import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { TextAnimate } from "@/components/ui/text-animate";

export const metadata: Metadata = {
  title: "Privacy Policy | IntentCtrl",
  description: "How we handle your data and privacy.",
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
          <p>
            This Privacy Policy explains how IntentCtrl ("we," "us," or "our") collects, uses, discloses, and protects
            information when you visit{" "}
            <Link href="https://intentctrl.com" className="text-primary hover:underline">
              intentctrl.com
            </Link>{" "}
            (the "Site") or use the IntentCtrl SDK, cloud platform, and related services (together with the Site, the
            "Services"). By using the Services, you agree to this policy and our{" "}
            <Link href="/terms-and-conditions" className="text-primary hover:underline">
              Terms and Conditions
            </Link>
            . If you do not agree, please do not use the Services.
          </p>

          <h2 className="font-medium text-foreground text-xl">Information we collect</h2>
          <p>We may collect:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Information you provide</strong> — such as your name, email address, company name, and messages
              you send through contact forms, email, or chat.
            </li>
            <li>
              <strong>Account and billing information</strong> — such as your email address, username, and
              payment-related data processed by our payment providers (we do not store full payment card numbers on our
              servers).
            </li>
            <li>
              <strong>Technical and usage data</strong> — such as IP address, browser type, device information, pages
              viewed, and referring URLs, collected through cookies and similar technologies (see below).
            </li>
            <li>
              <strong>SDK usage data (cloud platform only)</strong> — If you use the{" "}
              <Link href="http://app.intentctrl.com" className="text-primary hover:underline">
                cloud platform
              </Link>
              , we may collect session history, tool usage, and analytics to provide and improve the service.
              Self-hosted deployments send no data to us.
            </li>
          </ul>

          <h2 className="font-medium text-foreground text-xl">How we use information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, operate, and improve the Services;</li>
            <li>Respond to inquiries and communicate about your account;</li>
            <li>Process payments and send invoices or receipts;</li>
            <li>Analyze usage of the Site and cloud platform to improve content and performance;</li>
            <li>Comply with legal obligations and enforce our terms;</li>
            <li>Send service-related messages (you can opt out of marketing emails where applicable).</li>
          </ul>

          <h2 className="font-medium text-foreground text-xl">Legal bases (where applicable)</h2>
          <p>
            Depending on your location, we rely on one or more of: your consent; performance of a contract; our
            legitimate interests (such as operating and securing the Services); and compliance with legal obligations.
          </p>

          <h2 className="font-medium text-foreground text-xl">Sharing of information</h2>
          <p>We may share information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Service providers who assist us with hosting, analytics, email delivery, customer support, or payments,
              subject to appropriate safeguards;
            </li>
            <li>Professional advisers where required (for example, auditors or lawyers);</li>
            <li>Authorities when required by law or to protect our rights and users.</li>
          </ul>
          <p>We do not sell your personal information.</p>

          <h2 className="font-medium text-foreground text-xl">Cookies and analytics</h2>
          <p>
            We use cookies and similar technologies to remember preferences, measure traffic, and understand how the
            Site is used. You can control cookies through your browser settings; disabling some cookies may affect Site
            functionality.
          </p>

          <h2 className="font-medium text-foreground text-xl">SDK and your data</h2>
          <p>
            The SDK runs entirely in the browser. When self-hosted, it communicates only with the LLM endpoint you
            configure — we do not have access to those requests or responses. If you use the{" "}
            <Link href="http://app.intentctrl.com" className="text-primary hover:underline">
              cloud platform
            </Link>
            , session history and tool usage are stored to provide the service. You are responsible for reviewing your
            chosen LLM provider's privacy policy.
          </p>

          <h2 className="font-medium text-foreground text-xl">Data retention</h2>
          <p>
            We retain information for as long as needed to provide the Services, meet legal, tax, and accounting
            requirements, and resolve disputes. Retention periods vary depending on the type of data and the context.
          </p>

          <h2 className="font-medium text-foreground text-xl">Security</h2>
          <p>
            We implement reasonable technical and organizational measures to protect personal information. No method of
            transmission over the Internet is completely secure; we cannot guarantee absolute security.
          </p>

          <h2 className="font-medium text-foreground text-xl">International transfers</h2>
          <p>
            If you access the Services from outside India, your information may be processed in India or other countries
            where we or our providers operate. We take steps designed to ensure appropriate protection consistent with
            this policy and applicable law.
          </p>

          <h2 className="font-medium text-foreground text-xl">Your rights</h2>
          <p>
            Depending on where you live, you may have rights to access, correct, delete, or restrict processing of your
            personal information, or to object to certain processing. To exercise these rights, contact us at the email
            below. You may also have the right to lodge a complaint with a supervisory authority.
          </p>

          <h2 className="font-medium text-foreground text-xl">Children</h2>
          <p>
            The Services are not directed at children under 16. We do not knowingly collect personal information from
            children. If you believe we have collected such information, contact us and we will take steps to delete it.
          </p>

          <h2 className="font-medium text-foreground text-xl">Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will post the updated policy on this page and change
            the &quot;Last updated&quot; date. Continued use of the Services after changes constitutes acceptance of the
            updated policy where permitted by law.
          </p>

          <p className="text-sm text-muted-foreground/60">Last updated: June 28, 2026</p>

          <h2 className="font-medium text-foreground text-xl">Contact</h2>
          <p>
            For privacy questions or requests:{" "}
            <Link href="mailto:contact@intentctrl.com" className="text-primary hover:underline">
              contact@intentctrl.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
