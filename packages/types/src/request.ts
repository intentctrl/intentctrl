import type { SemanticGraph } from './semantic'
import type { SerializedTool } from './tools'
import type { RuntimePermissions } from './permissions'

// Single conversation message — matches ai-sdk UIMessage wire format
export interface Message {
  id: string
  role: 'system' | 'user' | 'assistant'
  parts: unknown[]
  metadata?: unknown
}

// Full snapshot SDK sends to backend on every request
export interface IntentCtrlRequest {
  messages: Message[]
  semanticContext: SemanticGraph
  tools: SerializedTool[]
  dataContext?: Record<string, unknown>
  permissions?: RuntimePermissions
}