// Re-export core so consumers only install @intentctrl/react
export * from "@intentctrl/core";
export * from "@intentctrl/types";

// Provider
export { IntentCtrlProvider } from "./provider/IntentCtrlProvider";
export type { IntentCtrlProviderProps } from "./provider/IntentCtrlProvider";

// Context
export { useIntentCtrlContext } from "./provider/context";
export type { IntentCtrlContextValue } from "./provider/context";

// Hooks
export { useTool } from "./hooks/useTool";
export { useDataContext } from "./hooks/useDataContext";
export { useIntentCtrl } from "./hooks/useIntentCtrl";
export { usePermissions } from "./hooks/usePermissions";

// AI SDK types
export type { UIMessage, ChatStatus, ToolUIPart, DynamicToolUIPart, FileUIPart, SourceDocumentUIPart } from "ai";
