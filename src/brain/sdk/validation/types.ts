/** Severity of a validation finding. */
export type ValidationSeverity = "error" | "warning" | "info";

/** A single validation finding. */
export interface ValidationIssue {
  field?: string;
  code: string;
  message: string;
  severity: ValidationSeverity;
}

/** Structured validation output from department validate(). */
export interface ValidationReport {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  info: ValidationIssue[];
  /** 0–100 completeness or quality score. */
  confidenceScore: number;
  confidence: "low" | "medium" | "high";
  validatedAt: string;
}

/** Rule definition for declarative validation. */
export interface ValidationRule<T> {
  field: keyof T & string;
  required?: boolean;
  label?: string;
  validate?: (value: unknown, request: T) => ValidationIssue | null;
}

/** Options for building a validation report. */
export interface ValidationOptions {
  /** Minimum confidence score to mark valid when no errors exist. */
  minimumConfidence?: number;
}
