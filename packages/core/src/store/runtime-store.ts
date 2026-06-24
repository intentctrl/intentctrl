import { createStore } from "zustand/vanilla";
import type { RuntimePermissions } from "../registry/built-in-tools";

interface RuntimeState {
  dataContext: Record<string, unknown>;
  permissions: RuntimePermissions;
  isExecuting: boolean;
  lastError: string | null;
  setDataContext: (ctx: Record<string, unknown>) => void;
  setPermissions: (p: RuntimePermissions) => void;
  setExecuting: (v: boolean) => void;
  setLastError: (e: string | null) => void;
}

// Central runtime state — survives route transitions and SPA navigation
export const runtimeStore = createStore<RuntimeState>((set) => ({
  dataContext: {},
  permissions: {},
  isExecuting: false,
  lastError: null,

  setDataContext: (ctx) => set({ dataContext: ctx }),
  setPermissions: (p) => set({ permissions: p }),
  setExecuting: (v) => set({ isExecuting: v }),
  setLastError: (e) => set({ lastError: e }),
}));
