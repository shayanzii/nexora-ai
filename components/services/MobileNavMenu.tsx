"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { MarketingActiveNav } from "./MarketingNavLinks";

const navItems: { href: string; label: string; key: MarketingActiveNav }[] = [
  { href: "/", label: "Home", key: "home" },
  { href: "/services", label: "Services", key: "services" },
  { href: "/pricing", label: "Pricing", key: "pricing" },
  { href: "/portfolio", label: "Portfolio", key: "portfolio" },
  { href: "/contact", label: "Contact", key: "contact" },
];

type MobileNavMenuProps = {
  activeNav?: MarketingActiveNav;
};

export function MobileNavMenu({ activeNav }: MobileNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      return;
    }

    const timer = window.setTimeout(() => setIsVisible(false), 300);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, close]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="nexora-border inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-nexora-surface text-nexora-text transition hover:border-nexora-primary/40 hover:bg-nexora-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexora-hover"
      >
        {isOpen ? (
          <X className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
        )}
      </button>

      {isVisible && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={close}
          className={`mobile-nav-backdrop fixed inset-0 z-[90] bg-nexora-bg/70 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
      )}

      <nav
        id="mobile-nav-panel"
        aria-hidden={!isOpen}
        className={`mobile-nav-panel fixed right-0 top-0 z-[95] flex h-full w-[min(100vw-3rem,320px)] flex-col border-l border-nexora-border bg-nexora-bg/95 shadow-[-8px_0_40px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <div className="nexora-border flex items-center justify-between border-b px-5 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-nexora-primary">Menu</span>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="nexora-border inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-nexora-surface text-nexora-muted transition hover:text-nexora-text"
          >
            <X className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>

        <ul className="flex flex-1 flex-col gap-1 px-4 py-6">
          {navItems.map((item) => {
            const isActive = activeNav === item.key;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className={`block rounded-xl px-4 py-3.5 text-base font-medium transition ${
                    isActive
                      ? "bg-nexora-primary/15 text-nexora-hover"
                      : "text-nexora-text hover:bg-nexora-surface hover:text-nexora-hover"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
