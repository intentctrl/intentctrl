import { BuiltInSchemas } from "@intentctrl/types";
import type { BuiltInToolName } from "@intentctrl/types";
import type { ZodTypeAny } from "zod";

interface BuiltInToolDefinition {
  id: BuiltInToolName;
  description: string;
  inputSchema: ZodTypeAny;
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
