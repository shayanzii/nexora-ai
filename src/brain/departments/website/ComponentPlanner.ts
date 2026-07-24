import type { BlueprintPage, ComponentPlan, StandardComponent } from "./WebsiteTypes";

const COMPONENT_PURPOSES: Readonly<Record<StandardComponent, string>> = {
  Navbar: "Primary site navigation and brand identity.",
  Footer: "Secondary navigation, legal links, and contact details.",
  Hero: "Above-the-fold value proposition and primary CTA.",
  Cards: "Feature, service, and benefit presentation blocks.",
  Forms: "Generic form container for lead capture.",
  Buttons: "Primary and secondary call-to-action controls.",
  "Pricing Cards": "Package and pricing comparison display.",
  Testimonials: "Social proof from customer reviews.",
  FAQ: "Expandable question and answer sections.",
  "Booking Form": "Appointment scheduling and calendar integration.",
  "Contact Form": "General inquiry and callback requests.",
  "Chat Widget": "AI chatbot engagement for after-hours support.",
};

/** Selects reusable components required across the site. */
export function planComponents(
  pages: readonly BlueprintPage[],
  flags: { hasBooking: boolean; hasChatbot: boolean; hasPricing: boolean },
): ComponentPlan[] {
  const usedOnAll = pages.map((page) => page.slug);
  const components: ComponentPlan[] = [];

  const add = (name: StandardComponent, usedOnPages: readonly string[]): void => {
    components.push({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      usedOnPages,
      purpose: COMPONENT_PURPOSES[name],
    });
  };

  add("Navbar", usedOnAll);
  add("Footer", usedOnAll);
  add("Hero", pages.filter((page) => page.slug === "home" || page.conversionPage).map((p) => p.slug));
  add("Buttons", usedOnAll);

  if (pages.some((page) => page.slug.includes("testimonial") || page.title.includes("Testimonial"))) {
    add("Testimonials", pages.filter((page) => page.slug.includes("testimonial")).map((p) => p.slug));
  } else {
    add("Testimonials", ["home"]);
  }

  if (pages.some((page) => page.slug === "faq")) {
    add("FAQ", ["faq", "home"]);
  }

  if (flags.hasBooking || pages.some((page) => page.slug.includes("book"))) {
    add("Booking Form", pages.filter((page) => page.conversionPage || page.slug.includes("book")).map((p) => p.slug));
  }

  if (pages.some((page) => page.slug === "contact")) {
    add("Contact Form", ["contact"]);
  }

  if (flags.hasChatbot) {
    add("Chat Widget", usedOnAll);
  }

  if (flags.hasPricing || pages.some((page) => page.slug === "pricing")) {
    add("Pricing Cards", pages.filter((page) => page.slug === "pricing" || page.slug === "services").map((p) => p.slug));
  }

  add("Cards", pages.filter((page) => ["home", "services", "about"].includes(page.slug)).map((p) => p.slug));

  return components.filter(
    (component, index, list) => list.findIndex((entry) => entry.name === component.name) === index,
  );
}

export function listComponentNames(components: readonly ComponentPlan[]): string[] {
  return components.map((component) => component.name);
}
