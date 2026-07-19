import type { Metadata } from "next";
import { PricingPageTemplate } from "@/components/pricing/PricingPageTemplate";

export const metadata: Metadata = {
  title: "Pricing | Nexora AI",
  description:
    "Transparent AI pricing for Canadian businesses. Starter from CA$199, Growth CA$399, Pro CA$699, and Enterprise custom plans with optional monthly support.",
};

export default function PricingPage() {
  return <PricingPageTemplate />;
}
