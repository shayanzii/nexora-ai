import type { IndustryProfile } from "../types";

export const DENTIST_PROFILE: IndustryProfile = {
  id: "dentist",
  name: "Dental Practice",
  regulated: true,
  commonBusinessGoals: [
    "Reduce front desk call volume",
    "Book more new patient appointments",
    "Decrease appointment no-show rates",
    "Answer patient questions after hours",
  ],
  commonCustomerProblems: [
    "Front desk overwhelmed with scheduling calls during peak hours",
    "After-hours inquiries go unanswered, losing new patient opportunities",
    "Manual appointment reminders contribute to no-show rates",
    "Patients repeat the same FAQ about hours, insurance, and services",
  ],
  commonAutomationOpportunities: [
    "Online appointment booking with calendar sync",
    "Automated appointment reminders via SMS or email",
    "AI chatbot for FAQ and insurance pre-qualification",
    "After-hours lead capture for new patient inquiries",
  ],
  recommendedAiServices: ["ai-chatbot", "workflow-automation", "crm-integration"],
  websiteRecommendations: [
    "Prominent online booking call-to-action on every page",
    "New patient intake form with automated follow-up",
    "Service pages optimized for local SEO",
    "Mobile-first design for patients searching on phones",
  ],
  socialMediaRecommendations: [
    "Share patient education content and oral health tips",
    "Promote same-day emergency appointment availability",
    "Use Instagram for before/after case highlights",
    "Respond to DMs with automated initial replies",
  ],
  kpis: [
    "New patient bookings per month",
    "Front desk call volume reduction",
    "Appointment no-show rate",
    "After-hours inquiry response rate",
  ],
};

export const HVAC_PROFILE: IndustryProfile = {
  id: "hvac",
  name: "HVAC Services",
  regulated: false,
  commonBusinessGoals: [
    "Capture emergency leads 24/7",
    "Book more service and maintenance calls",
    "Reduce missed calls during peak season",
    "Improve lead-to-job conversion speed",
  ],
  commonCustomerProblems: [
    "Emergency calls missed outside business hours during peak seasons",
    "Slow follow-up on service requests allows competitors to win the job",
    "Manual scheduling creates delays for maintenance and installation bookings",
    "Dispatch coordination relies on phone tag between office and field techs",
  ],
  commonAutomationOpportunities: [
    "AI voice agent for after-hours emergency call handling",
    "Automated appointment booking for maintenance visits",
    "Lead capture and qualification from website visitors",
    "CRM-triggered follow-up sequences for open estimates",
  ],
  recommendedAiServices: ["ai-voice-agent", "ai-chatbot", "workflow-automation", "crm-integration"],
  websiteRecommendations: [
    "Emergency service banner with click-to-call and chat",
    "Service area map with local landing pages",
    "Online booking for non-emergency maintenance",
    "Customer review and trust signal sections",
  ],
  socialMediaRecommendations: [
    "Seasonal maintenance reminder campaigns",
    "Before/after installation showcases",
    "Educational content on energy efficiency",
    "Promote limited-time tune-up specials",
  ],
  kpis: [
    "Emergency call answer rate",
    "Lead-to-booking conversion time",
    "Maintenance appointments booked online",
    "Revenue from after-hours captured leads",
  ],
};

export const PLUMBING_PROFILE: IndustryProfile = {
  id: "plumbing",
  name: "Plumbing Services",
  regulated: false,
  commonBusinessGoals: [
    "Answer urgent calls instantly",
    "Capture leads from website after hours",
    "Reduce dispatch coordination overhead",
    "Book more service appointments without extra staff",
  ],
  commonCustomerProblems: [
    "Urgent calls go to voicemail when technicians are on active jobs",
    "Leads from website visits are not captured after hours",
    "Dispatch coordination relies on manual phone tag",
    "Customers abandon calls when hold times exceed two minutes",
  ],
  commonAutomationOpportunities: [
    "AI receptionist for urgent call triage and booking",
    "Website chatbot for immediate customer engagement",
    "Automated booking for non-emergency service windows",
    "Lead routing to available technicians by service area",
  ],
  recommendedAiServices: ["ai-voice-agent", "ai-chatbot", "workflow-automation"],
  websiteRecommendations: [
    "Emergency plumbing CTA above the fold",
    "Service area and response time expectations",
    "Online booking for standard service calls",
    "Trust badges, licensing, and insurance display",
  ],
  socialMediaRecommendations: [
    "Share preventative maintenance tips",
    "Highlight 24/7 emergency availability",
    "Customer testimonial video snippets",
    "Seasonal promotions for water heater and drain services",
  ],
  kpis: [
    "Emergency call capture rate",
    "Average response time to new leads",
    "Jobs booked without phone tag",
    "After-hours lead conversion rate",
  ],
};

export const LAW_FIRM_PROFILE: IndustryProfile = {
  id: "law-firm",
  name: "Law Firm",
  regulated: true,
  commonBusinessGoals: [
    "Qualify intake leads faster",
    "Schedule consultations automatically",
    "Reduce intake staff workload",
    "Improve client response time without sacrificing compliance",
  ],
  commonCustomerProblems: [
    "Potential clients expect immediate responses to intake inquiries",
    "Consultation scheduling requires multiple back-and-forth calls",
    "Compliance requirements demand careful handling of client data",
    "After-hours inquiries go to voicemail and prospects hire competitors",
  ],
  commonAutomationOpportunities: [
    "Secure intake chatbot with practice-area qualification",
    "Automated consultation booking with conflict checks",
    "CRM integration for matter intake tracking",
    "Follow-up sequences for incomplete intake forms",
  ],
  recommendedAiServices: ["ai-chatbot", "workflow-automation", "crm-integration", "business-website"],
  websiteRecommendations: [
    "Practice area pages with clear intake CTAs",
    "Secure client intake forms with encryption",
    "Attorney bio pages optimized for local search",
    "Compliance-friendly privacy and disclaimer sections",
  ],
  socialMediaRecommendations: [
    "Share legal education content for target client segments",
    "Highlight case results within advertising compliance rules",
    "LinkedIn thought leadership from senior partners",
    "Avoid direct legal advice in automated social responses",
  ],
  kpis: [
    "Intake lead response time",
    "Consultation booking rate",
    "Qualified lead-to-retainer conversion",
    "Intake form completion rate",
  ],
};

export const RESTAURANT_PROFILE: IndustryProfile = {
  id: "restaurant",
  name: "Restaurant",
  regulated: false,
  commonBusinessGoals: [
    "Handle reservation inquiries without pulling staff off the floor",
    "Capture catering leads after hours",
    "Answer menu and hours questions automatically",
    "Reduce phone volume during service rush",
  ],
  commonCustomerProblems: [
    "Staff cannot answer phones during dinner rush periods",
    "Catering and reservation inquiries lost outside operating hours",
    "Repeat questions about hours, menu, and policies consume staff time",
    "Online reservation no-shows due to lack of automated reminders",
  ],
  commonAutomationOpportunities: [
    "AI chatbot for reservations, hours, and menu FAQs",
    "Automated catering inquiry capture and qualification",
    "Booking reminders to reduce no-shows",
    "Social media DM auto-responses with handoff to staff",
  ],
  recommendedAiServices: ["ai-chatbot", "workflow-automation", "social-media-management"],
  websiteRecommendations: [
    "Online reservation widget integrated with POS",
    "Catering inquiry form with event detail capture",
    "Mobile-optimized menu with dietary filter tags",
    "Google Business Profile integration for hours and bookings",
  ],
  socialMediaRecommendations: [
    "Daily specials and event promotion posts",
    "Instagram food photography with reservation links",
    "Respond to reviews within 24 hours",
    "Promote catering packages for corporate and private events",
  ],
  kpis: [
    "Reservations booked online",
    "Catering leads captured per month",
    "Phone call volume during peak service hours",
    "Reservation no-show rate",
  ],
};

export const INDUSTRY_PROFILES: IndustryProfile[] = [
  DENTIST_PROFILE,
  HVAC_PROFILE,
  PLUMBING_PROFILE,
  LAW_FIRM_PROFILE,
  RESTAURANT_PROFILE,
];

export const INDUSTRY_ALIASES: Record<string, string> = {
  dental: "dentist",
  dentist: "dentist",
  dentistry: "dentist",
  hvac: "hvac",
  heating: "hvac",
  plumbing: "plumbing",
  plumber: "plumbing",
  legal: "law-firm",
  "law firm": "law-firm",
  law: "law-firm",
  lawyer: "law-firm",
  restaurant: "restaurant",
  food: "restaurant",
  hospitality: "restaurant",
};
