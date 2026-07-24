import { OPENAI_DEFAULT_MODEL } from "../../llm/providers/openai/OpenAIModels";

export const CEO_INTELLIGENCE_AGENT_ID = "ceo-intelligence-agent";

/** Configuration for the production CEO Agent. */
export interface CEOAgentConfig {
  promptId: string;
  promptVersion?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  fallbackOnLlmFailure: boolean;
}

export const DEFAULT_CEO_AGENT_CONFIG: CEOAgentConfig = {
  promptId: "ceo.business-analysis",
  model: OPENAI_DEFAULT_MODEL,
  temperature: 0.3,
  maxTokens: 2048,
  fallbackOnLlmFailure: true,
};

/** Resolves partial CEO agent configuration with defaults. */
export function resolveCEOAgentConfig(
  overrides: Partial<CEOAgentConfig> = {},
): CEOAgentConfig {
  return {
    ...DEFAULT_CEO_AGENT_CONFIG,
    ...overrides,
  };
}

/** Department identifiers the CEO Agent can recommend. */
export const CEO_DEPARTMENTS = ["sales", "website"] as const;

export type CEODepartmentId = (typeof CEO_DEPARTMENTS)[number];

/** Maps requested services to Nexora departments. */
export const SERVICE_TO_DEPARTMENT: Record<string, CEODepartmentId> = {
  website: "website",
  chatbot: "sales",
  automation: "sales",
  receptionist: "sales",
  crm: "sales",
  booking: "sales",
  leads: "sales",
  support: "sales",
};
