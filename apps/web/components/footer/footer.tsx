"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

type FooterLink = {
  title: string;
  href: string;
  icon?: ReactNode;
};

type FooterSection = {
  label: string;
  links: FooterLink[];
};

const footerLinks: FooterSection[] = [
  {
    label: "Platform",
    links: [
      { title: "Documentation", href: "https://docs.intentctrl.com" },
      { title: "Features", href: "/#features" },
      // { title: "Pricing", href: "/#pricing" },
      { title: "Integrations", href: "/#integrations" },
    ],
  },
  {
    label: "About",
    links: [
      { title: "About Us", href: "/about" },
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "Refund Policy", href: "/refund-policy" },
      { title: "Terms and Conditions", href: "/terms-and-conditions" },
      { title: "FAQs", href: "/#faqs" },
    ],
  },
  {
    label: "Social",
    links: [
      {
        title: "Twitter",
        href: "https://x.com/intentctrl",
        icon: <IconBrandX />,
      },
      {
        title: "GitHub",
        href: "https://github.com/intentctrl/intentctrl",
        icon: <IconBrandGithub />,
      },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className={cn(
        "relative mx-auto flex w-full flex-col items-center justify-center border-t px-6 md:px-8",
        "dark:bg-[radial-gradient(35%_128px_at_50%_100%,theme(--color-foreground/.1),transparent)]",
      )}
    >
      <div className="absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/20 blur" />

      <div className="grid max-w-5xl w-full gap-8 p-6 md:p-8 lg:grid-cols-3 lg:gap-8">
        <AnimatedContainer className="space-y-4">
          <Logo className="h-6" />
          <p className="mt-8 text-muted-foreground text-sm md:mt-0">A runtime for intelligent apps.</p>
          <ThemeToggle />
        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-2 lg:mt-0">
          {footerLinks.map((section, index) => (
            <AnimatedContainer delay={0.1 + index * 0.1} key={section.label}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs">{section.label}</h3>
                <ul className="mt-4 space-y-2 text-muted-foreground text-sm">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        className="inline-flex items-center duration-250 hover:text-foreground [&_svg]:me-1.5 [&_svg]:size-3.5"
                        href={link.href}
                        key={`${section.label}-${link.title}`}
                      >
                        {link.icon}
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
      <div className="h-px w-full bg-linear-to-r via-border" />
      <div className="flex w-full items-center justify-center py-4">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} IntentCtrl, All rights reserved
        </p>
      </div>
    </footer>
  );
}

export function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: {
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return children;
  }

  return (
    <motion.div
      className={className}
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      transition={{ delay, duration: 0.8 }}
      viewport={{ once: true }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
    >
      {children}
    </motion.div>
  );
}
