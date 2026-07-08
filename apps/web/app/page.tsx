import { HeroSection } from "@/components/hero/hero";
import { LogosSection } from "@/components/logos/logos";
import { FeatureSection } from "@/components/feature/feature";
import { UsageSection } from "@/components/usage/usage";
import { IntegrationsSection } from "@/components/integrations/integrations";
import { PricingSection } from "@/components/pricing/pricing";
import { FaqsSection } from "@/components/faqs/faqs";
import { ContactSection } from "@/components/contact/contact";

import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden px-4 supports-[overflow:clip]:overflow-clip">
      <main
        className={cn(
          "relative mx-auto max-w-4xl grow",
          // X Borders
          "before:absolute before:-inset-y-14 before:-left-px before:w-px before:bg-border",
          "after:absolute after:-inset-y-14 after:-right-px after:w-px after:bg-border",
        )}
      >
        <HeroSection />
        {/* <LogosSection /> */}
        <FeatureSection />
        <UsageSection />
        <IntegrationsSection />
        {/* <PricingSection /> */}
        <FaqsSection />
        <ContactSection />
      </main>
    </div>
  );
}
