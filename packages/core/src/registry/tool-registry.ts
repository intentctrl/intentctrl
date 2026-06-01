import { createStore } from "zustand/vanilla";
import type { RegisteredTool } from "./built-in-tools";

interface ToolRegistryState {
  tools: Map<string, RegisteredTool>;
  version: number;
  register: (tool: RegisteredTool) => void;
  unregister: (id: string) => void;
  getAll: () => RegisteredTool[];
  getById: (id: string) => RegisteredTool | undefined;
  getVersion: () => number;
}

export const toolRegistry = createStore<ToolRegistryState>((set, get) => ({
  tools: new Map(),
  version: 0,

  register: (tool) => {
    set((state) => {
      const next = new Map(state.tools);
      next.set(tool.id, tool);
      return { tools: next, version: state.version + 1 };
    });
  },

  unregister: (id) => {
    set((state) => {
      if (!state.tools.has(id)) return state;
      const next = new Map(state.tools);
      next.delete(id);
      return { tools: next, version: state.version + 1 };
    });
  },

  getAll: () => Array.from(get().tools.values()),
  getById: (id) => get().tools.get(id),
  getVersion: () => get().version,
}));
