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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_38%),linear-gradient(135deg,_#020617_0%,_#050816_45%,_#111827_100%)] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#home" className="text-lg font-semibold uppercase tracking-[0.35em] text-cyan-300">
            Nexora AI
          </a>
          <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#services" className="transition hover:text-cyan-300">
              Services
            </a>
            <a href="#about" className="transition hover:text-cyan-300">
              Why Us
            </a>
            <a href="#testimonials" className="transition hover:text-cyan-300">
              Testimonials
            </a>
            <a href="#pricing" className="transition hover:text-cyan-300">
              Pricing
            </a>
            <a href="#contact" className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 font-medium text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-400/20">
              Contact
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.15),_transparent_55%)]" />
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
                <span className="mr-2 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                Premium AI strategy for ambitious teams
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                AI Automation for Modern Businesses
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
                We design intelligent systems that increase productivity, delight customers, and unlock growth without adding complexity.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#contact"
                  className="rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 px-6 py-3 text-center font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.25)] transition hover:scale-[1.02]"
                >
                  Book a Free Consultation
                </a>
                <a
                  href="#services"
                  className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-center font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-white/10"
                >
                  Explore Services
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
                <div>
                  <p className="text-2xl font-semibold text-white">120+</p>
                  <p>Launches shipped</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">98%</p>
                  <p>Client retention</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">24/7</p>
                  <p>Implementation support</p>
                </div>
              </div>
            </div>

            <div className="glass-panel animate-float relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-[0_0_80px_rgba(34,211,238,0.15)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.3),_transparent_32%)]" />
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
                  Intelligent operations
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  From manual effort to high-impact automation.
                </h2>
                <ul className="mt-6 space-y-4 text-sm text-slate-300">
                  <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="font-semibold text-white">Automate repetitive tasks</span>
                    <p className="mt-1">Reduce response times and free teams for strategic work.</p>
                  </li>
                  <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="font-semibold text-white">Scale with confidence</span>
                    <p className="mt-1">Deploy AI that integrates seamlessly with your current stack.</p>
                  </li>
                  <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="font-semibold text-white">Measure every outcome</span>
                    <p className="mt-1">Track ROI clearly with real-time dashboards and insights.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Services</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                AI solutions built to move your business forward.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-400/10"
                >
                  <div className="mb-4 h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20" />
                  <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="px-6 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-[0_0_60px_rgba(15,23,42,0.4)] lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Why Choose Us</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                Strategy, design, and execution in one team.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                We blend technical depth with a world-class consulting approach so your AI investments deliver real business outcomes.
              </p>
            </div>
            <div className="grid gap-4">
              {reasons.map((reason) => (
                <div key={reason} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  <span className="mr-2 text-cyan-300">✦</span>
                  {reason}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Testimonials</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                Trusted by modern operators and growth teams.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <blockquote key={testimonial.name} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_0_40px_rgba(15,23,42,0.4)]">
                  <p className="text-lg leading-8 text-slate-200">“{testimonial.quote}”</p>
                  <footer className="mt-6">
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Pricing</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                Flexible plans for every stage of growth.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-3xl border p-8 ${plan.featured ? "border-cyan-400/40 bg-gradient-to-br from-cyan-400/15 to-violet-500/15 shadow-[0_0_50px_rgba(6,182,212,0.15)]" : "border-white/10 bg-slate-900/70"}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                    {plan.featured ? <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">Popular</span> : null}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{plan.description}</p>
                  <p className="mt-6 text-4xl font-semibold text-white">{plan.price}</p>
                  <ul className="mt-6 space-y-3 text-sm text-slate-300">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="text-cyan-300">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className={`mt-8 inline-flex rounded-full px-5 py-3 font-semibold transition ${plan.featured ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950" : "border border-white/15 bg-white/5 text-slate-100 hover:border-cyan-300/40 hover:bg-white/10"}`}
                  >
                    Choose Plan
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-cyan-400/20 bg-slate-900/80 p-8 shadow-[0_0_80px_rgba(34,211,238,0.1)] lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Contact</p>
                <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Let’s shape your next AI milestone.
                </h2>
                <p className="mt-5 text-lg leading-8 text-slate-300">
                  Share your goals and we’ll map the fastest path to value with a tailored strategy and launch plan.
                </p>
                <a href="mailto:hello@nexora.ai" className="mt-6 inline-flex text-cyan-300 transition hover:text-cyan-200">
                  hello@nexora.ai
                </a>
              </div>
              <form className="rounded-3xl border border-white/10 bg-black/20 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40" placeholder="Name" />
                  <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40" placeholder="Email" />
                </div>
                <textarea className="mt-4 min-h-32 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40" placeholder="Tell us about your goals" />
                <button type="button" className="mt-4 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.01]">
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-400 lg:px-8">
        © 2026 Nexora AI. Build smarter, move faster.
      </footer>
    </div>
  );
}
