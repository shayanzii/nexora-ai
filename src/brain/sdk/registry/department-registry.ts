import type {
  Department,
  DepartmentRegistration,
} from "../interfaces/department";

export interface DepartmentRegistryOptions {
  /** When true, registering duplicate IDs throws. Default false (overwrites). */
  strict?: boolean;
}

/**
 * Registry for department discovery and dependency injection.
 * Independent from AgentRegistry — departments are a higher-level abstraction.
 */
export class DepartmentRegistry {
  private readonly departments = new Map<string, DepartmentRegistration>();
  private readonly tagIndex = new Map<string, Set<string>>();
  private readonly taskTypeIndex = new Map<string, Set<string>>();

  constructor(private readonly options: DepartmentRegistryOptions = {}) {}

  /** Registers a department with optional discovery metadata. */
  register<TRequest, TResult>(
    registration: DepartmentRegistration<TRequest, TResult>,
  ): void {
    const { department } = registration;

    if (this.options.strict && this.departments.has(department.id)) {
      throw new Error(`Department '${department.id}' is already registered.`);
    }

    this.departments.set(department.id, registration as DepartmentRegistration);
    this.indexTags(department.id, registration.tags);
    this.indexTaskTypes(department.id, registration.supportedTaskTypes);
  }

  /** Removes a department from the registry. */
  unregister(departmentId: string): boolean {
    const existing = this.departments.get(departmentId);
    if (!existing) return false;

    this.departments.delete(departmentId);
    this.removeFromIndex(this.tagIndex, departmentId);
    this.removeFromIndex(this.taskTypeIndex, departmentId);
    return true;
  }

  /** Resolves a department by ID. */
  resolve<TRequest = unknown, TResult = unknown>(
    departmentId: string,
  ): Department<TRequest, TResult> | undefined {
    return this.departments.get(departmentId)?.department as
      | Department<TRequest, TResult>
      | undefined;
  }

  /** Discovers departments by tag or task type. */
  discover(query: { tag?: string; taskType?: string }): DepartmentRegistration[] {
    let ids: Set<string> | undefined;

    if (query.tag) {
      ids = new Set(this.tagIndex.get(query.tag) ?? []);
    }

    if (query.taskType) {
      const taskIds = this.taskTypeIndex.get(query.taskType) ?? new Set();
      ids = ids ? new Set([...ids].filter((id) => taskIds.has(id))) : new Set(taskIds);
    }

    if (!ids) {
      return this.list();
    }

    return [...ids]
      .map((id) => this.departments.get(id))
      .filter((entry): entry is DepartmentRegistration => entry !== undefined)
      .sort((a, b) => b.priority - a.priority);
  }

  /** Lists all registered departments sorted by priority. */
  list(): DepartmentRegistration[] {
    return [...this.departments.values()].sort((a, b) => b.priority - a.priority);
  }

  /** Returns true if department is registered. */
  has(departmentId: string): boolean {
    return this.departments.has(departmentId);
  }

  /** Clears all registrations — useful for testing. */
  clear(): void {
    this.departments.clear();
    this.tagIndex.clear();
    this.taskTypeIndex.clear();
  }

  private indexTags(departmentId: string, tags: string[]): void {
    for (const tag of tags) {
      const set = this.tagIndex.get(tag) ?? new Set();
      set.add(departmentId);
      this.tagIndex.set(tag, set);
    }
  }

  private indexTaskTypes(departmentId: string, taskTypes: string[]): void {
    for (const taskType of taskTypes) {
      const set = this.taskTypeIndex.get(taskType) ?? new Set();
      set.add(departmentId);
      this.taskTypeIndex.set(taskType, set);
    }
  }

  private removeFromIndex(index: Map<string, Set<string>>, departmentId: string): void {
    for (const [key, set] of index.entries()) {
      set.delete(departmentId);
      if (set.size === 0) index.delete(key);
    }
  }
}

let defaultRegistry: DepartmentRegistry | null = null;

/** Returns the singleton department registry. */
export function getDepartmentRegistry(): DepartmentRegistry {
  if (!defaultRegistry) {
    defaultRegistry = new DepartmentRegistry();
  }
  return defaultRegistry;
}

/** Resets the singleton — useful for testing. */
export function resetDepartmentRegistry(): void {
  defaultRegistry = null;
}
