import type { UserJourneyStageName } from "../types/UserJourney";

/** Rule definition for a single journey stage within an industry strategy. */
export interface JourneyStageRule {
  stageName: UserJourneyStageName;
  userGoal: string;
  recommendedPages: readonly string[];
  recommendedCTA: string;
  recommendedContent: readonly string[];
  trustSignals: readonly string[];
  nextStage: UserJourneyStageName | null;
}

/** Industry-specific four-stage journey strategy. */
export interface JourneyStrategyRule {
  industryIds: readonly string[];
  stages: readonly [
    JourneyStageRule,
    JourneyStageRule,
    JourneyStageRule,
    JourneyStageRule,
  ];
}

export const RESTAURANT_JOURNEY_STRATEGY: JourneyStrategyRule = {
  industryIds: ["restaurant"],
  stages: [
    {
      stageName: "awareness",
      userGoal: "Discover the restaurant, atmosphere, and menu highlights",
      recommendedPages: ["Home", "Menu Preview", "Gallery", "Google Reviews"],
      recommendedCTA: "View Menu",
      recommendedContent: [
        "Hero dining photography",
        "Featured dishes and chef specials",
        "Google review highlights",
        "Neighborhood and hours overview",
      ],
      trustSignals: ["Google Reviews", "Food photography", "Local reputation"],
      nextStage: "consideration",
    },
    {
      stageName: "consideration",
      userGoal: "Compare menu options, pricing, and visit logistics",
      recommendedPages: ["Menu", "Pricing", "Location", "Reservations"],
      recommendedCTA: "Reserve a Table",
      recommendedContent: [
        "Full menu with dietary options",
        "Pricing and specials",
        "Location map and parking",
        "Reservation availability",
      ],
      trustSignals: ["Transparent pricing", "Location details", "Reservation policy"],
      nextStage: "conversion",
    },
    {
      stageName: "conversion",
      userGoal: "Complete a reservation or direct booking",
      recommendedPages: ["Reservation", "Contact", "Phone"],
      recommendedCTA: "Book Now",
      recommendedContent: [
        "Online reservation form",
        "Contact details and hours",
        "Click-to-call phone number",
      ],
      trustSignals: ["Confirmation messaging", "Clear contact options"],
      nextStage: "retention",
    },
    {
      stageName: "retention",
      userGoal: "Return for repeat visits and stay engaged with the brand",
      recommendedPages: ["Loyalty", "Events", "Newsletter", "Google Review"],
      recommendedCTA: "Join Loyalty Program",
      recommendedContent: [
        "Loyalty program benefits",
        "Upcoming events and specials",
        "Email newsletter signup",
        "Review request after visit",
      ],
      trustSignals: ["Loyalty rewards", "Event calendar", "Community engagement"],
      nextStage: null,
    },
  ],
};

export const DENTIST_JOURNEY_STRATEGY: JourneyStrategyRule = {
  industryIds: ["dentist", "dental"],
  stages: [
    {
      stageName: "awareness",
      userGoal: "Learn about the practice, services, and clinical team",
      recommendedPages: ["Home", "Services", "Meet the Doctor"],
      recommendedCTA: "Explore Services",
      recommendedContent: [
        "Practice introduction and values",
        "Core dental services overview",
        "Doctor credentials and approach",
      ],
      trustSignals: ["Professional credentials", "Calm clinical imagery", "Service clarity"],
      nextStage: "consideration",
    },
    {
      stageName: "consideration",
      userGoal: "Evaluate care quality, insurance coverage, and patient outcomes",
      recommendedPages: ["Services", "Insurance", "Testimonials"],
      recommendedCTA: "View Insurance Options",
      recommendedContent: [
        "Detailed service descriptions",
        "Insurance and payment information",
        "Patient testimonials and reviews",
      ],
      trustSignals: ["Insurance acceptance", "Patient testimonials", "Before-and-after proof"],
      nextStage: "conversion",
    },
    {
      stageName: "conversion",
      userGoal: "Schedule a dental appointment with confidence",
      recommendedPages: ["Book Appointment", "Contact"],
      recommendedCTA: "Book Appointment",
      recommendedContent: [
        "Online appointment booking",
        "New patient intake information",
        "Contact and office hours",
      ],
      trustSignals: ["Easy booking flow", "New patient welcome", "HIPAA-aware messaging"],
      nextStage: "retention",
    },
    {
      stageName: "retention",
      userGoal: "Maintain oral health and stay connected with the practice",
      recommendedPages: ["Testimonials", "Newsletter", "Google Review"],
      recommendedCTA: "Leave a Review",
      recommendedContent: [
        "Recall and hygiene reminders",
        "Oral health tips newsletter",
        "Post-visit review request",
      ],
      trustSignals: ["Ongoing care reminders", "Patient satisfaction", "Educational content"],
      nextStage: null,
    },
  ],
};

export const LAW_FIRM_JOURNEY_STRATEGY: JourneyStrategyRule = {
  industryIds: ["law-firm"],
  stages: [
    {
      stageName: "awareness",
      userGoal: "Understand practice areas and legal expertise",
      recommendedPages: ["Home", "Practice Areas"],
      recommendedCTA: "Explore Practice Areas",
      recommendedContent: [
        "Firm overview and mission",
        "Practice area summaries",
        "Compliance-aware positioning",
      ],
      trustSignals: ["Bar credentials", "Practice area clarity", "Professional tone"],
      nextStage: "consideration",
    },
    {
      stageName: "consideration",
      userGoal: "Evaluate attorney expertise and proven case outcomes",
      recommendedPages: ["Attorney Profiles", "Case Results"],
      recommendedCTA: "View Case Results",
      recommendedContent: [
        "Attorney biographies and experience",
        "Case results and outcomes",
        "Client success narratives",
      ],
      trustSignals: ["Attorney profiles", "Case results", "Professional endorsements"],
      nextStage: "conversion",
    },
    {
      stageName: "conversion",
      userGoal: "Request a confidential legal consultation",
      recommendedPages: ["Free Consultation", "Contact"],
      recommendedCTA: "Schedule a Consultation",
      recommendedContent: [
        "Free consultation intake form",
        "Confidentiality and disclaimer notes",
        "Contact and office locations",
      ],
      trustSignals: ["Confidential intake", "Required disclaimers", "Clear next steps"],
      nextStage: "retention",
    },
    {
      stageName: "retention",
      userGoal: "Stay informed and refer others to the firm",
      recommendedPages: ["Case Results", "Newsletter", "Client Testimonials"],
      recommendedCTA: "Subscribe to Legal Insights",
      recommendedContent: [
        "Legal insights and updates",
        "Newsletter for business clients",
        "Client testimonial highlights",
      ],
      trustSignals: ["Thought leadership", "Client testimonials", "Ongoing communication"],
      nextStage: null,
    },
  ],
};

export const GENERIC_JOURNEY_STRATEGY: JourneyStrategyRule = {
  industryIds: ["default"],
  stages: [
    {
      stageName: "awareness",
      userGoal: "Discover the business, services, and value proposition",
      recommendedPages: ["Home", "About", "Services"],
      recommendedCTA: "Learn More",
      recommendedContent: [
        "Business overview and differentiators",
        "Core services summary",
        "Local credibility signals",
      ],
      trustSignals: ["Clear value proposition", "Professional presentation", "Local presence"],
      nextStage: "consideration",
    },
    {
      stageName: "consideration",
      userGoal: "Compare services, proof points, and fit for their needs",
      recommendedPages: ["Services", "Testimonials", "FAQ"],
      recommendedCTA: "View Services",
      recommendedContent: [
        "Detailed service descriptions",
        "Customer testimonials",
        "Frequently asked questions",
      ],
      trustSignals: ["Social proof", "Transparent FAQs", "Service outcomes"],
      nextStage: "conversion",
    },
    {
      stageName: "conversion",
      userGoal: "Take action and contact the business",
      recommendedPages: ["Contact", "Quote Request"],
      recommendedCTA: "Contact Us Today",
      recommendedContent: [
        "Contact form and phone number",
        "Quote or inquiry request flow",
        "Response time expectations",
      ],
      trustSignals: ["Clear contact path", "Privacy reassurance", "Prompt follow-up promise"],
      nextStage: "retention",
    },
    {
      stageName: "retention",
      userGoal: "Stay engaged and recommend the business to others",
      recommendedPages: ["Newsletter", "Reviews", "Support"],
      recommendedCTA: "Subscribe for Updates",
      recommendedContent: [
        "Email newsletter signup",
        "Review and referral prompts",
        "Customer support resources",
      ],
      trustSignals: ["Ongoing communication", "Customer satisfaction", "Support availability"],
      nextStage: null,
    },
  ],
};

const JOURNEY_STRATEGIES: readonly JourneyStrategyRule[] = [
  RESTAURANT_JOURNEY_STRATEGY,
  DENTIST_JOURNEY_STRATEGY,
  LAW_FIRM_JOURNEY_STRATEGY,
];

/** Resolves the journey strategy rule for a normalized industry id. */
export function resolveJourneyStrategy(industryId: string): JourneyStrategyRule {
  const normalized = industryId.toLowerCase().trim();

  for (const strategy of JOURNEY_STRATEGIES) {
    if (strategy.industryIds.includes(normalized)) {
      return strategy;
    }
  }

  return GENERIC_JOURNEY_STRATEGY;
}
