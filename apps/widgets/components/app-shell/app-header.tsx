"use client";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { DecorIcon } from "@/components/common/decor-icon";
import { AppBreadcrumbs } from "@/components/app-shell/app-breadcrumbs";
import { navLinks } from "@/components/app-shell/app-shared";
import { CustomSidebarTrigger } from "@/components/app-shell/custom-sidebar-trigger";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";

export function AppHeader() {
  const path = usePathname();
  const activeItem = [...navLinks]
    .sort((a, b) => b.path.length - a.path.length)
    .find((item) => path === item.path || path.startsWith(item.path + "/"));
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 md:px-6",
        "bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50",
      )}
    >
      <DecorIcon className="hidden md:block" position="bottom-left" />
      <div className="flex items-center gap-3">
        <CustomSidebarTrigger />
        <Separator className="mr-2 h-4 data-[orientation=vertical]:self-center" orientation="vertical" />
        <AppBreadcrumbs page={activeItem} />
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}
