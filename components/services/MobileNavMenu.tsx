"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      return;
    }

    const timer = window.setTimeout(() => setIsVisible(false), 320);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const { overflow, position, top, width } = document.body.style;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.position = position;
      document.body.style.top = top;
      document.body.style.width = width;
      window.scrollTo(0, scrollY);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, close]);

  const overlay =
    isMounted && isVisible
      ? createPortal(
          <div
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            aria-hidden={!isOpen}
            className={`mobile-nav-panel fixed inset-0 z-[200] flex flex-col overscroll-none bg-[rgba(0,0,0,0.96)] backdrop-blur-xl transition-transform duration-300 ease-out md:hidden ${
              isOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
            }`}
            {...(!isOpen ? { inert: true } : {})}
          >
            <div className="mobile-nav-close-wrap flex shrink-0 justify-end px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))]">
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className={`mobile-nav-close nexora-border inline-flex h-12 w-12 items-center justify-center rounded-xl border bg-nexora-surface/90 text-nexora-text transition-all duration-300 hover:border-nexora-primary/40 hover:bg-nexora-card hover:text-nexora-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexora-hover ${
                  isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <X className="h-6 w-6" strokeWidth={2.25} aria-hidden="true" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col items-center justify-center px-6 pb-[max(2rem,env(safe-area-inset-bottom))]" aria-label="Mobile">
              <ul className="flex w-full max-w-sm flex-col gap-3">
                {navItems.map((item) => {
                  const isActive = activeNav === item.key;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className={`flex min-h-[3.25rem] items-center justify-center rounded-2xl px-6 py-4 text-xl font-semibold tracking-wide transition active:scale-[0.98] ${
                          isActive
                            ? "bg-nexora-primary/20 text-nexora-hover"
                            : "text-nexora-text hover:bg-white/5 hover:text-nexora-hover active:bg-white/10"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>,
          document.body,
        )
      : null;

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
        <Menu className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
      </button>

      {overlay}
    </div>
  );
}
