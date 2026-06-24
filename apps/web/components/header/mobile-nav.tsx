import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/header/portal";
import { aboutLinks, aboutLinks2, platformLinks } from "@/components/header/nav-links";
import { LinkItem } from "@/components/header/sheard";
import { IconX, IconMenu2, IconBook } from "@tabler/icons-react";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
      >
        <div className={cn("transition-all", open ? "scale-100 opacity-100" : "scale-0 opacity-0")}>
          <IconX />
        </div>
        <div className={cn("absolute transition-all", open ? "scale-0 opacity-0" : "scale-100 opacity-100")}>
          <IconMenu2 />
        </div>
      </Button>
      {open && (
        <Portal className="top-14">
          <PortalBackdrop />
          <div
            className={cn(
              "size-full overflow-y-auto p-4",
              "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
            )}
            data-slot={open ? "open" : "closed"}
          >
            <div className="flex w-full flex-col gap-y-2">
              <span className="text-sm">Platform</span>
              {platformLinks.map((link) => (
                <LinkItem
                  className="rounded-lg p-2 active:bg-muted dark:active:bg-muted/50"
                  key={`product-${link.label}`}
                  {...link}
                />
              ))}
              <div className="my-2 border-t" />
              <LinkItem
                className="rounded-lg p-2 active:bg-muted dark:active:bg-muted/50"
                href="https://docs.intentctrl.com"
                icon={<IconBook />}
                label="Docs"
              />
              <span className="text-sm">About</span>
              {aboutLinks.map((link) => (
                <LinkItem
                  className="rounded-lg p-2 active:bg-muted dark:active:bg-muted/50"
                  key={`about-${link.label}`}
                  {...link}
                />
              ))}
              {aboutLinks2.map((link) => (
                <LinkItem
                  className="rounded-lg p-2 active:bg-muted dark:active:bg-muted/50"
                  key={`about-${link.label}`}
                  {...link}
                />
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                href="https://intentctrl.com/sign-in"
                className={cn("w-full", buttonVariants({ variant: "default" }))}
              >
                Sign In
              </Link>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
