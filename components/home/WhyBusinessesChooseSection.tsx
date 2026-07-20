import { businessBenefitCards } from "@/lib/home/business-benefits";

export function WhyBusinessesChooseSection() {
  return (
    <section className="nexora-section px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="nexora-eyebrow">Why Businesses Choose Nexora AI</p>
          <h2 className="nexora-heading-section mt-3">Every card is a business outcome—not a feature list.</h2>
          <p className="mt-5 text-lg leading-8 text-nexora-muted">
            More customers. More appointments. Less busywork. Higher revenue. That&apos;s what you gain.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {businessBenefitCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="why-choose-card nexora-card group rounded-3xl p-6 transition duration-300 hover:border-nexora-primary/35 hover:shadow-[0_0_32px_rgba(185,28,28,0.12)] lg:p-7"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="nexora-icon-box mb-5 inline-flex h-12 w-12 items-center justify-center transition duration-300 group-hover:shadow-[0_0_28px_rgba(185,28,28,0.35)]">
                  <Icon className="h-5 w-5 text-nexora-hover" strokeWidth={2.25} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-nexora-text">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-nexora-muted">{card.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
