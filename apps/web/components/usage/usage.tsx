import { CodeBlock } from "@/components/ui/code-block";
import { FullWidthDivider } from "@/components/common/full-width-divider";
import { TextAnimate } from "@/components/ui/text-animate";
import Link from "next/link";

export function UsageSection() {
  return (
    <section className="relative mx-auto grid grid-cols-1 gap-12 p-4 md:grid-cols-2 scroll-mt-20" id="usage">
      <FullWidthDivider className="-top-px" />

      <div className="p-4 md:p-6">
        <div className="space-y-4">
          <TextAnimate
            animation="blurIn"
            as="h2"
            by="word"
            className="font-medium text-2xl text-foreground tracking-tight md:text-3xl lg:text-4xl"
            duration={0.6}
            once
            startOnView
          >
            Add an AI assistant to your app in 3 steps
          </TextAnimate>
          <TextAnimate
            animation="blurIn"
            as="p"
            by="word"
            className="text-muted-foreground text-sm md:text-base"
            delay={0.3}
            duration={0.6}
            once
            startOnView
          >
            Install the runtime, wrap your app with the provider, and build your own chat interface using the hooks we
            give you.
          </TextAnimate>
          <TextAnimate
            animation="blurIn"
            as="p"
            by="word"
            className="text-muted-foreground text-sm md:text-base"
            delay={0.6}
            duration={0.6}
            once
            startOnView
          >
            See the docs for guides, API reference, and advanced usage.
          </TextAnimate>
          <Link href="https://docs.intentctrl.com" className="text-primary hover:underline">
            Read the docs
          </Link>{" "}
        </div>
      </div>

      <div className="p-4 md:p-6">
        <CodeBlock
          tabs={[
            {
              label: "Install",
              language: "bash",
              code: "npm install @intentctrl/react",
            },
            {
              label: "Setup",
              language: "tsx",
              code: `import { IntentCtrlProvider } from "@intentctrl/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <IntentCtrlProvider apiKey={process.env.NEXT_PUBLIC_API_KEY!}>
      {children}
    </IntentCtrlProvider>
  );
}`,
            },
            {
              label: "Build a Chat",
              language: "tsx",
              code: `import { useIntentCtrl } from "@intentctrl/react";

function ChatWidget() {
  const { messages, sendMessage, status, stop } = useIntentCtrl();

  return <div>{/* your custom chat UI */}</div>;
}`,
            },
          ]}
        />
      </div>
    </section>
  );
}
