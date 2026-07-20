import { howItWorksSteps } from "@/lib/home/how-it-works";

export function HowItWorksSection() {
  return (
    <section className="nexora-section px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="nexora-eyebrow">How It Works</p>
          <h2 className="nexora-heading-section mt-3">From first call to live AI in five simple steps.</h2>
          <p className="mt-5 text-lg leading-8 text-nexora-muted">
            No technical background needed. We handle the setup—you focus on running your business.
          </p>
        </div>

        <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {howItWorksSteps.map((item) => (
            <li
              key={item.step}
              className="nexora-card relative rounded-3xl p-6 transition duration-300 hover:border-nexora-primary/35"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-nexora-primary/40 bg-nexora-primary/15 text-sm font-bold text-nexora-hover">
                {item.step}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-nexora-text">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-nexora-muted">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
