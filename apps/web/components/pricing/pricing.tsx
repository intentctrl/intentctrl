"use client";

import React from "react";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DecorIcon } from "@/components/common/decor-icon";
import { FullWidthDivider } from "@/components/common/full-width-divider";
import { type FREQUENCY, FrequencyToggle } from "@/components/pricing/frequency-toggle";
import { IconStar, IconCheck } from "@tabler/icons-react";
import { TextAnimate } from "@/components/ui/text-animate";

type Plan = {
  name: string;
  info: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  btn: {
    text: string;
    href: string;
  };
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    info: "Get started with the open-source SDK and cloud platform",
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      "MIT licensed SDK",
      "1 cloud project",
      "1,000 messages/month",
      "100 requests/day API limit",
      "Basic analytics",
    ],
    btn: {
      text: "Get started",
      href: "https://app.intentctrl.com/sign-up",
    },
  },
  {
    name: "Builder",
    info: "For developers building and testing production apps",
    highlighted: true,
    price: {
      monthly: 8,
      yearly: 80,
    },
    features: [
      "Everything in Free",
      "3 cloud projects",
      "10,000 messages/month",
      "1,000 requests/day API limit",
      "Basic analytics",
      "Early access to upcoming features",
    ],
    btn: {
      text: "Get started",
      href: "https://app.intentctrl.com/sign-up",
    },
  },
  {
    name: "Pro",
    info: "For larger applications with higher usage limits",
    price: {
      monthly: 24,
      yearly: 240,
    },
    features: [
      "Everything in Builder",
      "6 cloud projects",
      "100,000 messages/month",
      "10,000 requests/day API limit",
      "Basic analytics",
      "Highest usage limits",
      "Early access to upcoming features",
    ],
    btn: {
      text: "Get started",
      href: "https://app.intentctrl.com/sign-up",
    },
  },
];

export function PricingSection() {
  const [frequency, setFrequency] = React.useState<"monthly" | "yearly">("monthly");

  return (
    <section className="mx-auto min-h-screen place-content-center scroll-mt-20" id="pricing">
      <div className="relative">
        <div className="mx-auto flex w-full flex-col items-center space-y-7 p-8">
          <div className="mx-auto max-w-xl space-y-2">
            <TextAnimate
              animation="blurIn"
              as="h2"
              by="word"
              className="text-center font-medium text-2xl tracking-tight md:text-3xl lg:text-4xl"
              duration={0.6}
              once
              startOnView
            >
              Open source SDK. Paid cloud. Self-host anytime.
            </TextAnimate>
            <TextAnimate
              animation="blurIn"
              as="p"
              by="word"
              className="text-center text-muted-foreground text-sm md:text-base"
              delay={0.3}
              duration={0.6}
              once
              startOnView
            >
              Use the SDK today with no account, no usage limits, and no hidden costs. Self-host the platform for free
              with unlimited usage, or use our cloud platform as we continue building features like session history,
              analytics, and memory.
            </TextAnimate>
          </div>

          <FrequencyToggle frequency={frequency} setFrequency={setFrequency} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard frequency={frequency} key={plan.name} plan={plan} />
          ))}
        </div>

        <FullWidthDivider />

        <p className="my-4 text-center text-muted-foreground text-xs">
          The SDK is open source and free forever. Paid plans apply only to the hosted Cloud platform.
        </p>
      </div>
      <FullWidthDivider />
    </section>
  );
}

type PricingCardProps = React.ComponentProps<"div"> & {
  plan: Plan;
  frequency?: FREQUENCY;
};

export function PricingCard({ plan, className, frequency = "monthly", ...props }: PricingCardProps) {
  return (
    <div
      className={cn("relative flex flex-col border-t border-r-0 md:border-r bg-background  last:border-r-0", className)}
      key={plan.name}
      {...props}
    >
      {!plan.highlighted && (
        <>
          <DecorIcon className="size-4" position="top-left" />
          <DecorIcon className="size-4" position="top-right" />
        </>
      )}

      <div className={cn("border-b p-4", plan.highlighted && "bg-card dark:bg-card/80")}>
        <AnimatePresence mode="wait">
          <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
            {plan.highlighted && (
              <motion.div
                className="flex items-center gap-1 rounded-md border bg-background px-2 py-0.5 text-xs"
                key="popular-badge"
                layout
                transition={{ duration: 0.1 }}
              >
                <IconStar className="size-3 fill-current" />
                Popular
              </motion.div>
            )}

            {frequency === "yearly" && plan.price.monthly > plan.price.yearly && (
              <motion.div
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 rounded-md border bg-primary px-2 py-0.5 text-primary-foreground text-xs"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="discount-badge"
                layout
                transition={{ duration: 0.15 }}
              >
                {/* Calculate the actual discount percentage of the plan */}
                {Math.round(((plan.price.monthly - plan.price.yearly) / plan.price.monthly) * 100)}% off
              </motion.div>
            )}
          </div>
        </AnimatePresence>

        <div className="mt-4 font-medium text-lg">{plan.name}</div>
        <p className="font-normal text-muted-foreground text-sm">{plan.info}</p>

        <h3 className="mt-6 mb-1 flex w-max items-end gap-1">
          <NumberFlow
            className="font-extrabold text-3xl [&::part(suffix)]:font-normal [&::part(suffix)]:text-base [&::part(suffix)]:text-muted-foreground"
            format={{
              style: "currency",
              currency: "USD",
              notation: "compact",
            }}
            suffix="/month"
            value={plan.price[frequency]}
          />
        </h3>
        <p className="mb-2 font-normal text-muted-foreground text-xs">billed {frequency}</p>

        <Button asChild className="mt-4 w-full" variant={plan.highlighted ? "default" : "outline"}>
          <Link href={plan.btn.href}>{plan.btn.text}</Link>
        </Button>
      </div>

      <div className="space-y-3 px-4 py-6 text-muted-foreground text-sm">
        {plan.features.map((feature) => (
          <div className="flex items-center gap-2" key={feature}>
            <IconCheck className="size-4 text-foreground" />
            <p>{feature}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
