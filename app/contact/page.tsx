import { ContactPageTemplate } from "@/components/contact/ContactPageTemplate";
import { createPageMetadata } from "@/lib/site/seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Nexora AI for a free AI strategy call. Toronto-based team serving Canadian businesses with automation, chatbots, and voice agents.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageTemplate />;
}
