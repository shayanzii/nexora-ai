import Link from "next/link";
import { BookConsultationButton } from "@/components/services/BookConsultationButton";
import { ServiceMarketingFooter, ServiceMarketingHeader } from "@/components/services/ServiceMarketingHeader";

export function ContactPageTemplate() {
  return (
    <div className="nexora-page-bg min-h-screen text-nexora-muted">
      <ServiceMarketingHeader activeNav="contact" />

      <main>
        <section className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(185,28,28,0.1),_transparent_55%)]" />
          <div className="nexora-glow nexora-card mx-auto max-w-7xl rounded-[2rem] border-nexora-primary/25 p-8 shadow-[0_0_80px_rgba(185,28,28,0.1)] lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p className="nexora-eyebrow">Contact</p>
                <h1 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                  Let&apos;s shape your next AI milestone.
                </h1>
                <p className="mt-5 text-lg leading-8 text-nexora-muted">
                  Share your goals and we&apos;ll map the fastest path to value with a tailored strategy and launch
                  plan.
                </p>
                <Link href="mailto:hello@nexora.ai" className="nexora-link mt-6 inline-flex font-medium">
                  hello@nexora.ai
                </Link>
                <div className="mt-8">
                  <BookConsultationButton className="px-6 py-3" />
                </div>
              </div>
              <div className="nexora-surface rounded-3xl p-6">
                <p className="mb-4 text-sm font-semibold text-nexora-text">Quick links</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link href="/services" className="nexora-card rounded-2xl px-4 py-3 text-sm transition hover:border-nexora-primary/40">
                    View Services →
                  </Link>
                  <Link href="/pricing" className="nexora-card rounded-2xl px-4 py-3 text-sm transition hover:border-nexora-primary/40">
                    View Pricing →
                  </Link>
                  <Link href="/portfolio" className="nexora-card rounded-2xl px-4 py-3 text-sm transition hover:border-nexora-primary/40">
                    View Portfolio →
                  </Link>
                  <Link href="/admin" className="nexora-card rounded-2xl px-4 py-3 text-sm transition hover:border-nexora-primary/40">
                    Admin Dashboard →
                  </Link>
                </div>
                <p className="mt-6 text-sm leading-7 text-nexora-muted">
                  Prefer a form? Click &ldquo;Book Free Consultation&rdquo; to submit your project details—we respond
                  within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ServiceMarketingFooter />
    </div>
  );
}
