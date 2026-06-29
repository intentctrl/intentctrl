import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { TextAnimate } from "@/components/ui/text-animate";

export const metadata: Metadata = {
  title: "Terms and Conditions | IntentCtrl",
  description: "Terms governing the use of the website, SDK, and cloud platform.",
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
          Terms and Conditions
        </TextAnimate>

        <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            These Terms and Conditions govern your access to the website at{" "}
            <Link href="https://intentctrl.com" className="text-primary hover:underline">
              intentctrl.com
            </Link>{" "}
            (the "Site") and any use of the IntentCtrl SDK, cloud platform, and related services (together with the
            Site, the "Services") provided by IntentCtrl ("we," "us," or "our"). By using the Services, you agree to
            these Terms. If you do not agree, do not use the Services.
          </p>

          <h2 className="font-medium text-foreground text-xl">Services</h2>
          <p>
            We provide an open-source SDK for embedding AI assistants in React applications, along with an optional{" "}
            <Link href="http://app.intentctrl.com" className="text-primary hover:underline">
              cloud platform
            </Link>{" "}
            offering session history, analytics, and memory. The SDK is licensed separately under the MIT License —
            these Terms govern the Site and cloud platform use. Cloud platform features, limits, and fees are as
            described on the Site at the time of use.
          </p>

          <h2 className="font-medium text-foreground text-xl">Accounts and eligibility</h2>
          <p>
            You must be at least 18 years old and able to enter a binding contract to use our Services. You are
            responsible for the accuracy of information you provide and for maintaining the confidentiality of any
            account credentials.
          </p>

          <h2 className="font-medium text-foreground text-xl">Fees and payment</h2>
          <p>
            Fees for cloud platform usage are due as set out on the Site or in your agreement. Unless stated otherwise,
            amounts are in the currency specified on the invoice. Late payment may result in suspension or termination
            of Services. You are responsible for applicable taxes unless we agree otherwise in writing.
          </p>

          <h2 className="font-medium text-foreground text-xl">Open-source SDK</h2>
          <p>
            The SDK is open source under the MIT License. You may use, modify, and distribute it in accordance with that
            license. These Terms do not restrict your rights under the MIT License. When self-hosted, the SDK
            communicates only with the LLM endpoint you configure and sends no data to us.
          </p>

          <h2 className="font-medium text-foreground text-xl">Intellectual property</h2>
          <p>
            The IntentCtrl name, logo, and brand assets are our trademarks. The SDK code is licensed, not sold, under
            the MIT License. You may not use our brand assets without prior written permission.
          </p>

          <h2 className="font-medium text-foreground text-xl">Third-party services</h2>
          <p>
            The SDK sends requests to the LLM provider whose API key you configure. Those services are subject to their
            own terms and privacy policies. We are not responsible for third-party outages, conduct, or data handling.
          </p>

          <h2 className="font-medium text-foreground text-xl">Disclaimer and limitation of liability</h2>
          <p>
            The Site and cloud platform are provided "as is" to the fullest extent permitted by law. We do not guarantee
            uninterrupted or error-free operation. To the maximum extent permitted by applicable law, we are not liable
            for any indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, or
            goodwill. Our total liability arising out of or relating to these Terms or the Services is limited to the
            fees you paid us for the Services giving rise to the claim in the twelve (12) months before the claim arose.
            The SDK is provided under the MIT License with its own disclaimer of warranty and limitation of liability.
          </p>

          <h2 className="font-medium text-foreground text-xl">Indemnity</h2>
          <p>
            You will defend and indemnify us against claims arising from your use of the Services, your content, or your
            violation of these Terms or applicable law, except to the extent caused by our gross negligence or willful
            misconduct.
          </p>

          <h2 className="font-medium text-foreground text-xl">Termination</h2>
          <p>
            We may suspend or terminate access to the Site or cloud platform if you breach these Terms or if required by
            law. Provisions that by their nature should survive will survive termination.
          </p>

          <h2 className="font-medium text-foreground text-xl">Governing law</h2>
          <p>
            These Terms are governed by the laws applicable in India, without regard to conflict-of-law rules, unless
            mandatory consumer protections in your jurisdiction apply.
          </p>

          <h2 className="font-medium text-foreground text-xl">Changes</h2>
          <p>
            We may update these Terms from time to time. We will post the revised Terms on this page and update the
            "Last updated" date. Continued use of the Services after changes constitutes acceptance of the revised Terms
            where permitted by law. See our{" "}
            <Link href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>{" "}
            for information on how we handle your data.
          </p>

          <p className="text-sm text-muted-foreground/60">Last updated: June 28, 2026</p>

          <h2 className="font-medium text-foreground text-xl">Contact</h2>
          <p>
            Questions about these Terms:{" "}
            <Link href="mailto:contact@intentctrl.com" className="text-primary hover:underline">
              contact@intentctrl.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
