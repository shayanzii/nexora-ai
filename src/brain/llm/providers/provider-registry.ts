import { LLMProviderNotFoundError } from "../errors/llm-errors";
import type { ModelCapability } from "../types/model";
import type { LLMProvider, LLMProviderRegistration } from "./base-provider";

export interface ProviderRegistryOptions {
  /** When true, registering duplicate provider IDs throws. Default false (overwrites). */
  strict?: boolean;
}

/**
 * Open registry for LLM providers.
 * New providers (OpenAI, Anthropic, Google, Grok, local models) register here
 * without modifying this class.
 */
export class ProviderRegistry {
  private readonly providers = new Map<string, LLMProviderRegistration>();
  private readonly tagIndex = new Map<string, Set<string>>();

  constructor(private readonly options: ProviderRegistryOptions = {}) {}

  /** Registers a provider with optional discovery metadata. */
  register(registration: LLMProviderRegistration): void {
    const { provider } = registration;

    if (this.options.strict && this.providers.has(provider.id)) {
      throw new Error(`LLM provider '${provider.id}' is already registered.`);
    }

    this.providers.set(provider.id, registration);
    this.indexTags(provider.id, registration.tags);
  }

  /** Removes a provider from the registry. */
  unregister(providerId: string): boolean {
    const existing = this.providers.get(providerId);
    if (!existing) return false;

    this.providers.delete(providerId);
    this.removeFromTagIndex(providerId);
    return true;
  }

  /** Resolves a provider by ID. */
  resolve(providerId: string): LLMProvider | undefined {
    return this.providers.get(providerId)?.provider;
  }

  /** Resolves a provider by ID or throws. */
  require(providerId: string): LLMProvider {
    const provider = this.resolve(providerId);
    if (!provider) {
      throw new LLMProviderNotFoundError(providerId);
    }
    return provider;
  }

  /** Lists all registered providers sorted by priority (descending). */
  list(): LLMProviderRegistration[] {
    return [...this.providers.values()].sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
    );
  }

  /** Discovers providers that support a capability, optionally filtered by tag. */
  discover(query: {
    capability?: ModelCapability;
    tag?: string;
    modelId?: string;
  }): LLMProviderRegistration[] {
    let registrations = this.list();

    if (query.tag) {
      const taggedIds = this.tagIndex.get(query.tag) ?? new Set<string>();
      registrations = registrations.filter((entry) =>
        taggedIds.has(entry.provider.id),
      );
    }

    if (query.capability) {
      registrations = registrations.filter((entry) =>
        entry.provider.supports(query.capability!, query.modelId),
      );
    }

    return registrations;
  }

  /** Returns true when a provider ID is registered. */
  has(providerId: string): boolean {
    return this.providers.has(providerId);
  }

  /** Clears all registered providers. Intended for tests. */
  clear(): void {
    this.providers.clear();
    this.tagIndex.clear();
  }

  private indexTags(providerId: string, tags: readonly string[] = []): void {
    this.removeFromTagIndex(providerId);

    for (const tag of tags) {
      const ids = this.tagIndex.get(tag) ?? new Set<string>();
      ids.add(providerId);
      this.tagIndex.set(tag, ids);
    }
  }

  private removeFromTagIndex(providerId: string): void {
    for (const [tag, ids] of this.tagIndex.entries()) {
      ids.delete(providerId);
      if (ids.size === 0) {
        this.tagIndex.delete(tag);
      }
    }
  }
}

let defaultRegistry: ProviderRegistry | undefined;

/** Returns the process-wide default provider registry. */
export function getProviderRegistry(): ProviderRegistry {
  if (!defaultRegistry) {
    defaultRegistry = new ProviderRegistry();
  }
  return defaultRegistry;
}

/** Resets the process-wide default registry. Intended for tests. */
export function resetProviderRegistry(): void {
  defaultRegistry?.clear();
  defaultRegistry = undefined;
}
