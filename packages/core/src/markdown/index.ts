import TurndownService from "turndown";
import { computeSelectors } from "./selectors";

function fmtAnnotation(sel: { css: string; xpath: string }): string {
  return `<!-- css="${sel.css}" xpath="${sel.xpath}" -->`;
}

const BLOCK_TAGS = new Set([
  "address", "article", "aside", "blockquote", "details", "dialog",
  "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure",
  "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header",
  "hgroup", "hr", "li", "main", "nav", "ol", "p", "pre", "section",
  "table", "ul",
]);

export class MarkdownAnnotator {
  private service: TurndownService;

  constructor() {
    this.service = new TurndownService({
      headingStyle: "atx",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
      emDelimiter: "*",
    });
    this.installRules();
  }

  get turndownService(): TurndownService {
    return this.service;
  }

  convert(html: string): string {
    return this.service.turndown(html);
  }

  private annotate(node: any): string {
    const sel = computeSelectors(node, ["css", "xpath"]);
    return fmtAnnotation(sel);
  }

  private installRules(): void {
    this.addHeadingRule();
    this.addParagraphRule();
    this.addLinkRule();
    this.addImageRule();
    this.addListRule();
    this.addListItemRule();
    this.addBlockquoteRule();
    this.addCodeBlockRule();
    this.addButtonRule();
    this.addTextInputRule();
    this.addCheckboxRadioRule();
    this.addFileInputRule();
    this.addSelectDropdownRule();
    this.addTextareaRule();
    this.addEditableRule();
    this.addTextBlockRule();
  }

  // ---- Content rules ----

  private addHeadingRule(): void {
    this.service.addRule("md-heading", {
      filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
      replacement: (content, node) => {
        const level = Number(node.nodeName.charAt(1));
        const text = content.replace(/\n/g, " ").trim();
        if (!text) return "";
        const hashes = "#".repeat(level);
        return `\n\n${hashes} ${text}${this.annotate(node)}\n\n`;
      },
    });
  }

  private addParagraphRule(): void {
    this.service.addRule("md-paragraph", {
      filter: "p",
      replacement: (content, node) => {
        const text = content.trim();
        if (!text) return "";
        return `\n\n${text}${this.annotate(node)}\n\n`;
      },
    });
  }

  private addLinkRule(): void {
    this.service.addRule("md-link", {
      filter: (node: any) =>
        node.nodeName === "A" && !!node.getAttribute("href"),
      replacement: (content, node) => {
        const href = node.getAttribute("href") || "";
        const title = node.getAttribute("title");
        const titlePart = title ? ` "${title}"` : "";
        return `[${content}](${href}${titlePart})${this.annotate(node)}`;
      },
    });
  }

  private addImageRule(): void {
    this.service.addRule("md-image", {
      filter: "img",
      replacement: (_content, node) => {
        const alt = (node.getAttribute("alt") || "").replace(/\n/g, " ");
        const src = node.getAttribute("src") || "";
        const title = node.getAttribute("title");
        const titlePart = title ? ` "${title}"` : "";
        if (!src) return "";
        return `![${alt}](${src}${titlePart})${this.annotate(node)}`;
      },
    });
  }

  private addListRule(): void {
    this.service.addRule("md-list", {
      filter: ["ul", "ol"],
      replacement: (content, node) => {
        const parent = node.parentNode as any;
        const isNestedList =
          parent &&
          parent.nodeName === "LI" &&
          parent.lastElementChild === node;
        if (isNestedList) return `\n${content}`;
        return `\n\n${content}${this.annotate(node)}\n\n`;
      },
    });
  }

  private addListItemRule(): void {
    this.service.addRule("md-listItem", {
      filter: "li",
      replacement: (content, node, options) => {
        let text = content
          .replace(/^\n+/, "")
          .replace(/\n+$/, "\n")
          .replace(/\n/gm, "\n    ");

        let prefix = (options.bulletListMarker || "-") + "   ";
        const parent = node.parentNode as any;

        if (parent && parent.nodeName === "OL") {
          const start = parent.getAttribute?.("start");
          const children = Array.from(
            parent.children || parent.childNodes || [],
          ).filter((n: any) => n.nodeType === 1);
          const index = children.indexOf(node);
          prefix = (start ? Number(start) + index : index + 1) + ".  ";
        }

        return `${prefix}${text.replace(/\n$/, "")}${this.annotate(node)}\n`;
      },
    });
  }

  private addBlockquoteRule(): void {
    this.service.addRule("md-blockquote", {
      filter: "blockquote",
      replacement: (content, node) => {
        let text = content.replace(/^\n+|\n+$/g, "");
        text = text.replace(/^/gm, "> ");
        return `\n\n${text}${this.annotate(node)}\n\n`;
      },
    });
  }

  private addCodeBlockRule(): void {
    this.service.addRule("md-codeBlock", {
      filter: (node: any) =>
        node.nodeName === "PRE" &&
        node.firstChild &&
        node.firstChild.nodeName === "CODE",
      replacement: (_content, node) => {
        const codeNode = node.firstChild as any;
        if (!codeNode) return "";
        const className = codeNode.getAttribute?.("class") || "";
        const language =
          (className.match(/language-(\S+)/) || [null, ""])[1] || "";
        const code = codeNode.textContent || "";

        const fenceChar = "`";
        let fenceSize = 3;
        const fenceRe = new RegExp("^`{3,}", "gm");
        let match;
        while ((match = fenceRe.exec(code))) {
          if (match[0].length >= fenceSize) fenceSize = match[0].length + 1;
        }
        const fence = fenceChar.repeat(fenceSize);

        return `\n\n${fence}${language}\n${code.replace(/\n$/, "")}\n${fence}${this.annotate(node)}\n\n`;
      },
    });
  }

  // ---- Interactive element rules ----

  private addButtonRule(): void {
    this.service.addRule("md-button", {
      filter: (node: any) => {
        const tag = (node.nodeName || "").toLowerCase();
        const role = node.getAttribute?.("role") || "";
        return tag === "button" || role === "button";
      },
      replacement: (_content, node) => {
        const text = (node.textContent || "").trim();
        if (!text) return "";
        return `**${text}**${this.annotate(node)}`;
      },
    });
  }

  private addTextInputRule(): void {
    this.service.addRule("md-textInput", {
      filter: (node: any) => {
        if ((node.nodeName || "").toLowerCase() !== "input") return false;
        const type = (
          node.getAttribute?.("type") || "text"
        ).toLowerCase();
        return [
          "text",
          "email",
          "password",
          "search",
          "url",
          "tel",
          "number",
        ].includes(type);
      },
      replacement: (_content, node) => {
        const placeholder = node.getAttribute?.("placeholder");
        const name = node.getAttribute?.("name");
        const id = node.getAttribute?.("id");
        const label = placeholder || name || id || "input";
        return `[${label}]${this.annotate(node)}`;
      },
    });
  }

  private addCheckboxRadioRule(): void {
    this.service.addRule("md-checkboxRadio", {
      filter: (node: any) => {
        if ((node.nodeName || "").toLowerCase() !== "input") return false;
        const type = (
          node.getAttribute?.("type") || ""
        ).toLowerCase();
        return type === "checkbox" || type === "radio";
      },
      replacement: (_content, node) => {
        const label = node.getAttribute?.("aria-label");
        const type = (
          node.getAttribute?.("type") || ""
        ).toLowerCase();
        const symbol = type === "radio" ? "( )" : "[ ]";
        if (label) return `${symbol} ${label}${this.annotate(node)}`;
        return `${symbol}${this.annotate(node)}`;
      },
    });
  }

  private addFileInputRule(): void {
    this.service.addRule("md-fileInput", {
      filter: (node: any) => {
        if ((node.nodeName || "").toLowerCase() !== "input") return false;
        return (
          (node.getAttribute?.("type") || "").toLowerCase() === "file"
        );
      },
      replacement: (_content, node) => {
        return `[Choose File]${this.annotate(node)}`;
      },
    });
  }

  private addSelectDropdownRule(): void {
    this.service.addRule("md-select", {
      filter: "select",
      replacement: (_content, node) => {
        const label =
          node.getAttribute?.("aria-label") ||
          node.getAttribute?.("name") ||
          "select";
        return `[▼ ${label}]${this.annotate(node)}`;
      },
    });
  }

  private addTextareaRule(): void {
    this.service.addRule("md-textarea", {
      filter: "textarea",
      replacement: (_content, node) => {
        const placeholder = node.getAttribute?.("placeholder");
        const name = node.getAttribute?.("name");
        const label = placeholder || name || "textarea";
        return `[${label}]${this.annotate(node)}`;
      },
    });
  }

  private addEditableRule(): void {
    this.service.addRule("md-editable", {
      filter: (node: any) => {
        const editable = node.getAttribute?.("contenteditable");
        return editable !== null && editable !== "false";
      },
      replacement: (content, node) => {
        const text = content.trim();
        if (!text) return "";
        return `${text}${this.annotate(node)}`;
      },
    });
  }

  private addTextBlockRule(): void {
    this.service.addRule("md-textBlock", {
      filter: (node: any) => {
        if ((node.nodeName || "").toLowerCase() !== "div") return false;
        const children = Array.from(node.childNodes || []);
        return !children.some(
          (child: any) =>
            child.nodeType === 1 &&
            BLOCK_TAGS.has(child.nodeName.toLowerCase()),
        );
      },
      replacement: (content, node) => {
        const text = content.trim();
        if (!text) return "";
        return `\n\n${text}${this.annotate(node)}\n\n`;
      },
    });
  }
}

export function toAnnotatedMarkdown(html: string): string {
  return new MarkdownAnnotator().convert(html);
}
