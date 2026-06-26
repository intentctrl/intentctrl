// markdown
export { buildPageMarkdown } from "./context/markdown-extractor";

// registry
export { toolRegistry } from "./registry/tool-registry";
export { registerScoped } from "./registry/scoped-registry";
export { builtInTools } from "./registry/built-in-tools";
export type {
  BuiltInToolName,
  BuiltInSchemas,
  BuiltInToolInput,
  RuntimePermissions,
  RegisteredTool,
  BuiltInToolDefinition,
} from "./registry/built-in-tools";

// executor
export { executeTool } from "./executor/tool-executor";
export { isPermitted, checkPermission } from "./executor/permission-guard";
export type { ExecuteToolParams, ExecuteToolResult } from "./executor/tool-executor";

// built-in DOM execution
export { executeBuiltIn } from "./lib/built-in-executor";

// navigation
export { navigateTo, setRouter } from "./navigation/router-bridge";
export { waitForNavigation } from "./navigation/settle-detector";

// store
export { runtimeStore } from "./store/runtime-store";

// serialization
export { serializeSchema, serializeTool } from "./serialization/schema-serializer";

// session
export {
  getOrCreateVisitorId,
  getActiveSessionId,
  saveActiveSessionId,
  fetchSessions,
  EMPTY_SESSIONS,
  fetchSessionMessages,
  createSession,
} from "./services/chat-session";
