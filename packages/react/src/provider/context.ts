import { createContext, useContext } from "react";
import type { ChatAddToolApproveResponseFunction, UIMessage, ChatStatus } from "ai";

export interface IntentCtrlContextValue {
  messages: UIMessage[];
  sendMessage: (text: string) => void;
  status: ChatStatus;
  stop: () => void;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  error?: string;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
  approveToolCall: (toolCallId: string) => Promise<void>;
  denyToolCall: (toolCallId: string) => void;
}

export const IntentCtrlContext = createContext<IntentCtrlContextValue | null>(null);

// Throws if called outside IntentCtrlProvider
export function useIntentCtrlContext(): IntentCtrlContextValue {
  const ctx = useContext(IntentCtrlContext);
  if (!ctx) throw new Error("Must be used inside <IntentCtrlProvider>");
  return ctx;
}
