# @intentctrl/core

Framework-agnostic engine that powers IntentCtrl — an embedded AI runtime for web applications. This package provides the core runtime without any UI framework dependency.

## Installation

```bash
npm install @intentctrl/core
```

## What it does

The core engine manages the full lifecycle of an AI-powered assistant embedded in your application. It registers tools the AI can call, executes them with input validation and permission checks, and maintains reactive state for permissions, data context, and tool configuration.

Chat sessions are persisted locally via IndexedDB and synchronized with your backend through REST API calls. Sessions are created lazily — the first message a user sends automatically starts a new conversation, and subsequent visits restore the most recent active session.

For client-side navigation, the engine integrates with your router so the AI can move between pages without full reloads. A fallback to `window.location.href` is used when no router is configured.

The runtime also converts page DOM into structured markdown annotated with CSS and XPath selectors, enabling the AI to reference and interact with specific elements on the page.

## License

MIT
