import type { CEOBusinessAnalysis } from "../agents/ceo/CEOOutput";
import {
  resolveDepartmentDependencies,
  type DepartmentId,
} from "./DepartmentSelector";
import type { ExecutionGraph, ExecutionGraphEdge, ExecutionGraphNode } from "./ExecutionPlan";
import {
  createOrchestratorTask,
  type OrchestratorTask,
  type TaskPriority,
} from "./TaskTypes";

/** Default estimated hours per department task. */
export const DEPARTMENT_DURATION_HOURS: Readonly<Record<string, number>> = {
  sales: 6,
  brand: 8,
  website: 40,
  seo: 16,
  automation: 24,
  marketing: 20,
  app: 80,
  qa: 12,
  delivery: 8,
};

/** Default priority per department. */
export const DEPARTMENT_PRIORITY: Readonly<Record<string, TaskPriority>> = {
  sales: "critical",
  website: "high",
  seo: "high",
  automation: "high",
  qa: "high",
  delivery: "critical",
};

export interface TaskPlanInput {
  requestId: string;
  analysis: CEOBusinessAnalysis;
  departments: readonly DepartmentId[];
}

const DEPARTMENT_TASK_DEFINITIONS: Readonly<
  Record<string, { title: string; description: (analysis: CEOBusinessAnalysis) => string }>
> = {
  sales: {
    title: "Client Discovery and Qualification",
    description: (analysis) =>
      `Qualify ${analysis.business} and capture discovery requirements for ${analysis.industry}.`,
  },
  brand: {
    title: "Brand Strategy",
    description: (analysis) =>
      `Define brand identity and messaging direction for ${analysis.business}.`,
  },
  website: {
    title: "Website Planning and Build",
    description: (analysis) =>
      `Plan and build the conversion-focused website for ${analysis.business}.`,
  },
  seo: {
    title: "SEO Strategy and Optimization",
    description: (analysis) =>
      `Create SEO strategy, page metadata, and local search optimization for ${analysis.industry}.`,
  },
  automation: {
    title: "AI Automation Integration",
    description: (analysis) =>
      `Implement AI chatbot and workflow automation for ${analysis.business}.`,
  },
  marketing: {
    title: "Marketing Launch Plan",
    description: (analysis) =>
      `Plan marketing campaigns to support lead generation for ${analysis.business}.`,
  },
  app: {
    title: "Mobile App Discovery",
    description: (analysis) =>
      `Scope future mobile app requirements for ${analysis.business}.`,
  },
  qa: {
    title: "Quality Assurance Review",
    description: () =>
      "Validate website, SEO, and automation deliverables against acceptance criteria.",
  },
  delivery: {
    title: "Final Delivery and Handoff",
    description: (analysis) =>
      `Deliver completed project assets and handoff documentation to ${analysis.business}.`,
  },
};

/** Creates orchestrator tasks for each selected department. */
export function planTasks(input: TaskPlanInput): OrchestratorTask[] {
  const dependencyMap = resolveDepartmentDependencies(input.departments);
  const taskByDepartment = new Map<string, OrchestratorTask>();

  for (const department of input.departments) {
    const definition = DEPARTMENT_TASK_DEFINITIONS[department] ?? {
      title: `${capitalize(department)} Workstream`,
      description: (analysis: CEOBusinessAnalysis) =>
        `Execute ${department} workstream for ${analysis.business}.`,
    };

    const dependencies = (dependencyMap.get(department) ?? [])
      .map((dep) => taskByDepartment.get(dep)?.id)
      .filter((taskId): taskId is string => taskId != null);

    const qaExtraDeps =
      department === "qa"
        ? input.departments
            .filter((dep) => ["website", "seo", "automation"].includes(dep))
            .map((dep) => taskByDepartment.get(dep)?.id)
            .filter((taskId): taskId is string => taskId != null)
        : [];

    const task = createOrchestratorTask({
      requestId: input.requestId,
      department,
      title: definition.title,
      description: definition.description(input.analysis),
      priority: DEPARTMENT_PRIORITY[department] ?? "medium",
      estimatedDuration: DEPARTMENT_DURATION_HOURS[department] ?? 8,
      dependencies: [...new Set([...dependencies, ...qaExtraDeps])],
      metadata: {
        industry: input.analysis.industry,
        complexity: input.analysis.estimatedComplexity,
      },
    });

    taskByDepartment.set(department, task);
  }

  return input.departments
    .map((department) => taskByDepartment.get(department))
    .filter((task): task is OrchestratorTask => task != null);
}

/** Builds an execution graph from department order and tasks. */
export function buildExecutionGraph(
  departments: readonly string[],
  tasks: readonly OrchestratorTask[],
): ExecutionGraph {
  const dependencyMap = resolveDepartmentDependencies(departments);
  const nodes: ExecutionGraphNode[] = departments.map((department) => ({
    id: `dept-${department}`,
    department,
    taskIds: tasks.filter((task) => task.department === department).map((task) => task.id),
  }));

  const edges: ExecutionGraphEdge[] = [];
  for (const department of departments) {
    for (const dependency of dependencyMap.get(department) ?? []) {
      edges.push({ from: `dept-${dependency}`, to: `dept-${department}` });
    }
  }

  if (departments.includes("qa") && departments.includes("delivery")) {
    edges.push({ from: "dept-qa", to: "dept-delivery" });
  }

  return { nodes, edges };
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
