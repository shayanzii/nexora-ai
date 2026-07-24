import type { Playbook } from "../types";

export const HVAC_LEAD_GENERATION: Playbook = {
  id: "hvac-lead-generation",
  industryId: "hvac",
  name: "HVAC Lead Generation",
  objective: "Capture and qualify leads 24/7, especially during peak heating and cooling seasons.",
  recommendedServices: ["ai-voice-agent", "ai-chatbot", "workflow-automation", "crm-integration"],
  steps: [
    "Deploy AI voice agent for after-hours and overflow call handling",
    "Add website chatbot for instant quote and service inquiries",
    "Configure lead capture forms with service area validation",
    "Integrate CRM for automatic lead routing and follow-up sequences",
    "Track lead response time and conversion by channel",
  ],
  kpis: [
    "After-hours lead capture rate",
    "Lead-to-booking conversion time",
    "Cost per qualified lead",
    "Emergency call answer rate",
  ],
};

export const DENTAL_APPOINTMENT_BOOKING: Playbook = {
  id: "dental-appointment-booking",
  industryId: "dentist",
  name: "Dental Appointment Booking",
  objective: "Reduce front desk call volume and increase online appointment bookings.",
  recommendedServices: ["ai-chatbot", "workflow-automation", "crm-integration"],
  steps: [
    "Enable online booking with real-time calendar sync",
    "Deploy chatbot for FAQ, insurance, and new patient inquiries",
    "Configure automated appointment reminders",
    "Set up no-show follow-up sequences",
    "Monitor booking source and no-show rate weekly",
  ],
  kpis: [
    "Online bookings as % of total appointments",
    "Front desk call volume",
    "No-show rate",
    "New patient conversion rate",
  ],
};

export const RESTAURANT_RESERVATIONS: Playbook = {
  id: "restaurant-reservations",
  industryId: "restaurant",
  name: "Restaurant Reservations",
  objective: "Handle reservations and catering inquiries without pulling staff off the floor.",
  recommendedServices: ["ai-chatbot", "workflow-automation", "social-media-management"],
  steps: [
    "Integrate online reservation widget on website",
    "Deploy chatbot for hours, menu, and reservation FAQs",
    "Capture catering inquiries with automated qualification",
    "Send booking confirmation and reminder messages",
    "Automate social DM initial responses with staff handoff",
  ],
  kpis: [
    "Reservations booked online",
    "Catering leads per month",
    "Phone volume during peak service",
    "Reservation no-show rate",
  ],
};

export const LAW_FIRM_CONSULTATION: Playbook = {
  id: "law-firm-consultation",
  industryId: "law-firm",
  name: "Law Firm Consultation",
  objective: "Qualify intake leads and schedule consultations while maintaining compliance.",
  recommendedServices: ["ai-chatbot", "workflow-automation", "crm-integration", "business-website"],
  steps: [
    "Deploy secure intake chatbot with practice-area qualification",
    "Configure consultation booking with availability rules",
    "Integrate CRM for matter intake tracking",
    "Set up follow-up for incomplete intake forms",
    "Review compliance and data handling monthly",
  ],
  kpis: [
    "Intake response time",
    "Consultation booking rate",
    "Qualified lead-to-retainer conversion",
    "Intake form completion rate",
  ],
};

export const PLUMBING_EMERGENCY_RESPONSE: Playbook = {
  id: "plumbing-emergency-response",
  industryId: "plumbing",
  name: "Plumbing Emergency Response",
  objective: "Capture urgent calls instantly and book service appointments around the clock.",
  recommendedServices: ["ai-voice-agent", "ai-chatbot", "workflow-automation"],
  steps: [
    "Deploy AI voice agent for 24/7 emergency call answering",
    "Configure urgent vs. standard service triage rules",
    "Add website chatbot for immediate engagement",
    "Enable online booking for non-emergency windows",
    "Route leads to available technicians by service area",
  ],
  kpis: [
    "Emergency call capture rate",
    "Average lead response time",
    "Jobs booked without phone tag",
    "After-hours conversion rate",
  ],
};

export const PLAYBOOKS: Playbook[] = [
  HVAC_LEAD_GENERATION,
  DENTAL_APPOINTMENT_BOOKING,
  RESTAURANT_RESERVATIONS,
  LAW_FIRM_CONSULTATION,
  PLUMBING_EMERGENCY_RESPONSE,
];
