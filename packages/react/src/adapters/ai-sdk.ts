"use client";

import { useRef, useCallback } from "react";
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
  serializeSchema,
} from "@intentctrl/core";
import type { SerializedTool } from "@intentctrl/types";
import { executeBuiltIn } from "../lib/built-in-executor";

const apiFetch: typeof globalThis.fetch = async (url, init) => {
  const res = await fetch(url, init);
  if (res.ok) return res;
  const body = await res.json();
  throw new Error(body.message ?? "Request failed");
};

// Merges developer-registered tools with built-ins, registered ones take precedence
function getSerializedTools(): SerializedTool[] {
  const registered = toolRegistry.getState().getAll().map(serializeTool);
  const registeredIds = new Set(registered.map((t) => t.id));

  const builtInSerialized: SerializedTool[] = builtInTools
    .filter((t) => !registeredIds.has(t.id))
    .map((t) => ({
      id: t.id,
      description: t.description,
      inputSchema: serializeSchema(t.inputSchema),
      needsApproval: false,
    }));

  return [...registered, ...builtInSerialized];
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

// Wraps useChat with IntentCtrl tool dispatch and semantic context injection
export function useIntentCtrlChat(apiUrl: string, apiKey: string): UseIntentCtrlChatReturn {
  // Stable ref so onToolCall closure always has current addToolOutput
  const addToolOutputRef = useRef<
    | ((params: {
        tool: string;
        toolCallId: string;
        output?: unknown;
        state?: "output-error" | "output-available";
        errorText?: string;
      }) => void)
    | null
  >(null);

  // Stable transport — only recreated if apiUrl changes
  const transportRef = useRef<DefaultChatTransport<UIMessage> | null>(null);
  if (!transportRef.current) {
    transportRef.current = new DefaultChatTransport<UIMessage>({
      api: apiUrl,
      fetch: apiFetch,
      headers: () => ({
        Authorization: `Bearer ${apiKey}`,
      }),
      // Inject live semantic snapshot + tools + runtime state on every request
      body: () => ({
        semanticContext: buildSemanticGraph(),
        tools: getSerializedTools(),
        dataContext: runtimeStore.getState().dataContext,
        permissions: runtimeStore.getState().permissions,
      }),
    });
  }

  // Stores pending tool calls that need user approval, keyed by toolCallId
  const pendingToolCallsRef = useRef<Map<string, { toolName: string; input: unknown }>>(new Map());

  const handleToolCall = useCallback(async (toolName: string, toolCallId: string, input: unknown) => {
    const permissions = runtimeStore.getState().permissions;

    const result = await executeTool({
      toolId: toolName,
      toolCallId,
      input,
      permissions,
    });

    // __builtin__ signals the React layer must handle DOM execution
    if (result.output === "__builtin__") {
      return await executeBuiltIn(toolName, input);
    }

    if (result.error) return { error: result.error };
    return result.output;
  }, []);

  const chat = useChat({
    transport: transportRef.current,
    experimental_throttle: 50,
    onToolCall: async ({ toolCall }) => {
      const call = toolCall as { toolName: string; toolCallId: string; input: unknown };

      // Skip tools that need user approval — rendered inline by the UI
      const registryTool = toolRegistry.getState().getById(call.toolName);
      if (registryTool?.needsApproval) {
        pendingToolCallsRef.current.set(call.toolCallId, {
          toolName: call.toolName,
          input: call.input,
        });
        return;
      }

      const output = await handleToolCall(call.toolName, call.toolCallId, call.input);
      addToolOutputRef.current?.({
        tool: call.toolName,
        toolCallId: call.toolCallId,
        output,
      });
    },
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  // Keep ref pointing at the latest addToolOutput after each render
  addToolOutputRef.current = chat.addToolOutput as (params: {
    tool: string;
    toolCallId: string;
    output?: unknown;
    state?: "output-error" | "output-available";
    errorText?: string;
  }) => void;

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
      const output = await handleToolCall(pending.toolName, toolCallId, pending.input);
      addToolOutputRef.current?.({ tool: pending.toolName, toolCallId, output });
    },
    [handleToolCall],
  );

  const denyToolCall = useCallback((toolCallId: string) => {
    const pending = pendingToolCallsRef.current.get(toolCallId);
    if (!pending) return;
    pendingToolCallsRef.current.delete(toolCallId);
    addToolOutputRef.current?.({ tool: pending.toolName, toolCallId, output: { denied: true } });
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
