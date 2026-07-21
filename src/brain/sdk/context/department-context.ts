import type { KnowledgeRegistry } from "../../knowledge/registry";
import { getKnowledgeRegistry } from "../../knowledge";
import { SharedMemory } from "../../memory/shared-memory";
import type { ProjectContext } from "../../types/context";
import type { ProjectPlan, ProjectRequest } from "../../types/project";
import type { DepartmentExecutionOptions } from "../interfaces/department";

/** Runtime services available to departments via dependency injection. */
export interface DepartmentRuntimeServices {
  knowledge?: KnowledgeRegistry;
  /** Extensible service bag for future runtime integrations. */
  services?: Record<string, unknown>;
}

/** Immutable department execution context. */
export interface DepartmentContext {
  readonly requestId: string;
  readonly request: ProjectRequest;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly plan?: Readonly<ProjectPlan>;
  readonly projectContext?: Readonly<ProjectContext>;
  readonly memory: SharedMemory;
  readonly knowledge: KnowledgeRegistry;
  readonly runtime: Readonly<DepartmentRuntimeServices>;
  readonly options: Readonly<DepartmentExecutionOptions>;
  readonly createdAt: string;
}

/** Parameters for building a DepartmentContext. */
export interface BuildDepartmentContextParams {
  requestId: string;
  request: ProjectRequest;
  plan?: ProjectPlan;
  projectContext?: ProjectContext;
  memory?: SharedMemory;
  knowledge?: KnowledgeRegistry;
  runtime?: DepartmentRuntimeServices;
  options?: DepartmentExecutionOptions;
}

/**
 * Builds an immutable DepartmentContext for department execution.
 */
export function buildDepartmentContext(
  params: BuildDepartmentContextParams,
): DepartmentContext {
  const metadata = Object.freeze({ ...(params.request.metadata ?? {}) });
  const options = Object.freeze({ ...(params.options ?? {}) });
  const runtime = Object.freeze({
    knowledge: params.knowledge ?? getKnowledgeRegistry(),
    services: Object.freeze({ ...(params.runtime?.services ?? {}) }),
  });

  const context: DepartmentContext = {
    requestId: params.requestId,
    request: {
      ...params.request,
      metadata: { ...metadata },
    },
    metadata,
    plan: params.plan ? Object.freeze({ ...params.plan }) : undefined,
    projectContext: params.projectContext,
    memory: params.memory ?? params.projectContext?.memory ?? new SharedMemory(),
    knowledge: params.knowledge ?? runtime.knowledge ?? getKnowledgeRegistry(),
    runtime,
    options,
    createdAt: new Date().toISOString(),
  };

  return Object.freeze(context);
}

/** Extracts requestId from request or generates fallback from plan. */
export function resolveRequestId(
  requestId: string | undefined,
  plan?: ProjectPlan,
): string {
  return requestId ?? plan?.requestId ?? `dept-${Date.now()}`;
}
