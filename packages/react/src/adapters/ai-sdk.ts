"use client";

import { useRef, useCallback, useEffect } from "react";
import { useChat } from "@ai-sdk/react";

import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import type { ChatAddToolOutputFunction, UIMessage } from "ai";
import {
  buildSemanticGraph,
  toolRegistry,
  builtInTools,
  executeTool,
  runtimeStore,
  serializeTool,
} from "@intentctrl/core";
import type { BuiltInToolDefinition } from "@intentctrl/core";
import type { IntentCtrlRequest, SerializedTool } from "@intentctrl/types";

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
  approveToolCall: (toolCallId: string) => Promise<void>;
  denyToolCall: (toolCallId: string) => void;
}

export function useIntentCtrlChat(apiUrl: string, apiKey: string): UseIntentCtrlChatReturn {
  const addToolOutputRef = useRef<ChatAddToolOutputFunction<UIMessage> | null>(null);

  const transportRef = useRef<DefaultChatTransport<UIMessage> | null>(null);
  if (!transportRef.current) {
    transportRef.current = new DefaultChatTransport<UIMessage>({
      api: apiUrl,
      headers: () => ({
        "x-api-key": apiKey,
      }),
      prepareSendMessagesRequest({ messages }) {
        return {
          body: {
            messages: messages,
            semanticContext: buildSemanticGraph(),
            tools: getSerializedToolsCached(),
            dataContext: runtimeStore.getState().dataContext,
            permissions: runtimeStore.getState().permissions,
          } as IntentCtrlRequest,
        };
      },
    });
  }

  useEffect(() => {
    return toolRegistry.subscribe(() => {
      cachedSerializedTools = null;
    });
  }, []);

  const pendingApprovalsRef = useRef<Map<string, { toolName: string; toolCallId: string; input: unknown }>>(new Map());

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
      const call = toolCall;

      if (needsApprovalLookup(call.toolName)) {
        // Store it and don't execute - wait for user approval
        pendingApprovalsRef.current.set(call.toolCallId, {
          toolName: call.toolName,
          toolCallId: call.toolCallId,
          input: call.input,
        });
        return;
      }

      // Auto-execute tools that don't need approval
      await handleToolCall(call.toolName, call.toolCallId, call.input);
    },
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  useEffect(() => {
    addToolOutputRef.current = chat.addToolOutput;
  }, [chat.addToolOutput, chat.addToolApprovalResponse]);

  const sendMessage = useCallback(
    (text: string) => {
      chat.sendMessage({ text });
    },
    [chat.sendMessage],
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
  };
}
