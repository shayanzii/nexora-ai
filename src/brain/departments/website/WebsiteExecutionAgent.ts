import { WebsiteTaskNotFoundError, WebsiteExecutionValidationError } from "./WebsiteErrors";
import { planWebsiteBlueprint } from "./WebsitePlanner";
import type {
  WebsiteExecutionAgentInput,
  WebsiteExecutionAgentLogEvent,
  WebsiteExecutionAgentLogger,
  WebsiteExecutionAgentOptions,
  WebsiteExecutionBlueprint,
} from "./WebsiteTypes";

/**
 * First Nexora website execution department — planning and architecture only.
 * No HTML, React, or code generation.
 */
export class WebsiteExecutionAgent {
  constructor(private readonly logger: WebsiteExecutionAgentLogger = defaultLogger) {}

  /** Generates a complete website blueprint from upstream pipeline outputs. */
  plan(
    input: WebsiteExecutionAgentInput,
    options: WebsiteExecutionAgentOptions = {},
  ): WebsiteExecutionBlueprint {
    validateInput(input);

    const logger = options.logger ?? this.logger;
    logger({
      level: "info",
      action: "blueprint",
      message: `Creating website blueprint for ${input.analysis.business}.`,
    });

    const blueprint = planWebsiteBlueprint({
      ...input,
      metadata: {
        ...input.metadata,
        city: options.city ?? input.metadata?.city,
        country: options.country ?? input.metadata?.country,
      },
    });

    logger({
      level: "info",
      action: "pages",
      message: `Generated ${blueprint.pages.length} pages and ${blueprint.components.length} components.`,
    });

    logger({
      level: "info",
      action: "seo",
      message: `SEO plan created with primary keyword '${blueprint.seoPlan.primaryKeywords[0]}'.`,
    });

    logger({
      level: "info",
      action: "design",
      message: `Design system generated (${blueprint.designSystem.visualStyle}).`,
    });

    logger({
      level: "info",
      action: "complete",
      message: `Blueprint complete (${Math.round(blueprint.confidenceScore * 100)}% confidence).`,
    });

    return blueprint;
  }
}

function validateInput(input: WebsiteExecutionAgentInput): void {
  if (!input.analysis.business.trim()) {
    throw new WebsiteExecutionValidationError("CEO analysis must include a business name.");
  }
  if (!input.plan.requestId.trim()) {
    throw new WebsiteExecutionValidationError("Project execution plan must include requestId.");
  }
  if (!input.salesResult.requestId.trim()) {
    throw new WebsiteExecutionValidationError("Sales result must include requestId.");
  }
  if (!input.pricingResult.requestId.trim()) {
    throw new WebsiteExecutionValidationError("Pricing result must include requestId.");
  }

  if (!input.plan.departments.includes("website")) {
    throw new WebsiteTaskNotFoundError();
  }
}

function defaultLogger(event: WebsiteExecutionAgentLogEvent): void {
  console.info(
    "[website-execution]",
    JSON.stringify({ ...event, timestamp: new Date().toISOString() }),
  );
}

let defaultAgent: WebsiteExecutionAgent | undefined;

/** Returns the process-wide default Website Execution Agent. */
export function getWebsiteExecutionAgent(): WebsiteExecutionAgent {
  if (!defaultAgent) {
    defaultAgent = new WebsiteExecutionAgent();
  }
  return defaultAgent;
}

/** Resets the default Website Execution Agent. Intended for tests. */
export function resetWebsiteExecutionAgent(): void {
  defaultAgent = undefined;
}
