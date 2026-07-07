import { createContext, useContext } from "react";
import type { ChatStatus, UIMessage } from "ai";
import type { SessionState } from "../adapters/ai-sdk";

export interface IntentCtrlChat {
  messages: UIMessage[];
  sendMessage: (text: string) => Promise<void>;
  status: ChatStatus;
  stop: () => void;
  error?: string;
  approveToolCall: (toolCallId: string) => Promise<void>;
  denyToolCall: (toolCallId: string) => void;
  switchSession: (sessionId: string) => Promise<void>;
  newSession: () => Promise<void>;
  clearSession: () => Promise<void>;
  refreshSessions: () => Promise<void>;
  session: SessionState;
}

export const IntentCtrlContext = createContext<IntentCtrlChat | null>(null);

// Throws if called outside IntentCtrlProvider
export function useIntentCtrlChatContext(): IntentCtrlChat {
  const ctx = useContext(IntentCtrlContext);
  if (!ctx) throw new Error("Must be used inside <IntentCtrlProvider>");
  return ctx;
}
