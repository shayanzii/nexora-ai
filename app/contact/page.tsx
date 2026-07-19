import type { Metadata } from "next";
import { ContactPageTemplate } from "@/components/contact/ContactPageTemplate";

export const metadata: Metadata = {
  title: "Contact | Nexora AI",
  description: "Contact Nexora AI for a free consultation on AI automation, chatbots, and voice agents.",
};

export default function ContactPage() {
  return <ContactPageTemplate />;
}
