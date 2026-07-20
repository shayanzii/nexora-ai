import Link from "next/link";
import { ExpectedResponseTime } from "@/components/contact/ExpectedResponseTime";
import { NEXORA_CONTACT_EMAIL, NEXORA_CONTACT_MAILTO, NEXORA_LOCATION } from "@/lib/site/contact";
import { BookConsultationButton } from "@/components/services/BookConsultationButton";
import { ServiceMarketingFooter, ServiceMarketingHeader } from "@/components/services/ServiceMarketingHeader";

const bookingSteps = [
  {
    step: "1",
    title: "15-minute discovery call",
    description: "We learn about your business, customers, and where you're losing time or leads.",
  },
  {
    step: "2",
    title: "Business analysis",
    description: "We identify the highest-impact opportunities—chatbot, receptionist, booking, or automation.",
  },
  {
    step: "3",
    title: "Custom roadmap",
    description: "You get a clear plan with timeline, package recommendation, and expected outcomes.",
  },
  {
    step: "4",
    title: "Free quote",
    description: "Transparent pricing. No hidden fees. You decide if and when to move forward.",
  },
];

export function ContactPageTemplate() {
  return (
    <div className="nexora-page-bg nexora-marketing-page min-h-screen text-nexora-muted">
      <ServiceMarketingHeader activeNav="contact" />

      <main id="main-content">
        <section className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(185,28,28,0.1),_transparent_55%)]" />
          <div className="nexora-glow nexora-card mx-auto max-w-7xl rounded-[2rem] border-nexora-primary/25 p-8 shadow-[0_0_80px_rgba(185,28,28,0.1)] lg:p-12">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div>
                <p className="nexora-eyebrow">Contact</p>
                <h1 className="nexora-heading-section mt-3">Let&apos;s talk about growing your business.</h1>
                <p className="mt-5 text-lg leading-8 text-nexora-muted">
                  Book a free consultation and we&apos;ll show you exactly how AI can save time, capture more leads,
                  and answer customers 24/7.
                </p>
                <Link href={NEXORA_CONTACT_MAILTO} className="nexora-link mt-6 inline-flex font-medium">
                  {NEXORA_CONTACT_EMAIL}
                </Link>
                <p className="mt-2 text-sm text-nexora-muted">{NEXORA_LOCATION}</p>
                <ExpectedResponseTime className="mt-6" variant="card" />
                <div className="mt-8">
                  <BookConsultationButton className="px-7 py-3.5 shadow-[0_0_32px_rgba(185,28,28,0.35)]">
                    Book Free Consultation
                  </BookConsultationButton>
                </div>
              </div>

              <div className="nexora-surface rounded-3xl p-6 lg:p-8">
                <p className="text-sm font-semibold text-nexora-text">What happens after you book</p>
                <ol className="mt-6 space-y-4">
                  {bookingSteps.map((item) => (
                    <li key={item.step} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-nexora-primary/40 bg-nexora-primary/10 text-sm font-bold text-nexora-hover">
                        {item.step}
                      </span>
                      <div>
                        <p className="font-semibold text-nexora-text">{item.title}</p>
                        <p className="mt-1 text-sm leading-7 text-nexora-muted">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <Link href="/services" className="nexora-card rounded-2xl px-4 py-3 text-sm transition hover:border-nexora-primary/40">
                    View Services →
                  </Link>
                  <Link href="/pricing" className="nexora-card rounded-2xl px-4 py-3 text-sm transition hover:border-nexora-primary/40">
                    View Pricing →
                  </Link>
                  <Link href="/portfolio" className="nexora-card rounded-2xl px-4 py-3 text-sm transition hover:border-nexora-primary/40">
                    View Portfolio →
                  </Link>
                  <Link href="/chat" className="nexora-card rounded-2xl px-4 py-3 text-sm transition hover:border-nexora-primary/40">
                    See Live Demo →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ServiceMarketingFooter />
    </div>
  );
}
