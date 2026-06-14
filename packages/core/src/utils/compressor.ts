import type { SemanticNode } from "@intentctrl/types";

const MAX_NODES = 60;
const MIN_IMPORTANCE = 0.2;

// Reduces node list to top candidates by importance and deduplication
export function compressNodes(nodes: SemanticNode[]): SemanticNode[] {
  // Filter out low-importance nodes
  let filtered = nodes.filter((n) => n.importance >= MIN_IMPORTANCE);

  // Deduplicate by id — keep highest importance per id
  const byId = new Map<string, SemanticNode>();
  for (const node of filtered) {
    const existing = byId.get(node.id);
    if (!existing || node.importance > existing.importance) {
      byId.set(node.id, node);
    }
  }
  filtered = Array.from(byId.values());

  // Sort: annotated first, then by importance descending
  filtered.sort((a, b) => {
    if (a.annotated !== b.annotated) return a.annotated ? -1 : 1;
    return b.importance - a.importance;
  });

  // Cap at MAX_NODES
  return filtered.slice(0, MAX_NODES);
}
