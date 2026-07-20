import Link from "next/link";
import type { PortfolioProject } from "@/lib/portfolio/types";
import { BookConsultationButton } from "@/components/services/BookConsultationButton";
import { ServiceMarketingFooter, ServiceMarketingHeader } from "@/components/services/ServiceMarketingHeader";
import { PortfolioHeroPlaceholder } from "./PortfolioHeroPlaceholder";

type PortfolioCaseStudyTemplateProps = {
  project: PortfolioProject;
};

export function PortfolioCaseStudyTemplate({ project }: PortfolioCaseStudyTemplateProps) {
  return (
    <div className="nexora-page-bg nexora-marketing-page min-h-screen text-nexora-muted">
      <ServiceMarketingHeader activeNav="portfolio" />

      <main id="main-content">
        <section className="relative overflow-hidden px-6 py-16 lg:px-8 lg:py-20">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(185,28,28,0.08),_transparent_55%)]" />
          <div className="mx-auto max-w-7xl">
            <Link
              href="/portfolio"
              className="nexora-nav-link mb-8 inline-flex items-center gap-2 text-sm"
            >
              ← Back to Portfolio
            </Link>
            <PortfolioHeroPlaceholder
              title={project.title}
              accent={project.heroAccent}
              industry={project.industry}
              headingLevel="h1"
              className="nexora-glow shadow-[0_0_80px_rgba(185,28,28,0.12)]"
            />
          </div>
        </section>

        <section className="px-6 pb-16 lg:px-8 lg:pb-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
            <div>
              <p className="nexora-eyebrow">Client Industry</p>
              <p className="mt-2 text-xl font-semibold text-nexora-text">{project.industry}</p>

              <div className="mt-12">
                <p className="nexora-eyebrow">The Challenge</p>
                <p className="mt-4 text-lg leading-8 text-nexora-muted">{project.challenge}</p>
              </div>

              <div className="mt-12">
                <p className="nexora-eyebrow">Our Solution</p>
                <p className="mt-4 text-lg leading-8 text-nexora-muted">{project.solution}</p>
              </div>
            </div>

            <aside className="nexora-card h-fit rounded-3xl p-6 lg:sticky lg:top-24">
              <p className="nexora-eyebrow text-sm">Technologies Used</p>
              <ul className="mt-4 space-y-2">
                {project.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="nexora-surface rounded-xl px-3 py-2 text-sm text-nexora-text"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
              <BookConsultationButton className="mt-6 w-full rounded-full px-5 py-3 text-sm" />
            </aside>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="nexora-eyebrow">Results</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                Measurable outcomes after launch.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {project.results.map((result) => (
                <div
                  key={result.label}
                  className="nexora-card rounded-3xl p-6 text-center transition hover:border-nexora-primary/40 hover:shadow-[0_0_40px_rgba(185,28,28,0.1)]"
                >
                  <p className="text-3xl font-semibold text-nexora-text sm:text-4xl">{result.value}</p>
                  <p className="mt-2 text-sm leading-6 text-nexora-muted">{result.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8 lg:py-20">
          <div className="nexora-glow nexora-card mx-auto max-w-4xl rounded-[2rem] p-8 shadow-[0_0_60px_rgba(0,0,0,0.45)] lg:p-12">
            <p className="nexora-eyebrow">Client Testimonial</p>
            <blockquote className="mt-6">
              <p className="text-xl leading-9 text-nexora-muted sm:text-2xl sm:leading-10">
                &ldquo;{project.testimonial.quote}&rdquo;
              </p>
              <footer className="mt-8 flex items-center gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-nexora-border bg-nexora-surface text-sm font-semibold text-nexora-hover"
                  aria-hidden="true"
                >
                  {project.testimonial.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-nexora-text">{project.testimonial.name}</p>
                  <p className="text-sm text-nexora-muted">{project.testimonial.role}</p>
                </div>
              </footer>
            </blockquote>
          </div>
        </section>

        <section className="px-6 pb-24 lg:px-8 lg:pb-32">
          <div className="nexora-glow nexora-card mx-auto max-w-7xl rounded-[2rem] border-nexora-primary/25 p-8 shadow-[0_0_80px_rgba(185,28,28,0.1)] lg:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="nexora-eyebrow">Get Started</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                Ready for results like these?
              </h2>
              <p className="mt-5 text-lg leading-8 text-nexora-muted">
                Book a free consultation and we&apos;ll map the fastest path to an AI solution tailored to your industry.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <BookConsultationButton className="px-8 py-3.5" />
                <Link href="/portfolio" className="nexora-btn-secondary px-6 py-3 font-semibold">
                  View More Projects
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
