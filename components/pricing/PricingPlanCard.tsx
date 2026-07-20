"use client";

import type { PricingPlan } from "@/lib/pricing/content";
import { SALES_MAILTO } from "@/lib/pricing/content";
import { BookConsultationButton } from "@/components/services/BookConsultationButton";

type PricingPlanCardProps = {
  plan: PricingPlan;
  index: number;
  animate: boolean;
};

export function PricingPlanCard({ plan, index, animate }: PricingPlanCardProps) {
  return (
    <article
      className={`pricing-card-enter relative flex flex-col rounded-3xl border p-6 transition duration-300 lg:p-8 ${
        plan.featured
          ? "pricing-featured-card border-nexora-primary/50 bg-gradient-to-br from-nexora-primary/15 to-nexora-hover/10 shadow-[0_0_50px_rgba(185,28,28,0.2)] lg:scale-[1.02] lg:-translate-y-1"
          : "nexora-card hover:-translate-y-1 hover:border-nexora-primary/35 hover:shadow-[0_0_40px_rgba(185,28,28,0.1)]"
      } ${animate ? "pricing-card-visible" : ""}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {plan.featured ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-nexora-primary px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-nexora-text shadow-[0_0_20px_rgba(185,28,28,0.4)]">
          Most Popular
        </span>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-semibold text-nexora-text">{plan.name}</h3>
        {plan.id === "business" ? (
          <span className="rounded-full border border-nexora-border bg-nexora-surface px-2 py-0.5 text-[10px] uppercase tracking-wider text-nexora-muted">
            Custom
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium uppercase tracking-[0.15em] text-nexora-muted">Starting at</p>
        <p className="mt-1 text-4xl font-semibold tracking-tight text-nexora-text">{plan.price}</p>
        {plan.priceNote ? (
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-nexora-muted">{plan.priceNote}</p>
        ) : null}
      </div>

      <p className="mt-5 text-sm leading-7 text-nexora-muted">{plan.description}</p>

      <ul className="mt-6 flex-1 space-y-3 border-t border-nexora-border pt-6 text-sm text-nexora-muted">
        {plan.includes.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0 text-nexora-hover">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        {plan.cta === "sales" ? (
          <a
            href={SALES_MAILTO}
            className={`inline-flex w-full justify-center rounded-full px-5 py-3 text-center font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexora-hover ${
              plan.featured ? "nexora-btn-primary shadow-[0_0_24px_rgba(185,28,28,0.28)]" : "nexora-btn-secondary"
            }`}
          >
            {plan.ctaLabel}
          </a>
        ) : (
          <BookConsultationButton
            variant={plan.featured ? "primary" : "secondary"}
            className={`w-full rounded-full px-5 py-3 text-sm ${
              plan.featured ? "shadow-[0_0_24px_rgba(185,28,28,0.28)]" : ""
            }`}
          >
            {plan.ctaLabel}
          </BookConsultationButton>
        )}
      </div>
    </article>
  );
}
