import type { RegisteredTool } from "./built-in-tools";
import { toolRegistry } from "./tool-registry";

// Tracks which tool ids belong to each component scope
const scopeMap = new Map<string, Set<string>>();
const refCounts = new Map<string, number>();

// Registers tools under a scope and returns a cleanup function
export function registerScoped(scopeId: string, tools: RegisteredTool[]): () => void {
  const ids = new Set<string>();

  for (const tool of tools) {
    const conflictScope = [...scopeMap.entries()].find(([sid, toolIds]) => sid !== scopeId && toolIds.has(tool.id));
    if (conflictScope) {
      console.warn(
        `[IntentCtrl] Tool "${tool.id}" already registered by scope "${conflictScope[0]}". ` +
          `Scope "${scopeId}" is overriding it. Ensure tool IDs are unique per page.`,
      );
    }

    toolRegistry.getState().register(tool);
    refCounts.set(tool.id, (refCounts.get(tool.id) ?? 0) + 1);
    ids.add(tool.id);
  }

  scopeMap.set(scopeId, ids);

  return () => {
    const toolIds = scopeMap.get(scopeId);
    if (!toolIds) return;

    for (const id of toolIds) {
      const count = (refCounts.get(id) ?? 1) - 1;
      refCounts.set(id, count);
      if (count <= 0) {
        toolRegistry.getState().unregister(id);
        refCounts.delete(id);
      }
    }
    scopeMap.delete(scopeId);
  };
}
