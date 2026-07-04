import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/landing/portal";
import { IconX, IconMenu2, IconBook, IconLayoutGrid } from "@tabler/icons-react";
import { Github } from "@react-symbols/icons/files";

const links = [
  { label: "Widgets", href: "/widgets", icon: <IconLayoutGrid /> },
  { label: "Docs", href: "https://docs.intentctrl.com", icon: <IconBook /> },
  { label: "GitHub", href: "https://github.com/intentctrl/intentctrl", icon: <Github /> },
];

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
              {links.map((link) => (
                <Link
                  key={link.label}
                  className="flex items-center gap-x-3 rounded-lg p-3 text-sm font-medium active:bg-muted dark:active:bg-muted/50"
                  href={link.href}
                  onClick={() => setOpen(false)}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                >
                  <div className="flex size-10 items-center justify-center rounded-md border bg-card text-sm shadow-sm">
                    {link.icon}
                  </div>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
