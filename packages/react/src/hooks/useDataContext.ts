import { useEffect, useRef } from "react";
import { runtimeStore } from "@intentctrl/core";

export function useDataContext(data: Record<string, unknown>): void {
  const prevRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    const prev = prevRef.current;
    const snapshot = { ...data };
    prevRef.current = snapshot;

    const current = runtimeStore.getState().dataContext;
    const next: Record<string, unknown> = { ...current };

    for (const key of Object.keys(prev)) {
      if (!(key in data)) delete next[key];
    }
    Object.assign(next, snapshot);
    runtimeStore.getState().setDataContext(next);

    return () => {
      const ctx = runtimeStore.getState().dataContext;
      const cleaned: Record<string, unknown> = { ...ctx };
      for (const key of Object.keys(snapshot)) delete cleaned[key];
      runtimeStore.getState().setDataContext(cleaned);
    };
  }, [JSON.stringify(data)]);
}
