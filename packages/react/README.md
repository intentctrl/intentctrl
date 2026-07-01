# @intentctrl/react

React bindings for IntentCtrl — an embedded AI runtime for React applications.

## Installation

```bash
npm install @intentctrl/react
```

Requires `react`, `react-dom`, and `zod` as peer dependencies.

## What it does

Provides the `IntentCtrlProvider` component that wraps your application with the AI runtime context. Inside the provider, the `useIntentCtrl()` hook gives you access to the full chat interface — messages, sending messages, session management, and tool call approvals.

Custom tools are registered with the `useTool()` hook. Each tool defines a name, description, Zod input schema, and a handler function. Tools are scoped to the component that registers them — they are available to the AI while the component is mounted and cleaned up automatically when unmounted. This allows tools for a settings panel to only exist while that panel is open.

The `usePermissions()` hook provides reactive read and write access to the runtime permission state. Permissions control which built-in DOM tools (navigate, click, type, highlight, scroll, extract) the AI can use, with three states per tool: allowed with approval, allowed without approval, or denied.

The `useDataContext()` hook lets you provide contextual data from your components to the AI, enriching what the assistant knows about the current page state.

The package also re-exports all types and functions from `@intentctrl/core` and `@intentctrl/types`, so consumers only need a single dependency.

## License

MIT
