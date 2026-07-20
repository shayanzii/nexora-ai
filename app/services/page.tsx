import { ServicesIndexTemplate } from "@/components/services/ServicesIndexTemplate";
import { createPageMetadata } from "@/lib/site/seo";

export const metadata = createPageMetadata({
  title: "Services",
  description:
    "Explore Nexora AI services: chatbots, automation, voice agents, customer support, and AI-powered websites for Canadian businesses.",
  path: "/services",
});

export default function ServicesPage() {
  return <ServicesIndexTemplate />;
}
