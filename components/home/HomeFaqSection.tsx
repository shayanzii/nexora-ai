import { homeFaqItems } from "@/lib/home/faq";

export function HomeFaqSection() {
  return (
    <section id="faq" className="px-6 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="nexora-eyebrow">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold text-nexora-text sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-5 text-lg leading-8 text-nexora-muted">
            Straight answers about pricing, timelines, and how Nexora AI works with your business.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {homeFaqItems.map((item) => (
            <details
              key={item.question}
              className="nexora-card group rounded-2xl p-5 transition hover:border-nexora-primary/25"
            >
              <summary className="cursor-pointer list-none font-semibold text-nexora-text marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.question}
                  <span className="shrink-0 text-nexora-hover transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-4 text-sm leading-7 text-nexora-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
