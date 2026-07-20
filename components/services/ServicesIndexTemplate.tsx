import Link from "next/link";
import { HomePackagesSection } from "@/components/home/HomePackagesSection";
import { IndustriesWeServeSection } from "@/components/home/IndustriesWeServeSection";
import { ServicesOfferingsSection } from "@/components/home/ServicesOfferingsSection";
import { WhyBusinessesChooseSection } from "@/components/home/WhyBusinessesChooseSection";
import { WhyBusinessesTrustSection } from "@/components/home/WhyBusinessesTrustSection";
import { BookConsultationButton } from "./BookConsultationButton";
import { ServiceMarketingFooter, ServiceMarketingHeader } from "./ServiceMarketingHeader";

export function ServicesIndexTemplate() {
  return (
    <div className="nexora-page-bg nexora-marketing-page min-h-screen text-nexora-muted">
      <ServiceMarketingHeader activeNav="services" />

      <main id="main-content">
        <section className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(185,28,28,0.1),_transparent_55%)]" />
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <div className="nexora-badge mb-6 inline-flex px-4 py-2">
                <span className="mr-2 h-2.5 w-2.5 rounded-full bg-nexora-hover shadow-[0_0_8px_rgba(220,38,28,0.8)]" />
                Services
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-nexora-text sm:text-5xl lg:text-6xl">
                AI that solves real business problems—not tech puzzles.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-nexora-muted sm:text-xl">
                Missed calls, slow replies, lost leads, manual booking—we fix the problems that cost you customers
                and time.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <BookConsultationButton className="shadow-[0_0_32px_rgba(185,28,28,0.35)]">
                  Book Free Consultation
                </BookConsultationButton>
                <Link href="/pricing" className="nexora-btn-secondary px-6 py-3 text-center font-semibold">
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ServicesOfferingsSection />

        <WhyBusinessesChooseSection />

        <HomePackagesSection showViewAllLink={false} />

        <WhyBusinessesTrustSection />

        <IndustriesWeServeSection />

        <section className="px-6 pb-24 lg:px-8 lg:pb-32">
          <div className="nexora-glow nexora-card mx-auto max-w-7xl rounded-[2rem] border-nexora-primary/25 p-8 shadow-[0_0_80px_rgba(185,28,28,0.1)] lg:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="nexora-eyebrow">Free Consultation</p>
              <h2 className="nexora-heading-section mt-3">Not sure where to start?</h2>
              <p className="mt-5 text-lg leading-8 text-nexora-muted">
                Book a free call. We&apos;ll recommend the right solution for your business—no pressure.
              </p>
              <div className="mt-8 flex justify-center">
                <BookConsultationButton className="px-8 py-3.5 shadow-[0_0_32px_rgba(185,28,28,0.35)]">
                  Get Your Free AI Strategy
                </BookConsultationButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ServiceMarketingFooter />
    </div>
  );
}
