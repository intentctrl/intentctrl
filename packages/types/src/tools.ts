// JSON Schema object — used for HTTP transport
export type JsonSchema = Record<string, unknown>;

// Tool stripped of handler and Zod schema — safe for transport
export interface SerializedTool {
  id: string;
  description: string;
  inputSchema: JsonSchema;
  needsApproval: boolean;
}
