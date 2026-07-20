import Link from "next/link";
import { allPortfolioList } from "@/lib/portfolio/content";
import { BookConsultationButton } from "@/components/services/BookConsultationButton";
import { ServiceMarketingFooter, ServiceMarketingHeader } from "@/components/services/ServiceMarketingHeader";
import { PortfolioHeroPlaceholder } from "./PortfolioHeroPlaceholder";

export function PortfolioIndexTemplate() {
  return (
    <div className="nexora-page-bg nexora-marketing-page min-h-screen text-nexora-muted">
      <ServiceMarketingHeader activeNav="portfolio" />

      <main id="main-content">
        <section className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(185,28,28,0.1),_transparent_55%)]" />
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <div className="nexora-badge mb-6 inline-flex px-4 py-2">
                <span className="mr-2 h-2.5 w-2.5 rounded-full bg-nexora-hover shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                Portfolio
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-nexora-text sm:text-5xl lg:text-6xl">
                Real businesses. Real results.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-nexora-muted sm:text-xl">
                See how local companies use AI to answer customers faster, book more jobs, and save hours every week.
              </p>
              <div className="mt-8">
                <BookConsultationButton className="shadow-[0_0_32px_rgba(185,28,28,0.35)]">
                  Book a Free Consultation
                </BookConsultationButton>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 lg:px-8 lg:pb-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-2xl">
              <p className="nexora-eyebrow">Case Studies</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                {allPortfolioList.length} modern AI implementations.
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {allPortfolioList.map((project) => (
                <Link
                  key={project.slug}
                  href={`/portfolio/${project.slug}`}
                  className="group nexora-card block overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1 hover:border-nexora-primary/40 hover:shadow-[0_0_40px_rgba(185,28,28,0.12)]"
                >
                  <PortfolioHeroPlaceholder
                    title={project.title}
                    accent={project.heroAccent}
                    industry={project.industry}
                    className="rounded-none border-0 border-b border-nexora-border"
                  />
                  <div className="p-6 lg:p-8">
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-nexora-border bg-nexora-surface/50 px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-nexora-muted">Before</p>
                        <p className="mt-1 text-xs leading-5 text-nexora-text line-clamp-2">{project.before}</p>
                      </div>
                      <div className="rounded-xl border border-nexora-primary/25 bg-nexora-primary/5 px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-nexora-hover">After</p>
                        <p className="mt-1 text-xs leading-5 text-nexora-text line-clamp-2">{project.after}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-nexora-muted">{project.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-nexora-hover transition group-hover:gap-3">
                      Read case study
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 lg:px-8 lg:pb-32">
          <div className="nexora-glow nexora-card mx-auto max-w-7xl rounded-[2rem] border-nexora-primary/25 p-8 shadow-[0_0_80px_rgba(185,28,28,0.1)] lg:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="nexora-eyebrow">Free Consultation</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                Ready to get the same results for your business?
              </h2>
              <p className="mt-5 text-lg leading-8 text-nexora-muted">
                Book a free call and we&apos;ll show you what AI could do for your industry—no obligation.
              </p>
              <div className="mt-8 flex justify-center">
                <BookConsultationButton className="px-8 py-3.5 shadow-[0_0_32px_rgba(185,28,28,0.35)]">
                  Book a Free Consultation
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
