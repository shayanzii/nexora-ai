import { industryCards } from "@/lib/home/industries";

export function WhoWeHelpSection() {
  return (
    <section className="nexora-section px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="nexora-eyebrow">Who We Help</p>
          <h2 className="nexora-heading-section mt-3">Built for local Canadian service businesses.</h2>
          <p className="mt-5 text-lg leading-8 text-nexora-muted">
            Whether you run a trade crew, clinic, or restaurant—we help you answer customers faster and book more
            work.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industryCards.map((industry) => {
            const Icon = industry.icon;

            return (
              <article
                key={industry.title}
                className="why-choose-card nexora-card group rounded-3xl p-6 transition duration-300 hover:border-nexora-primary/35 lg:p-7"
              >
                <div className="nexora-icon-box mb-4 inline-flex h-11 w-11 items-center justify-center transition duration-300 group-hover:shadow-[0_0_24px_rgba(185,28,28,0.25)]">
                  <Icon className="h-5 w-5 text-nexora-hover" strokeWidth={2.25} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-nexora-text">{industry.title}</h3>
                <p className="mt-3 text-sm leading-7 text-nexora-muted">{industry.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
