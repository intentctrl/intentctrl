import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { TextAnimate } from "@/components/ui/text-animate";

export const metadata: Metadata = {
  title: "About | IntentCtrl",
  description: "A runtime for intelligent apps — open source, permission-checked, framework-agnostic.",
};

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden mx-auto max-w-3xl grow px-4 py-12 supports-[overflow:clip]:overflow-clip">
      <div
        className={cn(
          "absolute -inset-x-20 inset-y-0 z-0 rounded-full",
          "bg-[radial-gradient(ellipse_at_center,theme(--color-foreground/.1),transparent,transparent)]",
          "blur-[50px]",
        )}
      />

      <div className="relative z-10">
        <TextAnimate
          animation="blurIn"
          by="word"
          className="text-center font-medium text-3xl tracking-tight md:text-5xl"
          duration={0.6}
          once
          startOnView
        >
          About
        </TextAnimate>

        <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            IntentCtrl is an open-source runtime that lets you embed an AI assistant directly into your application. Not
            a chatbot wrapper — a runtime that understands your app's structure and can act inside it safely.
          </p>

          <h2 className="font-medium text-foreground text-xl">Why we built it</h2>
          <p>
            Most AI integrations are shallow. A chat window that answers questions but can't do anything. We built
            IntentCtrl to bridge that gap — giving users an assistant that can navigate, click, type, and call your
            actual application logic, all through a permission-checked execution engine.
          </p>

          <h2 className="font-medium text-foreground text-xl">How it works</h2>
          <p>
            The AI never touches the DOM directly. Every action — whether it's a built-in tool like click or scroll, or
            a custom tool you register via <code className="rounded bg-muted px-1.5 py-0.5 text-sm">useTool</code> —
            is validated and executed by a runtime that respects the permissions you define. Your app stays in control.
          </p>

          <h2 className="font-medium text-foreground text-xl">Open source</h2>
          <p>
            The SDK is open source and available on{" "}
            <Link href="https://github.com/intentctrl/intentctrl" className="text-primary hover:underline">
              GitHub
            </Link>
            . No account required, no usage limits, no hidden costs. A cloud backend with session history, analytics,
            and memory is on the roadmap — there will always be a free tier.
          </p>

          <h2 className="font-medium text-foreground text-xl">The team</h2>
          <p>
            We're a small team building in public. IntentCtrl is the kind of tool we wanted ourselves — an AI
            integration that respects your architecture, your permissions, and your users.
          </p>
        </div>
      </div>
    </div>
  );
}
