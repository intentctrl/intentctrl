import { useEffect, useRef } from "react";
import { runtimeStore } from "@intentctrl/core";

export function useDataContext(data: Record<string, unknown>): void {
  const prevRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    const prev = prevRef.current;
    const prevKeys = new Set(Object.keys(prev));
    const myAddedKeys: string[] = [];
    for (const key of Object.keys(data)) {
      if (!prevKeys.has(key)) myAddedKeys.push(key);
    }

    prevRef.current = data;

    const current = runtimeStore.getState().dataContext;
    const next: Record<string, unknown> = { ...current };

    for (const key of Object.keys(prev)) {
      if (!(key in data)) delete next[key];
    }

    Object.assign(next, data);
    runtimeStore.getState().setDataContext(next);

    return () => {
      if (myAddedKeys.length === 0) return;
      const ctx = runtimeStore.getState().dataContext;
      const cleaned: Record<string, unknown> = { ...ctx };
      for (const key of myAddedKeys) delete cleaned[key];
      runtimeStore.getState().setDataContext(cleaned);
    };
  }, [JSON.stringify(data)]);
}
