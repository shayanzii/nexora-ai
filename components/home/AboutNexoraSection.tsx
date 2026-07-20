import { Compass, Eye, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { aboutPillars } from "@/lib/home/about";

const pillarIcons: Record<string, LucideIcon> = {
  Mission: Target,
  Vision: Eye,
  "Our Approach": Compass,
};

export function AboutNexoraSection() {
  return (
    <section id="about" className="px-6 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="nexora-eyebrow">About Nexora AI</p>
          <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
            We help Canadian businesses grow—with AI that&apos;s easy to understand.
          </h2>
          <p className="mt-5 text-lg leading-8 text-nexora-muted">
            We&apos;re not a faceless tech vendor. We&apos;re a Canadian team that listens, ships fast, and stays
            with you after launch.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {aboutPillars.map((pillar) => {
            const Icon = pillarIcons[pillar.title] ?? Target;

            return (
              <article
                key={pillar.title}
                className="glass-panel nexora-card rounded-3xl p-6 lg:p-8"
              >
                <div className="nexora-icon-box mb-5 inline-flex h-11 w-11 items-center justify-center">
                  <Icon className="h-5 w-5 text-nexora-hover" strokeWidth={2.25} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-nexora-text">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-nexora-muted">{pillar.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
