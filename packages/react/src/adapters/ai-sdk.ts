"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import type { ChatAddToolOutputFunction, UIMessage } from "ai";
import {
  buildPageMarkdown,
  toolRegistry,
  builtInTools,
  executeTool,
  runtimeStore,
  serializeTool,
  checkPermission,
  getOrCreateVisitorId,
  fetchSessions,
  fetchSessionMessages,
  saveActiveSessionId,
  getActiveSessionId,
  createSession,
  EMPTY_SESSIONS,
} from "@intentctrl/core";
import type { BuiltInToolDefinition } from "@intentctrl/core";
import type { ChatRequest, PaginatedChatSessionsResponse, SerializedTool } from "@intentctrl/types";

// Types

export type SessionInitState = "idle" | "loading" | "ready" | "error";

export interface SessionState {
  /** ID of the currently active session. Null only before the first message is sent on a fresh install. */
  activeSessionId: string | null;
  /** All known sessions for this visitor. */
  sessions: PaginatedChatSessionsResponse;
  /** Lifecycle state of the bootstrap + any session switch. */
  initState: SessionInitState;
}

export interface UseIntentCtrlChatReturn {
  messages: UIMessage[];
  sendMessage: (text: string) => Promise<void>;
  status: "submitted" | "streaming" | "ready" | "error";
  stop: () => void;
  error?: string;
  approveToolCall: (toolCallId: string) => Promise<void>;
  denyToolCall: (toolCallId: string) => void;
  /** Switch to an existing session by ID — loads its messages and persists the choice. */
  switchSession: (sessionId: string) => Promise<void>;
  /** Create a brand-new session, persist it, clear messages. Does NOT send anything. */
  newSession: () => Promise<void>;
  /** Re-fetch the sessions list. */
  refreshSessions: () => Promise<void>;
  session: SessionState;
}

// Hook

export function useIntentCtrlChat(apiUrl: string, apiKey: string): UseIntentCtrlChatReturn {
  const apiUrlRef = useRef(apiUrl);
  const apiKeyRef = useRef(apiKey);
  useEffect(() => {
    apiUrlRef.current = apiUrl;
  }, [apiUrl]);
  useEffect(() => {
    apiKeyRef.current = apiKey;
  }, [apiKey]);

  // Session state
  //
  // `activeSessionId` starts null and stays null until either:
  //   (a) bootstrap finds a stored session ID, or
  //   (b) the user sends their first message (lazy creation, ChatGPT-style).
  //
  const activeSessionIdRef = useRef<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const setActiveSession = useCallback((id: string | null) => {
    activeSessionIdRef.current = id;
    setActiveSessionId(id);
  }, []);

  const [sessionList, setSessionList] = useState<PaginatedChatSessionsResponse>(EMPTY_SESSIONS);
  const [initState, setInitState] = useState<SessionInitState>("idle");

  // Internal refs
  const addToolOutputRef = useRef<ChatAddToolOutputFunction<UIMessage> | null>(null);
  const setMessagesRef = useRef<((msgs: UIMessage[]) => void) | null>(null);
  const pendingApprovalsRef = useRef<Map<string, { toolName: string; toolCallId: string; input: unknown }>>(new Map());
  const sessionCreatingRef = useRef<Promise<void> | null>(null);
  const serializedToolsCacheRef = useRef<{ version: number; tools: SerializedTool[] } | null>(null);

  // Serialized tools cache (per-hook instance)
  const computeSerializedTools = useCallback((): SerializedTool[] => {
    const registered = toolRegistry.getState().getAll().map(serializeTool);
    const registeredIds = new Set(registered.map((t) => t.id));
    const builtInSerialized: SerializedTool[] = (builtInTools as readonly BuiltInToolDefinition[])
      .filter((t) => !registeredIds.has(t.id))
      .map((t) => serializeTool(t));
    return [...registered, ...builtInSerialized];
  }, []);

  const getSerializedToolsCached = useCallback((): SerializedTool[] => {
    const version = toolRegistry.getState().getVersion();
    if (serializedToolsCacheRef.current?.version === version) return serializedToolsCacheRef.current.tools;
    const tools = computeSerializedTools();
    serializedToolsCacheRef.current = { version, tools };
    return tools;
  }, [computeSerializedTools]);

  // Transport (stable; reads refs at call time)
  const transportRef = useRef<DefaultChatTransport<UIMessage> | null>(null);
  if (!transportRef.current) {
    transportRef.current = new DefaultChatTransport<UIMessage>({
      api: apiUrlRef.current,
      headers: () => ({ "x-api-key": apiKeyRef.current }),
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
          message: messages.at(-1),
          pageContent: buildPageMarkdown(),
          tools: getSerializedToolsCached(),
          dataContext: runtimeStore.getState().dataContext,
          permissions: runtimeStore.getState().permissions,
        } as ChatRequest,
        api: `${apiUrlRef.current}/${activeSessionIdRef.current}`,
      }),
    });
  }

  useEffect(
    () =>
      toolRegistry.subscribe(() => {
        serializedToolsCacheRef.current = null;
      }),
    [],
  );

  // Helpers

  const needsApproval = useCallback((toolName: string): boolean => {
    const { permitted, bypassApproval } = checkPermission(toolName, runtimeStore.getState().permissions);
    if (!permitted) return false;
    if (bypassApproval) return false;

    const registered = toolRegistry.getState().getById(toolName);
    if (registered) return registered.needsApproval ?? false;
    return (builtInTools as readonly BuiltInToolDefinition[]).find((t) => t.id === toolName)?.needsApproval ?? false;
  }, []);

  const handleToolCall = useCallback(async (toolName: string, toolCallId: string, input: unknown) => {
    const result = await executeTool({
      toolId: toolName,
      toolCallId,
      input,
      permissions: runtimeStore.getState().permissions,
    });
    if (!result.status) {
      addToolOutputRef.current?.({ tool: toolName, toolCallId, state: "output-error", errorText: result.error });
      return;
    }
    addToolOutputRef.current?.({ tool: toolName, toolCallId, output: result.output });
  }, []);

  // Low-level: activate a session ID + load its messages

  const activateSessionId = useCallback(
    async (id: string) => {
      // Persist first so any crash after this still restores the right session.
      await saveActiveSessionId(id);
      setActiveSession(id);

      const visitorId = await getOrCreateVisitorId();
      const messages = await fetchSessionMessages(apiUrlRef.current, apiKeyRef.current, id, visitorId);
      setMessagesRef.current?.(messages);
    },
    [setActiveSession],
  );

  // Session management

  const refreshSessions = useCallback(async () => {
    const visitorId = await getOrCreateVisitorId();
    const data = await fetchSessions(apiUrlRef.current, apiKeyRef.current, visitorId);
    setSessionList(data);
  }, []);

  const cancelPendingApprovals = useCallback((reason: string) => {
    for (const [toolCallId, pending] of pendingApprovalsRef.current) {
      addToolOutputRef.current?.({
        tool: pending.toolName,
        toolCallId,
        state: "output-error",
        errorText: reason,
      });
    }
    pendingApprovalsRef.current.clear();
  }, []);

  /**
   * Switch to an existing session by ID.
   * Loads its messages and updates the active session in storage.
   */
  const switchSession = useCallback(
    async (sessionId: string) => {
      if (sessionId === activeSessionIdRef.current) return;
      cancelPendingApprovals("Session switched — action cancelled");
      setInitState("loading");
      try {
        await activateSessionId(sessionId);
        setInitState("ready");
      } catch {
        setInitState("error");
      }
    },
    [activateSessionId, cancelPendingApprovals],
  );

  /**
   * Create a fresh session, make it active, clear the message list.
   * Does NOT send any message — that's the caller's job.
   */
  const newSession = useCallback(async () => {
    cancelPendingApprovals("New session started — action cancelled");
    setInitState("loading");
    try {
      const visitorId = await getOrCreateVisitorId();
      const created = await createSession(apiUrlRef.current, apiKeyRef.current, visitorId);
      if (!created) throw new Error("Session creation failed");

      // Clear messages immediately for snappy UX before activateSessionId sets them.
      setMessagesRef.current?.([]);
      await activateSessionId(created.id);

      // Refresh list in background — don't block the caller.
      refreshSessions().catch(() => null);
      setInitState("ready");
    } catch {
      setInitState("error");
    }
  }, [activateSessionId, refreshSessions, cancelPendingApprovals]);

  // Bootstrap on mount
  //
  // ChatGPT-style logic:
  //   • If there is a stored activeSessionId → restore it (fetch its messages).
  //   • If there is NO stored id → stay null, wait for the first sendMessage.
  //   Either way, always load the sessions list for the sidebar.
  //
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function bootstrap() {
      setInitState("loading");
      try {
        const [visitorId, storedId] = await Promise.all([getOrCreateVisitorId(), getActiveSessionId()]);

        const sessions = await fetchSessions(apiUrlRef.current, apiKeyRef.current, visitorId, controller.signal);
        if (cancelled) return;
        setSessionList(sessions);

        if (storedId) {
          // Validate it still exists on the server.
          const exists = sessions.items.some((s) => s.id === storedId);
          if (exists) {
            await activateSessionId(storedId);
          } else {
            // Stored session is gone — clear it and start fresh (null until first message).
            await saveActiveSessionId(null);
          }
        }
        // If no storedId: leave activeSessionId as null. sendMessage will create lazily.

        if (!cancelled) setInitState("ready");
      } catch {
        if (!cancelled) setInitState("error");
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useChat
  const chat = useChat({
    transport: transportRef.current,
    experimental_throttle: 50,
    onToolCall: async ({ toolCall }) => {
      if (needsApproval(toolCall.toolName)) {
        pendingApprovalsRef.current.set(toolCall.toolCallId, {
          toolName: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
          input: toolCall.input,
        });
        return;
      }
      await handleToolCall(toolCall.toolName, toolCall.toolCallId, toolCall.input);
    },
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onError: (error: Error) => console.error(error.message),
  });

  addToolOutputRef.current = chat.addToolOutput;
  setMessagesRef.current = chat.setMessages;

  // sendMessage — lazy session creation
  //
  // If there's already an active session: send immediately.
  // If not (first ever message on a clean install): create a session first,
  // then send. The session ID is set on the ref before chat.sendMessage so
  // the transport picks it up synchronously.
  //
  const sendMessage = useCallback(
    async (text: string) => {
      if (!activeSessionIdRef.current) {
        if (!sessionCreatingRef.current) {
          sessionCreatingRef.current = newSession().finally(() => {
            sessionCreatingRef.current = null;
          });
        }
        await sessionCreatingRef.current;
      }
      chat.sendMessage({ text });
    },
    [chat.sendMessage, newSession],
  );

  const approveToolCall = useCallback(
    async (toolCallId: string) => {
      const pending = pendingApprovalsRef.current.get(toolCallId);
      if (!pending) return;
      pendingApprovalsRef.current.delete(toolCallId);
      await handleToolCall(pending.toolName, toolCallId, pending.input);
    },
    [handleToolCall],
  );

  const denyToolCall = useCallback((toolCallId: string) => {
    const pending = pendingApprovalsRef.current.get(toolCallId);
    if (!pending) return;
    pendingApprovalsRef.current.delete(toolCallId);
    addToolOutputRef.current?.({
      tool: pending.toolName,
      toolCallId,
      state: "output-error",
      errorText: "User denied execution",
    });
  }, []);

  return {
    messages: chat.messages,
    sendMessage,
    status: chat.status,
    stop: chat.stop,
    error: chat.error?.message,
    approveToolCall,
    denyToolCall,
    switchSession,
    newSession,
    refreshSessions,
    session: {
      activeSessionId,
      sessions: sessionList,
      initState,
    },
  };
}
