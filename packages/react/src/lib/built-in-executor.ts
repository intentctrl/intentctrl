import { navigateTo } from "@intentctrl/core";

// Finds a DOM element by label using multiple strategies
function findByLabel(label: string): Element | null {
  const lower = label.toLowerCase();

  // data-ai-field takes priority for inputs
  const byField = document.querySelector(`[data-ai-field="${label}"]`);
  if (byField) return byField;

  // data-ai-action for buttons
  const byAction = document.querySelector(`[data-ai-action="${label}"]`);
  if (byAction) return byAction;

  // aria-label exact match
  const byAriaLabel = document.querySelector(`[aria-label="${label}"]`);
  if (byAriaLabel) return byAriaLabel;

  // placeholder match for inputs
  const byPlaceholder = document.querySelector<HTMLInputElement>(`[placeholder="${label}"]`);
  if (byPlaceholder) return byPlaceholder;

  // textContent match for buttons/links
  const interactive = document.querySelectorAll('button, a, [role="button"], [role="link"]');
  for (const el of interactive) {
    if (el.textContent?.trim().toLowerCase() === lower) return el;
  }

  return null;
}

// Simulates native input change so React state picks it up
function setNativeInputValue(el: HTMLInputElement, value: string): void {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

// Executes a built-in tool in the browser DOM context
export async function executeBuiltIn(toolName: string, input: unknown): Promise<unknown> {
  switch (toolName) {
    case "navigate": {
      const { target } = input as { target: string };
      await navigateTo(target);
      return { success: true };
    }

    case "click": {
      const { label } = input as { label: string };
      const el = findByLabel(label);
      if (!el) return { error: `Element not found: "${label}"` };
      (el as HTMLElement).click();
      return { success: true };
    }

    case "type": {
      const { field, value } = input as { field: string; value: string };
      const el = findByLabel(field) as HTMLInputElement | null;
      if (!el) return { error: `Field not found: "${field}"` };
      setNativeInputValue(el, value);
      return { success: true };
    }

    case "highlight": {
      const { region } = input as { region: string };
      const el = document.querySelector(`[data-ai-region="${region}"]`) ?? findByLabel(region);
      if (el) {
        el.setAttribute("data-ai-highlight", "true");
        setTimeout(() => el.removeAttribute("data-ai-highlight"), 3000);
      }
      return { success: true };
    }

    case "scroll": {
      const { target } = input as { target: string };
      const el = document.querySelector(`[data-ai-region="${target}"]`) ?? findByLabel(target);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return { success: true };
    }

    case "extract": {
      const { field } = input as { field: string };
      const el = findByLabel(field);
      if (!el) return { error: `Field not found: "${field}"` };
      const value = "value" in el ? (el as HTMLInputElement).value : (el.textContent?.trim() ?? "");
      return { value };
    }

    default:
      return { error: `Unknown built-in tool: ${toolName}` };
  }
}
