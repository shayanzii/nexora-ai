import { ShieldCheck } from "lucide-react";
import {
  PricingCardsGrid,
  PricingFinalCta,
  PricingHeroActions,
  PricingSupportGrid,
} from "@/components/pricing/PricingAnimatedSections";
import { ServiceMarketingFooter, ServiceMarketingHeader } from "@/components/services/ServiceMarketingHeader";
import { moneyBackGuarantee, monthlySupportTiers, pricingFaq, pricingPlans } from "@/lib/pricing/content";

export function PricingPageTemplate() {
  return (
    <div className="nexora-page-bg nexora-marketing-page min-h-screen text-nexora-muted">
      <ServiceMarketingHeader activeNav="pricing" />

      <main id="main-content">
        <section className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(185,28,28,0.12),_transparent_55%)]" />
          <div className="absolute -right-24 top-20 -z-10 h-72 w-72 rounded-full bg-nexora-primary/10 blur-3xl pricing-orb-float" />
          <div className="absolute -left-16 bottom-10 -z-10 h-56 w-56 rounded-full bg-nexora-hover/10 blur-3xl pricing-orb-float-delayed" />

          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="nexora-badge mb-6 inline-flex px-4 py-2">
                <span className="mr-2 h-2.5 w-2.5 rounded-full bg-nexora-hover shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                Simple, transparent pricing
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-nexora-text sm:text-5xl lg:text-6xl">
                AI that pays for itself—starting at CA$199.
              </h1>
              <p className="mt-6 text-lg leading-8 text-nexora-muted sm:text-xl">
                Choose a plan, launch fast, and scale with optional monthly care. No surprises—just clear value and
                measurable results.
              </p>
              <PricingHeroActions />
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm">
                <span className="flex items-center gap-2 text-nexora-muted">
                  <ShieldCheck className="h-4 w-4 text-nexora-hover" aria-hidden="true" />
                  30-day delivery guarantee
                </span>
                <span className="hidden h-4 w-px bg-nexora-border sm:block" aria-hidden="true" />
                <span className="text-nexora-muted">Setup in as little as 2 weeks</span>
                <span className="hidden h-4 w-px bg-nexora-border sm:block" aria-hidden="true" />
                <span className="text-nexora-muted">Cancel monthly care anytime</span>
              </div>
            </div>
          </div>
        </section>

        <section id="plans" className="px-6 pb-24 lg:px-8 lg:pb-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-2xl">
              <p className="nexora-eyebrow">Plans</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                Pick the right launch pad for your business.
              </h2>
              <p className="mt-4 text-lg leading-8 text-nexora-muted">
                One-time setup fees. Upgrade anytime as your needs grow.
              </p>
            </div>

            <PricingCardsGrid plans={pricingPlans} />
          </div>
        </section>

        <section id="monthly-support" className="px-6 py-20 lg:px-8 lg:py-24">
          <div className="nexora-glow nexora-card mx-auto max-w-7xl rounded-[2rem] p-8 shadow-[0_0_60px_rgba(0,0,0,0.45)] lg:p-12">
            <div className="max-w-2xl">
              <p className="nexora-eyebrow">Monthly Support</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                Keep your AI sharp after launch.
              </h2>
              <p className="mt-4 text-lg leading-8 text-nexora-muted">
                Optional care plans for updates, monitoring, and ongoing optimization—so your automations stay
                accurate as your business evolves.
              </p>
            </div>
            <div className="mt-12">
              <PricingSupportGrid tiers={monthlySupportTiers} />
            </div>
          </div>
        </section>

        <section id="guarantee" className="px-6 py-20 lg:px-8 lg:py-24">
          <div className="nexora-glow nexora-card mx-auto max-w-7xl overflow-hidden rounded-[2rem] border-nexora-primary/25 p-8 shadow-[0_0_80px_rgba(185,28,28,0.12)] lg:p-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
              <div className="pricing-guarantee-icon flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-nexora-primary/30 bg-nexora-primary/10">
                <ShieldCheck className="h-10 w-10 text-nexora-hover" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="nexora-eyebrow">Money-Back Guarantee</p>
                <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                  {moneyBackGuarantee.title}
                </h2>
                <p className="mt-4 text-lg leading-8 text-nexora-muted">{moneyBackGuarantee.description}</p>
                <ul className="mt-6 space-y-3 text-sm text-nexora-muted">
                  {moneyBackGuarantee.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="text-nexora-hover">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <p className="nexora-eyebrow">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">Pricing questions, answered.</h2>
            </div>
            <div className="mt-12 space-y-4">
              {pricingFaq.map((item) => (
                <details key={item.question} className="nexora-card group rounded-2xl p-5 transition hover:border-nexora-primary/25">
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

        <section className="px-6 pb-24 lg:px-8 lg:pb-32">
          <div className="nexora-glow nexora-card mx-auto max-w-7xl rounded-[2rem] border-nexora-primary/25 p-8 shadow-[0_0_80px_rgba(185,28,28,0.1)] lg:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="nexora-eyebrow">Get Started</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                Not sure which plan fits?
              </h2>
              <p className="mt-5 text-lg leading-8 text-nexora-muted">
                Book a free consultation for a tailored recommendation—or contact sales for Enterprise and custom
                scopes.
              </p>
              <PricingFinalCta />
            </div>
          </div>
        </section>
      </main>

      <ServiceMarketingFooter />
    </div>
  );
}
