// Re-export core so consumers only install @intentctrl/react
export * from "@intentctrl/core";
export * from "@intentctrl/types";

// Provider
export { IntentCtrlProvider } from "./provider/IntentCtrlProvider";
export type { IntentCtrlProviderProps } from "./provider/IntentCtrlProvider";

// Context
export { useIntentCtrlChatContext } from "./provider/context";
export type { IntentCtrlChat } from "./provider/context";

// Hooks
export { useTool } from "./hooks/useTool";
export { useDataContext } from "./hooks/useDataContext";
export { useIntentCtrlChat } from "./hooks/useIntentCtrl";
export { usePermissions } from "./hooks/usePermissions";

// AI SDK types
export type { UIMessage, ChatStatus, ToolUIPart, DynamicToolUIPart, FileUIPart, SourceDocumentUIPart } from "ai";
export type { SessionState, SessionInitState } from "./adapters/ai-sdk";

// AI SDK utilities
export { getToolName, isTextUIPart, isReasoningUIPart, isToolUIPart } from "ai";
