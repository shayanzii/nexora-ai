import type { CEOBusinessAnalysis } from "../agents/ceo/CEOOutput";
import { selectDepartments } from "./DepartmentSelector";
import {
  estimateCriticalPathDuration,
  formatDepartmentChain,
  type ProjectExecutionPlan,
} from "./ExecutionPlan";
import { OrchestratorValidationError } from "./OrchestratorErrors";
import { buildExecutionGraph, planTasks } from "./TaskPlanner";
import { TaskManager } from "./TaskManager";
import { deriveDepartmentOrder } from "./TaskScheduler";

export interface OrchestratorInput {
  requestId: string;
  analysis: CEOBusinessAnalysis;
  services?: readonly string[];
  metadata?: Readonly<Record<string, unknown>>;
}

export interface OrchestratorLogEvent {
  level: "info" | "error";
  action: "select" | "plan" | "schedule" | "complete";
  message: string;
  departments?: readonly string[];
}

export type OrchestratorLogger = (event: OrchestratorLogEvent) => void;

/**
 * Central project orchestrator — transforms CEO analysis into an execution plan.
 * Planning only — does not execute agents or departments.
 */
export class ProjectOrchestrator {
  constructor(private readonly logger: OrchestratorLogger = defaultLogger) {}

  /** Generates a full project execution plan from CEO business analysis. */
  orchestrate(input: OrchestratorInput): ProjectExecutionPlan {
    validateInput(input);

    const departments = selectDepartments({
      analysis: input.analysis,
      services: input.services,
    });

    this.logger({
      level: "info",
      action: "select",
      message: `Selected ${departments.length} departments for ${input.analysis.business}.`,
      departments,
    });

    const rawTasks = planTasks({
      requestId: input.requestId,
      analysis: input.analysis,
      departments,
    });

    const taskManager = new TaskManager(rawTasks, (event) => {
      if (event.action === "create" || event.action === "schedule") {
        this.logger({
          level: "info",
          action: "schedule",
          message: event.message,
          departments: event.department ? [event.department] : undefined,
        });
      }
    });

    const tasks = taskManager.getTasks();
    const departmentOrder = deriveDepartmentOrder(tasks);
    const executionGraph = buildExecutionGraph(departmentOrder, tasks);
    const estimatedTotalDuration = estimateCriticalPathDuration(tasks, departmentOrder);

    const plan: ProjectExecutionPlan = {
      requestId: input.requestId,
      business: input.analysis.business,
      industry: input.analysis.industry,
      goals: input.analysis.goals,
      departments,
      departmentOrder,
      tasks,
      executionGraph,
      estimatedTotalDuration,
      summary: buildPlanSummary(input.analysis, departmentOrder, tasks.length),
      createdAt: new Date().toISOString(),
      metadata: {
        ...input.metadata,
        confidence: input.analysis.confidence,
        complexity: input.analysis.estimatedComplexity,
        missingInformation: input.analysis.missingInformation,
      },
    };

    this.logger({
      level: "info",
      action: "complete",
      message: `Execution plan created: ${formatDepartmentChain(departmentOrder)} (${estimatedTotalDuration}h estimated).`,
      departments: departmentOrder,
    });

    return plan;
  }
}

function validateInput(input: OrchestratorInput): void {
  if (!input.requestId.trim()) {
    throw new OrchestratorValidationError("requestId is required.");
  }
  if (!input.analysis.business.trim()) {
    throw new OrchestratorValidationError("CEO analysis must include a business name.");
  }
  if (!input.analysis.industry.trim()) {
    throw new OrchestratorValidationError("CEO analysis must include an industry.");
  }
}

function buildPlanSummary(
  analysis: CEOBusinessAnalysis,
  departmentOrder: readonly string[],
  taskCount: number,
): string {
  return (
    `Orchestration plan for ${analysis.business} (${analysis.industry}) with ` +
    `${taskCount} tasks across ${departmentOrder.length} departments: ` +
    `${formatDepartmentChain(departmentOrder)}.`
  );
}

function defaultLogger(event: OrchestratorLogEvent): void {
  console.info(
    "[orchestrator]",
    JSON.stringify({ ...event, timestamp: new Date().toISOString() }),
  );
}

let defaultOrchestrator: ProjectOrchestrator | undefined;

/** Returns the process-wide default project orchestrator. */
export function getProjectOrchestrator(): ProjectOrchestrator {
  if (!defaultOrchestrator) {
    defaultOrchestrator = new ProjectOrchestrator();
  }
  return defaultOrchestrator;
}

/** Resets the default orchestrator. Intended for tests. */
export function resetProjectOrchestrator(): void {
  defaultOrchestrator = undefined;
}
