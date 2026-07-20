import { MapPin, Rocket, Shield, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type TrustBadge = {
  label: string;
  icon: LucideIcon;
};

const trustBadges: TrustBadge[] = [
  { label: "Canadian Business Focused", icon: MapPin },
  { label: "Free Strategy Session", icon: Sparkles },
  { label: "Fast Deployment", icon: Rocket },
  { label: "Ongoing Support", icon: Users },
  { label: "Secure AI Solutions", icon: Shield },
];

export function HeroTrustSection() {
  return (
    <section
      aria-label="Trust highlights"
      className="nexora-border border-y bg-nexora-surface/40 px-6 py-6 backdrop-blur-sm lg:px-8 lg:py-8"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 lg:gap-4">
        {trustBadges.map((badge) => {
          const Icon = badge.icon;

          return (
            <div
              key={badge.label}
              className="trust-badge flex items-center gap-2.5 rounded-full border border-nexora-border bg-nexora-card/80 px-4 py-2.5 transition duration-300 hover:border-nexora-primary/35 hover:shadow-[0_0_20px_rgba(185,28,28,0.12)]"
            >
              <Icon className="h-4 w-4 shrink-0 text-nexora-hover" strokeWidth={2} aria-hidden="true" />
              <span className="text-sm font-semibold text-nexora-text">{badge.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
