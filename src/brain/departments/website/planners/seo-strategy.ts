import type { SeoPagePriority } from "../types/SEOPlan";

/** SEO template for a single page slug within an industry strategy. */
export interface SeoPageTemplate {
  slug: string;
  titleLabel: string;
  focusKeywordPattern: string;
  secondaryKeywordPatterns: readonly string[];
  metaDescriptionPattern: string;
  headingPatterns: readonly string[];
  schemaType: string;
  priority: SeoPagePriority;
}

/** Industry-specific SEO strategy rule. */
export interface SeoStrategyRule {
  industryIds: readonly string[];
  pageTemplates: readonly SeoPageTemplate[];
}

function seoTemplate(
  slug: string,
  titleLabel: string,
  focusKeywordPattern: string,
  secondaryKeywordPatterns: readonly string[],
  metaDescriptionPattern: string,
  headingPatterns: readonly string[],
  schemaType: string,
  priority: SeoPagePriority,
): SeoPageTemplate {
  return {
    slug,
    titleLabel,
    focusKeywordPattern,
    secondaryKeywordPatterns,
    metaDescriptionPattern,
    headingPatterns,
    schemaType,
    priority,
  };
}

export const RESTAURANT_SEO_STRATEGY: SeoStrategyRule = {
  industryIds: ["restaurant"],
  pageTemplates: [
    seoTemplate(
      "home",
      "Home",
      "{business} restaurant {country}",
      ["local restaurant", "dining {country}", "best restaurant near me"],
      "Welcome to {business}, a local restaurant in {country}. {valueProposition}",
      ["Welcome to {business}", "Featured Dishes", "Why Dine With Us"],
      "Restaurant",
      "critical",
    ),
    seoTemplate(
      "menu",
      "Menu",
      "{business} menu",
      ["restaurant menu", "food menu {country}", "dinner menu"],
      "Explore the full menu at {business} in {country}. Fresh dishes, daily specials, and dietary options.",
      ["Our Menu", "Chef Specials", "Dietary Options"],
      "Menu",
      "critical",
    ),
    seoTemplate(
      "reservations",
      "Reservations",
      "restaurant reservations {country}",
      ["book a table", "dine in reservations", "{business} booking"],
      "Reserve your table at {business} in {country}. Easy online booking for groups and special occasions.",
      ["Reserve Your Table", "Booking Details", "Hours and Availability"],
      "FoodEstablishment",
      "critical",
    ),
    seoTemplate(
      "gallery",
      "Gallery",
      "{business} restaurant photos",
      ["restaurant gallery", "dining ambiance", "food photography"],
      "View photos of dishes, dining room ambiance, and guest experiences at {business}.",
      ["Photo Gallery", "Dining Ambiance", "Guest Favorites"],
      "ImageGallery",
      "high",
    ),
    seoTemplate(
      "about",
      "About",
      "about {business} restaurant",
      ["our story", "local restaurant team", "restaurant history"],
      "Learn about {business}, our culinary story, and the team behind memorable dining in {country}.",
      ["Our Story", "Meet the Team", "Our Values"],
      "AboutPage",
      "medium",
    ),
    seoTemplate(
      "contact",
      "Contact",
      "{business} restaurant contact",
      ["restaurant phone number", "restaurant location", "contact {business}"],
      "Contact {business} in {country} for reservations, directions, hours, and general inquiries.",
      ["Contact Us", "Location and Hours", "Get Directions"],
      "LocalBusiness",
      "high",
    ),
  ],
};

export const DENTIST_SEO_STRATEGY: SeoStrategyRule = {
  industryIds: ["dentist", "dental"],
  pageTemplates: [
    seoTemplate(
      "home",
      "Home",
      "{business} dentist {country}",
      ["family dentist", "dental clinic {country}", "local dentist near me"],
      "{business} provides trusted dental care in {country}. {valueProposition}",
      ["Trusted Dental Care", "Our Services", "Book Your Visit"],
      "Dentist",
      "critical",
    ),
    seoTemplate(
      "services",
      "Services",
      "dental services {country}",
      ["family dentistry", "cosmetic dentistry", "preventive dental care"],
      "Explore dental services at {business} including preventive, restorative, and cosmetic treatments.",
      ["Dental Services", "Treatment Options", "What to Expect"],
      "MedicalBusiness",
      "critical",
    ),
    seoTemplate(
      "meet-the-doctor",
      "Meet the Doctor",
      "dentist {country}",
      ["experienced dentist", "dental credentials", "family dentist profile"],
      "Meet the dentist at {business} and learn about credentials, experience, and patient-first care.",
      ["Meet Your Dentist", "Credentials and Experience", "Our Approach to Care"],
      "Physician",
      "high",
    ),
    seoTemplate(
      "insurance",
      "Insurance",
      "dental insurance {country}",
      ["accepted dental insurance", "dental payment options", "insurance coverage"],
      "Review accepted insurance plans and payment options at {business} in {country}.",
      ["Accepted Insurance", "Payment Options", "Billing FAQ"],
      "WebPage",
      "high",
    ),
    seoTemplate(
      "testimonials",
      "Testimonials",
      "{business} dental reviews",
      ["dentist reviews", "patient testimonials", "dental clinic ratings"],
      "Read patient testimonials and reviews for {business} in {country}.",
      ["Patient Reviews", "Success Stories", "Why Patients Choose Us"],
      "Review",
      "medium",
    ),
    seoTemplate(
      "book-appointment",
      "Book Appointment",
      "book dentist appointment {country}",
      ["schedule dental visit", "new patient appointment", "{business} booking"],
      "Book a dental appointment at {business} in {country}. New and returning patients welcome.",
      ["Book an Appointment", "New Patient Information", "Office Hours"],
      "MedicalBusiness",
      "critical",
    ),
  ],
};

export const LAW_FIRM_SEO_STRATEGY: SeoStrategyRule = {
  industryIds: ["law-firm"],
  pageTemplates: [
    seoTemplate(
      "home",
      "Home",
      "{business} law firm {country}",
      ["legal services {country}", "attorney near me", "law firm consultation"],
      "{business} provides professional legal services in {country}. {valueProposition}",
      ["Experienced Legal Representation", "Practice Overview", "Schedule a Consultation"],
      "LegalService",
      "critical",
    ),
    seoTemplate(
      "practice-areas",
      "Practice Areas",
      "legal practice areas {country}",
      ["business law", "litigation services", "legal expertise"],
      "Explore practice areas at {business} and find legal support tailored to your needs in {country}.",
      ["Our Practice Areas", "How We Help Clients", "Legal Process Overview"],
      "LegalService",
      "critical",
    ),
    seoTemplate(
      "attorneys",
      "Attorney Profiles",
      "attorney profiles {country}",
      ["experienced attorneys", "legal team", "law firm lawyers"],
      "Meet the attorneys at {business} and review credentials, experience, and case focus areas.",
      ["Our Attorneys", "Experience and Credentials", "Client-Focused Advocacy"],
      "Person",
      "high",
    ),
    seoTemplate(
      "case-results",
      "Case Results",
      "law firm case results",
      ["legal outcomes", "case studies", "attorney track record"],
      "Review representative case results from {business}. Outcomes vary; consult an attorney for advice.",
      ["Case Results", "Representative Outcomes", "Legal Disclaimers"],
      "WebPage",
      "high",
    ),
    seoTemplate(
      "consultation",
      "Consultation",
      "free legal consultation {country}",
      ["schedule legal consultation", "law firm intake", "confidential consultation"],
      "Request a confidential consultation with {business} in {country}. Get clear guidance on next steps.",
      ["Request a Consultation", "Confidential Intake", "What Happens Next"],
      "LegalService",
      "critical",
    ),
    seoTemplate(
      "blog",
      "Blog",
      "{business} legal insights",
      ["legal blog", "law firm articles", "legal updates {country}"],
      "Read legal insights, updates, and guidance from the team at {business}.",
      ["Legal Insights", "Recent Articles", "Subscribe for Updates"],
      "Blog",
      "medium",
    ),
  ],
};

export const GENERIC_SEO_STRATEGY: SeoStrategyRule = {
  industryIds: ["default"],
  pageTemplates: [
    seoTemplate(
      "home",
      "Home",
      "{business} {industry} {country}",
      ["local {industry}", "{industry} services", "trusted {industry} provider"],
      "{business} delivers professional {industry} services in {country}. {valueProposition}",
      ["Welcome to {business}", "Our Services", "Why Choose Us"],
      "LocalBusiness",
      "critical",
    ),
    seoTemplate(
      "about",
      "About",
      "about {business}",
      ["company background", "local business story", "{industry} team"],
      "Learn about {business}, our mission, and the team serving customers in {country}.",
      ["About Us", "Our Mission", "Meet the Team"],
      "AboutPage",
      "medium",
    ),
    seoTemplate(
      "services",
      "Services",
      "{industry} services {country}",
      ["professional services", "service offerings", "{business} services"],
      "Explore services offered by {business} in {country} and find the right solution for your needs.",
      ["Our Services", "Service Benefits", "How It Works"],
      "Service",
      "critical",
    ),
    seoTemplate(
      "testimonials",
      "Testimonials",
      "{business} reviews",
      ["customer reviews", "client testimonials", "{industry} ratings"],
      "Read customer testimonials and reviews for {business} in {country}.",
      ["Customer Reviews", "Client Success Stories", "Trusted by Locals"],
      "Review",
      "medium",
    ),
    seoTemplate(
      "contact",
      "Contact",
      "contact {business}",
      ["get a quote", "contact {industry} provider", "{business} phone"],
      "Contact {business} in {country} for inquiries, quotes, and service requests.",
      ["Contact Us", "Request Information", "Office Hours"],
      "LocalBusiness",
      "high",
    ),
    seoTemplate(
      "quote-request",
      "Quote Request",
      "{industry} quote {country}",
      ["request a quote", "free estimate", "service quote"],
      "Request a quote from {business} in {country}. Fast response and clear next steps.",
      ["Request a Quote", "Tell Us About Your Project", "What Happens Next"],
      "WebPage",
      "high",
    ),
  ],
};

const SEO_STRATEGIES: readonly SeoStrategyRule[] = [
  RESTAURANT_SEO_STRATEGY,
  DENTIST_SEO_STRATEGY,
  LAW_FIRM_SEO_STRATEGY,
];

/** Resolves the SEO strategy rule for a normalized industry id. */
export function resolveSeoStrategy(industryId: string): SeoStrategyRule {
  const normalized = industryId.toLowerCase().trim();

  for (const strategy of SEO_STRATEGIES) {
    if (strategy.industryIds.includes(normalized)) {
      return strategy;
    }
  }

  return GENERIC_SEO_STRATEGY;
}

/** Replaces template tokens in SEO copy patterns. */
export function applySeoTemplate(
  pattern: string,
  tokens: Readonly<Record<string, string>>,
): string {
  return pattern.replace(/\{(\w+)\}/g, (_match, key: string) => tokens[key] ?? "");
}
