import { useEffect, useId, useRef } from "react";
import { registerScoped } from "@intentctrl/core";
import type { RegisteredTool } from "@intentctrl/core";
import z from "zod";
import type { ZodType } from "zod";

// Registers a tool scoped to the calling component — unregisters on unmount
export function useAiTool<TSchema extends ZodType>(tool: RegisteredTool<TSchema>): void {
  const scopeId = useId();
  // Keep a stable ref so the handler always reflects the latest closure
  const toolRef = useRef<RegisteredTool<TSchema>>(tool);
  toolRef.current = tool;

  useEffect(() => {
    // Wrap handler through ref so stale closures are never registered
    const stableTool: RegisteredTool<TSchema> = {
      id: toolRef.current.id,
      description: toolRef.current.description,
      inputSchema: toolRef.current.inputSchema,
      needsApproval: toolRef.current.needsApproval,
      handler: (input: z.infer<TSchema>) => toolRef.current.handler(input),
    };

    const cleanup = registerScoped(scopeId, [stableTool]);
    return cleanup;
    // Re-register only if tool id changes — handler is always current via ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeId, tool.id]);
}
