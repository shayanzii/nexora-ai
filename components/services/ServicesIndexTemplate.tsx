import Link from "next/link";
import { allServicesList } from "@/lib/services/content";
import { BookConsultationButton } from "./BookConsultationButton";
import { ServiceMarketingFooter, ServiceMarketingHeader } from "./ServiceMarketingHeader";

export function ServicesIndexTemplate() {
  return (
    <div className="nexora-page-bg min-h-screen text-nexora-muted">
      <ServiceMarketingHeader activeNav="services" currentSlug="index" />

      <main>
        <section className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(185,28,28,0.1),_transparent_55%)]" />
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <div className="nexora-badge mb-6 inline-flex px-4 py-2">
                <span className="mr-2 h-2.5 w-2.5 rounded-full bg-nexora-hover shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                Services
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-nexora-text sm:text-5xl lg:text-6xl">
                AI solutions built to move your business forward.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-nexora-muted sm:text-xl">
                From chatbots to voice agents and full-stack automation—we design intelligent systems that increase
                productivity, delight customers, and unlock growth.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <BookConsultationButton />
                <Link href="/pricing" className="nexora-btn-secondary px-6 py-3 text-center font-semibold">
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 lg:px-8 lg:pb-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-2xl">
              <p className="nexora-eyebrow">What We Offer</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                {allServicesList.length} premium AI services.
              </h2>
              <p className="mt-4 text-lg leading-8 text-nexora-muted">
                Explore each service to see benefits, features, process, and pricing—or book a consultation for a
                tailored recommendation.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {allServicesList.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group nexora-card flex flex-col rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-nexora-primary/40 hover:shadow-[0_0_40px_rgba(185,28,28,0.1)] lg:p-8"
                >
                  <div className="nexora-icon-box mb-4 h-11 w-11" />
                  <h3 className="text-xl font-semibold text-nexora-text">{service.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-nexora-muted">{service.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {service.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="rounded-full border border-nexora-border bg-nexora-surface px-3 py-1 text-xs text-nexora-text"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-nexora-hover transition group-hover:gap-3">
                    Learn more
                    <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 lg:px-8 lg:pb-32">
          <div className="nexora-glow nexora-card mx-auto max-w-7xl rounded-[2rem] border-nexora-primary/25 p-8 shadow-[0_0_80px_rgba(185,28,28,0.1)] lg:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="nexora-eyebrow">Get Started</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                Not sure which service fits your goals?
              </h2>
              <p className="mt-5 text-lg leading-8 text-nexora-muted">
                Book a free consultation and we&apos;ll map the fastest path to value with a tailored strategy and
                launch plan.
              </p>
              <div className="mt-8 flex justify-center">
                <BookConsultationButton className="px-8 py-3.5" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <ServiceMarketingFooter />
    </div>
  );
}
