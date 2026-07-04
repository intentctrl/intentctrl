import { CodeBlock, CodeBlockHeader, CodeBlockIcon, CodeBlockContent } from "@/components/code-block/code-block";
import { CodeblockShiki } from "@/components/code-block/shiki";
import { CopyButton } from "@/components/code-block/copy-button";

const DepsPkg = ({ dependencies }: { dependencies: string[] }) => {
  return (
    <CodeBlock>
      <CodeBlockHeader className="select-none">
        <div className="flex items-center space-x-1">
          <CodeBlockIcon language="bash" />
          <span>Dependencies</span>
        </div>
        <CopyButton className="pl-1" content={dependencies.join(" ")} />
      </CodeBlockHeader>
      <CodeBlockContent>
        <CodeblockShiki className="hide-scrollbar" language="bash" code={dependencies.join(" ")} />
      </CodeBlockContent>
    </CodeBlock>
  );
};

export { DepsPkg };
