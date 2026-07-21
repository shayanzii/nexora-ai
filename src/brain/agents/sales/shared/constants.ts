import type { SalesRequiredField } from "../../../types/sales";

export const SALES_REQUIRED_FIELDS = [
  {
    field: "businessName" as SalesRequiredField,
    label: "Business name",
    question: "What is the legal or trading name of the business?",
  },
  {
    field: "industry" as SalesRequiredField,
    label: "Industry",
    question: "Which industry best describes the business (e.g. HVAC, dental, restaurant)?",
  },
  {
    field: "country" as SalesRequiredField,
    label: "Country",
    question: "In which country does the business primarily operate?",
  },
  {
    field: "targetAudience" as SalesRequiredField,
    label: "Target audience",
    question: "Who is the primary target audience or customer type?",
  },
  {
    field: "services" as SalesRequiredField,
    label: "Services requested",
    question: "Which services are you interested in (e.g. chatbot, website, automation)?",
  },
  {
    field: "goals" as SalesRequiredField,
    label: "Goals",
    question: "What are the primary business goals for this project?",
  },
  {
    field: "budget" as SalesRequiredField,
    label: "Budget",
    question: "What budget range has been allocated for this project?",
  },
  {
    field: "timeline" as SalesRequiredField,
    label: "Timeline",
    question: "What is the desired timeline or go-live date?",
  },
];

export const LEAD_QUALIFICATION_AGENT_ID = "lead-qualification-agent";
export const DISCOVERY_AGENT_ID = "discovery-agent";
export const BUSINESS_ANALYSIS_AGENT_ID = "business-analysis-agent";
export const PROPOSAL_ENGINE_AGENT_ID = "proposal-engine-agent";
/** @deprecated Use BUSINESS_ANALYSIS_AGENT_ID */
export const PROPOSAL_AGENT_ID = BUSINESS_ANALYSIS_AGENT_ID;
export const PRICING_AGENT_ID = "pricing-agent";
export const FOLLOW_UP_AGENT_ID = "follow-up-agent";

export const SALES_LEAD_QUALIFICATION_TASK = "sales_lead_qualification";
export const SALES_DISCOVERY_TASK = "sales_discovery";
export const SALES_BUSINESS_ANALYSIS_TASK = "sales_business_analysis";
export const SALES_PROPOSAL_ENGINE_TASK = "sales_proposal_engine";
/** @deprecated Use SALES_BUSINESS_ANALYSIS_TASK */
export const SALES_PROPOSAL_TASK = SALES_BUSINESS_ANALYSIS_TASK;
export const SALES_PRICING_TASK = "sales_pricing";
export const SALES_FOLLOW_UP_TASK = "sales_follow_up";
