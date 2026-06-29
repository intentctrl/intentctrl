import { cn } from "@/lib/utils";
import { DecorIcon } from "@/components/common/decor-icon";
import { CodeBlock } from "@/components/ui/code-block";
import { FullWidthDivider } from "@/components/common/full-width-divider";
import { TextAnimate } from "@/components/ui/text-animate";
import { IconArrowRight, IconPhone } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section id="hero">
      <div className="relative flex flex-col items-center justify-center gap-5 px-4 py-12 md:px-4 md:py-24 lg:py-28">
        {/* X Faded Borders & Shades */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-hidden">
          <div
            className={cn(
              "absolute -inset-x-20 inset-y-0 z-0 rounded-full",
              "bg-[radial-gradient(ellipse_at_center,theme(--color-foreground/.1),transparent,transparent)]",
              "blur-[50px]",
            )}
          />
          <div className="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-border to-border md:left-8" />
          <div className="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-border to-border md:right-8" />
          <div className="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:left-12" />
          <div className="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:right-12" />
        </div>

        <Link
          href="/#usage"
          className="group mx-auto flex w-fit items-center gap-3 rounded-sm border bg-card p-1 shadow"
        >
          <div className="rounded-xs border bg-card px-1.5 py-0.5 shadow-sm">
            <p className="font-mono text-xs">NEW</p>
          </div>

          <span className="text-xs">AI actions for your app</span>
          <span className="block h-5 border-l" />

          <div className="pr-1">
            <IconArrowRight className="size-3 -translate-x-0.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
          </div>
        </Link>

        <TextAnimate
          // as="h1"
          by="character"
          animation="blurIn"
          duration={2}
          startOnView
          once
          className="max-w-2xl text-balance text-center text-3xl text-foreground md:text-4xl lg:text-5xl"
        >
          Your app, now fluent in natural language.
        </TextAnimate>

        <TextAnimate
          as="p"
          by="word"
          animation="blurIn"
          delay={2}
          duration={0.6}
          startOnView
          once
          className="text-center max-w-sm lg:max-w-lg text-muted-foreground text-sm wrap-break-word tracking-wider sm:text-lg"
        >
          An open-source SDK that turns your application into an AI-native experience, enabling users to talk to your
          app and take actions using natural language.
        </TextAnimate>

        <div className="flex flex-col w-full max-w-72 items-center justify-center gap-3 pt-2 z-20">
          <CodeBlock
            className="w-full"
            tabs={[
              {
                label: "npm",
                code: "npm install @intentctrl/react",
                language: "bash",
              },
              {
                label: "pnpm",
                code: "pnpm add @intentctrl/react",
                language: "bash",
              },
              {
                label: "yarn",
                code: "yarn add @intentctrl/react",
                language: "bash",
              },
            ]}
          />
        </div>
      </div>
      <div className="relative">
        <DecorIcon className="size-4" position="top-left" />
        <DecorIcon className="size-4" position="top-right" />
        <DecorIcon className="size-4" position="bottom-left" />
        <DecorIcon className="size-4" position="bottom-right" />

        <FullWidthDivider className="-top-px" />
        <div className="overflow-hidden *:pointer-events-none *:aspect-video *:select-none">
          <Image
            alt="light app screen"
            className="dark:hidden blur-md mask-[url('/assets/noise-mask.svg')] mask-cover mask-no-repeat"
            height={720}
            src="/assets/images/dashboard-light.png"
            width={1280}
          />
          <Image
            alt="dark app screen"
            className="hidden dark:block blur-md mask-[url('/assets/noise-mask.svg')] mask-cover mask-no-repeat"
            height={720}
            src="/assets/images/dashboard-dark.png"
            width={1280}
          />
          <div className="absolute top-3/5 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center">
            <TextAnimate
              as="h2"
              by="word"
              animation="slideUp"
              duration={0.6}
              startOnView
              once
              className="text-2xl font-semibold text-foreground md:text-3xl"
            >
              Cloud platform coming soon.
            </TextAnimate>
          </div>
        </div>
        <FullWidthDivider className="-bottom-px" />
      </div>
    </section>
  );
}
