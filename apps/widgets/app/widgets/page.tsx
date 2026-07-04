"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DotmSquare4 } from "@/components/ui/dotm-square-4";

interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
}

export default function WidgetsPage() {
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
    <div>
      <h1 className="text-2xl font-bold tracking-tight">All Widgets</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {items.length} widget{items.length !== 1 ? "s" : ""}
      </p>

      {loading ? (
        <div className="flex justify-center py-24">
          <DotmSquare4 color="var(--primary)" />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-24 text-center">
          <h2 className="text-lg font-semibold">No widgets found</h2>
          <p className="mt-1 text-sm text-muted-foreground">Coming soon</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.name}
              href={`/widgets/${item.name}`}
              className="group rounded-lg border p-5 transition-colors hover:border-foreground/20"
            >
              <h3 className="font-semibold">{item.title ?? item.name}</h3>
              {item.description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {item.type.replace("registry:", "")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
