import type { ZodType } from 'zod'
import type { JsonSchema, RegisteredTool, SerializedTool } from '@intentctrl/types'

// Walks a Zod schema's def and returns a JSON Schema draft-7 object
export function serializeSchema(schema: ZodType): JsonSchema {
  const def = schema.def as unknown as Record<string, unknown>
  const type = def['type'] as string | undefined

  switch (type) {
    case 'string':
      return { type: 'string' }

    case 'number':
      return { type: 'number' }

    case 'boolean':
      return { type: 'boolean' }

    case 'optional':
    case 'nullable': {
      const inner = serializeSchema(def['innerType'] as ZodType)
      return inner
    }

    case 'array': {
      const items = serializeSchema(def['element'] as ZodType)
      return { type: 'array', items }
    }

    case 'object': {
      const shape = def['shape'] as Record<string, unknown>
      const resolvedShape = typeof shape === 'function' ? (shape as () => Record<string, ZodType>)() : shape as Record<string, ZodType>
      const properties: Record<string, JsonSchema> = {}
      const required: string[] = []

      for (const [key, value] of Object.entries(resolvedShape)) {
        const fieldDef = (value as ZodType).def as unknown as Record<string, unknown>
        const isOptional = fieldDef['type'] === 'optional'
        properties[key] = serializeSchema(value as ZodType)
        if (!isOptional) required.push(key)
      }

      const result: JsonSchema = { type: 'object', properties }
      if (required.length > 0) result['required'] = required
      return result
    }

    default:
      return { type: 'any' }
  }
}

// Converts a RegisteredTool into a transport-safe SerializedTool
export function serializeTool(tool: RegisteredTool): SerializedTool {
  return {
    id: tool.id,
    description: tool.description,
    inputSchema: serializeSchema(tool.inputSchema),
    needsApproval: tool.needsApproval ?? false,
  }
}
