import { InvalidPromptIdError, PromptRenderError, PromptValidationError } from "./PromptErrors";
import { extractTemplateVariables, type PromptVariables } from "./PromptRenderer";
import type { PromptTemplate } from "./PromptRegistry";
import { parsePromptVersion } from "./PromptVersion";

const PROMPT_ID_PATTERN = /^[a-z0-9]+(?:[.-][a-z0-9]+)+$/;

export interface PromptValidationResult {
  valid: boolean;
  errors: string[];
}

/** Validates prompt id format. */
export function validatePromptId(id: string): void {
  if (!PROMPT_ID_PATTERN.test(id.trim())) {
    throw new InvalidPromptIdError(id);
  }
}

/** Validates prompt template metadata and body. */
export function validatePromptTemplate(template: PromptTemplate): PromptValidationResult {
  const errors: string[] = [];

  try {
    validatePromptId(template.id);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }

  try {
    parsePromptVersion(template.version);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }

  if (!template.department.trim()) {
    errors.push("Prompt department must not be empty.");
  }

  if (!template.description.trim()) {
    errors.push("Prompt description must not be empty.");
  }

  if (!template.template.trim()) {
    errors.push("Prompt template body must not be empty.");
  }

  const referenced = new Set(extractTemplateVariables(template.template));
  for (const required of template.requiredVariables) {
    if (!referenced.has(required)) {
      errors.push(`Required variable '${required}' is not referenced in the template.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/** Validates that all required variables are present before rendering. */
export function validateRenderVariables(
  template: PromptTemplate,
  variables: PromptVariables,
): void {
  const missing = template.requiredVariables.filter((name) => {
    const value = variables[name];
    return value == null || String(value).trim() === "";
  });

  if (missing.length > 0) {
    throw new PromptRenderError(
      `Missing required prompt variables: ${missing.join(", ")}`,
      template.id,
      missing,
    );
  }
}

/** Asserts that a template is valid or throws. */
export function assertValidPromptTemplate(template: PromptTemplate): void {
  const result = validatePromptTemplate(template);
  if (!result.valid) {
    throw new PromptValidationError(result.errors.join(" "), template.id, {
      errors: result.errors,
    });
  }
}
