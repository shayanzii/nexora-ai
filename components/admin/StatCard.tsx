import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
};

const trendStyles = {
  up: "text-emerald-400",
  down: "text-nexora-hover",
  neutral: "text-nexora-muted",
};

export function StatCard({ label, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <article className="nexora-card group relative overflow-hidden rounded-2xl p-5 transition hover:border-nexora-primary/30">
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-nexora-primary/10 blur-2xl transition group-hover:bg-nexora-primary/20" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-nexora-muted">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-nexora-text">
            {value.toLocaleString()}
          </p>
          <p className={`mt-2 text-xs font-medium ${trendStyles[trend]}`}>{change}</p>
        </div>
        <div className="nexora-icon-box flex h-11 w-11 shrink-0 items-center justify-center">
          <Icon className="h-5 w-5 text-nexora-hover" strokeWidth={2} aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}
