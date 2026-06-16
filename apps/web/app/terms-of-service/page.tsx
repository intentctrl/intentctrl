import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { TextAnimate } from "@/components/ui/text-animate";

export const metadata: Metadata = {
  title: "Terms of Service | IntentCtrl",
  description: "Terms governing the use of the IntentCtrl website and SDK.",
};

export default function TermsOfServicePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden mx-auto max-w-3xl grow px-4 py-12 supports-[overflow:clip]:overflow-clip">
      <div
        className={cn(
          "absolute -inset-x-20 inset-y-0 z-0 rounded-full",
          "bg-[radial-gradient(ellipse_at_center,theme(--color-foreground/.1),transparent,transparent)]",
          "blur-[50px]",
        )}
      />

      <div className="relative z-10">
        <TextAnimate
          animation="blurIn"
          by="word"
          className="text-center font-medium text-3xl tracking-tight md:text-5xl"
          duration={0.6}
          once
          startOnView
        >
          Terms of Service
        </TextAnimate>

        <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="font-medium text-foreground text-xl">Acceptance</h2>
          <p>
            By accessing this website or using the IntentCtrl SDK, you agree to these terms. If you do not agree, do not
            use the software or site.
          </p>

          <h2 className="font-medium text-foreground text-xl">No Warranty</h2>
          <p>
            The software is provided "as is," without warranty of any kind, express or implied, including but not
            limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement.
          </p>

          <h2 className="font-medium text-foreground text-xl">Limitation of Liability</h2>
          <p>
            In no event shall the authors or copyright holders be liable for any claim, damages, or other liability,
            whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the
            software or the use or other dealings in the software.
          </p>

          <h2 className="font-medium text-foreground text-xl">Website Use</h2>
          <p>
            This website is provided for informational purposes. You may not use the site for any unlawful purpose or in
            violation of these terms.
          </p>

          <h2 className="font-medium text-foreground text-xl">Changes</h2>
          <p>
            We reserve the right to update these terms. Continued use after changes constitutes acceptance of the new
            terms.
          </p>

          <h2 className="font-medium text-foreground text-xl">Contact</h2>
          <p>
            Questions about these terms? Reach out via the{" "}
            <Link href="/#contact" className="text-primary hover:underline">
              contact section
            </Link>{" "}
            on our homepage.
          </p>
        </div>
      </div>
    </div>
  );
}
