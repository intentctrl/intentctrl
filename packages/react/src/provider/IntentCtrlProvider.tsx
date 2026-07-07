"use client";

import { useEffect, type ReactNode } from "react";
import { runtimeStore } from "@intentctrl/core";
import type { RuntimePermissions } from "@intentctrl/core";
import { IntentCtrlContext } from "./context";
import { useIntentCtrlChat } from "../adapters/ai-sdk";

const DEFAULT_API_URL = "http://localhost:4000/api/chat";

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
  useEffect(() => {
    runtimeStore.getState().setPermissions(permissions);
  }, [permissions]);

  const dataContextKey = JSON.stringify(dataContext);

  useEffect(() => {
    if (dataContext === EMPTY) return;
    const snapshot = { ...dataContext };
    const keys = Object.keys(snapshot);

    const current = runtimeStore.getState().dataContext;
    runtimeStore.getState().setDataContext({ ...current, ...snapshot });

    return () => {
      const ctx = runtimeStore.getState().dataContext;
      const cleaned: Record<string, unknown> = { ...ctx };
      for (const key of keys) delete cleaned[key];
      runtimeStore.getState().setDataContext(cleaned);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataContextKey]);

  const chat = useIntentCtrlChat(apiUrl, apiKey);

  return (
    <IntentCtrlContext.Provider
      value={{
        messages: chat.messages,
        sendMessage: chat.sendMessage,
        status: chat.status,
        stop: chat.stop,
        error: chat.error,
        approveToolCall: chat.approveToolCall,
        denyToolCall: chat.denyToolCall,
        switchSession: chat.switchSession,
        newSession: chat.newSession,
        clearSession: chat.clearSession,
        refreshSessions: chat.refreshSessions,
        session: chat.session,
      }}
    >
      {children}
    </IntentCtrlContext.Provider>
  );
}
