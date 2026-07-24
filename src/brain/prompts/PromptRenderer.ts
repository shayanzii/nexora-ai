const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;

export type PromptVariableValue = string | number | boolean | null | undefined;

/** Variables supplied when rendering a prompt template. */
export type PromptVariables = Readonly<Record<string, PromptVariableValue>>;

/** Extracts variable names referenced in a template body. */
export function extractTemplateVariables(template: string): string[] {
  const variables = new Set<string>();
  for (const match of template.matchAll(VARIABLE_PATTERN)) {
    variables.add(match[1]);
  }
  return [...variables];
}

/** Renders a template by replacing {{variable}} placeholders. */
export function renderPromptTemplate(
  template: string,
  variables: PromptVariables,
): string {
  return template.replace(VARIABLE_PATTERN, (_match, key: string) => {
    const value = variables[key];
    if (value == null) {
      return "";
    }
    return String(value);
  });
}
