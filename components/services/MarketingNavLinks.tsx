import Link from "next/link";
import { allServicesList } from "@/lib/services/content";

export type MarketingActiveNav = "home" | "services" | "pricing" | "portfolio" | "contact" | "admin";

type MarketingNavLinksProps = {
  activeNav?: MarketingActiveNav;
  currentSlug?: string;
};

function navLinkClass(isActive: boolean) {
  return isActive ? "text-nexora-hover" : "nexora-nav-link";
}

export function MarketingNavLinks({ activeNav, currentSlug }: MarketingNavLinksProps) {
  return (
    <div className="hidden items-center gap-6 text-sm md:flex">
      <Link href="/" className={navLinkClass(activeNav === "home")}>
        Home
      </Link>

      <div className="group relative">
        <Link href="/services" className={`${navLinkClass(activeNav === "services")} flex items-center gap-1`}>
          Services
          <span className="text-xs text-nexora-muted">▾</span>
        </Link>
        <div className="invisible absolute left-0 top-full z-50 mt-2 w-56 rounded-2xl border border-nexora-border bg-nexora-bg/95 p-2 opacity-0 shadow-[0_0_40px_rgba(0,0,0,0.45)] backdrop-blur-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          <Link
            href="/services"
            className={`block rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-nexora-surface ${
              currentSlug === "index" ? "text-nexora-hover" : "text-nexora-text"
            }`}
          >
            All Services
          </Link>
          <div className="my-1 border-t border-nexora-border" />
          {allServicesList.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className={`block rounded-xl px-3 py-2 text-sm transition hover:bg-nexora-surface ${
                currentSlug === service.slug ? "text-nexora-hover" : "text-nexora-muted hover:text-nexora-text"
              }`}
            >
              {service.title}
            </Link>
          ))}
        </div>
      </div>

      <Link href="/pricing" className={navLinkClass(activeNav === "pricing")}>
        Pricing
      </Link>

      <Link href="/portfolio" className={navLinkClass(activeNav === "portfolio")}>
        Portfolio
      </Link>

      <Link
        href="/contact"
        className={`nexora-btn-ghost px-4 py-2 text-sm ${activeNav === "contact" ? "border-nexora-hover" : ""}`}
      >
        Contact
      </Link>

      <Link href="/admin" className={navLinkClass(activeNav === "admin")}>
        Admin
      </Link>
    </div>
  );
}
