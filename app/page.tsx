import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { allPortfolioList } from "@/lib/portfolio/content";
import { BookConsultationButton } from "@/components/services/BookConsultationButton";
import { ExpectedResponseTime } from "@/components/contact/ExpectedResponseTime";
import { AboutNexoraSection } from "@/components/home/AboutNexoraSection";
import { HeroTrustSection } from "@/components/home/HeroTrustSection";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HomePackagesSection } from "@/components/home/HomePackagesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { IndustriesWeServeSection } from "@/components/home/IndustriesWeServeSection";
import { ServicesOfferingsSection } from "@/components/home/ServicesOfferingsSection";
import { WhyBusinessesChooseSection } from "@/components/home/WhyBusinessesChooseSection";
import { WhyBusinessesTrustSection } from "@/components/home/WhyBusinessesTrustSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceMarketingFooter, ServiceMarketingHeader } from "@/components/services/ServiceMarketingHeader";
import { createPageMetadata, faqJsonLd } from "@/lib/site/seo";
import { homeFaqItems } from "@/lib/home/faq";

export const metadata = createPageMetadata({
  title: "Premium AI Automation for Modern Businesses",
  description:
    "Nexora AI helps Canadian businesses deploy AI automation, chatbots, and voice agents with transparent pricing, fast delivery, and ongoing support.",
  path: "/",
});

export default function Home() {
  const portfolioPreviews = allPortfolioList.slice(0, 3);

  return (
    <div className="nexora-page-bg nexora-marketing-page min-h-screen text-nexora-muted">
      <JsonLd data={faqJsonLd(homeFaqItems)} />
      <ServiceMarketingHeader activeNav="home" />

      <main id="main-content">
        <section className="nexora-section-hero relative overflow-hidden px-6 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(185,28,28,0.1),_transparent_55%)]" />
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="nexora-badge mb-6 px-4 py-2">
                <span className="mr-2 h-2.5 w-2.5 rounded-full bg-nexora-hover shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                Built for Canadian service businesses
              </div>
              <h1 className="nexora-heading-hero">Stop Losing Customers After Business Hours</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-nexora-muted sm:text-xl">
                AI receptionists, chatbots, and automations that answer customers, capture leads, and book
                appointments 24/7—so you never miss another sale.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <BookConsultationButton className="px-7 py-3.5 text-base shadow-[0_0_32px_rgba(185,28,28,0.35)]">
                  Book Free Consultation
                </BookConsultationButton>
                <Link href="/chat" className="nexora-btn-secondary px-7 py-3.5 text-center text-base font-semibold">
                  See Live Demo
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-sm">
                <div className="nexora-surface rounded-2xl px-4 py-3">
                  <p className="font-semibold text-nexora-text">Free strategy call</p>
                  <p className="mt-0.5 text-nexora-muted">No pressure, no jargon</p>
                </div>
                <div className="nexora-surface rounded-2xl px-4 py-3">
                  <p className="font-semibold text-nexora-text">Live in ~2 weeks</p>
                  <p className="mt-0.5 text-nexora-muted">Typical Starter AI setup</p>
                </div>
                <div className="nexora-surface rounded-2xl px-4 py-3">
                  <p className="font-semibold text-nexora-text">Canadian team</p>
                  <p className="mt-0.5 text-nexora-muted">Local support you can reach</p>
                </div>
              </div>
            </div>

            <div className="glass-panel animate-float nexora-glow nexora-card relative overflow-hidden rounded-3xl p-8 shadow-[0_0_80px_rgba(185,28,28,0.12)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(185,28,28,0.18),_transparent_32%)]" />
              <div className="relative">
                <p className="nexora-eyebrow text-sm">What changes for your business</p>
                <ul className="mt-6 space-y-4 text-sm">
                  <li className="nexora-surface rounded-2xl p-4">
                    <span className="font-semibold text-nexora-text">Lost customers → Captured leads</span>
                    <p className="mt-1 text-nexora-muted">Every after-hours call and message gets answered—not ignored.</p>
                  </li>
                  <li className="nexora-surface rounded-2xl p-4">
                    <span className="font-semibold text-nexora-text">Phone tag → Booked appointments</span>
                    <p className="mt-1 text-nexora-muted">Customers schedule online while you focus on the work.</p>
                  </li>
                  <li className="nexora-surface rounded-2xl p-4">
                    <span className="font-semibold text-nexora-text">Manual busywork → Hours saved weekly</span>
                    <p className="mt-1 text-nexora-muted">Stop repeating the same answers. AI handles the routine.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <HeroTrustSection />

        <WhyBusinessesChooseSection />

        <ServicesOfferingsSection />

        <HowItWorksSection />

        <AboutNexoraSection />

        <HomePackagesSection />

        <WhyBusinessesTrustSection />

        <IndustriesWeServeSection />

        <section className="nexora-section px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="nexora-eyebrow">Portfolio</p>
                <h2 className="nexora-heading-section">See the before and after.</h2>
                <p className="mt-4 text-lg leading-8 text-nexora-muted">
                  Real problems. Real solutions. Measurable business outcomes across industries.
                </p>
              </div>
              <Link href="/portfolio" className="nexora-btn-secondary shrink-0 px-6 py-3 font-semibold">
                View Case Studies
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {portfolioPreviews.map((project) => (
                <Link
                  key={project.slug}
                  href={`/portfolio/${project.slug}`}
                  className="nexora-preview-card nexora-card group rounded-3xl p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nexora-hover">
                    {project.industry}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-nexora-text">{project.title}</h3>
                  <div className="mt-4 space-y-2 text-xs leading-5">
                    <p>
                      <span className="font-semibold text-nexora-muted">Before: </span>
                      <span className="text-nexora-muted line-clamp-2">{project.before}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-nexora-hover">After: </span>
                      <span className="text-nexora-muted line-clamp-2">{project.after}</span>
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-nexora-hover">
                    Read case study
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <HomeFaqSection />

        <section className="px-6 pb-24 lg:px-8 lg:pb-32">
          <div className="nexora-glow nexora-card mx-auto max-w-7xl rounded-[2rem] border-nexora-primary/25 p-8 shadow-[0_0_80px_rgba(185,28,28,0.1)] lg:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="nexora-eyebrow">Ready to grow?</p>
              <h2 className="nexora-heading-section">Book your free consultation today.</h2>
              <p className="mt-5 text-lg leading-8 text-nexora-muted">
                Tell us about your business. In 15 minutes we&apos;ll show you how to get more customers and save
                time—no pressure, no tech talk.
              </p>
              <ExpectedResponseTime className="mt-4" />
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <BookConsultationButton className="px-8 py-3.5 text-base shadow-[0_0_32px_rgba(185,28,28,0.35)]">
                  Book Free Consultation
                </BookConsultationButton>
                <Link href="/chat" className="nexora-btn-secondary px-8 py-3.5 text-base font-semibold">
                  See Live Demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ServiceMarketingFooter />
    </div>
  );
}
