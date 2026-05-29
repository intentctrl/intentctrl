import { useSyncExternalStore } from "react";
import { runtimeStore } from "@intentctrl/core";
import type { RuntimePermissions } from "@intentctrl/types";

// Returns current permissions and a setter from the runtime store
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
