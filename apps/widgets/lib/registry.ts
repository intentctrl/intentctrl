import path from "path";
import { promises as fs } from "fs";
import { registryItemSchema } from "shadcn/schema";
import rawRegistry from "@/registry.json";

interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description?: string;
  files?: { path: string; type: string; target?: string }[];
}

interface Registry {
  name: string;
  homepage: string;
  $schema: string;
  items: RegistryItem[];
}

const registry = rawRegistry as Registry;

export interface Component {
  name: string;
  type: string;
  title: string;
  description?: string;
  files?: { path: string; type: string; target: string }[];
}

export function getRegistryItems(): Component[] {
  const components = registry.items.filter((item) => item.type !== "registry:style");
  return components as Component[];
}

export function getRegistryItem(name: string): Component {
  const components = getRegistryItems();
  const component = components.find((item: { name: string }) => item.name === name);
  if (component == null) {
    throw new Error(`Component "${name}" not found`);
  }
  return component;
}

export function getBlocks() {
  return getRegistryItems()
    .filter((component) => component.type === "registry:block")
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getUIPrimitives() {
  return getRegistryItems()
    .filter((component) => component.type === "registry:ui")
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getComponents() {
  return getRegistryItems()
    .filter((component) => component.type === "registry:component")
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getItemFromRegistry(name: string) {
  const registryData = await import("@/registry.json");
  const reg = registryData.default;

  if (name === "registry") {
    return reg;
  }

  const component = reg.items.find((c: { name: string }) => c.name === name);

  if (!component) {
    return null;
  }

  const parsed = registryItemSchema.parse(component);

  if (!parsed) {
    return null;
  }

  if (!parsed.files?.length) {
    return null;
  }

  const filesWithContent = await Promise.all(
    parsed.files.map(async (file: { path: string }) => {
      const filePath = path.join(process.cwd(), file.path);
      const content = await fs.readFile(filePath, "utf8");
      return { ...file, content };
    }),
  );

  return { ...parsed, files: filesWithContent };
}
