// Returns data-ai-action value or null
export function getAiAction(el: Element): string | null {
  return el.getAttribute("data-ai-action");
}

// Returns data-ai-field value or null
export function getAiField(el: Element): string | null {
  return el.getAttribute("data-ai-field");
}

// Returns data-ai-region value or null
export function getAiRegion(el: Element): string | null {
  return el.getAttribute("data-ai-region");
}

// True if element has any data-ai-* attribute
export function isAnnotated(el: Element): boolean {
  return el.hasAttribute("data-ai-action") || el.hasAttribute("data-ai-field") || el.hasAttribute("data-ai-region");
}
