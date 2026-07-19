type PortfolioHeroPlaceholderProps = {
  title: string;
  accent: string;
  industry: string;
  className?: string;
};

export function PortfolioHeroPlaceholder({
  title,
  accent,
  industry,
  className = "",
}: PortfolioHeroPlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-nexora-border bg-nexora-surface ${className}`}
      role="img"
      aria-label={`${title} project preview`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(185,28,28,0.22),_transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative flex min-h-[220px] flex-col justify-between p-8 sm:min-h-[280px] lg:min-h-[360px] lg:p-10">
        <div className="flex items-start justify-between gap-4">
          <span className="nexora-badge px-3 py-1.5 text-xs">{industry}</span>
          <span className="rounded-full border border-nexora-border bg-nexora-bg/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-nexora-muted">
            Case Study
          </span>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-nexora-hover">{accent}</p>
          <h2 className="mt-2 text-2xl font-semibold text-nexora-text sm:text-3xl lg:text-4xl">{title}</h2>
          <p className="mt-3 max-w-md text-sm text-nexora-muted">Project preview · Hero image placeholder</p>
        </div>
        <div className="mt-6 flex gap-2">
          <span className="h-2 w-2 rounded-full bg-nexora-hover shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
          <span className="h-2 w-8 rounded-full bg-nexora-primary/40" />
          <span className="h-2 w-8 rounded-full bg-nexora-primary/20" />
        </div>
      </div>
    </div>
  );
}
