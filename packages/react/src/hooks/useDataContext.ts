import { useEffect, useRef } from "react";
import { runtimeStore } from "@intentctrl/core";

// Merges component-level data into the runtime dataContext on every change
export function useDataContext(data: Record<string, unknown>): void {
  const prevRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = data;

    // Merge new data into existing context, remove keys that disappeared
    const current = runtimeStore.getState().dataContext;
    const next: Record<string, unknown> = { ...current };

    // Remove keys from previous call that are no longer present
    for (const key of Object.keys(prev)) {
      if (!(key in data)) delete next[key];
    }

    Object.assign(next, data);
    runtimeStore.getState().setDataContext(next);

    return () => {
      // Remove this component's keys on unmount
      const onUnmount = { ...runtimeStore.getState().dataContext };
      for (const key of Object.keys(data)) {
        delete onUnmount[key];
      }
      runtimeStore.getState().setDataContext(onUnmount);
    };
    // data object reference changes handled by deep-ish comparison below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);
}
