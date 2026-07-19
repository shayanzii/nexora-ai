"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PricingPlan } from "@/lib/pricing/content";
import { SALES_MAILTO } from "@/lib/pricing/content";
import { BookConsultationButton } from "@/components/services/BookConsultationButton";
import { PricingPlanCard } from "./PricingPlanCard";

type PricingCardsGridProps = {
  plans: PricingPlan[];
};

export function PricingCardsGrid({ plans }: PricingCardsGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`grid gap-6 lg:grid-cols-2 xl:grid-cols-4 ${visible ? "pricing-grid-visible" : ""}`}
    >
      {plans.map((plan, index) => (
        <PricingPlanCard key={plan.id} plan={plan} index={index} animate={visible} />
      ))}
    </div>
  );
}

export function PricingSupportGrid({
  tiers,
}: {
  tiers: { plan: string; price: string; includes: string[] }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${visible ? "pricing-grid-visible" : ""}`}
    >
      {tiers.map((tier, index) => (
        <article
          key={tier.plan}
          className={`pricing-card-enter nexora-card rounded-3xl p-6 transition hover:border-nexora-primary/30 hover:shadow-[0_0_32px_rgba(185,28,28,0.08)] ${
            visible ? "pricing-card-visible" : ""
          }`}
          style={{ animationDelay: `${index * 90}ms` }}
        >
          <h3 className="text-lg font-semibold text-nexora-text">{tier.plan}</h3>
          <p className="mt-2 text-2xl font-semibold text-nexora-hover">{tier.price}</p>
          <ul className="mt-4 space-y-2 text-sm text-nexora-muted">
            {tier.includes.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-nexora-hover">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

export function PricingHeroActions() {
  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
      <BookConsultationButton className="pricing-hero-cta px-6 py-3" />
      <Link href="/pricing" className="nexora-btn-secondary px-6 py-3 text-center font-semibold">
        Compare Plans
      </Link>
    </div>
  );
}

export function PricingFinalCta() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <BookConsultationButton className="px-8 py-3.5" />
      <a href={SALES_MAILTO} className="nexora-btn-secondary px-8 py-3.5 font-semibold">
        Contact Sales
      </a>
    </div>
  );
}
