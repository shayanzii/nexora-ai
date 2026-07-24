import type {
  ValidationIssue,
  ValidationOptions,
  ValidationReport,
  ValidationRule,
} from "./types";

function confidenceFromScore(score: number): ValidationReport["confidence"] {
  if (score >= 75) return "high";
  if (score >= 45) return "medium";
  return "low";
}

function issue(
  code: string,
  message: string,
  severity: ValidationIssue["severity"],
  field?: string,
): ValidationIssue {
  return { code, message, severity, field };
}

/**
 * Builds a validation report from rules and optional business validators.
 */
export function validateRequest<T extends object>(
  request: T,
  rules: ValidationRule<T>[],
  businessValidators: Array<(req: T) => ValidationIssue | null> = [],
  options: ValidationOptions = {},
): ValidationReport {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const info: ValidationIssue[] = [];

  for (const rule of rules) {
    const value = request[rule.field];
    const label = rule.label ?? String(rule.field);

    if (rule.required) {
      const empty =
        value === undefined ||
        value === null ||
        (typeof value === "string" && !value.trim()) ||
        (Array.isArray(value) && value.length === 0);

      if (empty) {
        errors.push(
          issue("REQUIRED_FIELD", `${label} is required.`, "error", rule.field),
        );
        continue;
      }
    }

    if (rule.validate) {
      const finding = rule.validate(value, request);
      if (finding) {
        if (finding.severity === "error") errors.push(finding);
        else if (finding.severity === "warning") warnings.push(finding);
        else info.push(finding);
      }
    }
  }

  for (const validator of businessValidators) {
    const finding = validator(request);
    if (!finding) continue;
    if (finding.severity === "error") errors.push(finding);
    else if (finding.severity === "warning") warnings.push(finding);
    else info.push(finding);
  }

  const totalChecks = Math.max(rules.length, 1);
  const failedRequired = errors.filter((e) => e.code === "REQUIRED_FIELD").length;
  const confidenceScore = Math.round(
    Math.max(0, ((totalChecks - failedRequired) / totalChecks) * 100 - warnings.length * 5),
  );

  const minimumConfidence = options.minimumConfidence ?? 0;
  const valid = errors.length === 0 && confidenceScore >= minimumConfidence;

  return {
    valid,
    errors,
    warnings,
    info,
    confidenceScore,
    confidence: confidenceFromScore(confidenceScore),
    validatedAt: new Date().toISOString(),
  };
}

/** Merges multiple validation reports into one. */
export function mergeValidationReports(reports: ValidationReport[]): ValidationReport {
  const errors = reports.flatMap((r) => r.errors);
  const warnings = reports.flatMap((r) => r.warnings);
  const info = reports.flatMap((r) => r.info);
  const confidenceScore = Math.round(
    reports.reduce((sum, r) => sum + r.confidenceScore, 0) / Math.max(reports.length, 1),
  );

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    info,
    confidenceScore,
    confidence: confidenceFromScore(confidenceScore),
    validatedAt: new Date().toISOString(),
  };
}

/** Creates an empty passing validation report. */
export function emptyValidationReport(): ValidationReport {
  return {
    valid: true,
    errors: [],
    warnings: [],
    info: [],
    confidenceScore: 100,
    confidence: "high",
    validatedAt: new Date().toISOString(),
  };
}
