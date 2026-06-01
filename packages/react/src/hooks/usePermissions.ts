import { useSyncExternalStore } from "react";
import { runtimeStore } from "@intentctrl/core";
import type { RuntimePermissions } from "@intentctrl/core";

export function usePermissions(): {
  permissions: RuntimePermissions;
  setPermissions: (p: RuntimePermissions) => void;
} {
  const permissions = useSyncExternalStore(
    runtimeStore.subscribe,
    () => runtimeStore.getState().permissions,
    () => ({}),
  );

  return {
    permissions,
    setPermissions: runtimeStore.getState().setPermissions,
  };
}
