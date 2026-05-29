import type { RuntimePermissions } from "@intentctrl/types";
import { isPermitted } from "./permission-guard";
import { toolRegistry } from "../registry/tool-registry";
import { builtInTools } from "../registry/built-in-tools";

export interface ExecuteToolParams {
  toolId: string;
  toolCallId: string;
  input: unknown;
  permissions: RuntimePermissions;
}

export interface ExecuteToolResult {
  output: unknown;
  error?: string;
}

// Executes a tool call: permission check → parse → run
export async function executeTool(params: ExecuteToolParams): Promise<ExecuteToolResult> {
  const { toolId, toolCallId, input, permissions } = params;

  if (!isPermitted(toolId, permissions)) {
    return { output: null, error: `Permission denied for tool: ${toolId}` };
  }

  const registryTool = toolRegistry.getState().getById(toolId);

  if (!registryTool) {
    const isBuiltIn = builtInTools.some((t) => t.id === toolId);
    if (isBuiltIn) {
      // Signal to @intentctrl/react to handle built-in execution
      return { output: "__builtin__" };
    }
    return { output: null, error: `Unknown tool: ${toolId}` };
  }

  const parsed = registryTool.inputSchema.safeParse(input);
  if (!parsed.success) {
    return { output: null, error: "Invalid input" };
  }

  try {
    const result = await registryTool.handler(parsed.data);
    return { output: result };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Tool execution failed";
    return { output: null, error: message };
  }
}
