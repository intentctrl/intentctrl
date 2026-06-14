import { navigateTo } from "../navigation/router-bridge";
import { builtInSchemas, builtInTools } from "../registry/built-in-tools";

type EditableElement = HTMLInputElement | HTMLTextAreaElement;

const MAX_TYPE_LENGTH = 10_000;

function sanitizeTypeValue(value: string): string {
  return value.replace(/\0/g, "").slice(0, MAX_TYPE_LENGTH);
}

function isEditable(el: Element): el is EditableElement {
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
}

function findByLabel(label: string): Element | null {
  const escaped = CSS.escape(label);

  const byField = document.querySelector(`[data-ai-field="${escaped}"]`);
  if (byField) return byField;

  const byAction = document.querySelector(`[data-ai-action="${escaped}"]`);
  if (byAction) return byAction;

  const byAriaLabel = document.querySelector(`[aria-label="${escaped}"]`);
  if (byAriaLabel) return byAriaLabel;

  const byPlaceholder = document.querySelector(`[placeholder="${escaped}"]`);
  if (byPlaceholder) return byPlaceholder;

  const lower = label.toLowerCase();
  const interactive = document.querySelectorAll('button, a, [role="button"], [role="link"]');
  for (const el of interactive) {
    if (el.textContent?.trim().toLowerCase() === lower) return el;
  }

  return null;
}

function findByRegionOrLabel(value: string): Element | null {
  return document.querySelector(`[data-ai-region="${CSS.escape(value)}"]`) ?? findByLabel(value);
}

function setNativeEditableValue(el: EditableElement, value: string): void {
  const proto = Object.getPrototypeOf(el) as { constructor: { prototype: EditableElement } };
  const setter = Object.getOwnPropertyDescriptor(proto.constructor.prototype, "value")?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

export async function executeBuiltIn(toolName: string, input: unknown): Promise<unknown> {
  if (!builtInTools.some((t) => t.id === toolName)) {
    throw new Error(`Unknown built-in tool: ${toolName}`);
  }

  switch (toolName) {
    case "navigate": {
      const { target } = builtInSchemas.navigate.parse(input);
      await navigateTo(target);
      return { success: true };
    }

    case "click": {
      const { label } = builtInSchemas.click.parse(input);
      const el = findByLabel(label);
      if (!el) throw new Error(`Element not found: "${label}"`);
      (el as HTMLElement).click();
      return { success: true };
    }

    case "type": {
      const { field, value } = builtInSchemas.type.parse(input);
      const el = findByLabel(field);
      if (!el) throw new Error(`Field not found: "${field}"`);
      if (!isEditable(el)) throw new Error(`Element is not editable: "${field}"`);
      setNativeEditableValue(el, sanitizeTypeValue(value));
      return { success: true };
    }

    case "highlight": {
      const { region } = builtInSchemas.highlight.parse(input);
      const el = findByRegionOrLabel(region);
      if (!el) throw new Error(`Region not found: "${region}"`);
      el.setAttribute("data-ai-highlight", "true");
      setTimeout(() => el.removeAttribute("data-ai-highlight"), 3000);
      return { success: true };
    }

    case "scroll": {
      const { target } = builtInSchemas.scroll.parse(input);
      const el = findByRegionOrLabel(target);
      if (!el) throw new Error(`Element not found: "${target}"`);
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      return { success: true };
    }

    case "extract": {
      const { field } = builtInSchemas.extract.parse(input);
      const el = findByLabel(field);
      if (!el) throw new Error(`Field not found: "${field}"`);
      return isEditable(el) ? el.value : (el.textContent?.trim() ?? "");
    }
  }
}
