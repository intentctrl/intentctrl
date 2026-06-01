import { isPermitted } from "./permission-guard";
import { toolRegistry } from "../registry/tool-registry";
import { builtInTools, type RuntimePermissions } from "../registry/built-in-tools";
import { executeBuiltIn } from "../lib/built-in-executor";

export interface ExecuteToolParams {
  toolId: string;
  toolCallId: string;
  input: unknown;
  permissions: RuntimePermissions;
}

export type ExecuteToolResult =
  | { ok: true; output: unknown }
  | { ok: false; error: string; retryable?: boolean };

export async function executeTool(params: ExecuteToolParams): Promise<ExecuteToolResult> {
  const { toolId, input, permissions } = params;

  if (!isPermitted(toolId, permissions)) {
    return { ok: false, error: `Permission denied for tool: ${toolId}` };
  }

  const registryTool = toolRegistry.getState().getById(toolId);

  if (!registryTool) {
    const isBuiltIn = builtInTools.some((t) => t.id === toolId);
    if (isBuiltIn) {
      try {
        const output = await executeBuiltIn(toolId, input);
        return { ok: true, output };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : "Tool execution failed" };
      }
    }
    return { ok: false, error: `Unknown tool: ${toolId}` };
  }

  const parsed = registryTool.inputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input" };
  }

  try {
    const output = await registryTool.handler(parsed.data);
    return { ok: true, output };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Tool execution failed";
    return { ok: false, error: message };
  }
}
