import { trustSignalCards } from "@/lib/home/trust-signals";

export function WhyBusinessesTrustSection() {
  return (
    <section className="nexora-section px-6 lg:px-8">
      <div className="nexora-glow nexora-card mx-auto max-w-7xl rounded-[2rem] border-nexora-primary/20 p-8 lg:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="nexora-eyebrow">Why Businesses Trust Nexora AI</p>
          <h2 className="nexora-heading-section mt-3">Built for owners who want results—not experiments.</h2>
          <p className="mt-5 text-lg leading-8 text-nexora-muted">
            We&apos;re a Canadian team focused on honest pricing, fast delivery, and support that continues after
            launch. No fake reviews—just a clear process you can count on.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trustSignalCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="nexora-surface rounded-2xl p-5 transition duration-300 hover:border-nexora-primary/30"
              >
                <div className="nexora-icon-box mb-4 inline-flex h-10 w-10 items-center justify-center">
                  <Icon className="h-4 w-4 text-nexora-hover" strokeWidth={2.25} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-nexora-text">{card.title}</h3>
                <p className="mt-2 text-sm leading-7 text-nexora-muted">{card.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
