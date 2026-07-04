"use client";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/landing/mobile-nav";
import { Github } from "@react-symbols/icons/files";
import Link from "next/link";

export function Header() {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b",
        "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50",
      )}
    >
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-5">
          <Link className="rounded-lg px-3 py-2.5 hover:bg-muted dark:hover:bg-muted/50" href="/">
            <Logo className="h-6" />
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <Link className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent" href="/widgets">
              Widgets
            </Link>
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              href="https://docs.intentctrl.com"
              target="_blank"
            >
              Docs
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent"
            href="https://github.com/intentctrl/intentctrl"
            target="_blank"
            aria-label="GitHub"
          >
            <Github className="size-5" />
          </Link>
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
