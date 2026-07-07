"use client";

import { useEffect, useState } from "react";
import { CodeBlock, CodeBlockContent, CodeBlockHeader, CodeBlockIcon } from "@/components/code-block/code-block";
import { CodeBlockTabsPkg } from "@/components/code-block/code-block-tabs-pkg";
import { CopyButton } from "@/components/code-block/copy-button";
import { CodeblockShiki } from "@/components/code-block/shiki";
import { DepsPkg } from "@/components/code-block/deps-pkg";
import { DotmSquare4 } from "@/components/ui/dotm-square-4";
import { PopoverChat } from "@/components/widgets/popover-chat";
import { notFound } from "next/navigation";
import { useIntentCtrlChat } from "@intentctrl/react";

interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
}

export default function PopoverChatPage() {
  const chat = useIntentCtrlChat();
  const [item, setItem] = useState<RegistryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/r/popover-chat")
      .then((res) => res.json())
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <DotmSquare4 color="var(--primary)" />
      </div>
    );
  }

  if (!item) notFound();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{item.title ?? item.name}</h1>
        {item.description && <p className="mt-1 text-muted-foreground">{item.description}</p>}
      </header>

      {item.dependencies && item.dependencies.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold">Dependencies</h2>
          <DepsPkg dependencies={item.dependencies} />
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold">Install</h2>
        <CodeBlockTabsPkg name={item.name} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold">Usage</h2>
        <CodeBlock>
          <CodeBlockHeader>
            <div className="flex items-center gap-1.5">
              <CodeBlockIcon language="tsx" />
              <span>popover-chat.tsx</span>
            </div>
            <CopyButton
              content={`import { useIntentCtrlChat } from "@intentctrl/react";
import { PopoverChat } from "@intentctrl/widgets";

export default function App() {
  const chat = useIntentCtrlChat();
  return (
    <PopoverChat
      chat={chat}
      title="AI Assistant"
      description="Ask me anything"
      placeholder="Type a message..."
      suggestions={["What can you do?", "Help me debug"]}
    />
  );
}`}
            />
          </CodeBlockHeader>
          <CodeBlockContent>
            <CodeblockShiki
              language="tsx"
              code={`import { useIntentCtrlChat } from "@intentctrl/react";
import { PopoverChat } from "@intentctrl/widgets";

export default function App() {
  const chat = useIntentCtrlChat();
  return (
    <PopoverChat
      chat={chat}
      title="AI Assistant"
      description="Ask me anything"
      placeholder="Type a message..."
      suggestions={["What can you do?", "Help me debug"]}
    />
  );
}`}
            />
          </CodeBlockContent>
        </CodeBlock>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold">Demo</h2>
        <p className="text-sm text-muted-foreground">Click the chat button in the bottom-right corner</p>
        <PopoverChat chat={chat} title="AI Assistant" description="Ask me anything" placeholder="Type a message..." />
      </section>
    </div>
  );
}
