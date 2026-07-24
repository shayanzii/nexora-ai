import type { ContentSectionPriority } from "../types/ContentPlan";

/** Section template within a page content strategy. */
export interface ContentSectionTemplate {
  sectionName: string;
  purposePattern: string;
  contentGuidelinesPattern: string;
  recommendedComponents: readonly string[];
  priority: ContentSectionPriority;
}

/** Page-level content template for deterministic generation. */
export interface ContentPageTemplate {
  slug: string;
  heroHeadlinePattern: string;
  heroSubheadlinePattern: string;
  headlinePattern: string;
  subheadlinePattern: string;
  ctaFromJourneyStage: "awareness" | "consideration" | "conversion";
  sectionTemplates: readonly ContentSectionTemplate[];
  faqTopics: readonly string[];
  trustSignals: readonly string[];
  testimonialPrompts: readonly string[];
  serviceHighlights: readonly string[];
  contactStrategyPattern: string;
}

/** Industry-specific content strategy rule. */
export interface ContentStrategyRule {
  industryIds: readonly string[];
  contentFocus: string;
  pageTemplates: readonly ContentPageTemplate[];
}

function section(
  sectionName: string,
  purposePattern: string,
  contentGuidelinesPattern: string,
  recommendedComponents: readonly string[],
  priority: ContentSectionPriority = "required",
): ContentSectionTemplate {
  return {
    sectionName,
    purposePattern,
    contentGuidelinesPattern,
    recommendedComponents,
    priority,
  };
}

function pageTemplate(
  slug: string,
  config: {
    heroHeadlinePattern: string;
    heroSubheadlinePattern: string;
    headlinePattern: string;
    subheadlinePattern: string;
    ctaFromJourneyStage: ContentPageTemplate["ctaFromJourneyStage"];
    sectionTemplates: readonly ContentSectionTemplate[];
    faqTopics: readonly string[];
    trustSignals: readonly string[];
    testimonialPrompts: readonly string[];
    serviceHighlights: readonly string[];
    contactStrategyPattern: string;
  },
): ContentPageTemplate {
  return { slug, ...config };
}

const RESTAURANT_PAGE_TEMPLATES: readonly ContentPageTemplate[] = [
  pageTemplate("home", {
    heroHeadlinePattern: "Welcome to {business}",
    heroSubheadlinePattern: "{valueProposition}",
    headlinePattern: "Experience Memorable Dining at {business}",
    subheadlinePattern: "Fresh flavors and warm hospitality for {audience} in {country}.",
    ctaFromJourneyStage: "awareness",
    sectionTemplates: [
      section("Featured Menu", "Showcase signature dishes.", "Highlight 3-5 best-selling plates with appetite-forward descriptions.", ["MenuPreview", "DishCards"]),
      section("Dining Experience", "Communicate ambiance and service.", "Describe atmosphere, service style, and what makes visits special.", ["ImageGallery", "StoryBlock"]),
      section("Guest Reviews", "Build trust with social proof.", "Feature star ratings and short quotes from recent diners.", ["ReviewCarousel", "RatingBadge"]),
    ],
    faqTopics: ["Do you accept walk-ins?", "Do you offer vegetarian or gluten-free options?", "How do reservations work?"],
    trustSignals: ["Google Reviews", "Local favorite", "Chef-crafted menu"],
    testimonialPrompts: ["Guest dining experience quotes", "Repeat visitor recommendations"],
    serviceHighlights: ["Signature dishes", "Daily specials", "Private dining options"],
    contactStrategyPattern: "Route hungry visitors to menu exploration first, then reservations via sticky CTA.",
  }),
  pageTemplate("menu", {
    heroHeadlinePattern: "Explore the {business} Menu",
    heroSubheadlinePattern: "Seasonal dishes crafted for {audience}.",
    headlinePattern: "Full Menu at {business}",
    subheadlinePattern: "Browse categories, pricing, and dietary options.",
    ctaFromJourneyStage: "consideration",
    sectionTemplates: [
      section("Menu Categories", "Organize dishes by course or style.", "Use scannable categories with concise, descriptive dish names.", ["MenuTabs", "CategoryNav"]),
      section("Specials", "Promote limited-time offers.", "Call out chef specials and seasonal items near the top.", ["SpecialsBanner", "PriceList"]),
      section("Dietary Options", "Reduce friction for dietary needs.", "Label vegan, gluten-free, and allergy-friendly items clearly.", ["DietaryBadges", "AllergyNote"]),
    ],
    faqTopics: ["Are prices listed on the menu?", "Can I customize an order?", "Do you publish allergen information?"],
    trustSignals: ["Transparent pricing", "Fresh ingredients", "Portion clarity"],
    testimonialPrompts: ["Favorite dish mentions", "Menu variety praise"],
    serviceHighlights: ["Appetizers", "Entrees", "Desserts and beverages"],
    contactStrategyPattern: "Place reservation CTA after menu browsing sections.",
  }),
  pageTemplate("reservations", {
    heroHeadlinePattern: "Reserve Your Table at {business}",
    heroSubheadlinePattern: "Book online in minutes for {audience}.",
    headlinePattern: "Table Reservations",
    subheadlinePattern: "Choose date, time, and party size with instant confirmation.",
    ctaFromJourneyStage: "conversion",
    sectionTemplates: [
      section("Booking Form", "Capture reservation details.", "Keep fields minimal: date, time, party size, and contact info.", ["BookingForm", "AvailabilityCalendar"]),
      section("Hours and Policies", "Set expectations before booking.", "List hours, cancellation policy, and large-party notes.", ["HoursTable", "PolicyNote"]),
    ],
    faqTopics: ["Can I modify a reservation?", "Do you accommodate large groups?", "What is the cancellation policy?"],
    trustSignals: ["Instant confirmation", "Clear policies", "Secure booking"],
    testimonialPrompts: ["Smooth booking experience quotes"],
    serviceHighlights: ["Online booking", "Group reservations", "Special occasion requests"],
    contactStrategyPattern: "Primary conversion page — use a single focused booking form above the fold.",
  }),
  pageTemplate("gallery", {
    heroHeadlinePattern: "See the {business} Experience",
    heroSubheadlinePattern: "Photos of dishes, ambiance, and guest moments.",
    headlinePattern: "Restaurant Gallery",
    subheadlinePattern: "Visual proof of the dining experience awaiting {audience}.",
    ctaFromJourneyStage: "awareness",
    sectionTemplates: [
      section("Food Photography", "Showcase plated dishes.", "Use high-quality images with descriptive alt text.", ["ImageGallery", "LightboxViewer"]),
      section("Ambiance", "Highlight dining room atmosphere.", "Include interior, bar, and patio photos where applicable.", ["AmbianceGrid"]),
    ],
    faqTopics: ["Can I use photos for event planning?", "Do you host photo-worthy events?"],
    trustSignals: ["Authentic photography", "Real guest moments"],
    testimonialPrompts: ["Visual experience compliments"],
    serviceHighlights: ["Plated dishes", "Ambiance", "Events and celebrations"],
    contactStrategyPattern: "Link gallery viewers to menu and reservations.",
  }),
  pageTemplate("about", {
    heroHeadlinePattern: "Our Story at {business}",
    heroSubheadlinePattern: "Passion for food and hospitality in {country}.",
    headlinePattern: "About {business}",
    subheadlinePattern: "Meet the team and values behind the menu.",
    ctaFromJourneyStage: "awareness",
    sectionTemplates: [
      section("Origin Story", "Share founding narrative.", "Explain why the restaurant exists and what guests can expect.", ["StorySection", "Timeline"]),
      section("Team", "Introduce chef and key staff.", "Use portraits and short bios to humanize the brand.", ["TeamProfiles"]),
    ],
    faqTopics: ["When did the restaurant open?", "Who leads the kitchen?"],
    trustSignals: ["Local ownership", "Culinary expertise"],
    testimonialPrompts: ["Community connection stories"],
    serviceHighlights: ["Local sourcing", "Hospitality culture", "Community involvement"],
    contactStrategyPattern: "Invite readers to explore the menu after the story.",
  }),
  pageTemplate("contact", {
    heroHeadlinePattern: "Contact {business}",
    heroSubheadlinePattern: "Questions, directions, and reservation support.",
    headlinePattern: "Get in Touch",
    subheadlinePattern: "Reach the team for reservations, events, and general inquiries.",
    ctaFromJourneyStage: "conversion",
    sectionTemplates: [
      section("Contact Details", "Provide phone, email, and address.", "Ensure NAP details match Google Business Profile.", ["ContactForm", "ClickToCall", "MapEmbed"]),
      section("Hours", "Display operating hours clearly.", "Include holiday hour exceptions when known.", ["HoursTable"]),
    ],
    faqTopics: ["What are your hours?", "Where can I park?", "Who handles event inquiries?"],
    trustSignals: ["Accurate NAP", "Prompt response promise"],
    testimonialPrompts: ["Responsive service feedback"],
    serviceHighlights: ["Phone support", "Event inquiries", "Directions"],
    contactStrategyPattern: "Offer click-to-call on mobile and a short contact form for async inquiries.",
  }),
];

const DENTIST_PAGE_TEMPLATES: readonly ContentPageTemplate[] = [
  pageTemplate("home", {
    heroHeadlinePattern: "Gentle Dental Care at {business}",
    heroSubheadlinePattern: "{valueProposition}",
    headlinePattern: "Trusted Dentistry for {audience}",
    subheadlinePattern: "Comfort-focused care in {country} with clear next steps.",
    ctaFromJourneyStage: "conversion",
    sectionTemplates: [
      section("Services Overview", "Introduce core treatments.", "Use plain language and avoid alarming clinical jargon.", ["ServiceCards", "ProcessSteps"]),
      section("Patient Comfort", "Reduce dental anxiety.", "Explain gentle approach, sedation options, and welcoming environment.", ["ComfortIcons", "FAQTeaser"]),
      section("Trust Proof", "Show credentials and reviews.", "Include certifications, affiliations, and review highlights.", ["CredentialStrip", "ReviewSummary"]),
    ],
    faqTopics: ["Are you accepting new patients?", "Do you treat children?", "What should I bring to my first visit?"],
    trustSignals: ["Licensed clinicians", "Patient reviews", "Clean modern office"],
    testimonialPrompts: ["Anxiety relief success stories", "Friendly staff mentions"],
    serviceHighlights: ["Preventive care", "Cosmetic dentistry", "Emergency visits"],
    contactStrategyPattern: "Prioritize appointment booking CTA with optional phone fallback.",
  }),
  pageTemplate("services", {
    heroHeadlinePattern: "Dental Services at {business}",
    heroSubheadlinePattern: "Treatment options explained for {audience}.",
    headlinePattern: "Comprehensive Dental Services",
    subheadlinePattern: "Understand treatments, benefits, and what to expect.",
    ctaFromJourneyStage: "consideration",
    sectionTemplates: [
      section("Treatment List", "Detail each service line.", "Describe outcomes, visit length, and recovery expectations.", ["ServiceGrid", "TreatmentCards"]),
      section("New Patients", "Guide first-time visitors.", "Outline intake, insurance verification, and first appointment flow.", ["IntakeChecklist"]),
    ],
    faqTopics: ["Do you offer cosmetic dentistry?", "How often should I schedule cleanings?", "Is sedation available?"],
    trustSignals: ["Clinical excellence", "Transparent explanations"],
    testimonialPrompts: ["Treatment outcome satisfaction quotes"],
    serviceHighlights: ["Cleanings", "Fillings and crowns", "Whitening"],
    contactStrategyPattern: "Link each service block to the booking page.",
  }),
  pageTemplate("meet-the-doctor", {
    heroHeadlinePattern: "Meet Your Dentist at {business}",
    heroSubheadlinePattern: "Credentials and care philosophy for {audience}.",
    headlinePattern: "Meet the Doctor",
    subheadlinePattern: "Build confidence through experience and approachable care.",
    ctaFromJourneyStage: "consideration",
    sectionTemplates: [
      section("Doctor Bio", "Present credentials and background.", "Include education, memberships, and years of experience.", ["ProfileHero", "CredentialList"]),
      section("Care Philosophy", "Explain patient-first approach.", "Emphasize comfort, communication, and conservative treatment.", ["QuoteBlock"]),
    ],
    faqTopics: ["Who will perform my treatment?", "Does the doctor pursue continuing education?"],
    trustSignals: ["Board credentials", "Professional memberships"],
    testimonialPrompts: ["Doctor bedside manner praise"],
    serviceHighlights: ["Personalized care plans", "Conservative treatment", "Clear communication"],
    contactStrategyPattern: "Encourage appointment booking after credibility sections.",
  }),
  pageTemplate("insurance", {
    heroHeadlinePattern: "Insurance and Payment at {business}",
    heroSubheadlinePattern: "Clear coverage guidance for {audience}.",
    headlinePattern: "Insurance and Billing",
    subheadlinePattern: "Understand accepted plans and payment options before your visit.",
    ctaFromJourneyStage: "consideration",
    sectionTemplates: [
      section("Accepted Plans", "List insurance partners.", "Keep list current and note verification process.", ["InsuranceLogos", "CoverageTable"]),
      section("Payment Options", "Explain financing and self-pay.", "Include payment methods and estimate request path.", ["PaymentTable"]),
    ],
    faqTopics: ["Do you verify benefits before visits?", "What if my plan is out of network?", "Do you offer payment plans?"],
    trustSignals: ["Transparent billing", "Benefit verification"],
    testimonialPrompts: ["Billing clarity feedback"],
    serviceHighlights: ["Insurance verification", "Flexible payment options"],
    contactStrategyPattern: "Offer booking CTA with note to bring insurance card to first visit.",
  }),
  pageTemplate("testimonials", {
    heroHeadlinePattern: "Patient Stories at {business}",
    heroSubheadlinePattern: "Real experiences from {audience}.",
    headlinePattern: "Patient Testimonials",
    subheadlinePattern: "Social proof that reinforces trust and comfort.",
    ctaFromJourneyStage: "consideration",
    sectionTemplates: [
      section("Review Highlights", "Feature top patient feedback.", "Mix short quotes with star ratings and source attribution.", ["ReviewCarousel", "VideoTestimonials"]),
    ],
    faqTopics: ["Where do reviews come from?", "Can I leave a review after my visit?"],
    trustSignals: ["Verified reviews", "Consistent satisfaction"],
    testimonialPrompts: ["Detailed patient journey quotes", "Staff kindness mentions"],
    serviceHighlights: ["Comfortable visits", "Clear explanations", "Friendly team"],
    contactStrategyPattern: "Convert satisfied readers with book appointment CTA.",
  }),
  pageTemplate("book-appointment", {
    heroHeadlinePattern: "Book Your Appointment at {business}",
    heroSubheadlinePattern: "Schedule care that fits {audience}.",
    headlinePattern: "Schedule a Dental Visit",
    subheadlinePattern: "Fast booking with new patient guidance included.",
    ctaFromJourneyStage: "conversion",
    sectionTemplates: [
      section("Appointment Form", "Capture visit intent.", "Collect reason for visit, preferred time, and contact details.", ["AppointmentForm", "CalendarPicker"]),
      section("New Patient Prep", "Reduce first-visit uncertainty.", "List what to bring, arrival time, and insurance info.", ["IntakeChecklist"]),
    ],
    faqTopics: ["How soon can I get an appointment?", "What forms should I complete beforehand?", "Do you send reminders?"],
    trustSignals: ["HIPAA-aware forms", "Confirmation messaging"],
    testimonialPrompts: ["Easy scheduling praise"],
    serviceHighlights: ["Online scheduling", "Reminder messages", "New patient welcome"],
    contactStrategyPattern: "Single-purpose conversion page with minimal distractions.",
  }),
];

const LAW_FIRM_PAGE_TEMPLATES: readonly ContentPageTemplate[] = [
  pageTemplate("home", {
    heroHeadlinePattern: "Trusted Legal Counsel at {business}",
    heroSubheadlinePattern: "{valueProposition}",
    headlinePattern: "Professional Legal Representation",
    subheadlinePattern: "Confident guidance for {audience} in {country}.",
    ctaFromJourneyStage: "conversion",
    sectionTemplates: [
      section("Practice Overview", "Summarize legal expertise.", "Lead with practice areas and client types served.", ["PracticeSummary", "OutcomeCards"]),
      section("Credibility", "Establish authority.", "Highlight credentials, bar admissions, and professional affiliations.", ["CredentialStrip", "CaseHighlights"]),
    ],
    faqTopics: ["How do consultations work?", "What areas of law do you handle?", "Are consultations confidential?"],
    trustSignals: ["Bar credentials", "Professional memberships", "Client confidentiality"],
    testimonialPrompts: ["Professionalism and clarity quotes"],
    serviceHighlights: ["Strategic counsel", "Responsive communication", "Compliance-aware advice"],
    contactStrategyPattern: "Drive confidential consultation requests with required disclaimers nearby.",
  }),
  pageTemplate("practice-areas", {
    heroHeadlinePattern: "Practice Areas at {business}",
    heroSubheadlinePattern: "Legal services tailored to {audience}.",
    headlinePattern: "Areas of Legal Practice",
    subheadlinePattern: "Explore services and typical client scenarios.",
    ctaFromJourneyStage: "consideration",
    sectionTemplates: [
      section("Practice List", "Detail each practice area.", "Explain who it helps, process overview, and expected timelines.", ["PracticeGrid", "ProcessTimeline"]),
    ],
    faqTopics: ["Which practice area fits my situation?", "Do you handle cases in {country}?"],
    trustSignals: ["Focused expertise", "Process transparency"],
    testimonialPrompts: ["Practice-specific client outcomes"],
    serviceHighlights: ["Business law", "Litigation support", "Advisory services"],
    contactStrategyPattern: "Link each practice area to consultation intake.",
  }),
  pageTemplate("attorneys", {
    heroHeadlinePattern: "Attorney Profiles at {business}",
    heroSubheadlinePattern: "Experience you can trust in {country}.",
    headlinePattern: "Attorney Profiles",
    subheadlinePattern: "Review credentials, focus areas, and professional background.",
    ctaFromJourneyStage: "consideration",
    sectionTemplates: [
      section("Attorney Bios", "Present individual profiles.", "Include bar admissions, education, and representative matters.", ["AttorneyGrid", "BioCards"]),
    ],
    faqTopics: ["Who will handle my matter?", "Can I choose a specific attorney?"],
    trustSignals: ["Verified credentials", "Professional track record"],
    testimonialPrompts: ["Attorney communication praise"],
    serviceHighlights: ["Senior counsel access", "Specialized expertise"],
    contactStrategyPattern: "Invite consultation requests after profile review.",
  }),
  pageTemplate("case-results", {
    heroHeadlinePattern: "Case Results at {business}",
    heroSubheadlinePattern: "Representative outcomes for {audience}.",
    headlinePattern: "Case Results and Outcomes",
    subheadlinePattern: "Illustrative results with required legal disclaimers.",
    ctaFromJourneyStage: "consideration",
    sectionTemplates: [
      section("Results Summary", "Showcase representative matters.", "Avoid guarantees; include disclaimers on every results block.", ["ResultsGrid", "DisclaimerBlock"]),
    ],
    faqTopics: ["Do results guarantee similar outcomes?", "How are cases selected for display?"],
    trustSignals: ["Required disclaimers", "Transparent presentation"],
    testimonialPrompts: ["Client satisfaction with outcomes"],
    serviceHighlights: ["Complex matter experience", "Negotiation strength"],
    contactStrategyPattern: "Pair results content with consultation CTA and disclaimer.",
  }),
  pageTemplate("consultation", {
    heroHeadlinePattern: "Request a Consultation at {business}",
    heroSubheadlinePattern: "Confidential intake for {audience}.",
    headlinePattern: "Schedule a Legal Consultation",
    subheadlinePattern: "Share your situation and receive clear next-step guidance.",
    ctaFromJourneyStage: "conversion",
    sectionTemplates: [
      section("Consultation Form", "Capture qualified intake.", "Collect matter type, urgency, and contact preferences securely.", ["IntakeForm", "ConfidentialityNotice"]),
      section("Next Steps", "Explain what happens after submission.", "Set response-time expectations and document requirements.", ["ProcessSteps"]),
    ],
    faqTopics: ["Is the consultation confidential?", "What should I prepare?", "Is there a consultation fee?"],
    trustSignals: ["Confidential intake", "Compliance notices"],
    testimonialPrompts: ["Clear guidance after consultation"],
    serviceHighlights: ["Confidential review", "Actionable next steps"],
    contactStrategyPattern: "Primary legal conversion page with privacy and disclaimer copy.",
  }),
  pageTemplate("blog", {
    heroHeadlinePattern: "Legal Insights from {business}",
    heroSubheadlinePattern: "Articles and updates for {audience}.",
    headlinePattern: "Legal Insights Blog",
    subheadlinePattern: "Thought leadership that supports informed decisions.",
    ctaFromJourneyStage: "awareness",
    sectionTemplates: [
      section("Featured Articles", "Highlight recent posts.", "Use clear titles, summaries, and compliance-safe language.", ["ArticleList", "CategoryNav"]),
      section("Newsletter", "Capture ongoing interest.", "Offer subscription for legal updates and firm news.", ["NewsletterSignup"]),
    ],
    faqTopics: ["How often is the blog updated?", "Does blog content constitute legal advice?"],
    trustSignals: ["Educational content", "Attorney-authored articles"],
    testimonialPrompts: ["Helpful educational content feedback"],
    serviceHighlights: ["Legal updates", "Client guidance", "Industry analysis"],
    contactStrategyPattern: "Cross-link articles to relevant practice areas and consultation.",
  }),
];

const GENERIC_PAGE_TEMPLATES: readonly ContentPageTemplate[] = [
  pageTemplate("home", {
    heroHeadlinePattern: "Welcome to {business}",
    heroSubheadlinePattern: "{valueProposition}",
    headlinePattern: "Professional {industry} Services",
    subheadlinePattern: "Trusted solutions for {audience} in {country}.",
    ctaFromJourneyStage: "conversion",
    sectionTemplates: [
      section("Services Overview", "Introduce core offerings.", "Focus on outcomes and why {audience} chooses {business}.", ["ServiceCards", "BenefitList"]),
      section("Why Choose Us", "Differentiate the business.", "Highlight experience, guarantees, and local presence.", ["TrustBadges", "StatsRow"]),
    ],
    faqTopics: ["What services do you offer?", "How do I get started?", "Do you serve {country}?"],
    trustSignals: ["Local reputation", "Professional team", "Clear pricing approach"],
    testimonialPrompts: ["Customer satisfaction quotes"],
    serviceHighlights: ["Core services", "Fast response", "Quality workmanship"],
    contactStrategyPattern: "Promote contact and quote CTAs in hero and mid-page sections.",
  }),
  pageTemplate("about", {
    heroHeadlinePattern: "About {business}",
    heroSubheadlinePattern: "The team serving {audience} in {country}.",
    headlinePattern: "About Our Company",
    subheadlinePattern: "Background, values, and commitment to quality service.",
    ctaFromJourneyStage: "awareness",
    sectionTemplates: [
      section("Company Story", "Share mission and history.", "Explain founding purpose and what clients can expect.", ["StorySection", "ValuesGrid"]),
      section("Team", "Introduce key team members.", "Use approachable bios with relevant credentials.", ["TeamProfiles"]),
    ],
    faqTopics: ["How long have you been in business?", "Who leads the team?"],
    trustSignals: ["Experienced team", "Community presence"],
    testimonialPrompts: ["Long-term client relationships"],
    serviceHighlights: ["Local expertise", "Reliable service"],
    contactStrategyPattern: "Guide readers to services and contact after the story.",
  }),
  pageTemplate("services", {
    heroHeadlinePattern: "Services at {business}",
    heroSubheadlinePattern: "Solutions built for {audience}.",
    headlinePattern: "Our Services",
    subheadlinePattern: "Detailed offerings with clear benefits and process.",
    ctaFromJourneyStage: "consideration",
    sectionTemplates: [
      section("Service Details", "Explain each service line.", "Use benefit-led copy with process and timeline notes.", ["ServiceGrid", "ProcessSteps"]),
    ],
    faqTopics: ["Which service fits my needs?", "How quickly can you start?", "Do you offer estimates?"],
    trustSignals: ["Transparent scope", "Proven process"],
    testimonialPrompts: ["Service quality feedback"],
    serviceHighlights: ["Primary services", "Add-on options", "Maintenance plans"],
    contactStrategyPattern: "Add quote or contact CTA after each major service block.",
  }),
  pageTemplate("testimonials", {
    heroHeadlinePattern: "Customer Reviews for {business}",
    heroSubheadlinePattern: "Feedback from {audience}.",
    headlinePattern: "Client Testimonials",
    subheadlinePattern: "Proof that reinforces trust and purchase confidence.",
    ctaFromJourneyStage: "consideration",
    sectionTemplates: [
      section("Review Showcase", "Present customer quotes.", "Include names, locations, and project type when available.", ["ReviewCarousel", "QuoteCards"]),
    ],
    faqTopics: ["Can I read reviews on third-party sites?", "Can I submit a testimonial?"],
    trustSignals: ["Verified feedback", "Consistent quality"],
    testimonialPrompts: ["Project outcome quotes", "Communication praise"],
    serviceHighlights: ["On-time delivery", "Professional team"],
    contactStrategyPattern: "Follow testimonials with contact or quote CTA.",
  }),
  pageTemplate("contact", {
    heroHeadlinePattern: "Contact {business}",
    heroSubheadlinePattern: "We respond quickly to {audience}.",
    headlinePattern: "Contact Us",
    subheadlinePattern: "Reach out for quotes, questions, and project requests.",
    ctaFromJourneyStage: "conversion",
    sectionTemplates: [
      section("Contact Form", "Capture inquiries.", "Use labeled fields and set response-time expectations.", ["ContactForm", "ClickToCall"]),
      section("Service Area", "Clarify coverage.", "State regions served within {country}.", ["MapEmbed", "ServiceAreaList"]),
    ],
    faqTopics: ["What are your business hours?", "How fast will I hear back?", "Do you offer emergency service?"],
    trustSignals: ["Prompt follow-up", "Clear contact paths"],
    testimonialPrompts: ["Responsive support mentions"],
    serviceHighlights: ["Phone support", "Email inquiries", "On-site visits"],
    contactStrategyPattern: "Primary lead capture page with short form and click-to-call.",
  }),
  pageTemplate("quote-request", {
    heroHeadlinePattern: "Request a Quote from {business}",
    heroSubheadlinePattern: "Tell us about your project, {audience}.",
    headlinePattern: "Get a Free Quote",
    subheadlinePattern: "Structured intake for accurate estimates and fast follow-up.",
    ctaFromJourneyStage: "conversion",
    sectionTemplates: [
      section("Quote Form", "Qualify project details.", "Collect scope, timeline, budget range, and contact info.", ["QuoteForm", "ServiceSelector"]),
    ],
    faqTopics: ["How long until I receive a quote?", "Is the quote obligation-free?", "What details help you estimate accurately?"],
    trustSignals: ["No-obligation quote", "Clear timeline"],
    testimonialPrompts: ["Accurate estimate feedback"],
    serviceHighlights: ["Fast estimates", "Transparent pricing"],
    contactStrategyPattern: "Dedicated quote conversion flow with confirmation message.",
  }),
];

export const RESTAURANT_CONTENT_STRATEGY: ContentStrategyRule = {
  industryIds: ["restaurant"],
  contentFocus: "menu-focused dining content",
  pageTemplates: RESTAURANT_PAGE_TEMPLATES,
};

export const DENTIST_CONTENT_STRATEGY: ContentStrategyRule = {
  industryIds: ["dentist", "dental"],
  contentFocus: "trust and appointment-focused dental content",
  pageTemplates: DENTIST_PAGE_TEMPLATES,
};

export const LAW_FIRM_CONTENT_STRATEGY: ContentStrategyRule = {
  industryIds: ["law-firm"],
  contentFocus: "authority and consultation-focused legal content",
  pageTemplates: LAW_FIRM_PAGE_TEMPLATES,
};

export const GENERIC_CONTENT_STRATEGY: ContentStrategyRule = {
  industryIds: ["default"],
  contentFocus: "generic business service content",
  pageTemplates: GENERIC_PAGE_TEMPLATES,
};

const CONTENT_STRATEGIES: readonly ContentStrategyRule[] = [
  RESTAURANT_CONTENT_STRATEGY,
  DENTIST_CONTENT_STRATEGY,
  LAW_FIRM_CONTENT_STRATEGY,
];

/** Resolves the content strategy rule for a normalized industry id. */
export function resolveContentStrategy(industryId: string): ContentStrategyRule {
  const normalized = industryId.toLowerCase().trim();

  for (const strategy of CONTENT_STRATEGIES) {
    if (strategy.industryIds.includes(normalized)) {
      return strategy;
    }
  }

  return GENERIC_CONTENT_STRATEGY;
}

/** Finds a page template by slug within a content strategy. */
export function findContentPageTemplate(
  strategy: ContentStrategyRule,
  slug: string,
): ContentPageTemplate | undefined {
  return strategy.pageTemplates.find((template) => template.slug === slug);
}
