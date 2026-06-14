import type { SemanticNode, SemanticRole } from "@intentctrl/types";
import { getAiAction, getAiField, getAiRegion, isAnnotated } from "../utils/annotations";

const MEANINGFUL_ARIA_ROLES = [
  "button",
  "link",
  "checkbox",
  "radio",
  "textbox",
  "combobox",
  "listbox",
  "menuitem",
  "tab",
  "dialog",
  "region",
  "search",
  "navigation",
  "main",
  "form",
] as const;

const QUERY_SELECTOR = [
  "button",
  "input",
  "select",
  "textarea",
  "a[href]",
  ...MEANINGFUL_ARIA_ROLES.map((r) => `[role="${r}"]`),
  "section",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "[data-ai-action]",
  "[data-ai-field]",
  "[data-ai-region]",
].join(", ");

// Maps HTML tag or ARIA role to SemanticRole
function resolveRole(el: Element): SemanticRole {
  const tag = el.tagName.toLowerCase();
  const ariaRole = el.getAttribute("role");

  if (ariaRole === "button" || tag === "button") return "button";
  if (ariaRole === "link" || tag === "a") return "link";
  if (tag === "input" || tag === "select" || tag === "textarea") return "input";
  if (tag === "form" || ariaRole === "form") return "form";
  if (tag === "section" || ariaRole === "region") return "section";
  if (/^h[1-6]$/.test(tag)) return "heading";
  if (el.hasAttribute("data-ai-field")) return "input";
  if (el.hasAttribute("data-ai-region")) return "section";
  if (el.hasAttribute("data-ai-action")) return "button";
  return "text";
}

const CONTAINER_TAGS = new Set(["section", "form", "div", "main", "nav", "aside", "article", "ul", "ol", "table"]);

// Resolves label from element using priority order
function resolveLabel(el: Element): string | null {
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel?.trim()) return ariaLabel.trim();

  const labelledById = el.getAttribute("aria-labelledby");
  if (labelledById) {
    const labelEl = document.getElementById(labelledById);
    if (labelEl?.textContent?.trim()) return labelEl.textContent.trim();
  }

  const aiAction = getAiAction(el);
  if (aiAction?.trim()) return aiAction.trim();

  const aiField = getAiField(el);
  if (aiField?.trim()) return aiField.trim();

  const aiRegion = getAiRegion(el);
  if (aiRegion?.trim()) return aiRegion.trim();

  if (el instanceof HTMLInputElement && el.placeholder?.trim()) {
    return el.placeholder.trim();
  }

  if (!CONTAINER_TAGS.has(el.tagName.toLowerCase())) {
    const text = el.textContent?.trim();
    if (text) return text.slice(0, 80);
  }

  if (el instanceof HTMLImageElement && el.alt?.trim()) return el.alt.trim();

  return null;
}

// Resolves description from aria-describedby or title attribute
function resolveDescription(el: Element): string | undefined {
  const describedById = el.getAttribute("aria-describedby");
  if (describedById) {
    const descEl = document.getElementById(describedById);
    if (descEl?.textContent?.trim()) return descEl.textContent.trim();
  }

  const title = el.getAttribute("title");
  if (title?.trim()) return title.trim();

  return undefined;
}

// Returns true if element is visible in the viewport
function isVisible(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;

  const style = window.getComputedStyle(el);
  if (style.display === "none") return false;
  if (style.visibility === "hidden") return false;

  return true;
}

// Computes importance score based on annotation and visibility
function resolveImportance(el: Element, visible: boolean, annotated: boolean): number {
  if (annotated) return 1.0;
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute("role");
  const isInteractive =
    tag === "button" ||
    tag === "a" ||
    tag === "input" ||
    tag === "select" ||
    tag === "textarea" ||
    role === "button" ||
    role === "link";
  if (isInteractive && visible) return 0.8;
  if (/^h[1-6]$/.test(tag) || tag === "section" || tag === "form") return 0.5;
  if (!visible) return 0.1;
  return 0.3;
}

function isInsideIgnoredElement(el: Element): boolean {
  return el.closest("[data-ai-ignore]") !== null;
}

// Scans the DOM and returns all semantic nodes
export function extractSemanticNodes(): SemanticNode[] {
  const seenIds = new Map<string, number>();

  function generateId(role: SemanticRole, label: string): string {
    const slug = label
      .slice(0, 20)
      .replace(/\s+/g, "-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    const base = `${role}-${slug}`;
    const count = (seenIds.get(base) ?? 0) + 1;
    seenIds.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  }

  const elements = Array.from(document.querySelectorAll(QUERY_SELECTOR));
  const nodes: SemanticNode[] = [];

  for (const el of elements) {
    if (isInsideIgnoredElement(el)) continue;
    const label = resolveLabel(el);
    const annotated = isAnnotated(el);

    if (!label && !annotated) continue;

    const role = resolveRole(el);
    const visible = isVisible(el);
    const importance = resolveImportance(el, visible, annotated);
    const description = resolveDescription(el);
    const finalLabel = label ?? "";
    const id = generateId(role, finalLabel);

    nodes.push({
      id,
      role,
      label: finalLabel,
      description,
      visible,
      importance,
      annotated,
    });
  }

  return nodes;
}
