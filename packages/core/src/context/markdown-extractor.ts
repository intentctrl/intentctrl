import { toAnnotatedMarkdown } from "../markdown";

export function buildPageMarkdown(): string {
  if (typeof document === "undefined") return "";
  const html = document.body.innerHTML;
  if (!html) return "";
  return toAnnotatedMarkdown(html);
}
