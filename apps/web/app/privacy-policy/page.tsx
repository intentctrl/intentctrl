import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { TextAnimate } from "@/components/ui/text-animate";

export const metadata: Metadata = {
  title: "Privacy Policy | IntentCtrl",
  description: "How IntentCtrl handles your data and privacy.",
};

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </TextAnimate>

        <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="font-medium text-foreground text-xl">Information We Collect</h2>
          <p>
            IntentCtrl is an SDK that runs in your browser. We do not collect, store, or process any data from your
            application or its users. The SDK operates entirely client-side and communicates only with the LLM endpoint
            you configure.
          </p>
          <p>
            This website (intentctrl.app) does not use cookies or tracking scripts. We do not collect personal
            information unless you voluntarily provide it via the contact form.
          </p>

          <h2 className="font-medium text-foreground text-xl">Data You Provide</h2>
          <p>
            If you contact us, we receive the information you choose to share (name, email, message). This is used
            solely to respond to your inquiry and is not shared with third parties.
          </p>

          <h2 className="font-medium text-foreground text-xl">Third-Party Services</h2>
          <p>
            The SDK sends requests to the LLM provider whose API key you configure. We do not have access to those
            requests or responses. You are responsible for reviewing your chosen LLM provider's privacy policy.
          </p>

          <h2 className="font-medium text-foreground text-xl">Changes</h2>
          <p>
            We may update this policy as the project evolves. Changes will be posted on this page with an updated date.
          </p>

          <h2 className="font-medium text-foreground text-xl">Contact</h2>
          <p>
            Questions about this policy? Reach out via the{" "}
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
