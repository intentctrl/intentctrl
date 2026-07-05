import { toAnnotatedMarkdown } from "../markdown";

export function buildPageMarkdown(): string {
  if (typeof document === "undefined" || !document.body) return "";
  const route = `Route: ${window.location.pathname}`;
  const title = `Title: ${document.title}`;
  const header = `${route}\n${title}`;

  const markdown = toAnnotatedMarkdown(document.body);
  if (!markdown) return header;

  return `${header}\n\n${markdown}`;
}
