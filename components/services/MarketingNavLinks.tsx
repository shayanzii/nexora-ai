"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { serviceOfferings } from "@/lib/home/service-offerings";
import { BookConsultationButton } from "./BookConsultationButton";

export type MarketingActiveNav = "home" | "services" | "pricing" | "portfolio" | "contact" | "admin";

type MarketingNavLinksProps = {
  activeNav?: MarketingActiveNav;
};

function navLinkClass(isActive: boolean) {
  return isActive
    ? "font-medium text-nexora-hover"
    : "nexora-nav-link font-medium transition duration-200 hover:text-nexora-hover";
}

export function MarketingNavLinks({ activeNav }: MarketingNavLinksProps) {
  return (
    <div className="hidden items-center gap-1 md:flex lg:gap-2">
      <Link href="/" className={`rounded-lg px-3 py-2 ${navLinkClass(activeNav === "home")}`}>
        Home
      </Link>

      <div className="group relative">
        <Link
          href="/services"
          aria-haspopup="true"
          className={`${navLinkClass(activeNav === "services")} inline-flex items-center gap-1 rounded-lg px-3 py-2`}
        >
          Services
          <ChevronDown
            className="h-3.5 w-3.5 text-nexora-muted transition duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
            aria-hidden="true"
          />
        </Link>
        <div className="invisible absolute left-0 top-full z-50 mt-1 w-64 translate-y-1 rounded-2xl border border-nexora-border bg-nexora-bg/98 p-2 opacity-0 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <Link
            href="/services"
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-nexora-text transition hover:bg-nexora-surface"
          >
            View All Services
          </Link>
          <div className="my-1 border-t border-nexora-border" />
          {serviceOfferings.map((service) => (
            <Link
              key={service.title}
              href={service.href ?? "/services"}
              className="block rounded-xl px-3 py-2 text-sm text-nexora-muted transition hover:bg-nexora-surface hover:text-nexora-text"
            >
              {service.title}
            </Link>
          ))}
        </div>
      </div>

      <Link href="/pricing" className={`rounded-lg px-3 py-2 ${navLinkClass(activeNav === "pricing")}`}>
        Pricing
      </Link>

      <Link href="/portfolio" className={`rounded-lg px-3 py-2 ${navLinkClass(activeNav === "portfolio")}`}>
        Portfolio
      </Link>

      <BookConsultationButton className="nexora-btn-primary ml-2 rounded-full px-5 py-2.5 text-sm shadow-[0_0_24px_rgba(185,28,28,0.35)] lg:ml-4">
        Book Free Consultation
      </BookConsultationButton>
    </div>
  );
}
