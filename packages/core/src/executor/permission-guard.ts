import { builtInTools, type RuntimePermissions } from "../registry/built-in-tools";

export function isPermitted(toolId: string, permissions: RuntimePermissions): boolean {
  const isBuiltIn = builtInTools.some((t) => t.id === toolId);
  if (!isBuiltIn) return true;
  return (permissions as Record<string, boolean | undefined>)[toolId] !== false;
}

export function checkPermission(
  toolId: string,
  permissions: RuntimePermissions,
): { permitted: boolean; bypassApproval: boolean } {
  const isBuiltIn = builtInTools.some((t) => t.id === toolId);
  if (!isBuiltIn) return { permitted: true, bypassApproval: false };

  const value = (permissions as Record<string, boolean | undefined>)[toolId];

  if (value === false) return { permitted: false, bypassApproval: false };
  if (value === true) return { permitted: true, bypassApproval: true };
  return { permitted: true, bypassApproval: false };
}
