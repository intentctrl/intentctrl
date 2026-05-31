import type { RuntimePermissions } from '@intentctrl/types'
import type { BuiltInToolName } from '../registry/built-in-tools'

const BUILT_IN_TOOL_NAMES = new Set<string>([
  'navigate', 'click', 'type', 'highlight', 'scroll', 'extract',
])

// Returns true if the tool is allowed to execute under current permissions
export function isPermitted(toolId: string, permissions: RuntimePermissions): boolean {
  if (!BUILT_IN_TOOL_NAMES.has(toolId)) {
    // Developer-registered tools are always permitted
    return true
  }

  const key = toolId as BuiltInToolName
  // Opt-out model: undefined means permitted, explicit false means denied
  return permissions[key] !== false
}
