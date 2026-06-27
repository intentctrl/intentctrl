import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { TextAnimate } from "@/components/ui/text-animate";

export const metadata: Metadata = {
  title: "Refund Policy | IntentCtrl",
  description: "How refunds and cancellations work for the cloud platform.",
};

export default function RefundPolicyPage() {
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
          Refund Policy
        </TextAnimate>

        <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            This Refund Policy applies to the cloud platform and paid services provided by IntentCtrl ("we," "us," or
            "our"). The open-source SDK is provided under the MIT License at no cost and is not subject to this policy.
            By purchasing a cloud plan, you agree to this policy together with our{" "}
            <Link href="/terms-and-conditions" className="text-primary hover:underline">
              Terms and Conditions
            </Link>
            .
          </p>

          <h2 className="font-medium text-foreground text-xl">Nature of our services</h2>
          <p>
            We provide a cloud platform (app.intentctrl.com) that offers session history, analytics, memory, and related
            infrastructure for the IntentCtrl SDK. Plans are billed on a subscription basis and provide access to
            hosted services rather than downloadable goods.
          </p>

          <h2 className="font-medium text-foreground text-xl">General rule: fees are non-refundable</h2>
          <p>
            Subscription fees are non-refundable except where required by law or expressly stated in your agreement with
            us. Because the cloud platform provides immediate access to hosted infrastructure upon payment, standard
            consumer return rules for physical goods do not apply.
          </p>

          <h2 className="font-medium text-foreground text-xl">Cancellation</h2>
          <p>
            You may cancel your subscription at any time from your account settings. Upon cancellation, you will retain
            access to paid features until the end of the current billing period. No prorated refunds are issued for
            partial billing periods.
          </p>

          <h2 className="font-medium text-foreground text-xl">Service issues and downtime</h2>
          <p>
            If you experience persistent service issues that prevent normal use of the cloud platform, contact us at{" "}
            <a href="mailto:contact@intentctrl.com" className="text-primary hover:underline">
              contact@intentctrl.com
            </a>
            . We will investigate and work to resolve the issue. In cases of extended downtime caused by our
            infrastructure, we may, at our discretion, issue a service credit or partial refund proportional to the
            affected period.
          </p>

          <h2 className="font-medium text-foreground text-xl">Chargebacks</h2>
          <p>
            If you initiate a chargeback or payment reversal without first contacting us to resolve an issue, we may
            suspend access to the cloud platform and pursue available remedies. Please reach out to us before disputing
            a charge with your bank or card issuer so we can help.
          </p>

          <h2 className="font-medium text-foreground text-xl">Third-party fees</h2>
          <p>
            Fees paid directly to third parties (for example, LLM providers whose API keys you configure) are subject
            to those vendors&apos; refund policies. We do not control or guarantee refunds for third-party services.
          </p>

          <h2 className="font-medium text-foreground text-xl">Changes to this policy</h2>
          <p>
            We may update this Refund Policy from time to time. We will post the updated policy on this page and change
            the &quot;Last updated&quot; date. Your agreement and the terms in effect when you purchased services also
            apply.
          </p>

          <p className="text-sm text-muted-foreground/60">Last updated: June 28, 2026</p>

          <h2 className="font-medium text-foreground text-xl">Contact</h2>
          <p>
            Questions about refunds or this policy:{" "}
            <Link href="mailto:contact@intentctrl.com" className="text-primary hover:underline">
              contact@intentctrl.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
