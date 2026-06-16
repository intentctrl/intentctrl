import Image from "next/image";
import { cn } from "@/lib/utils";
import { DecorIcon } from "@/components/common/decor-icon";
import { PixelCanvas } from "@/components/ui/pixel-canvas";

type Logo = {
  dark: string;
  light: string;
  alt: string;
  colors: string[];
  className?: string;
};

export function LogoCloud() {
  return (
    <div className="grid grid-cols-2 border md:grid-cols-4">
      <LogoCard
        className="relative border-r border-b bg-secondary dark:bg-secondary/30"
        logo={{
          light: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/nvidia/wordmark-light.svg",
          dark: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/nvidia/wordmark-dark.svg",
          alt: "Nvidia Logo",
          colors: ["#d1d5db", "#9ca3af", "#6b7280"],
        }}
      >
        <DecorIcon className="z-10" position="bottom-right" />
      </LogoCard>

      <LogoCard
        className="border-b md:border-r"
        logo={{
          light: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/supabase/wordmark-light.svg",
          dark: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/supabase/wordmark-dark.svg",
          alt: "Supabase Logo",
          colors: ["#d1fae5", "#34d399", "#059669"],
        }}
      />

      <LogoCard
        className="relative border-r border-b md:bg-secondary dark:md:bg-secondary/30"
        logo={{
          light: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/github/wordmark-light.svg",
          dark: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/github/wordmark-dark.svg",
          alt: "GitHub Logo",
          colors: ["#f5f5f5", "#e5e5e5", "#a3a3a3"],
        }}
      >
        <DecorIcon className="z-10" position="bottom-right" />
        <DecorIcon className="z-10 hidden md:block" position="bottom-left" />
      </LogoCard>

      <LogoCard
        className="relative border-b bg-secondary md:bg-background dark:bg-secondary/30 md:dark:bg-background"
        logo={{
          light: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/openai/wordmark-light.svg",
          dark: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/openai/wordmark-dark.svg",
          alt: "OpenAI Logo",
          colors: ["#d1fae5", "#34d399", "#059669"],
        }}
      />

      <LogoCard
        className="relative border-r border-b bg-secondary md:border-b-0 md:bg-background dark:bg-secondary/30 md:dark:bg-background"
        logo={{
          light: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/turso/wordmark-light.svg",
          dark: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/turso/wordmark-dark.svg",
          alt: "Turso Logo",
          colors: ["#fef3c7", "#fbbf24", "#d97706"],
        }}
      >
        <DecorIcon className="z-10 md:hidden" position="bottom-right" />
      </LogoCard>

      <LogoCard
        className="border-b bg-background md:border-r md:border-b-0 md:bg-secondary dark:md:bg-secondary/30"
        logo={{
          light: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/clerk/wordmark-light.svg",
          dark: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/clerk/wordmark-dark.svg",
          alt: "Clerk Logo",
          colors: ["#f3e8ff", "#c084fc", "#9333ea"],
        }}
      />

      <LogoCard
        className="border-r"
        logo={{
          light: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/claude-ai/wordmark-light.svg",
          dark: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/claude-ai/wordmark-dark.svg",
          alt: "Claude AI Logo",
          colors: ["#fef3c7", "#f59e0b", "#d97706"],
        }}
      />

      <LogoCard
        className="bg-secondary dark:bg-secondary/30"
        logo={{
          light: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/vercel/wordmark-light.svg",
          dark: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/vercel/wordmark-dark.svg",
          alt: "Vercel Logo",
          colors: ["#f5f5f5", "#e5e5e5", "#a3a3a3"],
        }}
      />
    </div>
  );
}

type LogoCardProps = React.ComponentProps<"div"> & {
  logo: Logo;
};

function LogoCard({ logo, className, children, ...props }: LogoCardProps) {
  return (
    <div
      className={cn(
        "group relative flex cursor-pointer items-center justify-center bg-background px-4 py-8 md:p-8",
        className,
      )}
      {...props}
    >
      <PixelCanvas gap={6} speed={25} colors={logo.colors} variant="icon" />
      <Image
        alt={logo.alt}
        className={cn("pointer-events-none relative z-10 h-4 w-auto select-none md:h-5 block dark:hidden", logo.className)}
        height={20}
        src={logo.light}
        width={120}
      />
      <Image
        alt={logo.alt}
        className={cn("pointer-events-none relative z-10 h-4 w-auto select-none md:h-5 hidden dark:block", logo.className)}
        height={20}
        src={logo.dark}
        width={120}
      />
      {children}
    </div>
  );
}
