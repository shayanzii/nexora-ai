"use client";

import { useEffect, useRef, useState } from "react";
import { pricingPlans } from "@/lib/pricing/content";

const comparisonFeatures = [
  { label: "AI Website Chatbot", starter: true, growth: true, business: true },
  { label: "Lead Capture", starter: true, growth: true, business: true },
  { label: "AI Receptionist", starter: false, growth: true, business: true },
  { label: "Appointment Booking", starter: false, growth: true, business: true },
  { label: "CRM Integration", starter: false, growth: true, business: true },
  { label: "WhatsApp / Messenger", starter: false, growth: true, business: true },
  { label: "Custom AI Workflows", starter: false, growth: false, business: true },
  { label: "Internal AI Assistant", starter: false, growth: false, business: true },
  { label: "Dashboard & Analytics", starter: false, growth: false, business: true },
  { label: "Premium Support", starter: false, growth: false, business: true },
];

function CheckCell({ included }: { included: boolean }) {
  return (
    <td className="px-4 py-3 text-center">
      {included ? (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-nexora-primary/15 text-sm text-nexora-hover">
          ✓
        </span>
      ) : (
        <span className="text-nexora-muted/40">—</span>
      )}
    </td>
  );
}

export function PricingComparisonTable() {
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

  const [starter, growth, business] = pricingPlans;

  return (
    <div
      ref={ref}
      className={`mt-16 overflow-hidden rounded-3xl border border-nexora-border bg-nexora-card/50 ${visible ? "pricing-card-visible" : "pricing-card-enter opacity-0"}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-nexora-border">
              <th className="px-6 py-5 font-semibold text-nexora-text">Compare packages</th>
              <th className="px-4 py-5 text-center">
                <span className="block font-semibold text-nexora-text">{starter.name}</span>
                <span className="mt-1 block text-xs text-nexora-muted">{starter.price}</span>
              </th>
              <th className="px-4 py-5 text-center">
                <span className="inline-block rounded-full bg-nexora-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-nexora-text">
                  Popular
                </span>
                <span className="mt-2 block font-semibold text-nexora-text">{growth.name}</span>
                <span className="mt-1 block text-xs text-nexora-muted">{growth.price}</span>
              </th>
              <th className="px-4 py-5 text-center">
                <span className="block font-semibold text-nexora-text">{business.name}</span>
                <span className="mt-1 block text-xs text-nexora-muted">{business.price}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonFeatures.map((row, index) => (
              <tr
                key={row.label}
                className={`border-b border-nexora-border/60 ${index % 2 === 0 ? "bg-nexora-surface/30" : ""}`}
              >
                <td className="px-6 py-3 font-medium text-nexora-text">{row.label}</td>
                <CheckCell included={row.starter} />
                <CheckCell included={row.growth} />
                <CheckCell included={row.business} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
