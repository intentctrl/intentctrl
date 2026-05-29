import z from "zod";

// Names of all SDK-provided built-in tools
export type BuiltInToolName = "navigate" | "click" | "type" | "highlight" | "scroll" | "extract";

// Zod schemas for each built-in tool
export const BuiltInSchemas = {
  navigate: z.object({
    target: z.string().describe("Route path to navigate to"),
  }),
  click: z.object({
    label: z.string().describe("Accessible label of element to click"),
  }),
  type: z.object({
    field: z.string().describe("Accessible label of input field"),
    value: z.string().describe("Value to type into the field"),
  }),
  highlight: z.object({
    region: z.string().describe("Region label or data-ai-region value"),
  }),
  scroll: z.object({
    target: z.string().describe("Element label or region to scroll to"),
  }),
  extract: z.object({
    field: z.string().describe("Field label to read value from"),
  }),
} as const;

// Inferred input types for each built-in tool
export type BuiltInToolInput = {
  [K in BuiltInToolName]: z.infer<(typeof BuiltInSchemas)[K]>;
};

// Developer-registered tool with typed Zod schema and handler
export interface RegisteredTool<TSchema extends z.ZodTypeAny = z.ZodTypeAny> {
  id: string;
  description: string;
  inputSchema: TSchema;
  needsApproval?: boolean;
  handler: (input: z.infer<TSchema>) => Promise<unknown>;
}

// JSON Schema object — used for HTTP transport
export type JsonSchema = Record<string, unknown>;

// Tool stripped of handler and Zod schema — safe for transport
export interface SerializedTool {
  id: string;
  description: string;
  inputSchema: JsonSchema;
  needsApproval: boolean;
}
