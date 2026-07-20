import type { PortfolioProject } from "./types";

export const PORTFOLIO_SLUGS = [
  "restaurant-ai-chatbot",
  "dental-clinic-appointment-assistant",
  "real-estate-lead-automation",
  "hvac-customer-support-ai",
  "law-firm-ai-receptionist",
  "ecommerce-ai-sales-assistant",
] as const;

export type PortfolioSlug = (typeof PORTFOLIO_SLUGS)[number];

export function isPortfolioSlug(value: string): value is PortfolioSlug {
  return (PORTFOLIO_SLUGS as readonly string[]).includes(value);
}

export const portfolioProjects: Record<PortfolioSlug, PortfolioProject> = {
  "restaurant-ai-chatbot": {
    slug: "restaurant-ai-chatbot",
    title: "Restaurant AI Chatbot",
    metaDescription:
      "How Nexora AI helped a multi-location restaurant group automate reservations, menu questions, and catering inquiries with a branded chatbot.",
    industry: "Hospitality & Food Service",
    summary:
      "A conversational assistant that handles reservations, dietary questions, and catering leads across 8 locations—24/7.",
    heroAccent: "Reservations · Menu · Catering",
    before: "Staff missed calls during dinner rush. Catering leads went unanswered overnight.",
    after: "Guests get instant answers 24/7. Catering inquiries are captured and qualified automatically.",
    challenge:
      "The client received hundreds of repetitive website and social messages daily about hours, allergens, and table availability. Staff answered the same questions during peak service, leading to missed calls, slow responses, and lost catering revenue.",
    solution:
      "Nexora built a branded AI chatbot trained on menus, allergen data, and location-specific hours. It qualifies catering requests, checks reservation availability via their booking API, and escalates VIP or complex requests to managers with full conversation context.",
    technologies: ["OpenAI GPT-4o", "Next.js", "Supabase", "Twilio SMS", "OpenTable API", "Vercel"],
    results: [
      { value: "68%", label: "Reduction in phone inquiries" },
      { value: "41%", label: "More catering leads captured" },
      { value: "<30s", label: "Average first response time" },
      { value: "4.8/5", label: "Guest satisfaction score" },
    ],
    isIllustrative: true,
  },

  "dental-clinic-appointment-assistant": {
    slug: "dental-clinic-appointment-assistant",
    title: "Dental Clinic Appointment Assistant",
    metaDescription:
      "AI appointment assistant for a dental clinic network—scheduling, insurance FAQs, and patient reminders delivered by Nexora AI.",
    industry: "Healthcare · Dental",
    summary:
      "An AI assistant that books cleanings, answers insurance FAQs, and sends smart reminders—reducing no-shows and front-desk load.",
    heroAccent: "Scheduling · Reminders · Patient FAQ",
    before: "Front desk spent 3+ hours daily on scheduling calls. 18% no-show rate.",
    after: "Patients book online anytime. Reminders cut no-shows and freed up staff.",
    challenge:
      "Front-desk staff spent 3+ hours daily on scheduling calls and insurance questions. After-hours voicemails piled up, and no-show rates hovered around 18%, costing the practice empty chair time each week.",
    solution:
      "We deployed a HIPAA-aware appointment assistant integrated with their practice management system. Patients book, reschedule, or cancel via chat and SMS. The bot answers common insurance and prep questions, sends automated reminders, and routes urgent pain cases to on-call staff.",
    technologies: ["OpenAI GPT-4o", "Next.js", "Twilio", "Google Calendar", "Supabase", "Zapier"],
    results: [
      { value: "52%", label: "Fewer scheduling calls" },
      { value: "23%", label: "Drop in no-show rate" },
      { value: "2.1×", label: "After-hours bookings" },
      { value: "89%", label: "Patient query resolution" },
    ],
    isIllustrative: true,
  },

  "real-estate-lead-automation": {
    slug: "real-estate-lead-automation",
    title: "Real Estate Lead Automation",
    metaDescription:
      "Nexora AI built lead qualification and follow-up automation for a regional real estate brokerage—faster response, higher conversion.",
    industry: "Real Estate",
    summary:
      "Instant lead qualification, property matching, and automated follow-up sequences for a 40-agent brokerage.",
    heroAccent: "Lead Qual · Property Match · Follow-up",
    before: "Leads waited 47 minutes for a response. Hot prospects went cold before agents called back.",
    after: "Leads are engaged in seconds, qualified, and routed to the right agent with full context.",
    challenge:
      "Online leads from Zillow and the brokerage site waited an average of 47 minutes for a response. Agents manually triaged budget, timeline, and neighborhood preferences, and many hot leads went cold before first contact.",
    solution:
      "Nexora implemented an AI lead router that engages visitors within seconds, captures budget, timeline, and preferred areas, matches listings from their MLS feed, and assigns qualified leads to the right agent with a full summary in CRM. Automated nurture sequences re-engage stalled prospects.",
    technologies: ["OpenAI GPT-4o", "HubSpot CRM", "Next.js", "Make.com", "MLS RETS API", "SendGrid"],
    results: [
      { value: "3.2×", label: "Faster lead response" },
      { value: "34%", label: "Increase in qualified showings" },
      { value: "27%", label: "Higher lead-to-client conversion" },
      { value: "12hrs", label: "Agent time saved weekly" },
    ],
    isIllustrative: true,
  },

  "hvac-customer-support-ai": {
    slug: "hvac-customer-support-ai",
    title: "HVAC Customer Support AI",
    metaDescription:
      "AI-powered customer support for an HVAC company—triage, dispatch routing, and seasonal surge handling by Nexora AI.",
    industry: "Home Services · HVAC",
    summary:
      "Support AI that triages service requests, routes emergencies, and deflects seasonal FAQ volume during peak summer demand.",
    heroAccent: "Triage · Dispatch · Seasonal Surge",
    before: "300% call spikes in summer. 20+ minute hold times. Emergency jobs delayed.",
    after: "AI triages urgency instantly and dispatches the right crew—routine jobs scheduled automatically.",
    challenge:
      "During heat waves, call volume spiked 300% and hold times exceeded 20 minutes. Customers couldn't distinguish emergency vs. routine service, and dispatchers manually logged every ticket—creating delays and frustrated homeowners.",
    solution:
      "Nexora built a support layer combining chat, SMS, and voice handoff. The AI classifies urgency, collects equipment details and address, creates tickets in ServiceTitan, and dispatches emergency jobs immediately while scheduling routine maintenance in open slots.",
    technologies: ["OpenAI GPT-4o", "ServiceTitan API", "Twilio Voice", "Next.js", "Supabase", "Slack Alerts"],
    results: [
      { value: "61%", label: "Tickets auto-triaged" },
      { value: "74%", label: "Faster emergency dispatch" },
      { value: "45%", label: "Reduction in hold times" },
      { value: "$18k", label: "Monthly ops savings (est.)" },
    ],
    isIllustrative: true,
  },

  "law-firm-ai-receptionist": {
    slug: "law-firm-ai-receptionist",
    title: "Law Firm AI Receptionist",
    metaDescription:
      "AI receptionist for a personal injury law firm—intake screening, appointment booking, and after-hours lead capture by Nexora AI.",
    industry: "Legal · Personal Injury",
    summary:
      "A professional AI receptionist that screens intakes, books consultations, and captures after-hours leads with compliance guardrails.",
    heroAccent: "Intake · Screening · After-hours",
    before: "After-hours calls went to voicemail. Intake was slow and inconsistent.",
    after: "Every caller gets professional intake 24/7. Consultations booked with complete case summaries.",
    challenge:
      "The firm missed after-hours calls from potential clients and paralegals spent hours on initial intake screening. Inconsistent questioning led to incomplete case files and delayed follow-ups on high-value claims.",
    solution:
      "Nexora deployed a voice and chat receptionist with attorney-approved intake scripts. It collects incident details, checks practice-area fit, schedules consultations in Clio, and flags urgent cases for immediate callback—never providing legal advice, only structured intake.",
    technologies: ["OpenAI GPT-4o", "Twilio Voice", "Clio Manage", "Next.js", "Supabase", "Calendly"],
    results: [
      { value: "38%", label: "More consultations booked" },
      { value: "100%", label: "After-hours lead capture" },
      { value: "55%", label: "Less paralegal intake time" },
      { value: "96%", label: "Intake script compliance" },
    ],
    isIllustrative: true,
  },

  "ecommerce-ai-sales-assistant": {
    slug: "ecommerce-ai-sales-assistant",
    title: "E-commerce AI Sales Assistant",
    metaDescription:
      "AI sales assistant for a DTC skincare brand—product recommendations, cart recovery, and support in one experience by Nexora AI.",
    industry: "E-commerce · DTC Beauty",
    summary:
      "A shopping assistant that recommends products, answers ingredient questions, and recovers abandoned carts with personalized outreach.",
    heroAccent: "Recommend · Recover · Convert",
    before: "72% cart abandonment. Pre-purchase questions went unanswered.",
    after: "Shoppers get instant product guidance. Personalized follow-ups recover lost sales.",
    challenge:
      "The brand's support team couldn't keep up with pre-purchase questions about ingredients and routines. Cart abandonment sat at 72%, and generic email flows failed to re-engage shoppers who left with specific skin concerns unanswered.",
    solution:
      "Nexora integrated an AI sales assistant on product and checkout pages. It asks about skin type, recommends bundles from their catalog, answers ingredient and shipping questions, and triggers personalized SMS follow-ups for abandoned carts with tailored product suggestions.",
    technologies: ["OpenAI GPT-4o", "Shopify", "Klaviyo", "Next.js", "Supabase", "Twilio SMS"],
    results: [
      { value: "19%", label: "Lift in conversion rate" },
      { value: "31%", label: "Cart recovery rate" },
      { value: "2.4×", label: "Average order value (assisted)" },
      { value: "64%", label: "Pre-purchase questions resolved" },
    ],
    isIllustrative: true,
  },
};

export function getPortfolioProject(slug: string): PortfolioProject | undefined {
  if (!isPortfolioSlug(slug)) return undefined;
  return portfolioProjects[slug];
}

export const allPortfolioList = PORTFOLIO_SLUGS.map((slug) => {
  const project = portfolioProjects[slug];
  return {
    slug,
    title: project.title,
    industry: project.industry,
    summary: project.summary,
    heroAccent: project.heroAccent,
    before: project.before,
    after: project.after,
  };
});
