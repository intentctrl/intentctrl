import { z } from "zod";
import type { JsonSchema, SerializedTool } from "@intentctrl/types";

interface SerializableTool {
  id: string;
  description: string;
  inputSchema: z.ZodType;
  needsApproval?: boolean;
}

export function serializeSchema(schema: z.ZodType): JsonSchema {
  return z.toJSONSchema(schema, { target: "draft-07", unrepresentable: "any" }) as JsonSchema;
}

export function serializeTool(tool: SerializableTool): SerializedTool {
  return {
    id: tool.id,
    description: tool.description,
    inputSchema: serializeSchema(tool.inputSchema),
    needsApproval: tool.needsApproval ?? false,
  };
}
