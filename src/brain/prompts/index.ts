import { getPromptEngine, PromptEngine } from "./PromptEngine";
import { BUILTIN_PROMPT_TEMPLATES } from "./templates";

export {
  PromptEngine,
  getPromptEngine,
  resetPromptEngine,
  renderPrompt,
} from "./PromptEngine";

export type {
  RenderPromptOptions,
  RenderedPrompt,
  PromptRegistration,
} from "./PromptEngine";

export {
  PromptRegistry,
  getPromptRegistry,
  resetPromptRegistry,
} from "./PromptRegistry";

export type {
  PromptTemplate,
  PromptRegistryOptions,
} from "./PromptRegistry";

export {
  renderPromptTemplate,
  extractTemplateVariables,
} from "./PromptRenderer";

export type { PromptVariables, PromptVariableValue } from "./PromptRenderer";

export {
  validatePromptId,
  validatePromptTemplate,
  validateRenderVariables,
  assertValidPromptTemplate,
} from "./PromptValidator";

export type { PromptValidationResult } from "./PromptValidator";

export {
  parsePromptVersion,
  formatPromptVersion,
  comparePromptVersions,
  maxPromptVersion,
} from "./PromptVersion";

export type {
  PromptVersionParts,
  LocalizedPromptVariant,
  PromptOptimizationCandidate,
  PromptExperimentAssignment,
  DynamicPromptSelectionCriteria,
} from "./PromptVersion";

export {
  PromptError,
  PromptNotFoundError,
  PromptValidationError,
  PromptRenderError,
  InvalidPromptIdError,
} from "./PromptErrors";

export type { PromptErrorCode, PromptErrorDetails } from "./PromptErrors";

export {
  BUILTIN_PROMPT_TEMPLATES,
  CEO_BUSINESS_ANALYSIS_PROMPT,
  CEO_PROJECT_SUMMARY_PROMPT,
  SALES_PROPOSAL_PROMPT,
  SALES_PRICING_PROMPT,
  WEBSITE_BRAND_ANALYSIS_PROMPT,
  WEBSITE_SITEMAP_PROMPT,
  WEBSITE_SEO_PROMPT,
} from "./templates";

/** Backward-compatible CEO analysis exports. */
export {
  AGENT_CAPABILITIES,
  CEO_AGENT_ID,
  CEO_ANALYSIS_PROMPT,
  SERVICE_CAPABILITY_MAP,
} from "./ceo-analysis";

export type { CEOAnalysis } from "./ceo-analysis";

function registerBuiltinPrompts(): void {
  const registered = getPromptEngine();
  if (registered.has(BUILTIN_PROMPT_TEMPLATES[0].id)) {
    return;
  }
  registered.registerAll(BUILTIN_PROMPT_TEMPLATES);
}

registerBuiltinPrompts();

export function createPromptEngine(): PromptEngine {
  registerBuiltinPrompts();
  return getPromptEngine();
}
