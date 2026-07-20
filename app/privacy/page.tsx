import type { Metadata } from "next";
import Link from "next/link";
import { ServiceMarketingFooter, ServiceMarketingHeader } from "@/components/services/ServiceMarketingHeader";

export const metadata: Metadata = {
  title: "Privacy Policy | Nexora AI",
  description: "How Nexora AI collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="nexora-page-bg nexora-marketing-page min-h-screen text-nexora-muted">
      <ServiceMarketingHeader />

      <main>
        <section className="px-6 py-24 lg:px-8 lg:py-32">
          <div className="nexora-card mx-auto max-w-3xl rounded-3xl p-8 lg:p-12">
            <p className="nexora-eyebrow">Legal</p>
            <h1 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">Privacy Policy</h1>
            <p className="mt-6 text-sm leading-7 text-nexora-muted">
              Nexora AI respects your privacy. We collect information you submit through contact forms, consultation
              requests, and chat interactions to respond to inquiries and deliver our services. We do not sell personal
              data. Analytics may be collected to improve site performance.
            </p>
            <p className="mt-4 text-sm leading-7 text-nexora-muted">
              For privacy questions, contact us at{" "}
              <Link href="mailto:hello@nexora.ai" className="nexora-link">
                hello@nexora.ai
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <ServiceMarketingFooter />
    </div>
  );
}
