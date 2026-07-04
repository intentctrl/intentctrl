"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DotmSquare4 } from "@/components/ui/dotm-square-4";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
}

export default function Home() {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/r")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center mx-auto max-w-5xl px-4">
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <DotmSquare4 color="var(--primary)" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold">Coming soon</h2>
          <p className="mt-2 text-muted-foreground">Chat widgets are on their way. Check back shortly.</p>
          <Link href="/widgets" className={cn(buttonVariants({ variant: "default" }), "mt-4")}>
            Browse All
          </Link>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center w-full py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">IntentCtrl Widgets</h1>
            <p className="mt-2 text-muted-foreground">
              {items.length} chat widget{items.length !== 1 ? "s" : ""} available
            </p>
          </div>
          <div className="mt-10 w-full">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.name}
                  className="group rounded-lg border p-6 transition-colors hover:border-foreground/20"
                >
                  <h3 className="font-semibold">{item.title ?? item.name}</h3>
                  {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
                  <code className="mt-3 block text-xs text-muted-foreground">
                    npx shadcn@latest add /r/{item.name}.json
                  </code>
                </div>
              ))}
            </div>
          </div>
          <Link href="/widgets" className={cn(buttonVariants({ variant: "default" }), "mt-10")}>
            Browse All Widgets
          </Link>
        </div>
      )}
    </div>
  );
}
