import type { Metadata } from "next";
import { ServicesIndexTemplate } from "@/components/services/ServicesIndexTemplate";

export const metadata: Metadata = {
  title: "Services | Nexora AI",
  description:
    "Explore Nexora AI services: chatbots, automation, voice agents, customer support, and AI-powered websites.",
};

export default function ServicesPage() {
  return <ServicesIndexTemplate />;
}
