import Link from "next/link";
import { allPortfolioList } from "@/lib/portfolio/content";
import { pricingPlans } from "@/lib/pricing/content";
import { allServicesList } from "@/lib/services/content";
import { BookConsultationButton } from "@/components/services/BookConsultationButton";
import { ServiceMarketingFooter, ServiceMarketingHeader } from "@/components/services/ServiceMarketingHeader";

const reasons = [
  "Senior AI strategists with enterprise delivery experience",
  "Rapid deployment frameworks that reduce time-to-value",
  "Security-first architecture for compliant growth",
  "Transparent roadmaps and measurable ROI",
];

const testimonials = [
  {
    quote:
      "Nexora helped us automate our support stack in under three weeks and improved response time by 74%.",
    name: "Mina Alvarez",
    role: "COO, Northstar Labs",
  },
  {
    quote:
      "Their team brought clarity to our AI roadmap and shipped a forecasting layer that changed our planning cycle.",
    name: "Jordan Kim",
    role: "VP Growth, Helio Commerce",
  },
  {
    quote:
      "The experience felt premium from day one—strategic, polished, and deeply technical.",
    name: "Dara Patel",
    role: "Founder, Brightside AI",
  },
];

export default function Home() {
  const servicePreviews = allServicesList.slice(0, 3);
  const portfolioPreviews = allPortfolioList.slice(0, 3);
  const pricingPreviews = pricingPlans.slice(0, 3);

  return (
    <div className="nexora-page-bg min-h-screen text-nexora-muted">
      <ServiceMarketingHeader activeNav="home" />

      <main>
        <section className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(185,28,28,0.1),_transparent_55%)]" />
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="nexora-badge mb-6 px-4 py-2">
                <span className="mr-2 h-2.5 w-2.5 rounded-full bg-nexora-hover shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                Premium AI strategy for ambitious teams
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-nexora-text sm:text-5xl lg:text-6xl">
                AI Automation for Modern Businesses
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-nexora-muted sm:text-xl">
                We design intelligent systems that increase productivity, delight customers, and unlock growth without
                adding complexity.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <BookConsultationButton className="px-6 py-3" />
                <Link href="/services" className="nexora-btn-secondary px-6 py-3 text-center font-semibold">
                  Explore Services
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-8 text-sm text-nexora-muted">
                <div>
                  <p className="text-2xl font-semibold text-nexora-text">120+</p>
                  <p>Launches shipped</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-nexora-text">98%</p>
                  <p>Client retention</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-nexora-text">24/7</p>
                  <p>Implementation support</p>
                </div>
              </div>
            </div>

            <div className="glass-panel animate-float nexora-glow nexora-card relative overflow-hidden rounded-3xl p-8 shadow-[0_0_80px_rgba(185,28,28,0.12)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(185,28,28,0.18),_transparent_32%)]" />
              <div className="relative">
                <p className="nexora-eyebrow text-sm">Intelligent operations</p>
                <h2 className="mt-3 text-2xl font-semibold text-nexora-text">
                  From manual effort to high-impact automation.
                </h2>
                <ul className="mt-6 space-y-4 text-sm text-nexora-muted">
                  <li className="nexora-surface rounded-2xl p-4">
                    <span className="font-semibold text-nexora-text">Automate repetitive tasks</span>
                    <p className="mt-1">Reduce response times and free teams for strategic work.</p>
                  </li>
                  <li className="nexora-surface rounded-2xl p-4">
                    <span className="font-semibold text-nexora-text">Scale with confidence</span>
                    <p className="mt-1">Deploy AI that integrates seamlessly with your current stack.</p>
                  </li>
                  <li className="nexora-surface rounded-2xl p-4">
                    <span className="font-semibold text-nexora-text">Measure every outcome</span>
                    <p className="mt-1">Track ROI clearly with real-time dashboards and insights.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-20 lg:px-8 lg:py-24">
          <div className="nexora-glow nexora-card mx-auto grid max-w-7xl gap-10 rounded-[2rem] p-8 shadow-[0_0_60px_rgba(0,0,0,0.45)] lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
            <div>
              <p className="nexora-eyebrow">Why Choose Us</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                Strategy, design, and execution in one team.
              </h2>
              <p className="mt-5 text-lg leading-8 text-nexora-muted">
                We blend technical depth with a world-class consulting approach so your AI investments deliver real
                business outcomes.
              </p>
            </div>
            <div className="grid gap-4">
              {reasons.map((reason) => (
                <div key={reason} className="nexora-surface rounded-2xl p-4 text-sm text-nexora-muted">
                  <span className="mr-2 text-nexora-hover">✦</span>
                  {reason}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="nexora-eyebrow">Services</p>
                <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                  AI solutions built to move your business forward.
                </h2>
              </div>
              <Link href="/services" className="nexora-btn-secondary shrink-0 px-6 py-3 font-semibold">
                Learn More
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {servicePreviews.map((service) => (
                <article key={service.slug} className="nexora-card rounded-3xl p-6">
                  <div className="nexora-icon-box mb-4 h-11 w-11" />
                  <h3 className="text-xl font-semibold text-nexora-text">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-nexora-muted line-clamp-3">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="nexora-eyebrow">Portfolio</p>
                <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                  Real results across industries.
                </h2>
              </div>
              <Link href="/portfolio" className="nexora-btn-secondary shrink-0 px-6 py-3 font-semibold">
                Learn More
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {portfolioPreviews.map((project) => (
                <article key={project.slug} className="nexora-card rounded-3xl p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nexora-hover">
                    {project.industry}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-nexora-text">{project.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-nexora-muted line-clamp-3">{project.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="nexora-eyebrow">Pricing</p>
                <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                  Flexible plans for every stage of growth.
                </h2>
              </div>
              <Link href="/pricing" className="nexora-btn-secondary shrink-0 px-6 py-3 font-semibold">
                Learn More
              </Link>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {pricingPreviews.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-3xl border p-6 ${
                    plan.featured
                      ? "border-nexora-primary/40 bg-gradient-to-br from-nexora-primary/15 to-nexora-hover/10"
                      : "nexora-card"
                  }`}
                >
                  <h3 className="text-xl font-semibold text-nexora-text">{plan.name}</h3>
                  <p className="mt-4 text-3xl font-semibold text-nexora-text">{plan.price}</p>
                  <p className="mt-3 text-sm leading-7 text-nexora-muted">{plan.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="nexora-eyebrow">Testimonials</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                Trusted by modern operators and growth teams.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <blockquote
                  key={testimonial.name}
                  className="nexora-card rounded-3xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.3)]"
                >
                  <p className="text-lg leading-8 text-nexora-muted">&ldquo;{testimonial.quote}&rdquo;</p>
                  <footer className="mt-6">
                    <p className="font-semibold text-nexora-text">{testimonial.name}</p>
                    <p className="text-sm text-nexora-muted">{testimonial.role}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 lg:px-8 lg:pb-32">
          <div className="nexora-glow nexora-card mx-auto max-w-7xl rounded-[2rem] border-nexora-primary/25 p-8 shadow-[0_0_80px_rgba(185,28,28,0.1)] lg:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="nexora-eyebrow">Get Started</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                Let&apos;s shape your next AI milestone.
              </h2>
              <p className="mt-5 text-lg leading-8 text-nexora-muted">
                Book a free consultation or visit our contact page to share your goals with our strategy team.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <BookConsultationButton className="px-8 py-3.5" />
                <Link href="/contact" className="nexora-btn-secondary px-8 py-3.5 font-semibold">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ServiceMarketingFooter />
    </div>
  );
}
