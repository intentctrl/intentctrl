import type { SemanticGraph } from "@intentctrl/types";
import { extractSemanticNodes } from "./extractor";
import { compressNodes } from "../utils/compressor";

// Builds a compressed semantic representation of the current page
export function buildSemanticGraph(): SemanticGraph {
  const raw = extractSemanticNodes();
  const nodes = compressNodes(raw);

  return {
    route: window.location.pathname,
    title: document.title,
    nodes,
  };
}
