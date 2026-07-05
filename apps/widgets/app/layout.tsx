import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import "./shiki.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

const fontSans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IntentCtrl",
  description: "Chat widgets for IntentCtrl",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "text-foreground",
        "bg-background",
        "h-full",
        "antialiased",
        fontSans.variable,
        fontMono.variable,
        "font-sans",
        "scrollbar-thin scrollbar-track-background scrollbar-thumb-foreground/50",
        "selection:bg-foreground selection:text-background",
      )}
    >
      <body className="min-h-full flex flex-col w-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
