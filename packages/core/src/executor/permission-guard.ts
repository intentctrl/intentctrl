import { builtInTools, type RuntimePermissions } from '../registry/built-in-tools'

export function isPermitted(toolId: string, permissions: RuntimePermissions): boolean {
  const isBuiltIn = builtInTools.some((t) => t.id === toolId)
  if (!isBuiltIn) return true
  return (permissions as Record<string, boolean | undefined>)[toolId] !== false
}
