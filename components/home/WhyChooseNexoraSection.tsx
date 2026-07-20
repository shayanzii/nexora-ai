import { Clock, Headphones, MapPin, Shield, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type WhyChooseCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const whyChooseCards: WhyChooseCard[] = [
  {
    title: "Fast Implementation",
    description: "Most setups go live in days or weeks—not months. You start seeing results quickly.",
    icon: Clock,
  },
  {
    title: "Custom Solutions",
    description: "Every business is different. We build AI that fits how you actually work.",
    icon: Sparkles,
  },
  {
    title: "Canadian-Based Support",
    description: "Real people in Canada who understand local businesses and respond when you need help.",
    icon: MapPin,
  },
  {
    title: "Secure & Reliable",
    description: "Your customer data stays protected. Systems built to run 24/7 without downtime.",
    icon: Shield,
  },
  {
    title: "Ongoing Support",
    description: "We don't disappear after launch. We keep improving your AI as your business grows.",
    icon: Headphones,
  },
];

export function WhyChooseNexoraSection() {
  return (
    <section className="nexora-section px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="nexora-eyebrow">Why Choose Nexora AI</p>
          <h2 className="nexora-heading-section mt-3">A partner you can trust—not just another tech vendor.</h2>
          <p className="mt-5 text-lg leading-8 text-nexora-muted">
            We help Canadian businesses save time, get more customers, and stop missing calls—without the jargon or
            long wait times.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
