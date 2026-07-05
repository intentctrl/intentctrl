import type { ReactNode } from "react";
import type { ImageResponseOptions } from "@takumi-rs/image-response";
import { cn } from "@/lib/cn";
import { appName } from "@/lib/shared";
import { Logo } from "@/components/logo";

export interface GenerateProps {
  title: ReactNode;
  description: ReactNode;
  theme?: "light" | "dark";
}

export async function getImageResponseOptions(): Promise<ImageResponseOptions> {
  return {
    width: 1200,
    height: 630,
    format: "webp",
  };
}

export function generate({ title, description, theme }: GenerateProps) {
  const mode = (theme || "light") as "dark" | "light";
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(224,245,242,0.8) 30%, rgba(128,201,193,0.5) 60%, rgba(0,120,111,0.7) 100%), radial-gradient(circle at 20% 30%, rgba(255,255,255,0.7) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(0,120,111,0.15) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(0,120,111,0.1) 0%, transparent 60%)`,
      }}
      tw="relative h-full w-full flex flex-col items-center justify-center p-20"
    >
      <div tw="flex items-center">
        <div tw="bg-neutral-800 flex text-white h-9 w-9 items-center justify-center rounded-lg">
          <Logo tw={cn("size-6")} />
        </div>
        <span tw="ml-4 text-xl text-neutral-900 font-medium">{appName}</span>
      </div>

      <h1 tw="mt-8 text-6xl text-center text-neutral-900 max-w-2xl mx-auto">{title}</h1>
      <p tw="-mt-3 text-center text-4xl text-neutral-800/90 max-w-2xl mx-auto">{description}</p>
    </div>
  );
}
