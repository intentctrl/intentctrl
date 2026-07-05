import TurndownService from "turndown";
import { computeCSSSelector } from "./selectors";

const NOISE_TAGS = "script,style,noscript,template,link,meta,nextjs-portal";
const NOISE_SELECTORS =
  '[data-ai-ignore],[aria-hidden="true"],[hidden],[data-nextjs-toast],[data-nextjs-dialog-overlay],' +
  "[data-nextjs-error-overlay],[data-nextjs-refresh-root],[data-nextjs-scroll-focus-boundary]," +
  "#__next-build-watcher,#__next-prerender-indicator,[data-vercel-toolbar],#__vercel-toolbar";

const SKIP = "data-ai-md-skip";
const MAX_STYLE_SCAN = 4000;

const BLOCK_TAGS = new Set(
  "address,article,aside,blockquote,details,dialog,dd,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,li,main,nav,ol,p,pre,section,table,ul".split(
    ",",
  ),
);

function isHidden(el: HTMLElement): boolean {
  const s = window.getComputedStyle(el);
  return s.display === "none" || s.visibility === "hidden" || s.visibility === "collapse";
}

const block = (body: string) => (body ? `\n\n${body}\n\n` : "");

export class MarkdownAnnotator {
  private service = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
  });
  private headings: { level: number; text: string }[] = [];

  constructor() {
    this.installRules();
  }

  convert(root: Node | string): string {
    this.headings = [];
    return this.service.turndown(this.prepare(root));
  }

  // ---- noise pruning ----

  private prepare(root: Node | string): HTMLElement {
    if (typeof root === "string") {
      const c = document.createElement("div");
      c.innerHTML = root;
      return this.prune(c);
    }
    const live = root as Element;
    const attached = live.isConnected && typeof window !== "undefined";
    if (attached) this.markHidden(live);
    const clone = live.cloneNode(true) as HTMLElement;
    if (attached) live.querySelectorAll(`[${SKIP}]`).forEach((el) => el.removeAttribute(SKIP));
    clone.querySelectorAll(`[${SKIP}]`).forEach((n) => n.remove());
    return this.prune(clone);
  }

  private prune(root: HTMLElement): HTMLElement {
    root.querySelectorAll(NOISE_TAGS).forEach((n) => n.remove());
    root.querySelectorAll(NOISE_SELECTORS).forEach((n) => n.remove());
    return root;
  }

  private markHidden(root: Element): void {
    const all = root.querySelectorAll<HTMLElement>("*");
    const limit = Math.min(all.length, MAX_STYLE_SCAN);
    for (let i = 0; i < limit; i++) {
      const el = all[i];
      if (el && isHidden(el)) el.setAttribute(SKIP, "1");
    }
  }

  // ---- annotation ----

  private pushHeading(level: number, text: string): void {
    while (this.headings.length) {
      const last = this.headings[this.headings.length - 1];
      if (!last || last.level < level) break;
      this.headings.pop();
    }
    this.headings.push({ level, text });
  }

  private tag(node: any, withSection = false): string {
    const css = computeCSSSelector(node);
    if (!withSection) return `<!-- css="${css}" -->`;
    const section = this.headings.map((h) => h.text).join(" > ");
    return `<!-- css="${css}"${section ? ` section="${section.replace(/"/g, "'")}"` : ""} -->`;
  }

  // ---- rules ----

  private installRules(): void {
    const s = this.service;

    s.addRule("md-heading", {
      filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
      replacement: (content, node: any) => {
        const level = Number(node.nodeName.charAt(1));
        const text = content.replace(/\n/g, " ").trim();
        if (!text) return "";
        this.pushHeading(level, text);
        return block(`${"#".repeat(level)} ${text}${this.tag(node)}`);
      },
    });

    s.addRule("md-paragraph", {
      filter: "p",
      replacement: (content, node) => {
        const text = content.trim();
        return text ? block(`${text}${this.tag(node)}`) : "";
      },
    });

    s.addRule("md-link", {
      filter: (node: any) => node.nodeName === "A" && !!node.getAttribute("href"),
      replacement: (content, node: any) => {
        const href = node.getAttribute("href") || "";
        const title = node.getAttribute("title");
        return `[${content}](${href}${title ? ` "${title}"` : ""})${this.tag(node, true)}`;
      },
    });

    s.addRule("md-image", {
      filter: "img",
      replacement: (_c, node: any) => {
        const src = node.getAttribute("src") || "";
        if (!src) return "";
        const alt = (node.getAttribute("alt") || "").replace(/\n/g, " ");
        const title = node.getAttribute("title");
        return `![${alt}](${src}${title ? ` "${title}"` : ""})${this.tag(node)}`;
      },
    });

    s.addRule("md-list", {
      filter: ["ul", "ol"],
      replacement: (content, node: any) => {
        const parent = node.parentNode;
        const nested = parent?.nodeName === "LI" && parent.lastElementChild === node;
        return nested ? `\n${content}` : block(`${content}${this.tag(node)}`);
      },
    });

    s.addRule("md-listItem", {
      filter: "li",
      replacement: (content, node: any, options) => {
        const text = content.replace(/^\n+/, "").replace(/\n+$/, "\n").replace(/\n/gm, "\n    ");
        let prefix = `${options.bulletListMarker || "-"}   `;
        const parent = node.parentNode;
        if (parent?.nodeName === "OL") {
          const start = parent.getAttribute?.("start");
          const idx = Array.from(parent.children || []).indexOf(node);
          prefix = `${start ? Number(start) + idx : idx + 1}.  `;
        }
        return `${prefix}${text.replace(/\n$/, "")}${this.tag(node)}\n`;
      },
    });

    s.addRule("md-blockquote", {
      filter: "blockquote",
      replacement: (content, node) =>
        block(`${content.replace(/^\n+|\n+$/g, "").replace(/^/gm, "> ")}${this.tag(node)}`),
    });

    s.addRule("md-codeBlock", {
      filter: (node: any) => node.nodeName === "PRE" && node.firstChild?.nodeName === "CODE",
      replacement: (_c, node: any) => {
        const codeNode = node.firstChild;
        const lang = (codeNode.getAttribute?.("class") || "").match(/language-(\S+)/)?.[1] || "";
        const code = codeNode.textContent || "";
        const runs = (code.match(/`{3,}/g) || [""]).map((m: string) => m.length);
        const fence = "`".repeat(Math.max(2, ...runs) + 1);
        return block(`${fence}${lang}\n${code.replace(/\n$/, "")}\n${fence}${this.tag(node)}`);
      },
    });

    // ---- interactive elements ----

    const labeled = (name: string, filter: any, getLabel: (node: any) => string) =>
      s.addRule(name, { filter, replacement: (_c, node: any) => `[${getLabel(node)}]${this.tag(node, true)}` });

    labeled(
      "md-textInput",
      (node: any) =>
        node.nodeName === "INPUT" &&
        ["text", "email", "password", "search", "url", "tel", "number"].includes(
          (node.getAttribute("type") || "text").toLowerCase(),
        ),
      (node) => node.getAttribute("placeholder") || node.getAttribute("name") || node.getAttribute("id") || "input",
    );

    labeled(
      "md-fileInput",
      (node: any) => node.nodeName === "INPUT" && (node.getAttribute("type") || "").toLowerCase() === "file",
      () => "Choose File",
    );

    labeled(
      "md-select",
      "select",
      (node) => `▼ ${node.getAttribute("aria-label") || node.getAttribute("name") || "select"}`,
    );

    labeled(
      "md-textarea",
      "textarea",
      (node) => node.getAttribute("placeholder") || node.getAttribute("name") || "textarea",
    );

    s.addRule("md-checkboxRadio", {
      filter: (node: any) =>
        node.nodeName === "INPUT" && ["checkbox", "radio"].includes((node.getAttribute("type") || "").toLowerCase()),
      replacement: (_c, node: any) => {
        const symbol = (node.getAttribute("type") || "").toLowerCase() === "radio" ? "( )" : "[ ]";
        const label = node.getAttribute("aria-label");
        return `${symbol}${label ? ` ${label}` : ""}${this.tag(node, true)}`;
      },
    });

    s.addRule("md-button", {
      filter: (node: any) => node.nodeName === "BUTTON" || node.getAttribute?.("role") === "button",
      replacement: (_c, node: any) => {
        const text = (node.getAttribute("aria-label") || node.textContent || "").trim();
        return text ? `**${text}**${this.tag(node, true)}` : "";
      },
    });

    s.addRule("md-editable", {
      filter: (node: any) => {
        const v = node.getAttribute?.("contenteditable");
        return v != null && v !== "false";
      },
      replacement: (content, node) => {
        const text = content.trim();
        return text ? `${text}${this.tag(node, true)}` : "";
      },
    });

    s.addRule("md-textBlock", {
      filter: (node: any) =>
        node.nodeName === "DIV" &&
        !Array.from(node.childNodes || []).some(
          (c: any) => c.nodeType === 1 && BLOCK_TAGS.has(c.nodeName.toLowerCase()),
        ),
      replacement: (content, node) => {
        const text = content.trim();
        return text ? block(`${text}${this.tag(node)}`) : "";
      },
    });
  }
}

export function toAnnotatedMarkdown(root: Node | string): string {
  return new MarkdownAnnotator().convert(root);
}
