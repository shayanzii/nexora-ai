import Link from "next/link";
import type { ServicePageContent } from "@/lib/services/types";
import { BookConsultationButton } from "./BookConsultationButton";
import { ServiceMarketingFooter, ServiceMarketingHeader } from "./ServiceMarketingHeader";

type ServicePageTemplateProps = {
  content: ServicePageContent;
};

export function ServicePageTemplate({ content }: ServicePageTemplateProps) {
  return (
    <div className="nexora-page-bg nexora-marketing-page min-h-screen text-nexora-muted">
      <ServiceMarketingHeader activeNav="services" currentSlug={content.slug} />

      <main>
        <section className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(185,28,28,0.1),_transparent_55%)]" />
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="nexora-badge mb-6 px-4 py-2">
                <span className="mr-2 h-2.5 w-2.5 rounded-full bg-nexora-hover shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                {content.hero.eyebrow}
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-nexora-text sm:text-5xl lg:text-6xl">
                {content.hero.headline}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-nexora-muted sm:text-xl">
                {content.hero.description}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <BookConsultationButton />
                <a href="#features" className="nexora-btn-secondary px-6 py-3 text-center font-semibold">
                  View Features
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-8 text-sm text-nexora-muted">
                {content.hero.highlights.map((highlight) => (
                  <div key={highlight}>
                    <p className="text-base font-semibold text-nexora-text">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel animate-float nexora-glow nexora-card relative overflow-hidden rounded-3xl p-8 shadow-[0_0_80px_rgba(185,28,28,0.12)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(185,28,28,0.18),_transparent_32%)]" />
              <div className="relative">
                <p className="nexora-eyebrow text-sm">Why it matters</p>
                <h2 className="mt-3 text-2xl font-semibold text-nexora-text">
                  Built for measurable business impact.
                </h2>
                <ul className="mt-6 space-y-4 text-sm text-nexora-muted">
                  {content.benefits.items.slice(0, 3).map((item) => (
                    <li key={item.title} className="nexora-surface rounded-2xl p-4">
                      <span className="font-semibold text-nexora-text">{item.title}</span>
                      <p className="mt-1">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="nexora-eyebrow">Benefits</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">{content.benefits.title}</h2>
              <p className="mt-4 text-lg leading-8 text-nexora-muted">{content.benefits.description}</p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {content.benefits.items.map((item) => (
                <article
                  key={item.title}
                  className="group nexora-card rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-nexora-primary/40 hover:shadow-[0_0_40px_rgba(185,28,28,0.1)]"
                >
                  <div className="nexora-icon-box mb-4 h-11 w-11" />
                  <h3 className="text-xl font-semibold text-nexora-text">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-nexora-muted">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="px-6 py-24 lg:px-8">
          <div className="nexora-glow nexora-card mx-auto max-w-7xl rounded-[2rem] p-8 shadow-[0_0_60px_rgba(0,0,0,0.45)] lg:p-12">
            <div className="max-w-2xl">
              <p className="nexora-eyebrow">Features</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">{content.features.title}</h2>
              <p className="mt-4 text-lg leading-8 text-nexora-muted">{content.features.description}</p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.features.items.map((item) => (
                <div key={item.title} className="nexora-surface rounded-2xl p-5">
                  <h3 className="font-semibold text-nexora-text">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-nexora-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="nexora-eyebrow">Process</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">{content.process.title}</h2>
              <p className="mt-4 text-lg leading-8 text-nexora-muted">{content.process.description}</p>
            </div>
            <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {content.process.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="nexora-card relative rounded-3xl p-6"
                >
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-nexora-primary/20 text-sm font-semibold text-nexora-text">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-semibold text-nexora-text">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-nexora-muted">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="pricing" className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="nexora-eyebrow">Pricing</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">{content.pricing.title}</h2>
              <p className="mt-4 text-lg leading-8 text-nexora-muted">{content.pricing.description}</p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {content.pricing.plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-3xl border p-8 ${
                    plan.featured
                      ? "border-nexora-primary/40 bg-gradient-to-br from-nexora-primary/15 to-nexora-hover/10 shadow-[0_0_50px_rgba(185,28,28,0.18)]"
                      : "nexora-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-nexora-text">{plan.name}</h3>
                    {plan.featured ? (
                      <span className="rounded-full bg-nexora-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-nexora-text">
                        Popular
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-nexora-muted">{plan.description}</p>
                  <p className="mt-6 text-4xl font-semibold text-nexora-text">{plan.price}</p>
                  <ul className="mt-6 space-y-3 text-sm text-nexora-muted">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="text-nexora-hover">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <BookConsultationButton
                    variant={plan.featured ? "primary" : "secondary"}
                    className={`mt-8 inline-flex w-full rounded-full px-5 py-3 ${
                      plan.featured ? "shadow-[0_0_24px_rgba(185,28,28,0.28)]" : ""
                    }`}
                  >
                    Book Free Consultation
                  </BookConsultationButton>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <p className="nexora-eyebrow">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">{content.faq.title}</h2>
              {content.faq.description ? (
                <p className="mt-4 text-lg leading-8 text-nexora-muted">{content.faq.description}</p>
              ) : null}
            </div>
            <div className="mt-12 space-y-4">
              {content.faq.items.map((item) => (
                <details key={item.question} className="nexora-card group rounded-2xl p-5">
                  <summary className="cursor-pointer list-none font-semibold text-nexora-text marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {item.question}
                      <span className="text-nexora-hover transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-nexora-muted">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="consultation" className="px-6 py-24 lg:px-8">
          <div className="nexora-glow nexora-card mx-auto max-w-7xl rounded-[2rem] border-nexora-primary/25 p-8 shadow-[0_0_80px_rgba(185,28,28,0.1)] lg:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="nexora-eyebrow">Get Started</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">{content.cta.title}</h2>
              <p className="mt-5 text-lg leading-8 text-nexora-muted">{content.cta.description}</p>
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
