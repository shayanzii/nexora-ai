import { generateDiscoveryQuestions } from "./DiscoveryEngine";
import { generateSalesProposal } from "./ProposalGenerator";
import { analyzeRequirements } from "./RequirementAnalyzer";
import {
  SalesProposalError,
  SalesTaskNotFoundError,
  SalesValidationError,
  SalesWrongDepartmentError,
} from "./SalesErrors";
import { recommendServices } from "./SolutionRecommender";
import type {
  SalesAgentInput,
  SalesAgentLogEvent,
  SalesAgentLogger,
  SalesResult,
} from "./SalesTypes";

/**
 * First executable Nexora Brain department.
 * Consumes orchestrator outputs and produces structured sales results — no LLM required.
 */
export class SalesAgent {
  constructor(private readonly logger: SalesAgentLogger = defaultLogger) {}

  /** Executes the sales task from a project execution plan. */
  execute(input: SalesAgentInput): SalesResult {
    validateInput(input);

    this.logger({
      level: "info",
      action: "received",
      taskId: input.task.id,
      message: `Sales task received for ${input.analysis.business}.`,
    });

    const requirements = analyzeRequirements({
      analysis: input.analysis,
      plan: input.plan,
      context: input.context,
    });

    this.logger({
      level: "info",
      action: "analysis",
      taskId: input.task.id,
      message: `Requirement analysis completed (${requirements.completenessScore}% complete).`,
    });

    const discoveryQuestions = generateDiscoveryQuestions({
      analysis: input.analysis,
      requirements,
      services: input.context?.services,
    });

    const recommendedServices = recommendServices({
      analysis: input.analysis,
      plan: input.plan,
      requestedServices: input.context?.services,
    });

    if (recommendedServices.length === 0) {
      throw new SalesProposalError("No relevant services could be recommended for this project.");
    }

    const proposal = generateSalesProposal({
      analysis: input.analysis,
      plan: input.plan,
      requirements,
      recommendedServices,
    });

    this.logger({
      level: "info",
      action: "proposal",
      taskId: input.task.id,
      message: `Proposal generated with ${recommendedServices.length} recommended services.`,
    });

    const confidenceScore = calculateConfidenceScore(
      input.analysis.confidence,
      requirements.completenessScore,
      recommendedServices.length,
    );

    const result: SalesResult = {
      taskId: input.task.id,
      requestId: input.plan.requestId,
      department: input.task.department,
      customerSummary: requirements.customerSummary,
      businessChallenges: requirements.businessChallenges,
      recommendedServices,
      discoveryQuestions,
      proposal,
      confidenceScore,
      completedAt: new Date().toISOString(),
    };

    this.logger({
      level: "info",
      action: "complete",
      taskId: input.task.id,
      message: `Sales execution complete (${Math.round(confidenceScore * 100)}% confidence).`,
    });

    return result;
  }
}

/** Resolves the sales task from an execution plan. */
export function resolveSalesTask(
  plan: SalesAgentInput["plan"],
  taskId?: string,
): SalesAgentInput["task"] {
  if (taskId) {
    const task = plan.tasks.find((entry) => entry.id === taskId);
    if (!task) {
      throw new SalesTaskNotFoundError(taskId);
    }
    if (task.department !== "sales") {
      throw new SalesWrongDepartmentError(task.id, task.department);
    }
    return task;
  }

  const salesTask = plan.tasks.find((task) => task.department === "sales");
  if (!salesTask) {
    throw new SalesTaskNotFoundError("sales");
  }
  return salesTask;
}

function validateInput(input: SalesAgentInput): void {
  if (!input.task?.id) {
    throw new SalesValidationError("Sales task is required.");
  }
  if (input.task.department !== "sales") {
    throw new SalesWrongDepartmentError(input.task.id, input.task.department);
  }
  if (!input.analysis.business.trim()) {
    throw new SalesValidationError("CEO analysis must include a business name.");
  }
  if (!input.plan.requestId.trim()) {
    throw new SalesValidationError("Project execution plan must include a requestId.");
  }

  const taskInPlan = input.plan.tasks.some((task) => task.id === input.task.id);
  if (!taskInPlan) {
    throw new SalesTaskNotFoundError(input.task.id);
  }
}

function calculateConfidenceScore(
  ceoConfidence: number,
  completenessScore: number,
  serviceCount: number,
): number {
  const completenessFactor = completenessScore / 100;
  const serviceFactor = Math.min(1, serviceCount / 3);
  const score = ceoConfidence * 0.5 + completenessFactor * 0.35 + serviceFactor * 0.15;
  return Math.round(Math.min(1, Math.max(0, score)) * 100) / 100;
}

function defaultLogger(event: SalesAgentLogEvent): void {
  console.info(
    "[sales-agent]",
    JSON.stringify({ ...event, timestamp: new Date().toISOString() }),
  );
}

let defaultAgent: SalesAgent | undefined;

/** Returns the process-wide default Sales Agent. */
export function getSalesAgent(): SalesAgent {
  if (!defaultAgent) {
    defaultAgent = new SalesAgent();
  }
  return defaultAgent;
}

/** Resets the default Sales Agent. Intended for tests. */
export function resetSalesAgent(): void {
  defaultAgent = undefined;
}
