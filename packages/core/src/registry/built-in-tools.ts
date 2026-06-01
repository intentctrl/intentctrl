import z from "zod";

export interface BuiltInToolDefinition {
  id: string;
  description: string;
  inputSchema: z.ZodTypeAny;
  needsApproval?: boolean;
}

export const builtInSchemas = {
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

export const builtInTools = [
  { id: "navigate", description: "Navigate to a route in the application", inputSchema: builtInSchemas.navigate },
  { id: "click", description: "Click a button or interactive element by its label", inputSchema: builtInSchemas.click },
  { id: "type", description: "Type a value into an input field", inputSchema: builtInSchemas.type },
  { id: "highlight", description: "Visually highlight a page region to guide the user", inputSchema: builtInSchemas.highlight },
  { id: "scroll", description: "Scroll a specific element or region into view", inputSchema: builtInSchemas.scroll },
  { id: "extract", description: "Read the current value of a field or element", inputSchema: builtInSchemas.extract },
] as const satisfies readonly BuiltInToolDefinition[];

export type BuiltInToolName = (typeof builtInTools)[number]["id"];

export type BuiltInSchemas = {
  [K in BuiltInToolName]: Extract<(typeof builtInTools)[number], { id: K }>["inputSchema"];
};

export type BuiltInToolInput = {
  [K in BuiltInToolName]: z.infer<BuiltInSchemas[K]>;
};

export type RuntimePermissions = { [K in BuiltInToolName]?: boolean };

export interface RegisteredTool<TSchema extends z.ZodTypeAny = z.ZodTypeAny> {
  id: string;
  description: string;
  inputSchema: TSchema;
  needsApproval?: boolean;
  handler: (input: z.infer<TSchema>) => Promise<unknown>;
}
