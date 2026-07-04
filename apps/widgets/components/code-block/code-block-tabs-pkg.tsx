"use client";

import type { FC, SVGProps } from "react";
import { usePackageManager, type PackageManager } from "@/stores/packageManager";
import { CodeBlock, CodeBlockContent, CodeBlockHeader, CodeBlockIcon } from "@/components/code-block/code-block";
import { CopyButton } from "@/components/code-block/copy-button";
import { CodeblockShiki } from "@/components/code-block/shiki";
import { Bun, NPM, PNPM, Yarn } from "@react-symbols/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Command {
  name: PackageManager;
  command: string;
  icon: FC<SVGProps<SVGSVGElement>>;
}

interface CodeBlockTabsPkgProps {
  name: string;
}

const registryUrl = "https://widgets.intentctrl.com/r/";

const Commands: Command[] = [
  {
    name: "npm",
    command: "npx shadcn@latest add",
    icon: NPM,
  },
  {
    name: "pnpm",
    command: "pnpm dlx shadcn@latest add",
    icon: PNPM,
  },
  {
    name: "yarn",
    command: "yarn shadcn@latest add",
    icon: Yarn,
  },
  {
    name: "bun",
    command: "bunx --bun shadcn@latest add",
    icon: Bun,
  },
];

const CodeBlockTabsPkg = ({ name }: CodeBlockTabsPkgProps) => {
  const { packageManager, setPackageManager } = usePackageManager();

  const selectedPkg = Commands.find((pkg) => pkg.name === packageManager) ?? Commands[0]!;
  const fullCommand = `${selectedPkg.command} ${registryUrl}${name}.json`;

  return (
    <Tabs
      className="w-full gap-1"
      value={packageManager}
      onValueChange={(value) => setPackageManager(value as PackageManager)}
    >
      <CodeBlock>
        <CodeBlockHeader className="select-none">
          <div className="flex items-center space-x-1">
            <CodeBlockIcon language="bash" />
            <TabsList className="gap-1 border-0 bg-transparent dark:bg-transparent">
              {Commands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <TabsTrigger key={cmd.name} value={cmd.name} className="data-active:shadow-none">
                    <Icon className="size-4" />
                    <span>{cmd.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
          <CopyButton className="pl-1" content={fullCommand} />
        </CodeBlockHeader>
        <CodeBlockContent>
          {Commands.map((cmd) => (
            <TabsContent key={cmd.name} value={cmd.name} className="mt-0">
              <CodeblockShiki className="hide-scrollbar" language="bash" code={fullCommand} />
            </TabsContent>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </Tabs>
  );
};

export { CodeBlockTabsPkg };
