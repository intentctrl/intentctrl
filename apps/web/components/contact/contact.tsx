import { cn } from "@/lib/utils";
import { FullWidthDivider } from "@/components/common/full-width-divider";
import { IconMail, IconBrandGithub, IconBrandTwitter } from "@tabler/icons-react";
import { DecorIcon } from "../common/decor-icon";
import { TextAnimate } from "@/components/ui/text-animate";
import Link from "next/link";

const data = [
  {
    title: "Twitter",
    value: "@IntentCtrl",
    href: "https://x.com/intentctrl",
    icon: <IconBrandTwitter />,
  },
  {
    title: "Send an Email",
    value: "hello@intentctrl.com",
    href: "mailto:hello@intentctrl.com",
    icon: <IconMail />,
  },
  {
    title: "GitHub",
    value: "intentctrl/intentctrl",
    href: "https://github.com/intentctrl/intentctrl",
    icon: <IconBrandGithub />,
  },
];

export function ContactSection() {
  return (
    <section className="mx-auto scroll-mt-20" id="contact">
      <div className="m-5">
        <h2 className="font-medium text-lg md:text-2xl">We're building this in public</h2>
      </div>

      <div className="relative">
        <FullWidthDivider position="top" />

        <DecorIcon className="size-4" position="top-left" />
        <DecorIcon className="size-4" position="top-right" />

        <div className="grid gap-px overflow-hidden bg-border md:grid-cols-3">
          {data.map((item, i) => (
            <div className="flex items-center gap-3 bg-background p-2 shadow-xs" key={item.title}>
              <div
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted/50",
                  "[&_svg]:size-4 [&_svg]:text-muted-foreground",
                )}
              >
                {item.icon}
              </div>
              <div className={cn("flex flex-col gap-y-0.5")}>
                <TextAnimate
                  animation="blurIn"
                  as="h2"
                  by="word"
                  className="text-sm"
                  delay={0.1 * i}
                  duration={0.4}
                  once
                  startOnView
                >
                  {item.title}
                </TextAnimate>
                <Link
                  href={item.href}
                  className="hover:underline"
                  target="_blank"
                  rel={"noopener noreferrer"}
                >
                  <TextAnimate
                    animation="blurIn"
                    as="p"
                    by="character"
                    className="text-muted-foreground text-xs"
                    delay={0.2 + 0.1 * i}
                    duration={0.5}
                    once
                    startOnView
                  >
                    {item.value}
                  </TextAnimate>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
