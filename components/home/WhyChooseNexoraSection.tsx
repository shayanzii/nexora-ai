import { Bot, Clock, Headphones, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type WhyChooseCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const whyChooseCards: WhyChooseCard[] = [
  {
    title: "AI-Powered Automation",
    description: "Automate repetitive work and free your team to focus on growth.",
    icon: Bot,
  },
  {
    title: "Fast Delivery",
    description: "Most projects are delivered in days, not months.",
    icon: Clock,
  },
  {
    title: "Built for Canadian Businesses",
    description: "Solutions designed for local businesses across Canada.",
    icon: MapPin,
  },
  {
    title: "Ongoing Support",
    description: "We continue improving your AI after launch.",
    icon: Headphones,
  },
];

export function WhyChooseNexoraSection() {
  return (
    <section className="px-6 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="nexora-eyebrow">Why Choose Nexora AI</p>
          <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
            Built for speed, scale, and lasting results.
          </h2>
          <p className="mt-5 text-lg leading-8 text-nexora-muted">
            From first launch to ongoing optimization, we deliver AI that works for your business—not the other way
            around.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {whyChooseCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="why-choose-card glass-panel nexora-card group relative overflow-hidden rounded-3xl p-6 transition duration-300 lg:p-8"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(185,28,28,0.14),_transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="nexora-icon-box mb-5 inline-flex h-12 w-12 items-center justify-center transition duration-300 group-hover:shadow-[0_0_28px_rgba(185,28,28,0.35)]">
                    <Icon className="h-5 w-5 text-nexora-hover" strokeWidth={2.25} aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-nexora-text">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-nexora-muted">{card.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
