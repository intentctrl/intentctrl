import { createContext, useContext } from "react";
import type { UIMessage, ChatStatus } from "ai";
import type { PaginatedChatSessionsResponse } from "@intentctrl/types";

export interface IntentCtrlContextValue {
  messages: UIMessage[];
  sendMessage: (text: string) => Promise<void>;
  status: ChatStatus;
  stop: () => void;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  error?: string;
  approveToolCall: (toolCallId: string) => Promise<void>;
  denyToolCall: (toolCallId: string) => void;
  initSession: (sessionId?: string) => Promise<void>;
  sessions: () => Promise<PaginatedChatSessionsResponse>;
}

export const IntentCtrlContext = createContext<IntentCtrlContextValue | null>(null);

// Throws if called outside IntentCtrlProvider
export function useIntentCtrlContext(): IntentCtrlContextValue {
  const ctx = useContext(IntentCtrlContext);
  if (!ctx) throw new Error("Must be used inside <IntentCtrlProvider>");
  return ctx;
}
