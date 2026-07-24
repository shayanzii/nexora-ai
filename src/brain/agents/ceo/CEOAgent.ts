import type { LLMGateway } from "../../llm/gateway/LLMGateway";
import { getLLMGateway } from "../../llm/gateway";
import type { PromptEngine } from "../../prompts/PromptEngine";
import { getPromptEngine } from "../../prompts";
import {
  CEO_INTELLIGENCE_AGENT_ID,
  DEFAULT_CEO_AGENT_CONFIG,
  resolveCEOAgentConfig,
  type CEOAgentConfig,
} from "./CEOAgentConfig";
import {
  buildCEOContext,
  type CEOCustomerRequest,
  type CEOContext,
} from "./CEOContext";
import { buildCEOAnalysisMessages } from "./CEOInstructions";
import {
  buildDeterministicCEOAnalysis,
  enrichCEOAnalysis,
} from "./CEOPlanner";
import {
  parseCEOOutputFromJson,
  type CEOBusinessAnalysis,
} from "./CEOOutput";

export class CEOAgentError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "CEOAgentError";
  }
}

export interface CEOAgentOptions {
  config?: Partial<CEOAgentConfig>;
  gateway?: LLMGateway;
  promptEngine?: PromptEngine;
}

/**
 * Production CEO Agent — understands customer intent and coordinates project lifecycle.
 * Uses the Prompt Engine and LLM Gateway as the only AI access paths.
 */
export class CEOAgent {
  readonly id = CEO_INTELLIGENCE_AGENT_ID;
  readonly config: CEOAgentConfig;
  private readonly gateway: LLMGateway;
  private readonly promptEngine: PromptEngine;

  constructor(options: CEOAgentOptions = {}) {
    this.config = resolveCEOAgentConfig(options.config);
    this.gateway = options.gateway ?? getLLMGateway();
    this.promptEngine = options.promptEngine ?? getPromptEngine();
  }

  /** Analyzes a customer request and returns structured business intelligence. */
  async analyze(request: CEOCustomerRequest): Promise<CEOBusinessAnalysis> {
    const context = buildCEOContext(request);

    try {
      const llmAnalysis = await this.analyzeWithGateway(context);
      return enrichCEOAnalysis(llmAnalysis, context);
    } catch (error) {
      if (!this.config.fallbackOnLlmFailure) {
        throw new CEOAgentError("CEO Agent analysis failed.", error);
      }

      return buildDeterministicCEOAnalysis(context);
    }
  }

  /** Builds deterministic analysis without calling the LLM gateway. */
  analyzeDeterministic(request: CEOCustomerRequest): CEOBusinessAnalysis {
    return buildDeterministicCEOAnalysis(buildCEOContext(request));
  }

  private async analyzeWithGateway(context: CEOContext): Promise<CEOBusinessAnalysis> {
    const messages = buildCEOAnalysisMessages(
      context,
      this.config,
      this.promptEngine,
    );

    const response = await this.gateway.generate({
      id: context.requestId,
      model: this.config.model,
      messages: [
        { role: "system", content: messages.system },
        { role: "user", content: messages.user },
      ],
      options: {
        temperature: this.config.temperature,
        maxTokens: this.config.maxTokens,
        responseFormat: "json",
      },
    });

    const parsed = parseCEOOutputFromJson(response.content);
    return {
      ...parsed,
      followUpQuestions: parsed.followUpQuestions ?? [],
    };
  }
}
