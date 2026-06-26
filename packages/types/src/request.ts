import type { UIMessage } from "ai";
import type { SerializedTool } from "./tools";

export type { UIMessage } from "ai";

export interface ChatRequest {
  message: UIMessage;
  pageContent: string;
  tools: SerializedTool[];
  dataContext?: Record<string, unknown>;
  permissions?: Record<string, boolean | undefined>;
}
