"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { runtimeStore, setRouter } from "@intentctrl/core";
import type { RuntimePermissions } from "@intentctrl/types";
import { IntentCtrlContext } from "./context";
import { useIntentCtrlChat } from "../adapters/ai-sdk";

const DEFAULT_API_URL = "http://localhost:4000/intent/chat";

export interface IntentCtrlProviderProps {
  /** Backend endpoint that handles IntentCtrl requests */
  apiUrl?: string;
  /** API key for backend authentication */
  apiKey: string;
  /** Controls which built-in tools the LLM can invoke */
  permissions?: RuntimePermissions;
  /** Live application data to include in every LLM request */
  dataContext?: Record<string, unknown>;
  /** Framework router — pass useRouter() from Next.js or React Router */
  router?: { push: (path: string) => void };
  children: ReactNode;
}

const EMPTY = {};

// Root provider — wrap your app or layout with this component
export function IntentCtrlProvider({
  apiUrl = DEFAULT_API_URL,
  apiKey,
  permissions = EMPTY,
  dataContext = EMPTY,
  router,
  children,
}: IntentCtrlProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inited = useRef(false);

  // Sync permissions into runtime store on mount and whenever they change
  useEffect(() => {
    runtimeStore.getState().setPermissions(permissions);
  }, [permissions]);

  // Merge provider-level dataContext on mount (without resetting child-set data)
  useEffect(() => {
    if (dataContext !== EMPTY) {
      const current = runtimeStore.getState().dataContext;
      runtimeStore.getState().setDataContext({ ...current, ...dataContext });
    }
  }, [dataContext]);

  // Inject framework router so router-bridge can navigate without React imports
  useEffect(() => {
    if (router) setRouter(router);
  }, [router]);

  const chat = useIntentCtrlChat(apiUrl, apiKey);

  return (
    <IntentCtrlContext.Provider
      value={{
        messages: chat.messages,
        sendMessage: chat.sendMessage,
        status: chat.status,
        stop: chat.stop,
        isOpen,
        setIsOpen,
        error: chat.error,
        addToolApprovalResponse: chat.addToolApprovalResponse,
        approveToolCall: chat.approveToolCall,
        denyToolCall: chat.denyToolCall,
      }}
    >
      {children}
    </IntentCtrlContext.Provider>
  );
}
