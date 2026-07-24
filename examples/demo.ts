/**
 * Nexora Brain — End-to-End Demo (Sprint 9.2)
 *
 * Customer → CEO Agent → Project Orchestrator → Sales Agent → Proposal
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import type {
  CEOBusinessAnalysis,
  CEOCustomerRequest,
  PricingResult,
  ProjectExecutionPlan,
  SalesResult,
  WebsiteExecutionBlueprint,
} from "@/src/brain";

// ── Environment (must run before Brain modules load) ──────────────────────

function loadEnvLocal(): void {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator <= 0) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

// ── Demo request ──────────────────────────────────────────────────────────

const DEMO_REQUEST: CEOCustomerRequest = {
  requestId: "demo-smile-dental-001",
  company: "Smile Dental",
  industry: "Dental Clinic",
  goal: "Increase booked appointments",
  budget: 7000,
  services: ["website", "seo", "chatbot"],
  metadata: {
    futurePlans: ["Mobile App"],
    targetAudience: "Local patients seeking preventative and cosmetic dental care",
    country: "Canada",
    regulated: true,
  },
};

// ── Formatting helpers ────────────────────────────────────────────────────

const LINE = "═".repeat(68);

function printSection(title: string): void {
  console.log(`\n${LINE}`);
  console.log(title);
  console.log(LINE);
}

function printField(label: string, value: string): void {
  console.log(`${label.padEnd(28)} ${value}`);
}

function printList(label: string, items: readonly string[], empty = "None"): void {
  console.log(`${label.padEnd(28)} ${items.length > 0 ? "" : empty}`);
  for (const item of items) {
    console.log(`${"".padEnd(28)} • ${item}`);
  }
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatConfidence(score: number): string {
  return `${Math.round(score * 100)}%`;
}

function normalizeServices(services: readonly string[]): string[] {
  return services.map((service) => {
    const normalized = service.toLowerCase();
    if (normalized.includes("chatbot")) return "AI Chatbot";
    if (normalized === "seo") return "SEO";
    if (normalized.includes("website")) return "Website";
    return service;
  });
}

function readFutureUpsells(request: CEOCustomerRequest): string[] {
  const plans = request.metadata?.futurePlans;
  if (!Array.isArray(plans)) return [];
  return plans.filter((plan): plan is string => typeof plan === "string");
}

// ── Output printers ───────────────────────────────────────────────────────

function printCustomerRequest(request: CEOCustomerRequest): void {
  printSection("Customer Request");
  printField("Company", request.company ?? "—");
  printField("Industry", request.industry);
  printField("Goal", request.goal);
  printField("Budget", formatCurrency(request.budget, "CAD"));
  printList("Requested Services", normalizeServices(request.services ?? []));
  printList("Future Plans", readFutureUpsells(request));
}

function printAnalysis(
  analysis: CEOBusinessAnalysis,
  request: CEOCustomerRequest,
  usedLlm: boolean,
): void {
  printSection("CEO Business Analysis");
  printField("Industry", analysis.industry);
  printList("Business Goals", analysis.goals);
  printField("Estimated Complexity", analysis.estimatedComplexity.toUpperCase());
  printField(
    "Estimated Budget",
    `${formatCurrency(analysis.estimatedBudget.min, analysis.estimatedBudget.currency)} – ${formatCurrency(analysis.estimatedBudget.max, analysis.estimatedBudget.currency)}`,
  );
  printField(
    "Estimated Timeline",
    `${analysis.estimatedTimeline.minWeeks}–${analysis.estimatedTimeline.maxWeeks} weeks`,
  );
  printList("Recommended Departments", analysis.recommendedDepartments);
  printList("Requirements", analysis.requirements);
  printList("Missing Information", analysis.missingInformation);
  printField("Confidence Score", formatConfidence(analysis.confidence));
  printField("Execution Path", usedLlm ? "Live LLM (OpenAI via Gateway)" : "Deterministic fallback");
  printList("Future Upsells", readFutureUpsells(request));
}

function printExecutionPlan(plan: ProjectExecutionPlan): void {
  printSection("Project Execution Plan");
  printField("Request ID", plan.requestId);
  printField("Business", plan.business);
  printField("Estimated Duration", `${plan.estimatedTotalDuration} hours`);
  printField("Department Chain", plan.departmentOrder.join(" → "));
  printList("Tasks", plan.tasks.map((task) => `${task.department}: ${task.title} (${task.status})`));
  printField("Summary", plan.summary);
}

function printSalesResult(result: SalesResult): void {
  printSection("Sales Agent — Proposal");
  printField("Task ID", result.taskId);
  printField("Confidence", formatConfidence(result.confidenceScore));
  printField("Customer Summary", result.customerSummary);

  printList("Business Challenges", result.businessChallenges.slice(0, 5));

  printList(
    "Recommended Services",
    result.recommendedServices.map(
      (service) => `${service.name} (${service.priority}): ${service.rationale}`,
    ),
  );

  printList(
    "Discovery Questions",
    result.discoveryQuestions.slice(0, 6).map((question) => question.question),
  );

  printSection("Proposal Document");
  printField("Executive Summary", result.proposal.executiveSummary);
  printList("Expected Outcomes", result.proposal.expectedOutcomes.slice(0, 5));
  printList(
    "Implementation Roadmap",
    result.proposal.implementationRoadmap.map(
      (phase) => `Phase ${phase.phase}: ${phase.name} (${phase.durationWeeks} weeks)`,
    ),
  );
  printList("Next Steps", result.proposal.nextSteps);
}

function printPricingResult(pricing: PricingResult): void {
  printSection("Pricing Engine — Quote");
  printField("One-Time Investment", formatCurrency(pricing.oneTimePrice, pricing.currency));
  printField(
    "Monthly Services",
    `${formatCurrency(pricing.monthlyRecurringRevenue, pricing.currency)}/month`,
  );
  printField("Estimated Internal Cost", formatCurrency(pricing.estimatedCost, pricing.currency));
  printField("Estimated Gross Profit", formatCurrency(pricing.grossProfit, pricing.currency));
  printField("Profit Margin", `${pricing.profitMargin}%`);
  printField("Payment Plan", pricing.paymentPlan.name);
  printField("Confidence", formatConfidence(pricing.confidenceScore));

  printSection("Pricing Breakdown — One-Time");
  for (const item of pricing.pricingBreakdown.oneTimeItems) {
    printField(item.label, formatCurrency(item.amount, pricing.currency));
  }
  printField("Total One-Time", formatCurrency(pricing.oneTimePrice, pricing.currency));

  printSection("Pricing Breakdown — Monthly");
  for (const item of pricing.pricingBreakdown.monthlyItems) {
    printField(item.label, `${formatCurrency(item.amount, pricing.currency)}/month`);
  }
  printField(
    "Total Monthly",
    `${formatCurrency(pricing.monthlyRecurringRevenue, pricing.currency)}/month`,
  );

  printList(
    "Recommended Upsells",
    pricing.recommendedUpsells.map((upsell) => upsell.name),
  );
}

function printWebsiteBlueprint(blueprint: WebsiteExecutionBlueprint): void {
  printSection("Website Execution Agent — Blueprint");
  printField("Website Type", blueprint.websiteTypeLabel);
  printField("Confidence", formatConfidence(blueprint.confidenceScore));
  printField("Project Summary", blueprint.projectSummary);

  printList("Pages", blueprint.pages.map((page) => page.title));
  printList("Components", blueprint.components.map((component) => component.name));

  printSection("SEO Plan");
  printField("Primary Keyword", blueprint.seoPlan.primaryKeywords[0] ?? "—");
  printList("Secondary Keywords", blueprint.seoPlan.secondaryKeywords.slice(0, 4));
  printList("Schema", blueprint.seoPlan.schemaRecommendations);

  printSection("Recommended Stack");
  printField("Framework", blueprint.recommendedStack.framework);
  printField("Styling", blueprint.recommendedStack.styling);
  printField("Language", blueprint.recommendedStack.language);
  printField("Hosting", blueprint.recommendedStack.hosting);

  printSection("Performance & Deployment");
  printField("Lighthouse Target", `${blueprint.performanceStrategy.lighthouseTarget}+`);
  printField("Platform", blueprint.deploymentPlan.platform);
  printField(
    "Timeline",
    `${blueprint.estimatedTimeline.minWeeks}–${blueprint.estimatedTimeline.maxWeeks} weeks`,
  );

  printSection("Design System");
  printList("Color Palette", blueprint.designSystem.colorPalette);
  printField("Visual Style", blueprint.designSystem.visualStyle);
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const {
    CEOIntelligenceAgent,
    ProjectOrchestrator,
    SalesExecutionAgent,
    PricingEngine,
    WebsiteExecutionAgent,
    getPricingCatalog,
    formatDepartmentChain,
    getLLMGateway,
    getPromptEngine,
    getProviderRegistry,
    registerOpenAIProvider,
    resolveSalesTask,
  } = await import("@/src/brain");

  console.log("\nNexora Brain — End-to-End Demo");
  console.log("Sprint 9.4 · Customer → CEO → Orchestrator → Sales → Pricing → Website\n");

  registerOpenAIProvider();

  const promptEngine = getPromptEngine();
  const registry = getProviderRegistry();
  const openaiProvider = registry.resolve("openai") as { configured?: boolean } | undefined;
  const openaiConfigured = openaiProvider?.configured === true;

  printSection("Pipeline Validation");
  printField(
    "Prompt Engine",
    promptEngine.has("ceo.business-analysis")
      ? "✓ ceo.business-analysis registered"
      : "✗ missing prompt",
  );
  printField(
    "LLM Gateway",
    typeof getLLMGateway().generate === "function" ? "✓ gateway ready" : "✗ gateway unavailable",
  );
  printField("OpenAI Provider", openaiProvider ? "✓ registered" : "✗ not registered");
  printField(
    "OpenAI API Key",
    openaiConfigured ? "✓ configured" : "✗ not set (CEO fallback mode)",
  );
  printField("Project Orchestrator", "✓ planning layer ready");
  printField("Sales Agent", "✓ executable department ready");
  printField("Pricing Engine", "✓ deterministic pricing ready");
  printField("Website Execution Agent", "✓ blueprint planning ready");

  printCustomerRequest(DEMO_REQUEST);

  let analysis: CEOBusinessAnalysis;
  let usedLlm = false;

  if (openaiConfigured) {
    try {
      const liveAgent = new CEOIntelligenceAgent({
        config: { fallbackOnLlmFailure: false, model: "gpt-4.1" },
      });

      printSection("CEO Agent — analyze()");
      const startedAt = Date.now();
      analysis = await liveAgent.analyze(DEMO_REQUEST);
      usedLlm = true;
      printField("Completed in", `${Date.now() - startedAt}ms`);
    } catch {
      console.log("\n  ℹ LLM unavailable — using deterministic CEO fallback\n");
      const fallbackAgent = new CEOIntelligenceAgent();
      analysis = await fallbackAgent.analyze(DEMO_REQUEST);
    }
  } else {
    printSection("CEO Agent — analyze()");
    analysis = await new CEOIntelligenceAgent().analyze(DEMO_REQUEST);
  }

  printAnalysis(analysis, DEMO_REQUEST, usedLlm);

  printSection("Project Orchestrator — orchestrate()");
  const orchestrator = new ProjectOrchestrator(() => {});
  const startedOrchestrator = Date.now();
  const plan = orchestrator.orchestrate({
    requestId: DEMO_REQUEST.requestId ?? "demo-smile-dental-001",
    analysis,
    services: DEMO_REQUEST.services,
  });
  printField("Completed in", `${Date.now() - startedOrchestrator}ms`);
  printField("Department Order", formatDepartmentChain(plan.departmentOrder));
  printExecutionPlan(plan);

  printSection("Sales Agent — execute()");
  const salesTask = resolveSalesTask(plan);
  const salesAgent = new SalesExecutionAgent(() => {});
  const startedSales = Date.now();
  const salesResult = salesAgent.execute({
    task: salesTask,
    analysis,
    plan,
    context: {
      budget: DEMO_REQUEST.budget,
      country:
        typeof DEMO_REQUEST.metadata?.country === "string"
          ? DEMO_REQUEST.metadata.country
          : undefined,
      targetAudience:
        typeof DEMO_REQUEST.metadata?.targetAudience === "string"
          ? DEMO_REQUEST.metadata.targetAudience
          : undefined,
      services: DEMO_REQUEST.services,
      metadata: DEMO_REQUEST.metadata,
    },
  });
  printField("Completed in", `${Date.now() - startedSales}ms`);
  printSalesResult(salesResult);

  printSection("Pricing Engine — price()");
  const pricingEngine = new PricingEngine(getPricingCatalog(), () => {});
  const startedPricing = Date.now();
  const pricingResult = pricingEngine.price(salesResult);
  printField("Completed in", `${Date.now() - startedPricing}ms`);
  printPricingResult(pricingResult);

  printSection("Website Execution Agent — plan()");
  const websiteAgent = new WebsiteExecutionAgent(() => {});
  const startedWebsite = Date.now();
  const websiteBlueprint = websiteAgent.plan(
    {
      analysis,
      plan,
      salesResult,
      pricingResult,
      metadata: DEMO_REQUEST.metadata,
    },
    {
      city: "Toronto",
      country:
        typeof DEMO_REQUEST.metadata?.country === "string"
          ? DEMO_REQUEST.metadata.country
          : "Canada",
    },
  );
  printField("Completed in", `${Date.now() - startedWebsite}ms`);
  printWebsiteBlueprint(websiteBlueprint);

  printSection("Pipeline Complete");
  printField("Flow", "Customer → CEO → Orchestrator → Sales → Pricing → Website");
  printField("Website Type", websiteBlueprint.websiteTypeLabel);
  printField("Pages Planned", `${websiteBlueprint.pages.length}`);
  printField("Components", `${websiteBlueprint.components.length}`);
  printField("Primary SEO", websiteBlueprint.seoPlan.primaryKeywords[0] ?? "—");
  printField("One-Time Price", formatCurrency(pricingResult.oneTimePrice, pricingResult.currency));
  printField(
    "Monthly Revenue",
    `${formatCurrency(pricingResult.monthlyRecurringRevenue, pricingResult.currency)}/month`,
  );
  console.log("");
}

main().catch((error: unknown) => {
  console.error("\nDemo failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
