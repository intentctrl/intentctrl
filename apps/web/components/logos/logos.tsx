import { LogoCloud } from "@/components/logos/logo-cloud";
import { DecorIcon } from "@/components/common/decor-icon";
import { FullWidthDivider } from "@/components/common/full-width-divider";

export function LogosSection() {
  return (
    <section className="mb-12 scroll-mt-20" id="logos">
      <h2 className="py-6 text-center font-medium text-lg text-muted-foreground tracking-tight md:text-xl">
        Built Using <span className="text-foreground">this</span>
      </h2>
      <div className="relative *:border-0">
        <DecorIcon className="size-4" position="top-left" />
        <DecorIcon className="size-4" position="top-right" />
        <DecorIcon className="size-4" position="bottom-left" />
        <DecorIcon className="size-4" position="bottom-right" />

        <FullWidthDivider className="-top-px" />
        <LogoCloud />
        <FullWidthDivider className="-bottom-px" />
      </div>
    </section>
  );
}
