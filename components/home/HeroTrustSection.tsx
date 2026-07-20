import { Calendar, Check, Headphones, Shield, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type TrustBadge = {
  label: string;
  icon: LucideIcon;
};

const trustBadges: TrustBadge[] = [
  { label: "Free Consultation", icon: Calendar },
  { label: "Secure AI Solutions", icon: Shield },
  { label: "Fast Deployment", icon: Zap },
  { label: "Ongoing Support", icon: Headphones },
];

export function HeroTrustSection() {
  return (
    <section
      aria-label="Trust highlights"
      className="nexora-border border-y bg-nexora-surface/30 px-6 py-8 backdrop-blur-sm lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {trustBadges.map((badge) => {
          const Icon = badge.icon;

          return (
            <div
              key={badge.label}
              className="trust-badge glass-panel nexora-card flex items-center gap-3 rounded-2xl px-4 py-3.5 transition duration-300 hover:border-nexora-primary/35 hover:shadow-[0_0_24px_rgba(185,28,28,0.1)]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-nexora-primary/30 bg-nexora-primary/10 shadow-[0_0_12px_rgba(185,28,28,0.15)]">
                <Check className="h-3.5 w-3.5 text-nexora-hover" strokeWidth={2.5} aria-hidden="true" />
              </span>
              <span className="flex min-w-0 items-center gap-2">
                <Icon className="h-3.5 w-3.5 shrink-0 text-nexora-muted" strokeWidth={2} aria-hidden="true" />
                <span className="text-sm font-medium text-nexora-text">{badge.label}</span>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
