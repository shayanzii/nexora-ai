import {
  comparePromptVersions,
  parsePromptVersion,
} from "./PromptVersion";

/** Metadata describing a versioned prompt template. */
export interface PromptTemplate {
  id: string;
  version: string;
  department: string;
  description: string;
  tags: readonly string[];
  template: string;
  requiredVariables: readonly string[];
  optionalVariables?: readonly string[];
}

/** Registration metadata stored in the prompt registry. */
export interface PromptRegistration {
  template: PromptTemplate;
  priority?: number;
}

export interface PromptRegistryOptions {
  /** When true, registering duplicate id+version pairs throws. Default false. */
  strict?: boolean;
}

function registryKey(id: string, version: string): string {
  return `${id}@${version}`;
}

/** Registry for prompt template discovery and version resolution. */
export class PromptRegistry {
  private readonly templates = new Map<string, PromptRegistration>();
  private readonly latestVersion = new Map<string, string>();
  private readonly departmentIndex = new Map<string, Set<string>>();
  private readonly tagIndex = new Map<string, Set<string>>();

  constructor(private readonly options: PromptRegistryOptions = {}) {}

  /** Registers a prompt template with optional discovery metadata. */
  register(registration: PromptRegistration): void {
    const { template } = registration;
    const key = registryKey(template.id, template.version);

    if (this.options.strict && this.templates.has(key)) {
      throw new Error(
        `Prompt '${template.id}' version '${template.version}' is already registered.`,
      );
    }

    this.templates.set(key, registration);
    this.indexDepartment(template.id, template.department);
    this.indexTags(template.id, template.tags);
    this.updateLatestVersion(template.id, template.version);
  }

  /** Removes a specific prompt version from the registry. */
  unregister(id: string, version: string): boolean {
    const key = registryKey(id, version);
    const existing = this.templates.get(key);
    if (!existing) return false;

    this.templates.delete(key);
    this.removeFromDepartmentIndex(id, existing.template.department);
    this.removeFromTagIndex(id);
    this.recomputeLatestVersion(id);
    return true;
  }

  /** Resolves a prompt by id and optional version. Uses latest when version omitted. */
  lookup(id: string, version?: string): PromptTemplate | undefined {
    const resolvedVersion = version ?? this.latestVersion.get(id);
    if (!resolvedVersion) return undefined;

    return this.templates.get(registryKey(id, resolvedVersion))?.template;
  }

  /** Resolves the latest registered version for a prompt id. */
  lookupLatest(id: string): PromptTemplate | undefined {
    return this.lookup(id);
  }

  /** Returns true when a prompt id (and optional version) exists. */
  has(id: string, version?: string): boolean {
    if (version) {
      return this.templates.has(registryKey(id, version));
    }
    return this.latestVersion.has(id);
  }

  /** Lists all registered templates sorted by id then version descending. */
  list(): PromptTemplate[] {
    return [...this.templates.values()]
      .map((entry) => entry.template)
      .sort((a, b) => {
        if (a.id !== b.id) return a.id.localeCompare(b.id);
        return b.version.localeCompare(a.version);
      });
  }

  /** Discovers templates by department and/or tag. */
  discover(query: { department?: string; tag?: string }): PromptTemplate[] {
    let ids: Set<string> | undefined;

    if (query.department) {
      ids = new Set(this.departmentIndex.get(query.department) ?? []);
    }

    if (query.tag) {
      const tagIds = this.tagIndex.get(query.tag) ?? new Set<string>();
      ids = ids ? new Set([...ids].filter((id) => tagIds.has(id))) : new Set(tagIds);
    }

    if (!ids) {
      return this.list();
    }

    return [...ids]
      .map((id) => this.lookupLatest(id))
      .filter((template): template is PromptTemplate => template !== undefined);
  }

  /** Returns all registered versions for a prompt id. */
  listVersions(id: string): PromptTemplate[] {
    return [...this.templates.values()]
      .map((entry) => entry.template)
      .filter((template) => template.id === id)
      .sort((a, b) => b.version.localeCompare(a.version));
  }

  /** Clears all registered templates. Intended for tests. */
  clear(): void {
    this.templates.clear();
    this.latestVersion.clear();
    this.departmentIndex.clear();
    this.tagIndex.clear();
  }

  private updateLatestVersion(id: string, version: string): void {
    const current = this.latestVersion.get(id);
    if (!current) {
      this.latestVersion.set(id, version);
      return;
    }

    this.latestVersion.set(id, this.pickLatestVersion(current, version));
  }

  private recomputeLatestVersion(id: string): void {
    const versions = this.listVersions(id).map((template) => template.version);
    if (versions.length === 0) {
      this.latestVersion.delete(id);
      return;
    }

    this.latestVersion.set(
      id,
      versions.reduce((latest, version) => this.pickLatestVersion(latest, version)),
    );
  }

  private pickLatestVersion(a: string, b: string): string {
    try {
      return comparePromptVersions(parsePromptVersion(a), parsePromptVersion(b)) >= 0
        ? a
        : b;
    } catch {
      return a.localeCompare(b) >= 0 ? a : b;
    }
  }

  private indexDepartment(id: string, department: string): void {
    const ids = this.departmentIndex.get(department) ?? new Set<string>();
    ids.add(id);
    this.departmentIndex.set(department, ids);
  }

  private removeFromDepartmentIndex(id: string, department: string): void {
    const ids = this.departmentIndex.get(department);
    if (!ids) return;

    ids.delete(id);
    if (ids.size === 0) {
      this.departmentIndex.delete(department);
    }
  }

  private indexTags(id: string, tags: readonly string[]): void {
    for (const tag of tags) {
      const ids = this.tagIndex.get(tag) ?? new Set<string>();
      ids.add(id);
      this.tagIndex.set(tag, ids);
    }
  }

  private removeFromTagIndex(id: string): void {
    for (const [tag, ids] of this.tagIndex.entries()) {
      ids.delete(id);
      if (ids.size === 0) {
        this.tagIndex.delete(tag);
      }
    }
  }
}

let defaultRegistry: PromptRegistry | undefined;

/** Returns the process-wide default prompt registry. */
export function getPromptRegistry(): PromptRegistry {
  if (!defaultRegistry) {
    defaultRegistry = new PromptRegistry();
  }
  return defaultRegistry;
}

/** Resets the process-wide default prompt registry. Intended for tests. */
export function resetPromptRegistry(): void {
  defaultRegistry?.clear();
  defaultRegistry = undefined;
}
