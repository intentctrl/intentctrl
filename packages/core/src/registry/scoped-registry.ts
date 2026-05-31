import type { RegisteredTool } from './built-in-tools'
import { toolRegistry } from './tool-registry'

// Tracks which tool ids belong to each component scope
const scopeMap = new Map<string, Set<string>>()

// Registers tools under a scope and returns a cleanup function
export function registerScoped(scopeId: string, tools: RegisteredTool[]): () => void {
  const ids = new Set<string>()

  for (const tool of tools) {
    toolRegistry.getState().register(tool)
    ids.add(tool.id)
  }

  scopeMap.set(scopeId, ids)

  return () => {
    const toolIds = scopeMap.get(scopeId)
    if (!toolIds) return

    for (const id of toolIds) {
      toolRegistry.getState().unregister(id)
    }

    scopeMap.delete(scopeId)
  }
}
