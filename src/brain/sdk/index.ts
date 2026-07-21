// Interfaces
export type {
  Department,
  DepartmentConfidence,
  DepartmentExecutionOptions,
  DepartmentRegistration,
  DepartmentRunResult,
  DepartmentSummary,
} from "./interfaces";

export {
  ContextBuildError,
  DepartmentError,
  ExecutionError,
  KnowledgeError,
  PlannerError,
  ValidationError,
} from "./interfaces";

export type {
  DepartmentErrorCode,
  DepartmentErrorDetails,
  DepartmentErrorSeverity,
} from "./interfaces";

// Base
export { BaseDepartment } from "./base";

// Context
export {
  buildDepartmentContext,
  resolveRequestId,
} from "./context";

export type {
  BuildDepartmentContextParams,
  DepartmentContext,
  DepartmentRuntimeServices,
} from "./context";

// Validation
export {
  emptyValidationReport,
  mergeValidationReports,
  validateRequest,
} from "./validation";

export type {
  ValidationIssue,
  ValidationOptions,
  ValidationReport,
  ValidationRule,
  ValidationSeverity,
} from "./validation";

// Telemetry
export { TelemetryCollector } from "./telemetry";

export type {
  DepartmentLifecycleStep,
  DepartmentTelemetry,
  StepTiming,
  TelemetryFailure,
} from "./telemetry";

// Registry
export {
  DepartmentRegistry,
  getDepartmentRegistry,
  resetDepartmentRegistry,
} from "./registry";

export type { DepartmentRegistryOptions } from "./registry";

// Utils
export {
  getLifecycleSteps,
  mapValidationConfidence,
  runDepartmentLifecycle,
} from "./utils";
