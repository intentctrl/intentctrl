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

interface BuiltInToolDefinition {
  id: BuiltInToolName;
  description: string;
  inputSchema: z.ZodTypeAny;
}

// Descriptions and schemas for all SDK-provided built-in tools
export const builtInTools: BuiltInToolDefinition[] = [
  {
    id: "navigate",
    description: "Navigate to a route in the application",
    inputSchema: BuiltInSchemas.navigate,
  },
  {
    id: "click",
    description: "Click a button or interactive element by its label",
    inputSchema: BuiltInSchemas.click,
  },
  {
    id: "type",
    description: "Type a value into an input field",
    inputSchema: BuiltInSchemas.type,
  },
  {
    id: "highlight",
    description: "Visually highlight a page region to guide the user",
    inputSchema: BuiltInSchemas.highlight,
  },
  {
    id: "scroll",
    description: "Scroll a specific element or region into view",
    inputSchema: BuiltInSchemas.scroll,
  },
  {
    id: "extract",
    description: "Read the current value of a field or element",
    inputSchema: BuiltInSchemas.extract,
  },
];
