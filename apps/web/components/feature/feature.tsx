import type React from "react";
import { cn } from "@/lib/utils";
import { DecorIcon } from "@/components/common/decor-icon";
import { IconMessages, IconTerminal2, IconTool, IconHierarchy, IconShieldLock, IconRefresh } from "@tabler/icons-react";
import { TextAnimate } from "@/components/ui/text-animate";

type FeatureType = {
  title: string;
  icon: React.ReactNode;
  description: string;
};

export function FeatureSection() {
  return (
    <section className="place-content-center p-4 scroll-mt-20" id="features">
      <div className="mx-auto flex w-full flex-col justify-center gap-12 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-2xl space-y-2 text-center">
          <TextAnimate
            animation="slideUp"
            as="h2"
            by="word"
            className="font-medium text-2xl tracking-tight md:text-3xl lg:text-4xl"
            duration={0.6}
            once
            startOnView
          >
            How it works
          </TextAnimate>
          <TextAnimate
            animation="slideUp"
            as="p"
            by="word"
            className="text-muted-foreground text-sm leading-relaxed md:text-base"
            delay={0.3}
            duration={0.6}
            once
            startOnView
          >
            It's a runtime that understands your app — its routes, its buttons, its forms, its logic — and lets the AI
            act on that understanding safely.
          </TextAnimate>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard feature={feature} key={feature.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  feature: FeatureType;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between gap-6 bg-background px-6 pt-8 pb-6 shadow-xs",
        // Gradient inspired by testimonials
        "dark:bg-[radial-gradient(50%_80%_at_25%_0%,--theme(--color-foreground/.1),transparent)]",
        className,
      )}
      {...props}
    >
      {/* Extended Borders */}
      <div className="absolute -inset-y-4 -left-px w-px bg-border" />
      <div className="absolute -inset-y-4 -right-px w-px bg-border" />
      <div className="absolute -inset-x-4 -top-px h-px bg-border" />
      <div className="absolute -right-4 -bottom-px -left-4 h-px bg-border" />

      {/* Corner Decor */}
      <DecorIcon className="size-3.5" position="top-left" />

      <div
        className={cn(
          "relative z-10 flex w-fit items-center justify-center rounded-lg border bg-muted/20 p-3",
          "[&_svg]:size-5 [&_svg]:stroke-[1.5] [&_svg]:text-foreground",
        )}
      >
        {feature.icon}
      </div>

      <div className="relative z-10 space-y-2">
        <h3 className="font-medium text-base text-foreground">{feature.title}</h3>
        <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
      </div>
    </div>
  );
}

const features: FeatureType[] = [
  {
    title: "Chat that knows your app",
    icon: <IconMessages />,
    description: "Answers with live context from the current page, available tools, and your app data.",
  },
  {
    title: "Actions, not hallucinations",
    icon: <IconTerminal2 />,
    description: "The LLM decides what to do. A permission-checked runtime executes every action safely.",
  },
  {
    title: "Register your own tools",
    icon: <IconTool />,
    description: "Expose typed, Zod-validated tools that connect directly to your app logic and state.",
  },
  {
    title: "Semantic page understanding",
    icon: <IconHierarchy />,
    description: "Builds a compact UI graph and sends only relevant context \u2014 never raw HTML.",
  },
  {
    title: "Granular permissions",
    icon: <IconShieldLock />,
    description: "Control AI access to navigation, input, and custom tools at any level.",
  },
  {
    title: "Lifecycle-aware tool scoping",
    icon: <IconRefresh />,
    description: "Component tools register on mount and clean up automatically on unmount.",
  },
];
