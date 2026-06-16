import { createContext, useContext } from "react";
import type { UIMessage } from "ai";
import type { SessionState } from "../adapters/ai-sdk";

export interface IntentCtrlContextValue {
  messages: UIMessage[];
  sendMessage: (text: string) => Promise<void>;
  status: "submitted" | "streaming" | "ready" | "error";
  stop: () => void;
  error?: string;
  approveToolCall: (toolCallId: string) => Promise<void>;
  denyToolCall: (toolCallId: string) => void;
  switchSession: (sessionId: string) => Promise<void>;
  newSession: () => Promise<void>;
  refreshSessions: () => Promise<void>;
  session: SessionState;
}

export const IntentCtrlContext = createContext<IntentCtrlContextValue | null>(null);

// Throws if called outside IntentCtrlProvider
export function useIntentCtrlContext(): IntentCtrlContextValue {
  const ctx = useContext(IntentCtrlContext);
  if (!ctx) throw new Error("Must be used inside <IntentCtrlProvider>");
  return ctx;
}
