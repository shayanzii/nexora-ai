import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { serviceOfferings } from "@/lib/home/service-offerings";

export function ServicesOfferingsSection() {
  return (
    <section id="services" className="nexora-section relative overflow-hidden px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,_rgba(185,28,28,0.06),_transparent_45%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="nexora-eyebrow">What We Do</p>
          <h2 className="nexora-heading-section mt-3">Six ways we help you get more customers and save time.</h2>
          <p className="mt-5 text-lg leading-8 text-nexora-muted">
            No tech jargon. Each solution solves a real problem—missed calls, slow replies, lost leads, or wasted
            hours.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {serviceOfferings.map((service) => {
            const Icon = service.icon;
            const CardInner = (
              <>
                <div className="nexora-icon-box mb-5 inline-flex h-12 w-12 items-center justify-center transition duration-300 group-hover:shadow-[0_0_28px_rgba(185,28,28,0.35)]">
                  <Icon className="h-5 w-5 text-nexora-hover" strokeWidth={2.25} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-nexora-text">{service.title}</h3>
                <div className="mt-4 space-y-3 text-sm leading-7">
                  <p>
                    <span className="font-semibold text-nexora-text">Problem: </span>
                    <span className="text-nexora-muted">{service.problem}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-nexora-hover">You gain: </span>
                    <span className="text-nexora-muted">{service.outcome}</span>
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-nexora-border bg-nexora-surface px-3 py-1 text-xs text-nexora-text">
                    {service.audience.split(",")[0].trim()} +
                  </span>
                  <span className="rounded-full border border-nexora-primary/30 bg-nexora-primary/10 px-3 py-1 text-xs font-medium text-nexora-hover">
                    {service.timeline}
                  </span>
                </div>
                {service.href ? (
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-nexora-hover">
                    Learn more
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </span>
                ) : null}
              </>
            );

            return service.href ? (
              <Link
                key={service.title}
                href={service.href}
                className="why-choose-card nexora-card group block rounded-3xl p-6 transition duration-300 lg:p-7"
              >
                {CardInner}
              </Link>
            ) : (
              <article key={service.title} className="why-choose-card nexora-card rounded-3xl p-6 lg:p-7">
                {CardInner}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
