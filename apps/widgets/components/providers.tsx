"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { DirectionProvider } from "@/components/ui/direction";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { IntentCtrlProvider } from "@intentctrl/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <IntentCtrlProvider apiKey="my-shared-secret-key">
      <DirectionProvider direction="ltr">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </DirectionProvider>
    </IntentCtrlProvider>
  );
}
