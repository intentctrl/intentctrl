# IntentCtrl

Embedded AI runtime for React applications.

```bash
npm install @intentctrl/react
```

## Usage

```tsx
import { IntentCtrlProvider, useIntentCtrl, useTool } from "@intentctrl/react";
import { z } from "zod";

function App() {
  return (
    <IntentCtrlProvider apiUrl="http://app.intentctrl.com/api/chat" apiKey="...">
      <Chat />
    </IntentCtrlProvider>
  );
}

function Chat() {
  const { messages, sendMessage } = useIntentCtrl();

  useTool({
    id: "add_todo",
    description: "Add a new todo item to the list",
    inputSchema: z.object({
      title: z.string(),
      priority: z.enum(["low", "medium", "high"]).optional(),
    }),
    handler: async ({ title, priority }) => {
      return fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ title, priority: priority ?? "medium" }),
      }).then((r) => r.json());
    },
  });

  return (
    <div>
      {messages.map((m) => (
        <p key={m.id}>{m.content}</p>
      ))}
      <input onKeyDown={(e) => {
        if (e.key === "Enter") sendMessage(e.currentTarget.value);
      }} />
    </div>
  );
}
```

- **Streaming chat** — real-time AI responses with a single hook
- **Page-aware AI** — the assistant sees what the user sees
- **Built-in tools** — navigate, click, type, scroll, highlight, extract
- **Custom tools** — register your own functions with typed inputs
- **Permissions** — control which tools the AI may use, per user
- **Approval workflows** — user confirmation before sensitive actions
- **Session management** — persistent conversations across page visits

[Documentation](https://docs.intentctrl.com) &middot; [Cloud Platform](http://app.intentctrl.com)

---

MIT
