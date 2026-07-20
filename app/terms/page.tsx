import Link from "next/link";
import { ServiceMarketingFooter, ServiceMarketingHeader } from "@/components/services/ServiceMarketingHeader";
import { NEXORA_CONTACT_EMAIL, NEXORA_CONTACT_MAILTO, NEXORA_LOCATION } from "@/lib/site/contact";
import { createPageMetadata } from "@/lib/site/seo";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description: "Terms governing use of the Nexora AI website and services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="nexora-page-bg nexora-marketing-page min-h-screen text-nexora-muted">
      <ServiceMarketingHeader />

      <main id="main-content">
        <section className="nexora-section px-6 lg:px-8">
          <div className="nexora-card mx-auto max-w-3xl rounded-3xl p-8 lg:p-12">
            <p className="nexora-eyebrow">Legal</p>
            <h1 className="nexora-heading-section mt-3">Terms of Service</h1>
            <p className="mt-6 text-sm leading-7 text-nexora-muted">
              By using the Nexora AI website, you agree to use our content and tools for lawful purposes. Service
              engagements are governed by separate statements of work. We provide information on this site as-is and may
              update these terms at any time.
            </p>
            <p className="mt-4 text-sm leading-7 text-nexora-muted">
              Questions about these terms? Reach us at{" "}
              <Link href={NEXORA_CONTACT_MAILTO} className="nexora-link">
                {NEXORA_CONTACT_EMAIL}
              </Link>
              .
            </p>
            <p className="mt-4 text-sm leading-7 text-nexora-muted">Nexora AI — {NEXORA_LOCATION}</p>
          </div>
        </section>
      </main>

      <ServiceMarketingFooter />
    </div>
  );
}
