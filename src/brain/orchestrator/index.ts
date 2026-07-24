export {
  ProjectOrchestrator,
  getProjectOrchestrator,
  resetProjectOrchestrator,
} from "./ProjectOrchestrator";

export type {
  OrchestratorInput,
  OrchestratorLogEvent,
  OrchestratorLogger,
} from "./ProjectOrchestrator";

export { TaskManager } from "./TaskManager";
export type { TaskManagerLogEvent, TaskManagerLogger } from "./TaskManager";

export { TaskQueue } from "./TaskQueue";

export {
  planTasks,
  buildExecutionGraph,
  DEPARTMENT_DURATION_HOURS,
  DEPARTMENT_PRIORITY,
} from "./TaskPlanner";

export type { TaskPlanInput } from "./TaskPlanner";

export {
  assignInitialTaskStatuses,
  areDependenciesMet,
  deriveDepartmentOrder,
  getReadyTasks,
  sortTasksByDependencies,
} from "./TaskScheduler";

export {
  selectDepartments,
  sortDepartments,
  resolveDepartmentDependencies,
  KNOWN_DEPARTMENTS,
  DEPARTMENT_ORDER,
  DEFAULT_DEPARTMENT_DEPENDENCIES,
  SERVICE_DEPARTMENT_MAP,
} from "./DepartmentSelector";

export type { DepartmentId, KnownDepartmentId, DepartmentSelectionInput } from "./DepartmentSelector";

export {
  estimateCriticalPathDuration,
  formatDepartmentChain,
} from "./ExecutionPlan";

export type {
  ProjectExecutionPlan,
  ExecutionGraph,
  ExecutionGraphNode,
  ExecutionGraphEdge,
} from "./ExecutionPlan";

export {
  createOrchestratorTask,
  TASK_PRIORITIES,
  TASK_PRIORITY_WEIGHT,
} from "./TaskTypes";

export type {
  OrchestratorTask,
  TaskPriority,
  TaskCreationInput,
} from "./TaskTypes";

export {
  TASK_STATUSES,
  isTerminalTaskStatus,
  isExecutableTaskStatus,
} from "./TaskStatus";

export type { TaskStatus } from "./TaskStatus";

export {
  OrchestratorError,
  OrchestratorValidationError,
  CyclicDependencyError,
  TaskNotFoundError,
} from "./OrchestratorErrors";

export type { OrchestratorErrorCode } from "./OrchestratorErrors";
