# IntentCtrl SDK — Detailed Architecture & Technical Overview

> **IntentCtrl** is an open-source embedded AI runtime that enables natural language interaction inside web applications. It extracts semantic context from the DOM, exposes built-in and developer-registered tools to an LLM, and executes tool calls against the browser with permission gating.

---

## Package Architecture

```
@intentctrl/types   (zero dependencies)
       ↑
@intentctrl/core    (zustand, types, zod peer)
       ↑
@intentctrl/react   (core, types, @ai-sdk/react, ai, react 19, zod peer)
```

- **`@intentctrl/types`** — Shared TypeScript type definitions (zero runtime dependencies)
- **`@intentctrl/core`** — Framework-agnostic runtime engine (DOM context extraction, tool registry with Zod schemas, executor, navigation, serialization)
- **`@intentctrl/react`** — React bindings (provider, hooks, AI SDK adapter, built-in DOM executor)

---

## `@intentctrl/types` — Shared Type Definitions

**Dependencies:** None (zero runtime dependencies)

### Semantic Types (`semantic.ts`)

| Export | Description |
|---|---|
| `SemanticRole` | Union: `"button" \| "input" \| "link" \| "section" \| "heading" \| "form" \| "text"` |
| `SemanticNode` | Single UI element with `id`, `role`, `label`, `description?`, `visible`, `importance`, `annotated` |
| `SemanticGraph` | Compressed snapshot of current page — `route`, `title`, `nodes: SemanticNode[]` |

### Transport Types (`tools.ts`)

| Export | Description |
|---|---|
| `JsonSchema` | `Record<string, unknown>` — transport-safe schema representation |
| `SerializedTool` | Stripped-down tool for HTTP transport — `id`, `description`, `inputSchema: JsonSchema`, `needsApproval` |

### Permission Types (`permissions.ts`)

| Export | Description |
|---|---|
| `RuntimePermissions` | Opt-out flags per built-in tool: `navigate?`, `click?`, `type?`, `highlight?`, `scroll?`, `extract?`. `undefined` = permitted, `false` = denied |

### Request Types (`request.ts`)

| Export | Description |
|---|---|
| `Message` | Conversation message: `id`, `role: 'user' \| 'assistant'`, `content` |
| `IntentCtrlRequest` | Full snapshot sent with every LLM request: `messages`, `semanticContext: SemanticGraph`, `tools: SerializedTool[]`, `dataContext`, `permissions` |

### Response Types (`response.ts`)

| Export | Description |
|---|---|
| `ApiResponse<T>` | Standard JSON envelope for non-streaming API responses: `{ status, success, data: T, message }`. Used by the backend for validation errors, health checks, and unhandled errors. |

---

## `@intentctrl/core` — Framework-Agnostic Runtime Engine

**Dependencies:** `zustand`, `@intentctrl/types`
**Peer:** `zod`

### Tool Types (`built-in-tools.ts`)

Definitions that were previously in `@intentctrl/types` — moved here to keep all built-in tool definitions atomic (name + schema + type together).

| Export | Description |
|---|---|
| `BuiltInToolName` | `"navigate" \| "click" \| "type" \| "highlight" \| "scroll" \| "extract"` |
| `BuiltInSchemas` | Zod object schemas for each built-in tool (e.g. `click: z.object({ label: z.string() })`) |
| `BuiltInToolInput` | Mapped type inferring input shapes per tool name |
| `RegisteredTool<TSchema>` | Developer tool contract: `id`, `description`, `inputSchema: TSchema`, `needsApproval?`, `handler: (input) => Promise<unknown>` |

### Context Module — `src/context/`

#### `extractor.ts`

DOM scanner that produces `SemanticNode[]` by:

1. **Querying** a compound CSS selector covering `button`, `input`, `select`, `textarea`, `a[href]`, `[role]`, `section`, `form`, `h1`–`h6`, `[data-ai-action]`, `[data-ai-field]`, `[data-ai-region]`
2. **Resolving role** via tag name and ARIA `role` attribute, falling back to `data-ai-*` attributes
3. **Resolving label** via priority: `aria-label` → `aria-labelledby` → `data-ai-action` → `data-ai-field` → `data-ai-region` → `placeholder` → `textContent` (80 char max) → `alt`
4. **Resolving description** from `aria-describedby` or `title`
5. **Visibility check** via `getBoundingClientRect()`, `display`, `visibility`
6. **Importance score** — annotated elements score `1.0`, interactive+visible `0.8`, structural `0.5`, hidden `0.1`, default `0.3`
7. **Stable ID** generated from role + label slug

#### `semantic-graph.ts`

`buildSemanticGraph()` — calls `extractSemanticNodes()` → `compressNodes()` → returns `SemanticGraph` with `window.location.pathname` and `document.title`.

### Registry Module — `src/registry/`

#### `tool-registry.ts`

Global Zustand vanilla store (`toolRegistry`) holding a `Map<string, RegisteredTool>`. Methods: `register`, `unregister`, `getAll`, `getById`. Last-write-wins by tool id.

#### `scoped-registry.ts`

`registerScoped(scopeId, tools)` — registers tools under a named scope, tracks the tool IDs in a `scopeMap`, returns a cleanup function that unregisters all tools for that scope. Used by React components to auto-cleanup on unmount.

#### `built-in-tools.ts`

Defines the 6 built-in tools with descriptions and Zod input schemas:

| Tool | Description | Input |
|---|---|---|
| `navigate` | Navigate to a route | `{ target: string }` |
| `click` | Click element by label | `{ label: string }` |
| `type` | Type into an input field | `{ field: string, value: string }` |
| `highlight` | Visually highlight a region | `{ region: string }` |
| `scroll` | Scroll element into view | `{ target: string }` |
| `extract` | Read a field's current value | `{ field: string }` |

### Executor Module — `src/executor/`

#### `permission-guard.ts`

`isPermitted(toolId, permissions)` — built-in tools check the opt-out `RuntimePermissions` flag. Developer-registered tools are always permitted.

#### `tool-executor.ts`

`executeTool(params)` — the core execution pipeline:

1. **Permission check** → returns `{ error: "Permission denied" }` if blocked
2. **Registry lookup** — if not found in registry, checks built-in tools; returns `{ output: "__builtin__" }` to signal the React layer
3. **Schema parse** — `safeParse` input against the tool's Zod schema
4. **Handler execution** — calls `handler(parsed.data)`, returns `{ output }` or `{ error }`

### Navigation Module — `src/navigation/`

#### `router-bridge.ts`

Router-agnostic navigation with fallback chain:

1. **Injected router** (set via `setRouter()`) — framework router passed by `@intentctrl/react`
2. **React Router auto-detect** — checks `window.__reactRouterDomGlobal`
3. **Fallback** — `window.location.href`

After navigation, awaits `waitForNavigation()`.

#### `settle-detector.ts`

`waitForNavigation(expectedPath?)` — polls every 50ms, resolves when URL is stable for 100ms, `document.readyState === 'complete'`, and (optionally) matches expected path. Times out after 3000ms.

### Store Module — `src/store/`

#### `runtime-store.ts`

Global Zustand vanilla store with state: `dataContext`, `permissions`, `isExecuting`, `lastError`. Survives route transitions. Setters are exposed directly.

### Serialization Module — `src/serialization/`

#### `schema-serializer.ts`

- **`serializeSchema(schema: ZodType)`** — walks Zod schema `def` tree and produces a JSON Schema draft-7 object. Handles `string`, `number`, `boolean`, `optional`, `nullable`, `array`, `object` (with `properties` and `required`), and defaults to `{ type: 'any' }`.
- **`serializeTool(tool)`** — converts `RegisteredTool` → `SerializedTool` (strips handler, serializes schema)

### Utils — `src/utils/`

#### `annotations.ts`

Reads `data-ai-action`, `data-ai-field`, `data-ai-region` attributes and checks if an element has any AI annotation.

#### `compressor.ts`

`compressNodes(nodes)` — filters nodes with `importance >= 0.2`, deduplicates by label (highest importance wins), sorts annotated first then by importance descending, caps at 60 nodes.

---

## `@intentctrl/react` — React SDK

**Dependencies:** `@intentctrl/core`, `@intentctrl/types`, `@ai-sdk/react`, `ai`
**Peer:** `react`, `react-dom`, `zod`

### Provider — `src/provider/`

#### `context.ts`

`IntentCtrlContext` and `useIntentCtrlContext()` hook. Exposes: `messages`, `sendMessage`, `status`, `stop`, `isOpen`, `setIsOpen`. Throws if used outside `IntentCtrlProvider`.

#### `IntentCtrlProvider.tsx`

Root provider component:

- Accepts `apiUrl` (backend endpoint, defaults to `https://api.intentctrl.com/intent/chat`), `apiKey` (required, backend auth), `permissions`, `dataContext`, `router` (framework router reference)
- Sends `Authorization: Bearer <apiKey>` header with every request
- Syncs `permissions` and `dataContext` into `runtimeStore` on mount/change
- Injects framework router via `setRouter()` for SPA navigation
- Initializes `useIntentCtrlChat(apiUrl, apiKey)` and exposes chat state through context

### Adapter — `src/adapters/`

#### `ai-sdk.ts`

`useIntentCtrlChat(apiUrl, apiKey)` — wraps `useChat` from `@ai-sdk/react`:

1. Creates a stable `DefaultChatTransport` with `Authorization: Bearer <apiKey>` header and a `body()` callback that injects live `buildSemanticGraph()`, `getSerializedTools()`, `runtimeStore` state on every request
2. Handles `onToolCall` by dispatching to `executeTool()` — built-in tools return `"__builtin__"` which triggers `executeBuiltIn()` in the React layer
3. Returns `{ messages, sendMessage, status, stop, error }` — `error` exposes the backend's validation/LLM error message when `status` is `"error"`

`getSerializedTools()` — merges registered tools and built-ins, with registered tools taking precedence on name collision. All tools are serialized via `serializeTool()` for transport.

### Hooks — `src/hooks/`

| Hook | Description |
|---|---|
| `useAiTool(tool)` | Registers a `RegisteredTool` scoped to the calling component. Uses `useId()` for scope, `useRef` for stable handler across renders. Auto-unregisters on unmount. |
| `useDataContext(data)` | Merges component-level data into `runtimeStore.dataContext`. Removes keys on unmount. Uses `JSON.stringify(data)` for change detection. |
| `usePermissions()` | Returns `{ permissions, setPermissions }` synced from `runtimeStore` via `useSyncExternalStore`. |
| `useIntentCtrl()` | Shorthand for `useIntentCtrlContext()`. Returns chat state and controls. |

No built-in UI components are provided. Consumers build their own ChatWidget and message rendering using `useIntentCtrl()` and their own UI library.

### Built-in Executor — `src/utils/`

#### `built-in-executor.ts`

`executeBuiltIn(toolName, input)` — DOM-level implementation of the 6 built-in tools:

| Tool | Implementation |
|---|---|
| `navigate` | Delegates to `navigateTo()` from core (router-bridge) |
| `click` | `findByLabel()` → queries `[data-ai-field]`, `[data-ai-action]`, `[aria-label]`, `[placeholder]`, text content; calls `.click()` |
| `type` | Same element lookup, then `setNativeInputValue()` to set the value and dispatch `input` + `change` events |
| `highlight` | Sets `data-ai-highlight="true"` on the element (auto-removed after 3s) |
| `scroll` | `element.scrollIntoView({ behavior: 'smooth', block: 'center' })` |
| `extract` | Returns `el.value` for inputs or `textContent` for other elements |

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  User sends message (via consumer's own ChatWidget)                        │
│       │                                                                    │
│       ▼                                                                    │
│  sendMessage(text) from useIntentCtrl()                                    │
│       │                                                                    │
│       ▼                                                                    │
│  useChat (AI SDK) — POST to apiUrl                                         │
│  Headers: { Authorization: Bearer <apiKey> }                              │
│  Body: {                                                                   │
│    messages,                                                               │
│    semanticContext: buildSemanticGraph(),  ← live DOM snapshot             │
│    tools: getSerializedTools(),           ← registered + built-in tools    │
│    dataContext: runtimeStore.state,       ← app-provided context           │
│    permissions: runtimeStore.state        ← opt-out flags                  │
│  }                                                                         │
│       │                                                                    │
│       ▼                                                                    │
│  LLM responds with tool calls                                              │
│       │                                                                    │
│       ▼                                                                    │
│  onToolCall → useIntentCtrlChat.handleToolCall()                           │
│       │                                                                    │
│       ▼                                                                    │
│  core/executor/executeTool()                                               │
│       │                                                                    │
│       ├── isPermitted() ? → returns error if denied                        │
│       ├── Registry lookup? → "__builtin__" if built-in, error if unknown   │
│       ├── safeParse input against Zod schema                               │
│       └── handler(parsed.data)                                             │
│             │                                                              │
│             ▼                                                              │
│  If built-in → executeBuiltIn() in React layer                             │
│    ├── navigate → router-bridge → SPA or window.location                  │
│    ├── click    → findByLabel() → .click()                                │
│    ├── type     → findByLabel() → setNativeInputValue()                   │
│    ├── highlight → set data-ai-highlight for 3s                           │
│    ├── scroll   → scrollIntoView()                                        │
│    └── extract  → return value or textContent                             │
│             │                                                              │
│             ▼                                                              │
│  messages array updates → consumer's message list re-renders               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Public API Surface

### `@intentctrl/types`

```typescript
// Zero-dependency types
SemanticRole, SemanticNode, SemanticGraph
SerializedTool, JsonSchema
RuntimePermissions
Message, IntentCtrlRequest, ApiResponse
```

### `@intentctrl/core`

```typescript
// Context
buildSemanticGraph(), extractSemanticNodes()

// Registry
toolRegistry, registerScoped(), builtInTools
export type { RegisteredTool }

// Executor
executeTool(), isPermitted()
export type { ExecuteToolParams, ExecuteToolResult }

// Navigation
navigateTo(), setRouter(), waitForNavigation()

// Store
runtimeStore

// Serialization
serializeSchema(), serializeTool()
```

### `@intentctrl/react`

```typescript
// Provider
IntentCtrlProvider
export type { IntentCtrlProviderProps }

// Context
useIntentCtrlContext()
export type { IntentCtrlContextValue }

// Hooks
useAiTool(), useDataContext(), useIntentCtrl(), usePermissions()
```

---

## Configuration

### `data-ai-*` DOM Attributes

Developers annotate HTML elements to improve AI understanding:

| Attribute | Purpose | Example |
|---|---|---|
| `data-ai-action` | Labels an interactive action | `<button data-ai-action="Save changes">Save</button>` |
| `data-ai-field` | Labels an input field | `<input data-ai-field="Email" />` |
| `data-ai-region` | Labels a page region | `<section data-ai-region="Sidebar">...</section>` |

### Runtime Permissions

Control which built-in tools the LLM can invoke by passing `permissions` to `IntentCtrlProvider`. Opt-out model — `undefined` = permitted, `false` = denied:

```tsx
<IntentCtrlProvider
  apiUrl="/api/chat"
  apiKey="dev-secret"
  permissions={{ navigate: false, click: false }}
>
  <App />
</IntentCtrlProvider>
```
