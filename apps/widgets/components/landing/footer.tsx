"use client";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function Footer() {
  return (
    <footer
      className={cn(
        "mx-auto flex w-full flex-col items-center justify-center border-t px-6 md:px-8",
        "dark:bg-[radial-gradient(35%_128px_at_50%_100%,theme(--color-foreground/.1),transparent)]",
      )}
    >
      <div className="flex w-full max-w-5xl items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <Logo className="h-5" />
          <span className="text-muted-foreground text-sm">Chat widgets for IntentCtrl</span>
        </div>
        <ThemeToggle />
      </div>
      <div className="h-px w-full max-w-5xl bg-border" />
      <div className="flex w-full max-w-5xl items-center justify-center py-4">
        <p className="text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} IntentCtrl, All rights reserved
        </p>
      </div>
    </footer>
  );
}
