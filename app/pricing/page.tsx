import { PricingPageTemplate } from "@/components/pricing/PricingPageTemplate";
import { createPageMetadata } from "@/lib/site/seo";

export const metadata = createPageMetadata({
  title: "Pricing",
  description:
    "Transparent AI pricing for Canadian businesses. Starter from CA$199, Growth CA$399, Pro CA$699, and Enterprise custom plans with optional monthly support.",
  path: "/pricing",
});

export default function PricingPage() {
  return <PricingPageTemplate />;
}
