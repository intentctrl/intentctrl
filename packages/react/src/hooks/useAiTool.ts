import { useEffect, useId, useRef } from "react";
import { registerScoped } from "@intentctrl/core";
import type { RegisteredTool } from "@intentctrl/core";
import type { ZodType } from "zod";

export function useAiTool<TSchema extends ZodType>(tool: RegisteredTool<TSchema>): void {
  const scopeId = useId();
  const toolRef = useRef<RegisteredTool<TSchema>>(tool);
  toolRef.current = tool;

  useEffect(() => {
    const stableTool: RegisteredTool<TSchema> = {
      id: toolRef.current.id,
      description: toolRef.current.description,
      inputSchema: toolRef.current.inputSchema,
      needsApproval: toolRef.current.needsApproval,
      handler: (input) => toolRef.current.handler(input),
    };

    return registerScoped(scopeId, [stableTool]);
  }, [scopeId, tool.id, tool.description, tool.inputSchema]);
}
