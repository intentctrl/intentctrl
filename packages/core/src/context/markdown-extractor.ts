import { toAnnotatedMarkdown } from "../markdown";

export function buildPageMarkdown(): string {
  if (typeof document === "undefined") return "";
  const route = `Route: ${window.location.pathname}`;
  const title = `Title: ${document.title}`;
  const header = `${route}\n${title}`;

  const html = document.body.innerHTML;
  if (!html) return header;

  return `${header}\n\n${toAnnotatedMarkdown(html)}`;
}
