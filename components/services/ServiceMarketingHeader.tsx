import Link from "next/link";
import { allServicesList } from "@/lib/services/content";
import { MarketingNavLinks, type MarketingActiveNav } from "./MarketingNavLinks";

type ServiceMarketingHeaderProps = {
  activeNav?: MarketingActiveNav;
  currentSlug?: string;
};

export function ServiceMarketingHeader({ activeNav, currentSlug }: ServiceMarketingHeaderProps) {
  return (
    <header className="sticky top-0 z-[100] nexora-border border-b bg-nexora-bg/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold uppercase tracking-[0.35em] text-nexora-primary transition hover:text-nexora-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexora-hover"
        >
          Nexora AI
        </Link>
        <MarketingNavLinks activeNav={activeNav} currentSlug={currentSlug} />
      </nav>
    </header>
  );
}

export function ServiceMarketingFooter() {
  return (
    <footer className="nexora-border border-t px-6 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-sm text-nexora-muted md:flex-row">
        <p>© 2026 Nexora AI. Build smarter, move faster.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="transition hover:text-nexora-hover">
            Home
          </Link>
          <Link href="/services" className="transition hover:text-nexora-hover">
            Services
          </Link>
          <Link href="/pricing" className="transition hover:text-nexora-hover">
            Pricing
          </Link>
          <Link href="/portfolio" className="transition hover:text-nexora-hover">
            Portfolio
          </Link>
          <Link href="/contact" className="transition hover:text-nexora-hover">
            Contact
          </Link>
          <Link href="/admin" className="transition hover:text-nexora-hover">
            Admin
          </Link>
          {allServicesList.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="hidden transition hover:text-nexora-hover lg:inline"
            >
              {service.title}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

export type { MarketingActiveNav };
