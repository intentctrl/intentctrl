import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

type Entry = {
  section: "Packages" | "Apps";
  name: string;
  path: string;
};

const entries: Entry[] = [
  { section: "Packages", name: "@intentctrl/core", path: "packages/core/CHANGELOG.md" },
  { section: "Packages", name: "@intentctrl/react", path: "packages/react/CHANGELOG.md" },
  { section: "Packages", name: "@intentctrl/types", path: "packages/types/CHANGELOG.md" },
  { section: "Apps", name: "@intentctrl/web", path: "apps/web/CHANGELOG.md" },
  { section: "Apps", name: "@intentctrl/docs", path: "apps/docs/CHANGELOG.md" },
];

const sections: Partial<Record<"Packages" | "Apps", { name: string; content: string }[]>> = {};

for (const entry of entries) {
  const fullPath = resolve(root, entry.path);

  if (!existsSync(fullPath)) continue;

  let content = readFileSync(fullPath, "utf-8").trim();
  if (!content) continue;

  content = content.replace(/^# .+\n?/, "");
  content = content.replace(/^(#+)/gm, (_, h: string) => "#".repeat(h.length + 1));

  if (!sections[entry.section]) sections[entry.section] = [];
  sections[entry.section]!.push({ name: entry.name, content });
}

const outputDir = resolve(root, "apps/docs/content/changelogs");
mkdirSync(outputDir, { recursive: true });

const sectionsList: [keyof typeof sections, string][] = [
  ["Packages", "packages-changelogs"],
  ["Apps", "apps-changelogs"],
];

for (const [sectionTitle, slug] of sectionsList) {
  const items = sections[sectionTitle] ?? [];

  let mdx = `---
title: ${sectionTitle}
description: Release history for ${sectionTitle.toLowerCase()}
icon: History
---

`;

  if (items.length === 0) {
    mdx += "No releases yet.\n";
  } else {
    for (const item of items) {
      mdx += `## ${item.name}\n\n${item.content}\n\n`;
    }
  }

  writeFileSync(resolve(outputDir, `${slug}.mdx`), mdx);
}
