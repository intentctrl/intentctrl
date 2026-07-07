"use client";

import * as React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { IconTool, IconChevronDown, IconCheck, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { getToolName } from "@intentctrl/react";
import type { ToolUIPart, DynamicToolUIPart, IntentCtrlChat } from "@intentctrl/react";

const TOOL_STATE_LABELS: Record<string, string> = {
  "approval-requested": "Awaiting approval",
  "input-available": "Running",
  "input-streaming": "Pending",
  "output-available": "Done",
  "output-error": "Error",
  "output-denied": "Denied",
};

function getToolStatusClasses(state?: string) {
  switch (state) {
    case "output-available":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "output-error":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "approval-requested":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function ToolCard({ toolPart, chat }: { toolPart: ToolUIPart | DynamicToolUIPart; chat: IntentCtrlChat }) {
  const isTerminal =
    toolPart.state === "output-available" || toolPart.state === "output-error" || toolPart.state === "output-denied";
  const [open, setOpen] = React.useState(!isTerminal);
  const stateLabel = TOOL_STATE_LABELS[toolPart.state] ?? toolPart.state;
  const displayName = getToolName(toolPart);
  const toolInput = toolPart.input;
  const toolOutput = toolPart.output;
  const toolErrorText = "errorText" in toolPart ? (toolPart as DynamicToolUIPart).errorText : undefined;
  const hasDetails = !!(toolInput || toolOutput || toolErrorText);

  return (
    <Collapsible className={cn("mt-2 rounded-lg border border-border text-xs")} open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 p-2 text-left">
        <div className="flex items-center gap-1.5 min-w-0">
          {toolPart.state === "output-available" ? (
            <IconCheck className="size-3 shrink-0 text-green-500" />
          ) : toolPart.state === "output-error" || toolPart.state === "output-denied" ? (
            <IconX className="size-3 shrink-0 text-destructive" />
          ) : (
            <IconTool className="size-3 shrink-0 text-muted-foreground" />
          )}
          <span className="font-medium truncate">{displayName}</span>
          <span
            className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", getToolStatusClasses(toolPart.state))}
          >
            {stateLabel}
          </span>
        </div>
        {hasDetails && (
          <IconChevronDown
            className={cn(
              "size-3 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="px-2 pb-2 space-y-2">
        {toolInput != null && (
          <div>
            <h4 className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Parameters</h4>
            <pre className="overflow-auto rounded bg-muted/50 p-1.5 text-[10px] text-foreground">
              {JSON.stringify(toolInput, null, 2)}
            </pre>
          </div>
        )}
        {toolPart.state === "approval-requested" && toolPart.toolCallId && (
          <div className="flex gap-2">
            <Button size="xs" variant="outline" onClick={() => chat.approveToolCall(toolPart.toolCallId!)}>
              <IconCheck className="size-3" />
              Approve
            </Button>
            <Button size="xs" variant="ghost" onClick={() => chat.denyToolCall(toolPart.toolCallId!)}>
              <IconX className="size-3" />
              Deny
            </Button>
          </div>
        )}
        {toolPart.state === "output-available" && toolOutput != null && (
          <div>
            <h4 className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Result</h4>
            <pre className="overflow-auto rounded bg-muted/50 p-1.5 text-[10px] text-foreground">
              {JSON.stringify(toolOutput, null, 2)}
            </pre>
          </div>
        )}
        {toolPart.state === "output-error" && toolErrorText && (
          <div>
            <h4 className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Error</h4>
            <div className="rounded bg-destructive/10 p-1.5 text-[10px] text-destructive">{toolErrorText}</div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

ToolCard.displayName = "ToolCard";

export { ToolCard };
