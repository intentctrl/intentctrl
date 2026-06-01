import type { UIMessage } from "ai";
import type { SemanticGraph } from "./semantic";
import type { SerializedTool } from "./tools";

export interface IntentCtrlRequest {
  messages: UIMessage[];
  semanticContext: SemanticGraph;
  tools: SerializedTool[];
  dataContext?: Record<string, unknown>;
  permissions?: Record<string, boolean | undefined>;
}

export type IntentCtrlRequestBody = Omit<IntentCtrlRequest, "messages">;
