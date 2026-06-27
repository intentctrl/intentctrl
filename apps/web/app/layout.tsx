import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";

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
  description: "Give your users an assistant that thinks, acts, and confirms before it does.",
  icons: {
    icon: "/favicon.svg",
  },
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
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
