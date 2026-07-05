import { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Outfit } from "next/font/google";
import { cn } from "@/lib/cn";

const fontSans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IntentCtrl",
  description: "Give your users an assistant that thinks, acts, and confirms before it does.",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        fontSans.className,
        "scrollbar-thin scrollbar-track-background scrollbar-thumb-foreground/50",
        "selection:bg-black/80 selection:text-white",
        "dark:selection:bg-white/80 dark:selection:text-black",
      )}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
