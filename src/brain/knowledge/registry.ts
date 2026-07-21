import {
  INDUSTRY_ALIASES,
  INDUSTRY_PROFILES,
} from "./industries";
import {
  PLAYBOOKS,
} from "./playbooks";
import {
  PRICING_ALIASES,
  PRICING_POLICY,
  SERVICE_PRICING,
} from "./pricing";
import {
  DEFAULT_CHALLENGES,
  GOAL_SERVICE_HINTS,
  GOAL_SERVICE_RATIONALES,
  PROPOSAL_TEMPLATE_BLOCKS,
} from "./templates";
import {
  KNOWLEDGE_PROMPTS,
} from "./prompts";
import {
  SERVICE_ALIASES,
  SERVICE_DEFINITIONS,
} from "./services";
import type {
  IndustryProfile,
  KnowledgePrompt,
  Playbook,
  PricingPolicy,
  ProposalTemplateBlock,
  ServiceDefinition,
  ServicePricing,
} from "./types";

/**
 * Central registry for all Nexora Brain knowledge modules.
 * Agents must request business knowledge through this registry — never embed it.
 */
export class KnowledgeRegistry {
  private readonly industries = new Map<string, IndustryProfile>();
  private readonly services = new Map<string, ServiceDefinition>();
  private readonly playbooks = new Map<string, Playbook>();
  private readonly templates = new Map<string, ProposalTemplateBlock>();
  private readonly pricing = new Map<string, ServicePricing>();
  private readonly prompts = new Map<string, KnowledgePrompt>();

  constructor() {
    this.loadDefaults();
  }

  // ── Industry ──────────────────────────────────────────────────────────

  getIndustry(id: string): IndustryProfile | undefined {
    return this.industries.get(this.resolveIndustryId(id));
  }

  getAllIndustries(): IndustryProfile[] {
    return [...this.industries.values()];
  }

  resolveIndustryId(industry: string): string {
    const normalized = industry.trim().toLowerCase();

    if (this.industries.has(normalized)) {
      return normalized;
    }

    return INDUSTRY_ALIASES[normalized] ?? normalized;
  }

  isRegulatedIndustry(industry: string): boolean {
    return this.getIndustry(industry)?.regulated ?? false;
  }

  getIndustryChallenges(industry: string): string[] {
    const profile = this.getIndustry(industry);
    return profile?.commonCustomerProblems ?? DEFAULT_CHALLENGES;
  }

  getPlaybooksByIndustry(industryId: string): Playbook[] {
    const resolved = this.resolveIndustryId(industryId);
    return this.getAllPlaybooks().filter((p) => p.industryId === resolved);
  }

  // ── Services ──────────────────────────────────────────────────────────

  getService(id: string): ServiceDefinition | undefined {
    return this.services.get(this.resolveServiceId(id));
  }

  getAllServices(): ServiceDefinition[] {
    return [...this.services.values()];
  }

  resolveServiceId(service: string): string {
    const normalized = service.trim().toLowerCase();

    if (this.services.has(normalized)) {
      return normalized;
    }

    return SERVICE_ALIASES[normalized] ?? PRICING_ALIASES[normalized] ?? normalized;
  }

  getServiceDeliverable(serviceId: string): ServiceDefinition["deliverable"] | undefined {
    return this.getService(serviceId)?.deliverable;
  }

  getGoalServiceHint(goal: string): string | undefined {
    return this.getGoalServiceHints(goal)[0];
  }

  getGoalServiceHints(goal: string): string[] {
    const lower = goal.toLowerCase();
    const hints: string[] = [];

    for (const [keyword, serviceId] of Object.entries(GOAL_SERVICE_HINTS)) {
      if (lower.includes(keyword) && !hints.includes(serviceId)) {
        hints.push(serviceId);
      }
    }

    return hints;
  }

  getGoalServiceRationale(serviceId: string): string | undefined {
    return GOAL_SERVICE_RATIONALES[serviceId];
  }

  // ── Playbooks ─────────────────────────────────────────────────────────

  getPlaybook(id: string): Playbook | undefined {
    return this.playbooks.get(id);
  }

  getAllPlaybooks(): Playbook[] {
    return [...this.playbooks.values()];
  }

  // ── Templates ─────────────────────────────────────────────────────────

  getProposalTemplate(id: string): ProposalTemplateBlock | undefined {
    return this.templates.get(id);
  }

  getAllProposalTemplates(): ProposalTemplateBlock[] {
    return [...this.templates.values()];
  }

  getProposalTemplatesByCategory(
    category: ProposalTemplateBlock["category"],
  ): ProposalTemplateBlock[] {
    return this.getAllProposalTemplates().filter((t) => t.category === category);
  }

  // ── Pricing ───────────────────────────────────────────────────────────

  getPricingPolicy(): PricingPolicy {
    return PRICING_POLICY;
  }

  getPricing(serviceId: string): ServicePricing | undefined {
    const resolved = this.resolveServiceId(serviceId);
    return this.pricing.get(resolved);
  }

  getAllPricing(): ServicePricing[] {
    return [...this.pricing.values()];
  }

  estimateServicePrice(serviceId: string): number {
    const pricing = this.getPricing(serviceId);
    return pricing?.defaultEstimate ?? PRICING_POLICY.defaultServiceEstimate;
  }

  estimatePriceRange(serviceIds: string[]): { minimum: number; maximum: number } {
    const minimum = serviceIds.reduce(
      (total, id) => total + this.estimateServicePrice(id),
      0,
    );
    const multiplier = this.getPricing(serviceIds[0])?.maximumMultiplier ?? 1.35;

    return {
      minimum,
      maximum: Math.max(Math.round(minimum * multiplier), minimum),
    };
  }

  isKnownService(serviceId: string): boolean {
    return this.getService(serviceId) !== undefined;
  }

  // ── Prompts ───────────────────────────────────────────────────────────

  getPrompt(id: string): KnowledgePrompt | undefined {
    return this.prompts.get(id);
  }

  getAllPrompts(): KnowledgePrompt[] {
    return [...this.prompts.values()];
  }

  // ── Registration (for future dynamic loading) ─────────────────────────

  registerIndustry(profile: IndustryProfile): void {
    this.industries.set(profile.id, profile);
  }

  registerService(service: ServiceDefinition): void {
    this.services.set(service.id, service);
  }

  registerPlaybook(playbook: Playbook): void {
    this.playbooks.set(playbook.id, playbook);
  }

  registerPricing(pricing: ServicePricing): void {
    this.pricing.set(pricing.serviceId, pricing);
  }

  private loadDefaults(): void {
    for (const profile of INDUSTRY_PROFILES) {
      this.industries.set(profile.id, profile);
    }

    for (const service of SERVICE_DEFINITIONS) {
      this.services.set(service.id, service);
    }

    for (const playbook of PLAYBOOKS) {
      this.playbooks.set(playbook.id, playbook);
    }

    for (const template of PROPOSAL_TEMPLATE_BLOCKS) {
      this.templates.set(template.id, template);
    }

    for (const price of SERVICE_PRICING) {
      this.pricing.set(price.serviceId, price);
    }

    for (const prompt of KNOWLEDGE_PROMPTS) {
      this.prompts.set(prompt.id, prompt);
    }
  }
}

let defaultRegistry: KnowledgeRegistry | null = null;

/** Returns the singleton knowledge registry. */
export function getKnowledgeRegistry(): KnowledgeRegistry {
  if (!defaultRegistry) {
    defaultRegistry = new KnowledgeRegistry();
  }

  return defaultRegistry;
}

/** Resets the singleton — useful for testing. */
export function resetKnowledgeRegistry(): void {
  defaultRegistry = null;
}
