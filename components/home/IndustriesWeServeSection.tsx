import { industryCards } from "@/lib/home/industries";

export function IndustriesWeServeSection() {
  return (
    <section className="nexora-section px-6 lg:px-8">
      <div className="nexora-glow nexora-card mx-auto max-w-7xl rounded-[2rem] border-nexora-primary/20 p-8 shadow-[0_0_60px_rgba(0,0,0,0.35)] lg:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="nexora-eyebrow">Industries We Serve</p>
          <h2 className="nexora-heading-section mt-3">Built for the businesses that keep Canada running.</h2>
          <p className="mt-5 text-lg leading-8 text-nexora-muted">
            Trades, clinics, restaurants, and professional services—if you talk to customers, we can help you do it
            better.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industryCards.map((industry) => {
            const Icon = industry.icon;

            return (
              <article
                key={industry.title}
                className="nexora-surface group flex gap-4 rounded-2xl border border-transparent p-5 transition duration-300 hover:border-nexora-primary/30 hover:bg-nexora-card"
              >
                <div className="nexora-icon-box flex h-10 w-10 shrink-0 items-center justify-center">
                  <Icon className="h-4 w-4 text-nexora-hover" strokeWidth={2.25} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-nexora-text">{industry.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-nexora-muted">{industry.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
