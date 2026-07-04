"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DotmSquare4 } from "@/components/ui/dotm-square-4";
import { CodeBlockTabsPkg } from "@/components/code-block/code-block-tabs-pkg";
import { DepsPkg } from "@/components/code-block/deps-pkg";

interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  files?: { path: string; type: string; content?: string }[];
  dependencies?: string[];
  registryDependencies?: string[];
}

export default function WidgetDetailPage() {
  const { name } = useParams<{ name: string }>();
  const [item, setItem] = useState<RegistryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/r/${name}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [name]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <DotmSquare4 color="var(--primary)" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mt-24 text-center">
        <h2 className="text-lg font-semibold">Widget not found</h2>
        <p className="mt-1 text-sm text-muted-foreground">No widget named &quot;{name}&quot; found.</p>
        <Link
          href="/widgets"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Back to all widgets
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight">{item.title ?? item.name}</h1>
      {item.description && <p className="mt-1 text-muted-foreground">{item.description}</p>}

      {item.dependencies && item.dependencies.length > 0 && (
        <div className="mt-6">
          <DepsPkg dependencies={item.dependencies} />
        </div>
      )}

      <div className="mt-8">
        <CodeBlockTabsPkg name={item.name} />
      </div>
    </div>
  );
}
