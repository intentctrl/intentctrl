import { source } from "@/lib/source";
import { DocsLayout } from "@/layouts/notebook";
import { baseOptions } from "@/lib/layout.shared";
import { AISearch, AISearchPanel, AISearchTrigger } from "@/components/ai/search";
import { MessageCircleIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { buttonVariants } from "fumadocs-ui/components/ui/button";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <DocsLayout tree={source.getPageTree()} tabMode="navbar" {...baseOptions()}>
      <AISearch>
        <AISearchPanel />
        <AISearchTrigger
          position="float"
          className={cn(
            buttonVariants({
              variant: "secondary",
              className: "text-fd-muted-foreground rounded-2xl",
            }),
          )}
        >
          <MessageCircleIcon className="size-4.5" />
          Ask AI
        </AISearchTrigger>
      </AISearch>

      <div className="absolute inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 xl:right-1/4 right-0 translate-x-1/2 -z-10 -translate-y-1/2 w-5xl h-256 rounded-full bg-fd-primary/10 [--mask:radial-gradient(circle_at_center,red,transparent_69%)] mask-(--mask) [webkit-mask-image:var(--mask)] pointer-events-none" />
        <div className="fixed top-0 xl:right-1/4 right-0 translate-x-1/2 -z-10 -translate-y-1/2 w-5xl h-256 rounded-full bg-fd-primary/5 [--mask:radial-gradient(circle_at_center,red,transparent_69%)] mask-(--mask) [webkit-mask-image:var(--mask)] pointer-events-none" />
        <div className="absolute top-0 xl:right-1/4 right-0 translate-x-1/2 -z-10 h-256 w-5xl bg-grid-lines-xl dark:opacity-80 -translate-y-1/2 [--mask:radial-gradient(circle_at_center_top,red,transparent)] mask-(--mask) [webkit-mask-image:var(--mask)] -skew-20 pointer-events-none" />
      </div>

      {children}
    </DocsLayout>
  );
}
