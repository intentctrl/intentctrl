"use client";

import { useEffect, useState, type ReactNode } from "react";
import { runtimeStore } from "@intentctrl/core";
import type { RuntimePermissions } from "@intentctrl/core";
import { IntentCtrlContext } from "./context";
import { useIntentCtrlChat } from "../adapters/ai-sdk";

const DEFAULT_API_URL = "http://localhost:4000/api/intent";

export interface IntentCtrlProviderProps {
  apiUrl?: string;
  apiKey: string;
  permissions?: RuntimePermissions;
  dataContext?: Record<string, unknown>;
  children: ReactNode;
}

const EMPTY = {};

export function IntentCtrlProvider({
  apiUrl = DEFAULT_API_URL,
  apiKey,
  permissions = EMPTY,
  dataContext = EMPTY,
  children,
}: IntentCtrlProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    runtimeStore.getState().setPermissions(permissions);
  }, [permissions]);

  useEffect(() => {
    if (dataContext === EMPTY) return;
    const addedKeys = Object.keys(dataContext);

    const current = runtimeStore.getState().dataContext;
    runtimeStore.getState().setDataContext({ ...current, ...dataContext });

    return () => {
      const ctx = runtimeStore.getState().dataContext;
      const cleaned: Record<string, unknown> = { ...ctx };
      for (const key of addedKeys) delete cleaned[key];
      runtimeStore.getState().setDataContext(cleaned);
    };
  }, [dataContext]);

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
        approveToolCall: chat.approveToolCall,
        denyToolCall: chat.denyToolCall,
        switchSession: chat.switchSession,
        newSession: chat.newSession,
        refreshSessions: chat.refreshSessions,
        session: chat.session,
      }}
    >
      {children}
    </IntentCtrlContext.Provider>
  );
}
