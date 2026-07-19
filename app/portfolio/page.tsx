import type { Metadata } from "next";
import { PortfolioIndexTemplate } from "@/components/portfolio/PortfolioIndexTemplate";

export const metadata: Metadata = {
  title: "Portfolio | Nexora AI",
  description:
    "Explore Nexora AI case studies across hospitality, healthcare, real estate, home services, legal, and e-commerce.",
};

export default function PortfolioPage() {
  return <PortfolioIndexTemplate />;
}
