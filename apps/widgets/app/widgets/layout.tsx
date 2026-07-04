import type { Metadata } from "next";
import { AppHeader } from "@/components/app-shell/app-header";
import { AppSidebar } from "@/components/app-shell/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Widgets | IntentCtrl",
  description: "Browse IntentCtrl chat widgets.",
};

export default function WidgetsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className={cn("[--app-wrapper-max-width:80rem]")}>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <AppHeader />
        <div className={cn("flex flex-1 flex-col p-4 md:p-6", "mx-auto w-full max-w-(--app-wrapper-max-width)")}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
