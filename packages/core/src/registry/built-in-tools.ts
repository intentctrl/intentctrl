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
    label: z.string().describe('The css="..." selector from the page context annotation.'),
  }),
  type: z.object({
    field: z.string().describe('The css="..." selector from the page context annotation.'),
    value: z.string().max(10_000).describe("Value to type into the field"),
  }),
  highlight: z.object({
    region: z.string().describe('The css="..." selector from the page context annotation.'),
  }),
  scroll: z.object({
    target: z.string().describe('The css="..." selector from the page context annotation.'),
  }),
} as const;

export const builtInTools = [
  {
    id: "navigate",
    description: "Navigate to a route in the application. Do not include the origin or query strings.",
    inputSchema: builtInSchemas.navigate,
    needsApproval: true,
  },
  {
    id: "click",
    description: 'Click an element. Pass the `css="..."` selector from the page annotation, not a description.',
    inputSchema: builtInSchemas.click,
    needsApproval: true,
  },
  {
    id: "type",
    description: 'Type into an input. Pass the `css="..."` selector from the page annotation.',
    inputSchema: builtInSchemas.type,
    needsApproval: true,
  },
  {
    id: "highlight",
    description: 'Highlight a page region. Pass the `css="..."` selector from the annotation.',
    inputSchema: builtInSchemas.highlight,
  },
  {
    id: "scroll",
    description:
      'Scroll an element into view. Pass the `css="..."` selector from the annotation for precise targeting.',
    inputSchema: builtInSchemas.scroll,
  },
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
