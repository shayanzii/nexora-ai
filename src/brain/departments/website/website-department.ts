import {
  BaseDepartment,
  getDepartmentRegistry,
  mapValidationConfidence,
  validateRequest,
  type BuildDepartmentContextParams,
  type DepartmentContext,
  type DepartmentExecutionOptions,
  type DepartmentSummary,
  type ValidationReport,
} from "../../sdk";
import { InputBuilder } from "./input-builder";
import { OutputAssembler } from "./output-assembler";
import { createPlaceholderPlannerOutputs } from "./placeholders";
import type {
  BuilderFeedback,
  WebsiteDepartmentRequest,
  WebsiteDepartmentResult,
} from "./schema";
import {
  WEBSITE_DEPARTMENT_ID,
  WEBSITE_DEPARTMENT_TAGS,
  WEBSITE_TASK_TYPE,
} from "./types";

function buildFailedResult(params: {
  requestId: string;
  errorMessage?: string;
  validation: ValidationReport;
  inputCompletenessScore: number;
  inputWarnings: string[];
  lifecycleSteps: string[];
  feedback?: BuilderFeedback;
}): WebsiteDepartmentResult {
  return {
    departmentId: WEBSITE_DEPARTMENT_ID,
    requestId: params.requestId,
    status: "failed",
    generatedAt: new Date().toISOString(),
    stepsExecuted: params.lifecycleSteps,
    stepsSkipped: [],
    inputCompletenessScore: params.inputCompletenessScore,
    inputWarnings: params.inputWarnings,
    summary: "Website plan generation failed.",
    nextStep: "Resolve validation errors and retry.",
    error: params.errorMessage,
    regenerationApplied: Boolean(params.feedback),
    feedbackIssuesResolved: [],
    feedbackIssuesRemaining: params.feedback?.issues.map((issue) => issue.id) ?? [],
  };
}

/**
 * Website Department — reasoning-only website planning.
 * Sprint 1: lifecycle + schemas + placeholder planner outputs.
 */
export class WebsiteDepartment extends BaseDepartment<
  WebsiteDepartmentRequest,
  WebsiteDepartmentResult
> {
  readonly id = WEBSITE_DEPARTMENT_ID;
  readonly name = "Website Department";
  readonly description =
    "Produces strategic WebsitePlan artifacts (no HTML/UI) for local service businesses.";
  readonly version = "1.0.0";

  protected validateRequest(request: WebsiteDepartmentRequest): ValidationReport {
    return validateRequest(
      request,
      [
        { field: "requestId", required: true, label: "Request ID" },
        { field: "clientName", required: true, label: "Client name" },
        { field: "industry", required: true, label: "Industry" },
        { field: "country", required: true, label: "Country" },
        { field: "goals", required: true, label: "Goals" },
        { field: "targetAudience", required: true, label: "Target audience" },
        { field: "services", required: true, label: "Services" },
        { field: "budget", required: true, label: "Budget" },
      ],
      [
        (req) =>
          req.budget <= 0
            ? {
                code: "INVALID_BUDGET",
                message: "Budget must be greater than zero.",
                severity: "error",
                field: "budget",
              }
            : null,
        (req) =>
          req.budget < 1500
            ? {
                code: "LOW_BUDGET",
                message: "Budget is below typical website project minimum.",
                severity: "warning",
                field: "budget",
              }
            : null,
        (req) =>
          !req.timeline?.trim()
            ? {
                code: "MISSING_TIMELINE",
                message: "Timeline not provided — plan assumptions may be conservative.",
                severity: "warning",
                field: "timeline",
              }
            : null,
      ],
    );
  }

  protected createContextParams(
    request: WebsiteDepartmentRequest,
    options?: DepartmentExecutionOptions,
  ): BuildDepartmentContextParams {
    return {
      requestId: request.requestId,
      request: {
        industry: request.industry,
        goal: request.goals[0] ?? "",
        budget: request.budget,
        services: [...request.services],
        metadata: {
          businessName: request.clientName,
          country: request.country,
          targetAudience: request.targetAudience,
          timeline: request.timeline,
          regulated: request.regulated,
          websiteOptions: request.options,
        },
      },
      options,
    };
  }

  protected async executeDepartment(
    context: DepartmentContext,
    request: WebsiteDepartmentRequest,
  ): Promise<WebsiteDepartmentResult> {
    const executionInput = InputBuilder.buildExecutionInput(
      context,
      request,
      request.feedback,
    );
    const plannerOutputs = createPlaceholderPlannerOutputs(executionInput);
    return OutputAssembler.assemble(executionInput, plannerOutputs);
  }

  protected buildSummary(
    context: DepartmentContext,
    result: WebsiteDepartmentResult,
  ): DepartmentSummary {
    const warnings = [
      ...result.inputWarnings,
      ...(result.status === "partial" ? ["Plan generated with incomplete input."] : []),
    ];

    const confidence =
      result.websitePlan?.confidenceLevel ??
      mapValidationConfidence(result.inputCompletenessScore);

    return {
      departmentId: this.id,
      requestId: context.requestId,
      headline: result.summary,
      nextStep: result.nextStep,
      warnings,
      confidence,
    };
  }

  /**
   * v1.1 entry point — supports optional BuilderFeedback for regeneration runs.
   */
  async runWebsitePlan(
    request: WebsiteDepartmentRequest,
    feedback?: BuilderFeedback,
    options?: DepartmentExecutionOptions,
  ): Promise<WebsiteDepartmentResult> {
    const requestWithFeedback: WebsiteDepartmentRequest = feedback
      ? { ...request, feedback }
      : request;

    const runResult = await this.run(requestWithFeedback, options);

    if (!runResult.success || !runResult.result) {
      const completeness = InputBuilder.assessCompleteness(requestWithFeedback);
      return buildFailedResult({
        requestId: runResult.requestId,
        errorMessage: runResult.error?.message,
        validation: runResult.validation,
        inputCompletenessScore: completeness.score,
        inputWarnings: [...completeness.warnings],
        lifecycleSteps: runResult.telemetry.lifecycleSteps.map((step) => step.step),
        feedback,
      });
    }

    return runResult.result;
  }
}

let registered = false;

/** Registers WebsiteDepartment in the global DepartmentRegistry (idempotent). */
export function registerWebsiteDepartment(
  registry = getDepartmentRegistry(),
): WebsiteDepartment {
  const existing = registry.resolve<WebsiteDepartmentRequest, WebsiteDepartmentResult>(
    WEBSITE_DEPARTMENT_ID,
  );

  if (existing instanceof WebsiteDepartment) {
    registered = true;
    return existing;
  }

  const department = new WebsiteDepartment();
  registry.register({
    department,
    tags: [...WEBSITE_DEPARTMENT_TAGS],
    supportedTaskTypes: [WEBSITE_TASK_TYPE],
    priority: 10,
  });
  registered = true;
  return department;
}

/** Returns a registered WebsiteDepartment instance. */
export function getWebsiteDepartment(
  registry = getDepartmentRegistry(),
): WebsiteDepartment {
  return registerWebsiteDepartment(registry);
}

/** Resets module registration state — useful for tests. */
export function resetWebsiteDepartmentRegistration(
  registry = getDepartmentRegistry(),
): void {
  registry.unregister(WEBSITE_DEPARTMENT_ID);
  registered = false;
}

export { registered as isWebsiteDepartmentRegistered };
