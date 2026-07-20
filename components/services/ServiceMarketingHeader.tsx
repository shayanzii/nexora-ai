import Link from "next/link";
import { NEXORA_CONTACT_EMAIL, NEXORA_CONTACT_MAILTO, NEXORA_LOCATION } from "@/lib/site/contact";
import { MarketingNavLinks, type MarketingActiveNav } from "./MarketingNavLinks";
import { MobileNavMenu } from "./MobileNavMenu";

type ServiceMarketingHeaderProps = {
  activeNav?: MarketingActiveNav;
};

export function ServiceMarketingHeader({ activeNav }: ServiceMarketingHeaderProps) {
  return (
    <header className="sticky top-0 z-[100] nexora-border border-b bg-nexora-bg/95 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5 lg:px-8 lg:py-4" aria-label="Primary">
        <Link
          href="/"
          className="shrink-0 text-base font-semibold uppercase tracking-[0.3em] text-nexora-primary transition hover:text-nexora-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexora-hover lg:text-lg lg:tracking-[0.35em]"
        >
          Nexora AI
        </Link>
        <MarketingNavLinks activeNav={activeNav} />
        <MobileNavMenu activeNav={activeNav} />
      </nav>
    </header>
  );
}

export function ServiceMarketingFooter() {
  return (
    <footer className="nexora-marketing-footer nexora-border border-t px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm text-center md:text-left">
            <p className="text-base font-semibold text-nexora-text">Nexora AI</p>
            <p className="mt-2 text-sm leading-7 text-nexora-muted">
              AI that answers customers, books appointments, and captures leads—for Canadian service businesses.
            </p>
            <p className="mt-3 text-sm text-nexora-muted">{NEXORA_LOCATION}</p>
            <a href={NEXORA_CONTACT_MAILTO} className="nexora-link mt-2 inline-block text-sm font-medium">
              {NEXORA_CONTACT_EMAIL}
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm md:justify-end">
            <Link href="/" className="nexora-nav-link transition hover:text-nexora-hover">
              Home
            </Link>
            <Link href="/services" className="nexora-nav-link transition hover:text-nexora-hover">
              Services
            </Link>
            <Link href="/pricing" className="nexora-nav-link transition hover:text-nexora-hover">
              Pricing
            </Link>
            <Link href="/portfolio" className="nexora-nav-link transition hover:text-nexora-hover">
              Portfolio
            </Link>
            <Link href="/contact" className="nexora-nav-link transition hover:text-nexora-hover">
              Contact
            </Link>
            <Link href="/privacy" className="nexora-nav-link transition hover:text-nexora-hover">
              Privacy
            </Link>
            <Link href="/terms" className="nexora-nav-link transition hover:text-nexora-hover">
              Terms
            </Link>
          </div>
        </div>

        <p className="nexora-border mt-10 border-t pt-6 text-center text-xs text-nexora-muted md:text-left">
          © 2026 Nexora AI. Helping Canadian businesses grow with AI.
        </p>
      </div>
    </footer>
  );
}

export type { MarketingActiveNav };
