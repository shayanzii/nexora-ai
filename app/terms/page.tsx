import type { Metadata } from "next";
import Link from "next/link";
import { ServiceMarketingFooter, ServiceMarketingHeader } from "@/components/services/ServiceMarketingHeader";

export const metadata: Metadata = {
  title: "Terms of Service | Nexora AI",
  description: "Terms governing use of the Nexora AI website and services.",
};

export default function TermsPage() {
  return (
    <div className="nexora-page-bg nexora-marketing-page min-h-screen text-nexora-muted">
      <ServiceMarketingHeader />

      <main>
        <section className="px-6 py-24 lg:px-8 lg:py-32">
          <div className="nexora-card mx-auto max-w-3xl rounded-3xl p-8 lg:p-12">
            <p className="nexora-eyebrow">Legal</p>
            <h1 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">Terms of Service</h1>
            <p className="mt-6 text-sm leading-7 text-nexora-muted">
              By using the Nexora AI website, you agree to use our content and tools for lawful purposes. Service
              engagements are governed by separate statements of work. We provide information on this site as-is and may
              update these terms at any time.
            </p>
            <p className="mt-4 text-sm leading-7 text-nexora-muted">
              Questions about these terms? Reach us at{" "}
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
