"use client";

import { useRef, useCallback, useEffect } from "react";
import { useChat } from "@ai-sdk/react";

import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import type { ChatAddToolApproveResponseFunction, UIMessage } from "ai";
import {
  buildSemanticGraph,
  toolRegistry,
  builtInTools,
  executeTool,
  runtimeStore,
  serializeTool,
} from "@intentctrl/core";
import type { BuiltInToolDefinition } from "@intentctrl/core";
import type { ApiResponse, IntentCtrlRequestBody, SerializedTool } from "@intentctrl/types";

const apiFetch: typeof globalThis.fetch = async (url, init) => {
  const res = await fetch(url, init);
  if (res.ok) return res;
  const body = (await res.json()) as ApiResponse<unknown>;
  throw new Error(body.message ?? "Request failed");
};

let cachedSerializedTools: { version: number; tools: SerializedTool[] } | null = null;

function computeSerializedTools(): SerializedTool[] {
  const registered = toolRegistry.getState().getAll().map(serializeTool);
  const registeredIds = new Set(registered.map((t) => t.id));

  const builtInSerialized: SerializedTool[] = (builtInTools as readonly BuiltInToolDefinition[])
    .filter((t) => !registeredIds.has(t.id))
    .map((t) => serializeTool(t));

  return [...registered, ...builtInSerialized];
}

function getSerializedToolsCached(): SerializedTool[] {
  const version = toolRegistry.getState().getVersion();
  if (cachedSerializedTools && cachedSerializedTools.version === version) {
    return cachedSerializedTools.tools;
  }
  const tools = computeSerializedTools();
  cachedSerializedTools = { version, tools };
  return tools;
}

export interface UseIntentCtrlChatReturn {
  messages: UIMessage[];
  sendMessage: (text: string) => void;
  status: "submitted" | "streaming" | "ready" | "error";
  stop: () => void;
  error?: string;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
  approveToolCall: (toolCallId: string) => Promise<void>;
  denyToolCall: (toolCallId: string) => void;
}

type AddToolOutputFn = (params: {
  tool: string;
  toolCallId: string;
  output?: unknown;
  state?: "output-error" | "output-available";
  errorText?: string;
}) => void;

export function useIntentCtrlChat(apiUrl: string, apiKey: string): UseIntentCtrlChatReturn {
  const addToolOutputRef = useRef<AddToolOutputFn | null>(null);

  const transportRef = useRef<DefaultChatTransport<UIMessage> | null>(null);
  if (!transportRef.current) {
    transportRef.current = new DefaultChatTransport<UIMessage>({
      api: apiUrl,
      fetch: apiFetch,
      headers: () => ({
        Authorization: `Bearer ${apiKey}`,
      }),
      body: (): IntentCtrlRequestBody => ({
        semanticContext: buildSemanticGraph(),
        tools: getSerializedToolsCached(),
        dataContext: runtimeStore.getState().dataContext,
        permissions: runtimeStore.getState().permissions,
      }),
    });
  }

  useEffect(() => {
    return toolRegistry.subscribe(() => {
      cachedSerializedTools = null;
    });
  }, []);

  const pendingToolCallsRef = useRef<Map<string, { toolName: string; input: unknown }>>(new Map());

  const needsApprovalLookup = useCallback((toolName: string): boolean => {
    const registered = toolRegistry.getState().getById(toolName);
    if (registered) return registered.needsApproval ?? false;
    const builtIn = (builtInTools as readonly BuiltInToolDefinition[]).find((t) => t.id === toolName);
    return builtIn?.needsApproval ?? false;
  }, []);

  const handleToolCall = useCallback(async (toolName: string, toolCallId: string, input: unknown) => {
    const permissions = runtimeStore.getState().permissions;
    const result = await executeTool({ toolId: toolName, toolCallId, input, permissions });

    if (!result.ok) {
      addToolOutputRef.current?.({
        tool: toolName,
        toolCallId,
        state: "output-error",
        errorText: result.error,
      });
      return;
    }

    addToolOutputRef.current?.({
      tool: toolName,
      toolCallId,
      output: result.output,
    });
  }, []);

  const chat = useChat({
    transport: transportRef.current,
    experimental_throttle: 50,
    onToolCall: async ({ toolCall }) => {
      const call = toolCall as { toolName: string; toolCallId: string; input: unknown };

      if (needsApprovalLookup(call.toolName)) {
        pendingToolCallsRef.current.set(call.toolCallId, {
          toolName: call.toolName,
          input: call.input,
        });
        return;
      }

      await handleToolCall(call.toolName, call.toolCallId, call.input);
    },
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  useEffect(() => {
    addToolOutputRef.current = chat.addToolOutput as AddToolOutputFn;
  }, [chat.addToolOutput]);

  const sendMessage = useCallback(
    (text: string) => {
      chat.sendMessage({ text });
    },
    [chat.sendMessage],
  );

  const approveToolCall = useCallback(
    async (toolCallId: string) => {
      const pending = pendingToolCallsRef.current.get(toolCallId);
      if (!pending) return;
      pendingToolCallsRef.current.delete(toolCallId);
      await handleToolCall(pending.toolName, toolCallId, pending.input);
    },
    [handleToolCall],
  );

  const denyToolCall = useCallback((toolCallId: string) => {
    const pending = pendingToolCallsRef.current.get(toolCallId);
    if (!pending) return;
    pendingToolCallsRef.current.delete(toolCallId);
    addToolOutputRef.current?.({
      tool: pending.toolName,
      toolCallId,
      state: "output-error",
      errorText: "Denied by user",
    });
  }, []);

  return {
    messages: chat.messages,
    sendMessage,
    status: chat.status,
    stop: chat.stop,
    error: chat.error?.message,
    addToolApprovalResponse: chat.addToolApprovalResponse,
    approveToolCall,
    denyToolCall,
  };
}
