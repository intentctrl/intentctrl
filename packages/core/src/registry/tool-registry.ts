import { createStore } from "zustand/vanilla";
import type { RegisteredTool } from "./built-in-tools";

interface ToolRegistryState {
  tools: Map<string, RegisteredTool>;
  register: (tool: RegisteredTool) => void;
  unregister: (id: string) => void;
  getAll: () => RegisteredTool[];
  getById: (id: string) => RegisteredTool | undefined;
}

// Global tool registry — keyed by tool id, last write wins
export const toolRegistry = createStore<ToolRegistryState>((set, get) => ({
  tools: new Map(),

  register: (tool) => {
    set((state) => {
      const next = new Map(state.tools);
      next.set(tool.id, tool);
      return { tools: next };
    });
  },

  unregister: (id) => {
    set((state) => {
      const next = new Map(state.tools);
      next.delete(id);
      return { tools: next };
    });
  },

  getAll: () => Array.from(get().tools.values()),

  getById: (id) => get().tools.get(id),
}));
