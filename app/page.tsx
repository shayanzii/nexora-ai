const services = [
  {
    title: "AI Workflow Automation",
    description: "Streamline repetitive operations and turn manual processes into intelligent systems.",
  },
  {
    title: "Conversational AI",
    description: "Deploy premium chat experiences that feel human, fast, and beautifully branded.",
  },
  {
    title: "Predictive Analytics",
    description: "Forecast revenue, churn, and growth patterns with actionable AI insights.",
  },
  {
    title: "Computer Vision",
    description: "Process images, documents, and visual data at scale with production-ready models.",
  },
  {
    title: "Demand Forecasting",
    description: "Optimize inventory, staffing, and campaigns with adaptive forecasting engines.",
  },
  {
    title: "Custom AI Agents",
    description: "Build tailored copilots and autonomous agents for internal operations and support.",
  },
];

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

const plans = [
  {
    name: "Launch",
    price: "$2.5k",
    description: "For early-stage brands upgrading with AI fast.",
    features: ["AI audit", "One automation workflow", "Priority email support"],
    featured: false,
  },
  {
    name: "Scale",
    price: "$8.5k",
    description: "For growing teams that need intelligent operations.",
    features: ["Multi-agent setup", "Advanced analytics", "Dedicated solution architect"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations ready to transform at global scale.",
    features: ["Custom model integrations", "Security review", "24/7 strategic support"],
    featured: false,
  },
];

export default function Home() {
  return (
    <div className="nexora-page-bg min-h-screen text-nexora-muted">
      <header className="sticky top-0 z-50 nexora-border border-b bg-nexora-bg/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a
            href="#home"
            className="text-lg font-semibold uppercase tracking-[0.35em] text-nexora-primary transition hover:text-nexora-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexora-hover"
          >
            Nexora AI
          </a>
          <div className="hidden items-center gap-6 text-sm md:flex">
            <a href="#services" className="nexora-nav-link">
              Services
            </a>
            <a href="#about" className="nexora-nav-link">
              Why Us
            </a>
            <a href="#testimonials" className="nexora-nav-link">
              Testimonials
            </a>
            <a href="#pricing" className="nexora-nav-link">
              Pricing
            </a>
            <a href="#contact" className="nexora-btn-ghost px-4 py-2 text-sm">
              Contact
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
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
                We design intelligent systems that increase productivity, delight customers, and unlock growth without adding complexity.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#contact"
                  className="nexora-btn-primary px-6 py-3 text-center"
                >
                  Book a Free Consultation
                </a>
                <a
                  href="#services"
                  className="nexora-btn-secondary px-6 py-3 text-center"
                >
                  Explore Services
                </a>
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

        <section id="services" className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="nexora-eyebrow">Services</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                AI solutions built to move your business forward.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="group nexora-card rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-nexora-primary/40 hover:shadow-[0_0_40px_rgba(185,28,28,0.1)]"
                >
                  <div className="nexora-icon-box mb-4 h-11 w-11" />
                  <h3 className="text-xl font-semibold text-nexora-text">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-nexora-muted">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="px-6 py-24 lg:px-8">
          <div className="nexora-glow nexora-card mx-auto grid max-w-7xl gap-10 rounded-[2rem] p-8 shadow-[0_0_60px_rgba(0,0,0,0.45)] lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
            <div>
              <p className="nexora-eyebrow">Why Choose Us</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                Strategy, design, and execution in one team.
              </h2>
              <p className="mt-5 text-lg leading-8 text-nexora-muted">
                We blend technical depth with a world-class consulting approach so your AI investments deliver real business outcomes.
              </p>
            </div>
            <div className="grid gap-4">
              {reasons.map((reason) => (
                <div
                  key={reason}
                  className="nexora-surface rounded-2xl p-4 text-sm text-nexora-muted"
                >
                  <span className="mr-2 text-nexora-hover">✦</span>
                  {reason}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="nexora-eyebrow">Testimonials</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                Trusted by modern operators and growth teams.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
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

        <section id="pricing" className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="nexora-eyebrow">Pricing</p>
              <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                Flexible plans for every stage of growth.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-3xl border p-8 ${
                    plan.featured
                      ? "border-nexora-primary/40 bg-gradient-to-br from-nexora-primary/15 to-nexora-hover/10 shadow-[0_0_50px_rgba(185,28,28,0.18)]"
                      : "nexora-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-nexora-text">{plan.name}</h3>
                    {plan.featured ? (
                      <span className="rounded-full bg-nexora-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-nexora-text">
                        Popular
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-nexora-muted">{plan.description}</p>
                  <p className="mt-6 text-4xl font-semibold text-nexora-text">{plan.price}</p>
                  <ul className="mt-6 space-y-3 text-sm text-nexora-muted">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="text-nexora-hover">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className={`mt-8 inline-flex rounded-full px-5 py-3 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexora-hover ${
                      plan.featured
                        ? "nexora-btn-primary shadow-[0_0_24px_rgba(185,28,28,0.28)]"
                        : "nexora-btn-secondary"
                    }`}
                  >
                    Choose Plan
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="px-6 py-24 lg:px-8">
          <div className="nexora-glow nexora-card mx-auto max-w-7xl rounded-[2rem] border-nexora-primary/25 p-8 shadow-[0_0_80px_rgba(185,28,28,0.1)] lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p className="nexora-eyebrow">Contact</p>
                <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
                  Let&apos;s shape your next AI milestone.
                </h2>
                <p className="mt-5 text-lg leading-8 text-nexora-muted">
                  Share your goals and we&apos;ll map the fastest path to value with a tailored strategy and launch plan.
                </p>
                <a href="mailto:hello@nexora.ai" className="nexora-link mt-6 inline-flex font-medium">
                  hello@nexora.ai
                </a>
              </div>
              <form className="nexora-surface rounded-3xl p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className="nexora-input px-4 py-3 text-sm" placeholder="Name" />
                  <input className="nexora-input px-4 py-3 text-sm" placeholder="Email" />
                </div>
                <textarea
                  className="nexora-input mt-4 min-h-32 w-full px-4 py-3 text-sm"
                  placeholder="Tell us about your goals"
                />
                <button type="button" className="nexora-btn-primary mt-4 px-5 py-3">
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="nexora-border border-t px-6 py-10 text-center text-sm text-nexora-muted lg:px-8">
        © 2026 Nexora AI. Build smarter, move faster.
      </footer>
    </div>
  );
}
