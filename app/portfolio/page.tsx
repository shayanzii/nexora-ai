import { PortfolioIndexTemplate } from "@/components/portfolio/PortfolioIndexTemplate";
import { createPageMetadata } from "@/lib/site/seo";

export const metadata = createPageMetadata({
  title: "Portfolio",
  description:
    "Explore Nexora AI case studies across hospitality, healthcare, real estate, home services, legal, and e-commerce.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return <PortfolioIndexTemplate />;
}
