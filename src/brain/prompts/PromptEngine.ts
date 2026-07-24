import { PromptNotFoundError } from "./PromptErrors";
import {
  getPromptRegistry,
  PromptRegistry,
  type PromptRegistration,
  type PromptTemplate,
} from "./PromptRegistry";
import { renderPromptTemplate, type PromptVariables } from "./PromptRenderer";
import {
  assertValidPromptTemplate,
  validatePromptId,
  validateRenderVariables,
} from "./PromptValidator";

export interface RenderPromptOptions {
  version?: string;
}

/** Rendered prompt output with metadata for downstream LLM calls. */
export interface RenderedPrompt {
  id: string;
  version: string;
  department: string;
  description: string;
  tags: readonly string[];
  content: string;
  variables: PromptVariables;
}

/**
 * Central prompt engine — the single source of truth for AI prompt templates.
 * Agents should render prompts through this class instead of hardcoding strings.
 */
export class PromptEngine {
  private readonly registry: PromptRegistry;

  constructor(registry: PromptRegistry = getPromptRegistry()) {
    this.registry = registry;
  }

  /** Registers a prompt template after validation. */
  register(template: PromptTemplate): void {
    validatePromptId(template.id);
    assertValidPromptTemplate(template);
    this.registry.register({ template });
  }

  /** Registers multiple prompt templates. */
  registerAll(templates: readonly PromptTemplate[]): void {
    for (const template of templates) {
      this.register(template);
    }
  }

  /** Resolves a prompt template by id and optional version. */
  get(id: string, version?: string): PromptTemplate {
    validatePromptId(id);
    const template = this.registry.lookup(id, version);
    if (!template) {
      throw new PromptNotFoundError(id, version);
    }
    return template;
  }

  /** Returns true when the prompt id exists. */
  has(id: string, version?: string): boolean {
    return this.registry.has(id, version);
  }

  /** Lists all registered prompt templates. */
  list(): PromptTemplate[] {
    return this.registry.list();
  }

  /** Discovers prompts by department and/or tag. */
  discover(query: { department?: string; tag?: string }): PromptTemplate[] {
    return this.registry.discover(query);
  }

  /** Returns all versions registered for a prompt id. */
  listVersions(id: string): PromptTemplate[] {
    validatePromptId(id);
    return this.registry.listVersions(id);
  }

  /** Validates and renders a prompt template with variables. */
  render(
    id: string,
    variables: PromptVariables,
    options: RenderPromptOptions = {},
  ): RenderedPrompt {
    const template = this.get(id, options.version);
    validateRenderVariables(template, variables);
    const content = renderPromptTemplate(template.template, variables);

    return {
      id: template.id,
      version: template.version,
      department: template.department,
      description: template.description,
      tags: template.tags,
      content,
      variables,
    };
  }
}

let defaultEngine: PromptEngine | undefined;

/** Returns the process-wide default prompt engine. */
export function getPromptEngine(): PromptEngine {
  if (!defaultEngine) {
    defaultEngine = new PromptEngine();
  }
  return defaultEngine;
}

/** Resets the process-wide default prompt engine. Intended for tests. */
export function resetPromptEngine(): void {
  defaultEngine = undefined;
}

/** Convenience helper for one-off rendering through the default engine. */
export function renderPrompt(
  id: string,
  variables: PromptVariables,
  options?: RenderPromptOptions,
): RenderedPrompt {
  return getPromptEngine().render(id, variables, options);
}

export type { PromptRegistration };
