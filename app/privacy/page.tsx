import Link from "next/link";
import { ServiceMarketingFooter, ServiceMarketingHeader } from "@/components/services/ServiceMarketingHeader";
import { NEXORA_CONTACT_EMAIL, NEXORA_CONTACT_MAILTO, NEXORA_LOCATION } from "@/lib/site/contact";
import { createPageMetadata } from "@/lib/site/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "How Nexora AI collects, uses, and protects your information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="nexora-page-bg nexora-marketing-page min-h-screen text-nexora-muted">
      <ServiceMarketingHeader />

      <main id="main-content">
        <section className="nexora-section px-6 lg:px-8">
          <div className="nexora-card mx-auto max-w-3xl rounded-3xl p-8 lg:p-12">
            <p className="nexora-eyebrow">Legal</p>
            <h1 className="nexora-heading-section mt-3">Privacy Policy</h1>
            <p className="mt-6 text-sm leading-7 text-nexora-muted">
              Nexora AI respects your privacy. We collect information you submit through contact forms, consultation
              requests, and chat interactions to respond to inquiries and deliver our services. We do not sell personal
              data. Analytics may be collected to improve site performance.
            </p>
            <p className="mt-4 text-sm leading-7 text-nexora-muted">
              For privacy questions, contact us at{" "}
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
