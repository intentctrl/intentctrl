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

export type ExecuteToolResult = { ok: true; output: unknown } | { ok: false; error: string; retryable?: boolean };

const TOOL_TIMEOUT_MS = 15_000;

async function withTimeout<T>(promise: Promise<T>, ms: number, toolId: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Tool "${toolId}" timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

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
    const output = await withTimeout(registryTool.handler(parsed.data), TOOL_TIMEOUT_MS, toolId);
    return { ok: true, output };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Tool execution failed";
    return { ok: false, error: message };
  }
}
