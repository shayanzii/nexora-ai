import type {
  ArchitecturePageHierarchyNode,
  ArchitectureSeoImportance,
} from "../types/InformationArchitecture";

/** Page rule definition for deterministic industry architecture strategies. */
export interface ArchitecturePageRule {
  title: string;
  purpose: string;
  priority: "required" | "recommended" | "optional";
  requiredSections: readonly string[];
  recommendedComponents: readonly string[];
  seoImportance: ArchitectureSeoImportance;
  headerNav: boolean;
  footerNav: boolean;
  conversionPage: boolean;
  legalPage: boolean;
}

/** Industry-specific information architecture strategy. */
export interface ArchitectureStrategyRule {
  industryIds: readonly string[];
  pages: readonly ArchitecturePageRule[];
  hierarchy: readonly ArchitecturePageHierarchyNode[];
  blogEnabled: boolean;
  blogRationale: string;
  blogTopics: readonly string[];
  blogParentSlug: string | null;
  primaryCtaSlug: string;
  primaryCtaPlacement: "header" | "hero" | "inline" | "footer" | "sticky";
  secondaryCtaSlug: string;
  secondaryCtaPlacement: "header" | "hero" | "inline" | "footer" | "sticky";
}

function pageRule(
  title: string,
  purpose: string,
  options: {
    priority?: ArchitecturePageRule["priority"];
    requiredSections: readonly string[];
    recommendedComponents: readonly string[];
    seoImportance: ArchitectureSeoImportance;
    headerNav?: boolean;
    footerNav?: boolean;
    conversionPage?: boolean;
    legalPage?: boolean;
  },
): ArchitecturePageRule {
  return {
    title,
    purpose,
    priority: options.priority ?? "required",
    requiredSections: options.requiredSections,
    recommendedComponents: options.recommendedComponents,
    seoImportance: options.seoImportance,
    headerNav: options.headerNav ?? !options.legalPage,
    footerNav: options.footerNav ?? options.legalPage ?? false,
    conversionPage: options.conversionPage ?? false,
    legalPage: options.legalPage ?? false,
  };
}

export const RESTAURANT_ARCHITECTURE_STRATEGY: ArchitectureStrategyRule = {
  industryIds: ["restaurant"],
  pages: [
    pageRule("Home", "Introduce the restaurant and drive menu exploration.", {
      requiredSections: ["Hero", "Featured Dishes", "Reviews", "Location Preview"],
      recommendedComponents: ["HeroBanner", "MenuPreview", "ReviewCarousel", "MapTeaser"],
      seoImportance: "critical",
      headerNav: true,
    }),
    pageRule("Menu", "Present full menu, pricing, and dietary options.", {
      requiredSections: ["Menu Categories", "Specials", "Dietary Notes"],
      recommendedComponents: ["MenuTabs", "PriceList", "DietaryBadges"],
      seoImportance: "critical",
      headerNav: true,
    }),
    pageRule("Reservations", "Convert visitors into booked diners.", {
      requiredSections: ["Reservation Form", "Hours", "Party Size"],
      recommendedComponents: ["BookingForm", "AvailabilityCalendar", "ConfirmationNote"],
      seoImportance: "critical",
      headerNav: true,
      conversionPage: true,
    }),
    pageRule("Gallery", "Showcase ambiance, dishes, and dining experience.", {
      requiredSections: ["Photo Grid", "Ambiance Highlights"],
      recommendedComponents: ["ImageGallery", "LightboxViewer"],
      seoImportance: "high",
      headerNav: true,
    }),
    pageRule("About", "Share story, chef background, and brand values.", {
      requiredSections: ["Story", "Team", "Values"],
      recommendedComponents: ["StorySection", "TeamProfiles", "Timeline"],
      seoImportance: "medium",
      headerNav: true,
    }),
    pageRule("Contact", "Provide contact details and location information.", {
      requiredSections: ["Contact Form", "Phone", "Map", "Hours"],
      recommendedComponents: ["ContactForm", "ClickToCall", "MapEmbed", "HoursTable"],
      seoImportance: "high",
      headerNav: true,
      conversionPage: true,
    }),
    pageRule("FAQ", "Answer common questions about dining and reservations.", {
      priority: "recommended",
      requiredSections: ["General Questions", "Reservations", "Dietary Options"],
      recommendedComponents: ["AccordionFAQ", "SearchFAQ"],
      seoImportance: "medium",
      headerNav: true,
      footerNav: true,
    }),
    pageRule("Privacy", "Publish privacy policy and data handling practices.", {
      requiredSections: ["Policy Content", "Last Updated"],
      recommendedComponents: ["LegalContentBlock"],
      seoImportance: "low",
      headerNav: false,
      footerNav: true,
      legalPage: true,
    }),
    pageRule("Terms", "Publish terms of service for online reservations.", {
      requiredSections: ["Terms Content", "Last Updated"],
      recommendedComponents: ["LegalContentBlock"],
      seoImportance: "low",
      headerNav: false,
      footerNav: true,
      legalPage: true,
    }),
  ],
  hierarchy: [
    {
      slug: "home",
      children: ["menu", "reservations", "gallery", "about", "contact", "faq"],
    },
    { slug: "contact", children: ["privacy", "terms"] },
    { slug: "menu", children: [] },
    { slug: "reservations", children: [] },
    { slug: "gallery", children: [] },
    { slug: "about", children: [] },
    { slug: "faq", children: [] },
    { slug: "privacy", children: [] },
    { slug: "terms", children: [] },
  ],
  blogEnabled: false,
  blogRationale: "Restaurant sites prioritize menu discovery and reservations over blog content.",
  blogTopics: [],
  blogParentSlug: null,
  primaryCtaSlug: "reservations",
  primaryCtaPlacement: "sticky",
  secondaryCtaSlug: "menu",
  secondaryCtaPlacement: "header",
};

export const DENTIST_ARCHITECTURE_STRATEGY: ArchitectureStrategyRule = {
  industryIds: ["dentist", "dental"],
  pages: [
    pageRule("Home", "Introduce the dental practice and reduce patient anxiety.", {
      requiredSections: ["Hero", "Services Overview", "Trust Signals", "CTA"],
      recommendedComponents: ["HeroBanner", "ServiceCards", "ReviewSummary", "PrimaryCTA"],
      seoImportance: "critical",
    }),
    pageRule("Services", "Explain dental services and treatment options.", {
      requiredSections: ["Service List", "Treatment Benefits", "New Patient Info"],
      recommendedComponents: ["ServiceGrid", "TreatmentCards", "ProcessSteps"],
      seoImportance: "critical",
    }),
    pageRule("Meet the Doctor", "Build trust through doctor credentials and approach.", {
      requiredSections: ["Doctor Bio", "Credentials", "Philosophy of Care"],
      recommendedComponents: ["ProfileHero", "CredentialList", "PortraitGallery"],
      seoImportance: "high",
    }),
    pageRule("Insurance", "Clarify accepted insurance and payment options.", {
      requiredSections: ["Accepted Plans", "Payment Options", "Billing FAQ"],
      recommendedComponents: ["InsuranceLogos", "PaymentTable", "AccordionFAQ"],
      seoImportance: "high",
    }),
    pageRule("Testimonials", "Provide social proof from satisfied patients.", {
      requiredSections: ["Patient Reviews", "Success Stories"],
      recommendedComponents: ["ReviewCarousel", "VideoTestimonials"],
      seoImportance: "medium",
    }),
    pageRule("Book Appointment", "Convert visitors into scheduled patients.", {
      requiredSections: ["Booking Form", "Office Hours", "New Patient Intake"],
      recommendedComponents: ["AppointmentForm", "CalendarPicker", "IntakeChecklist"],
      seoImportance: "critical",
      conversionPage: true,
    }),
    pageRule("Contact", "Provide office location, phone, and contact options.", {
      requiredSections: ["Contact Form", "Phone", "Map", "Hours"],
      recommendedComponents: ["ContactForm", "ClickToCall", "MapEmbed", "HoursTable"],
      seoImportance: "high",
      conversionPage: true,
    }),
    pageRule("FAQ", "Answer common dental care and appointment questions.", {
      priority: "recommended",
      requiredSections: ["General Care", "Appointments", "Insurance"],
      recommendedComponents: ["AccordionFAQ", "SearchFAQ"],
      seoImportance: "medium",
      footerNav: true,
    }),
    pageRule("Privacy", "Publish HIPAA-aware privacy policy.", {
      requiredSections: ["Policy Content", "HIPAA Notice", "Last Updated"],
      recommendedComponents: ["LegalContentBlock", "ComplianceNotice"],
      seoImportance: "low",
      headerNav: false,
      footerNav: true,
      legalPage: true,
    }),
  ],
  hierarchy: [
    {
      slug: "home",
      children: [
        "services",
        "meet-the-doctor",
        "insurance",
        "testimonials",
        "book-appointment",
        "contact",
        "faq",
      ],
    },
    { slug: "services", children: [] },
    { slug: "meet-the-doctor", children: [] },
    { slug: "insurance", children: [] },
    { slug: "testimonials", children: [] },
    { slug: "book-appointment", children: [] },
    { slug: "contact", children: ["privacy"] },
    { slug: "faq", children: [] },
    { slug: "privacy", children: [] },
  ],
  blogEnabled: false,
  blogRationale: "Dental practices convert through services clarity and appointment booking.",
  blogTopics: [],
  blogParentSlug: null,
  primaryCtaSlug: "book-appointment",
  primaryCtaPlacement: "sticky",
  secondaryCtaSlug: "services",
  secondaryCtaPlacement: "header",
};

export const LAW_FIRM_ARCHITECTURE_STRATEGY: ArchitectureStrategyRule = {
  industryIds: ["law-firm"],
  pages: [
    pageRule("Home", "Establish credibility and route visitors to practice areas.", {
      requiredSections: ["Hero", "Practice Overview", "Trust Signals", "CTA"],
      recommendedComponents: ["HeroBanner", "PracticeSummary", "CredentialStrip", "PrimaryCTA"],
      seoImportance: "critical",
    }),
    pageRule("Practice Areas", "Outline legal services and specializations.", {
      requiredSections: ["Practice List", "Outcome Focus", "Process Overview"],
      recommendedComponents: ["PracticeGrid", "OutcomeCards", "ProcessTimeline"],
      seoImportance: "critical",
    }),
    pageRule("Attorneys", "Present attorney profiles and expertise.", {
      requiredSections: ["Attorney Profiles", "Bar Admissions", "Experience"],
      recommendedComponents: ["AttorneyGrid", "BioCards", "CredentialList"],
      seoImportance: "high",
    }),
    pageRule("Case Results", "Demonstrate proven outcomes and client success.", {
      requiredSections: ["Results Summary", "Case Highlights", "Disclaimers"],
      recommendedComponents: ["ResultsGrid", "CaseStudyCards", "DisclaimerBlock"],
      seoImportance: "high",
    }),
    pageRule("Consultation", "Capture consultation requests with compliant intake.", {
      requiredSections: ["Consultation Form", "Confidentiality Notice", "Next Steps"],
      recommendedComponents: ["IntakeForm", "DisclaimerBlock", "ConfirmationMessage"],
      seoImportance: "critical",
      conversionPage: true,
    }),
    pageRule("Blog", "Publish legal insights and thought leadership.", {
      priority: "recommended",
      requiredSections: ["Featured Articles", "Category Index", "Newsletter CTA"],
      recommendedComponents: ["ArticleList", "CategoryNav", "NewsletterSignup"],
      seoImportance: "medium",
    }),
    pageRule("FAQ", "Address common legal process and consultation questions.", {
      priority: "recommended",
      requiredSections: ["General Questions", "Consultation Process", "Fees"],
      recommendedComponents: ["AccordionFAQ", "SearchFAQ"],
      seoImportance: "medium",
      footerNav: true,
    }),
    pageRule("Contact", "Provide firm contact details and office locations.", {
      requiredSections: ["Contact Form", "Office Locations", "Phone"],
      recommendedComponents: ["ContactForm", "OfficeList", "ClickToCall"],
      seoImportance: "high",
      conversionPage: true,
    }),
    pageRule("Privacy", "Publish privacy policy and compliance disclosures.", {
      requiredSections: ["Policy Content", "Disclaimers", "Last Updated"],
      recommendedComponents: ["LegalContentBlock", "ComplianceNotice"],
      seoImportance: "low",
      headerNav: false,
      footerNav: true,
      legalPage: true,
    }),
  ],
  hierarchy: [
    {
      slug: "home",
      children: [
        "practice-areas",
        "attorneys",
        "case-results",
        "consultation",
        "blog",
        "faq",
        "contact",
      ],
    },
    { slug: "practice-areas", children: [] },
    { slug: "attorneys", children: [] },
    { slug: "case-results", children: [] },
    { slug: "consultation", children: [] },
    { slug: "blog", children: [] },
    { slug: "faq", children: [] },
    { slug: "contact", children: ["privacy"] },
    { slug: "privacy", children: [] },
  ],
  blogEnabled: true,
  blogRationale: "Law firms benefit from thought leadership content for SEO and trust.",
  blogTopics: ["Legal updates", "Client guidance", "Industry compliance"],
  blogParentSlug: "blog",
  primaryCtaSlug: "consultation",
  primaryCtaPlacement: "sticky",
  secondaryCtaSlug: "practice-areas",
  secondaryCtaPlacement: "header",
};

export const GENERIC_ARCHITECTURE_STRATEGY: ArchitectureStrategyRule = {
  industryIds: ["default"],
  pages: [
    pageRule("Home", "Introduce the business and primary value proposition.", {
      requiredSections: ["Hero", "Services Overview", "Trust Signals", "CTA"],
      recommendedComponents: ["HeroBanner", "ServiceCards", "ReviewSummary", "PrimaryCTA"],
      seoImportance: "critical",
    }),
    pageRule("About", "Share company background, team, and differentiators.", {
      requiredSections: ["Story", "Team", "Values"],
      recommendedComponents: ["StorySection", "TeamProfiles", "ValuesGrid"],
      seoImportance: "medium",
    }),
    pageRule("Services", "Describe core services and customer outcomes.", {
      requiredSections: ["Service List", "Benefits", "Process"],
      recommendedComponents: ["ServiceGrid", "BenefitCards", "ProcessSteps"],
      seoImportance: "critical",
    }),
    pageRule("Testimonials", "Provide social proof from satisfied customers.", {
      priority: "recommended",
      requiredSections: ["Customer Reviews", "Success Highlights"],
      recommendedComponents: ["ReviewCarousel", "QuoteCards"],
      seoImportance: "medium",
    }),
    pageRule("Contact", "Enable direct contact and inquiry submission.", {
      requiredSections: ["Contact Form", "Phone", "Hours"],
      recommendedComponents: ["ContactForm", "ClickToCall", "HoursTable"],
      seoImportance: "high",
      conversionPage: true,
    }),
    pageRule("FAQ", "Answer common customer questions.", {
      priority: "recommended",
      requiredSections: ["General Questions", "Services", "Pricing"],
      recommendedComponents: ["AccordionFAQ", "SearchFAQ"],
      seoImportance: "medium",
      footerNav: true,
    }),
    pageRule("Quote Request", "Capture qualified leads through a quote form.", {
      requiredSections: ["Quote Form", "Service Selection", "Timeline"],
      recommendedComponents: ["QuoteForm", "ServiceSelector", "TimelinePicker"],
      seoImportance: "high",
      conversionPage: true,
    }),
    pageRule("Privacy", "Publish privacy policy and data practices.", {
      requiredSections: ["Policy Content", "Last Updated"],
      recommendedComponents: ["LegalContentBlock"],
      seoImportance: "low",
      headerNav: false,
      footerNav: true,
      legalPage: true,
    }),
  ],
  hierarchy: [
    {
      slug: "home",
      children: ["about", "services", "testimonials", "contact", "faq", "quote-request"],
    },
    { slug: "about", children: [] },
    { slug: "services", children: [] },
    { slug: "testimonials", children: [] },
    { slug: "contact", children: ["privacy"] },
    { slug: "faq", children: [] },
    { slug: "quote-request", children: [] },
    { slug: "privacy", children: [] },
  ],
  blogEnabled: false,
  blogRationale: "Generic business sites prioritize service clarity and lead capture.",
  blogTopics: [],
  blogParentSlug: null,
  primaryCtaSlug: "contact",
  primaryCtaPlacement: "sticky",
  secondaryCtaSlug: "services",
  secondaryCtaPlacement: "header",
};

const ARCHITECTURE_STRATEGIES: readonly ArchitectureStrategyRule[] = [
  RESTAURANT_ARCHITECTURE_STRATEGY,
  DENTIST_ARCHITECTURE_STRATEGY,
  LAW_FIRM_ARCHITECTURE_STRATEGY,
];

/** Resolves the architecture strategy rule for a normalized industry id. */
export function resolveArchitectureStrategy(industryId: string): ArchitectureStrategyRule {
  const normalized = industryId.toLowerCase().trim();

  for (const strategy of ARCHITECTURE_STRATEGIES) {
    if (strategy.industryIds.includes(normalized)) {
      return strategy;
    }
  }

  return GENERIC_ARCHITECTURE_STRATEGY;
}
