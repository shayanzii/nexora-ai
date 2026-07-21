import { randomUUID } from "crypto";

import { SalesDepartment } from "../agents/sales/department";
import { createDefaultSpecialistAgents } from "../agents";
import { RuntimeEngine } from "../core/runtime-engine";
import { WorkflowEngine } from "../core/workflow-engine";
import type { Proposal } from "../departments/sales/proposal";
import { executionStore, planStore } from "../memory";
import { SharedMemory } from "../memory/shared-memory";
import { AgentRegistry } from "../registry/agent-registry";
import { StrategicReasoner } from "../reasoning";
import type { StrategicReasoningResult } from "../reasoning";
import { validateBrainRequest } from "../schemas/brain-request.schema";
import { validateProjectRequest } from "../schemas/project-request.schema";
import { createProjectContext } from "../types/context";
import { validateWorkflowCoverage } from "../workflows/default-workflow";
import type { ExecutionResult } from "../types/execution";
import type { AgentTask, ProjectPlan, ProjectRequest } from "../types/project";
import type { SalesDepartmentResult } from "../types/sales";
import { SALES_TASK_TYPE } from "../types/sales";

export interface BrainServiceResult {
  success: boolean;
  plan?: ProjectPlan;
  execution?: ExecutionResult;
  proposal?: Proposal;
  strategicAnalysis?: StrategicReasoningResult;
  errors?: string[];
}

let cachedRegistry: AgentRegistry | null = null;
let cachedEngine: WorkflowEngine | null = null;
let cachedRuntime: RuntimeEngine | null = null;
let cachedStrategicReasoner: StrategicReasoner | null = null;

/**
 * Bootstraps the registry with default specialist agents.
 */
export function createBrainRegistry(): AgentRegistry {
  const registry = new AgentRegistry();

  for (const agent of createDefaultSpecialistAgents()) {
    registry.register(agent);
  }

  return registry;
}

/** Returns the shared agent registry singleton. */
export function getBrainRegistry(): AgentRegistry {
  if (!cachedRegistry) {
    cachedRegistry = createBrainRegistry();
  }

  return cachedRegistry;
}

/**
 * Returns a singleton WorkflowEngine instance.
 */
export function getWorkflowEngine(): WorkflowEngine {
  if (!cachedEngine) {
    cachedEngine = new WorkflowEngine(getBrainRegistry());
  }

  return cachedEngine;
}

/**
 * Returns a singleton RuntimeEngine instance.
 */
export function getRuntimeEngine(): RuntimeEngine {
  if (!cachedRuntime) {
    cachedRuntime = new RuntimeEngine(getBrainRegistry());
  }

  return cachedRuntime;
}

function getStrategicReasoner(): StrategicReasoner {
  if (!cachedStrategicReasoner) {
    cachedStrategicReasoner = new StrategicReasoner();
  }

  return cachedStrategicReasoner;
}

/**
 * Processes a validated project request and persists the plan in memory.
 */
export function processProjectRequest(request: ProjectRequest): BrainServiceResult {
  const engine = getWorkflowEngine();
  const plan = engine.plan(request);

  const coverage = validateWorkflowCoverage(plan);
  if (!coverage.valid) {
    return {
      success: false,
      errors: [`Workflow missing steps: ${coverage.missingSteps.join(", ")}`],
    };
  }

  planStore.save(plan);

  return { success: true, plan };
}

/**
 * Validates raw input and processes the request if valid.
 * Backward compatible — returns plan only (no execution).
 */
export function processProjectRequestPayload(body: unknown): BrainServiceResult {
  const validation = validateProjectRequest(body);

  if (!validation.success || !validation.data) {
    return { success: false, errors: validation.errors };
  }

  return processProjectRequest(validation.data);
}

/**
 * Runs the Sales Department pipeline against a plan with shared memory.
 */
export async function runSalesDepartment(
  request: ProjectRequest,
  plan: ProjectPlan,
): Promise<SalesDepartmentResult> {
  const department = new SalesDepartment();
  const memory = new SharedMemory();
  const context = createProjectContext({ ...plan, metadata: plan.metadata ?? request.metadata }, memory);

  const task: AgentTask = {
    id: `${plan.requestId}-task-sales`,
    type: SALES_TASK_TYPE,
    description: "Run sales department pipeline",
    requiredCapabilities: ["sales", "department"],
    priority: 0,
  };

  return department.runDepartment(task, context);
}

/**
 * Runs the Sales Department pipeline and returns a structured proposal when qualified.
 */
export async function generateProposalForRequest(
  request: ProjectRequest,
  requestId: string = randomUUID(),
): Promise<BrainServiceResult> {
  const plan = buildProposalPlan(request, requestId);
  const salesResult = await runSalesDepartment(request, plan);

  if (salesResult.status !== "qualified" || !salesResult.proposalDocument) {
    return {
      success: false,
      plan,
      errors: [
        salesResult.status === "needs_clarification"
          ? "Client request incomplete — proposal requires full qualification."
          : "Proposal engine did not produce a document.",
      ],
    };
  }

  return {
    success: true,
    plan,
    proposal: salesResult.proposalDocument,
  };
}

/**
 * Executes an existing project plan through the runtime engine.
 */
export async function executeProjectPlan(plan: ProjectPlan): Promise<BrainServiceResult> {
  try {
    const runtime = getRuntimeEngine();
    const execution = await runtime.execute(plan);

    executionStore.save(execution);

    if (execution.status === "failed") {
      return {
        success: false,
        plan,
        execution,
        errors: [execution.error ?? "Plan execution failed."],
      };
    }

    return { success: true, plan, execution };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected execution error.";
    return { success: false, plan, errors: [message] };
  }
}

/**
 * Plans and optionally executes a project request.
 * Set `execute: true` to run the runtime engine after planning.
 * Set `includeProposal: true` to generate a structured proposal.
 * Set `includeStrategicAnalysis: true` to generate strategic reasoning output.
 */
export async function processBrainRequest(body: unknown): Promise<BrainServiceResult> {
  const validation = validateBrainRequest(body);

  if (!validation.success || !validation.data) {
    return { success: false, errors: validation.errors };
  }

  const planResult = processProjectRequest(validation.data.request);

  if (!planResult.success || !planResult.plan) {
    return planResult;
  }

  let execution: ExecutionResult | undefined;
  let proposal: Proposal | undefined;
  let strategicAnalysis: StrategicReasoningResult | undefined;
  let salesResult: SalesDepartmentResult | undefined;
  const errors: string[] = [];

  if (validation.data.execute) {
    const executionResult = await executeProjectPlan(planResult.plan);
    execution = executionResult.execution;

    if (!executionResult.success) {
      errors.push(...(executionResult.errors ?? ["Execution failed."]));
    }
  }

  const needsSalesPipeline =
    validation.data.includeProposal || validation.data.includeStrategicAnalysis;

  if (needsSalesPipeline) {
    salesResult = await runSalesDepartment(validation.data.request, planResult.plan);

    if (validation.data.includeProposal) {
      if (salesResult.proposalDocument) {
        proposal = salesResult.proposalDocument;
      } else {
        errors.push(
          salesResult.status === "needs_clarification"
            ? "Client request incomplete — proposal requires full qualification."
            : "Proposal engine did not produce a document.",
        );
      }
    }
  }

  if (validation.data.includeStrategicAnalysis) {
    const reasoner = getStrategicReasoner();
    const reasonInput = reasoner.buildInput({
      requestId: planResult.plan.requestId,
      request: validation.data.request,
      salesResult,
      proposal,
    });
    const reasoning = reasoner.reason(reasonInput);

    if (reasoning.success && reasoning.result) {
      strategicAnalysis = reasoning.result;
    } else {
      errors.push(reasoning.error ?? "Strategic analysis failed.");
    }
  }

  const success =
    planResult.success &&
    (!validation.data.execute || execution?.status === "completed") &&
    (!validation.data.includeProposal || proposal !== undefined) &&
    (!validation.data.includeStrategicAnalysis || strategicAnalysis !== undefined);

  return {
    success,
    plan: planResult.plan,
    execution,
    proposal,
    strategicAnalysis,
    errors: errors.length > 0 ? errors : undefined,
  };
}

function buildProposalPlan(request: ProjectRequest, requestId: string): ProjectPlan {
  return {
    requestId,
    industry: request.industry,
    goal: request.goal,
    budget: request.budget,
    services: request.services,
    metadata: request.metadata,
    assignedAgents: [],
    executionOrder: ["sales-department"],
    tasks: [],
    estimatedComplexity: "low",
    complexityScore: 0,
    nextAction: {
      type: "execute_task",
      agentId: "sales-department",
      description: "Run sales department for proposal generation",
    },
    summary: "Proposal generation plan",
    createdAt: new Date().toISOString(),
  };
}

/** Resets singleton state — useful for testing. */
export function resetBrainService(): void {
  cachedRegistry = null;
  cachedEngine = null;
  cachedRuntime = null;
  cachedStrategicReasoner = null;
  planStore.clear();
  executionStore.clear();
}
