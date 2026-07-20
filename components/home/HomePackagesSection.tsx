import { PricingCardsGrid } from "@/components/pricing/PricingAnimatedSections";
import { PricingComparisonTable } from "@/components/pricing/PricingComparisonTable";
import { pricingPlans } from "@/lib/pricing/content";

type HomePackagesSectionProps = {
  showViewAllLink?: boolean;
};

export function HomePackagesSection({ showViewAllLink = true }: HomePackagesSectionProps) {
  return (
    <section id="plans" className="nexora-section relative overflow-hidden px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(185,28,28,0.08),_transparent_50%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="nexora-eyebrow">Services & Pricing</p>
          <h2 className="nexora-heading-section mt-3">Three packages. One clear path to more customers.</h2>
          <p className="mt-5 text-lg leading-8 text-nexora-muted">
            Pick the plan that fits your business today—upgrade anytime as you grow. All packages include setup,
            training, and Canadian-based support.
          </p>
        </div>

        <div className="mt-14">
          <PricingCardsGrid plans={pricingPlans} columns={3} />
        </div>

        <PricingComparisonTable />

        {showViewAllLink ? (
          <p className="mt-10 text-center text-sm text-nexora-muted">
            Need help choosing?{" "}
            <a href="/pricing" className="font-semibold text-nexora-hover transition hover:underline">
              Compare full plan details →
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
