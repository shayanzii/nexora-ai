export type {
  ComplexityLevel,
  IndustryProfile,
  KnowledgePrompt,
  Playbook,
  PricingPolicy,
  ProposalTemplateBlock,
  ServiceDefinition,
  ServicePricing,
} from "./types";

export {
  KnowledgeRegistry,
  getKnowledgeRegistry,
  resetKnowledgeRegistry,
} from "./registry";

export {
  INDUSTRY_PROFILES,
  INDUSTRY_ALIASES,
  DENTIST_PROFILE,
  HVAC_PROFILE,
  PLUMBING_PROFILE,
  LAW_FIRM_PROFILE,
  RESTAURANT_PROFILE,
} from "./industries";

export {
  SERVICE_DEFINITIONS,
  SERVICE_ALIASES,
  BUSINESS_WEBSITE,
  AI_CHATBOT,
  AI_VOICE_AGENT,
  WORKFLOW_AUTOMATION,
  CRM_INTEGRATION,
  SOCIAL_MEDIA_MANAGEMENT,
} from "./services";

export {
  PLAYBOOKS,
  HVAC_LEAD_GENERATION,
  DENTAL_APPOINTMENT_BOOKING,
  RESTAURANT_RESERVATIONS,
  LAW_FIRM_CONSULTATION,
  PLUMBING_EMERGENCY_RESPONSE,
} from "./playbooks";

export {
  PROPOSAL_TEMPLATE_BLOCKS,
  DEFAULT_CHALLENGES,
  GOAL_SERVICE_HINTS,
  GOAL_SERVICE_RATIONALES,
} from "./templates";

export {
  PRICING_POLICY,
  SERVICE_PRICING,
  PRICING_ALIASES,
} from "./pricing";

export { KNOWLEDGE_PROMPTS } from "./prompts";
