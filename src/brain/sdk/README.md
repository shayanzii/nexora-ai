# Nexora Brain — Department SDK

The Department SDK provides a **common foundation** for every current and future Nexora Brain department. It standardizes validation, context, telemetry, lifecycle, and registration — so departments implement **business logic only**.

Existing departments (Sales, Website) are **not migrated**. They continue to operate unchanged. New departments should extend this SDK.

## Philosophy

| Principle | Description |
|---|---|
| **Infrastructure, not business logic** | SDK handles lifecycle; departments handle domain reasoning |
| **Backward compatible** | Additive only — no changes to existing Agent or Department code |
| **Immutable context** | `DepartmentContext` is frozen after creation |
| **Knowledge-driven** | Every department gets `KnowledgeRegistry` via context |
| **Observable** | Built-in telemetry — no external providers required |
| **Typed** | Generic `Department<TRequest, TResult>` contract |

## Standard Lifecycle

Every department follows this execution order:

```
Validate
    ↓
Build Context
    ↓
Execute
    ↓
Summarize
    ↓
Telemetry
    ↓
Return DepartmentRunResult
```

Implemented by `BaseDepartment.run()`. Subclasses override:

- `validateRequest()` — validation rules
- `createContextParams()` — context mapping
- `executeDepartment()` — core business logic
- `buildSummary()` — human-readable summary

## Quick Start

```typescript
import {
  BaseDepartment,
  buildDepartmentContext,
  validateRequest,
  type DepartmentContext,
  type ValidationReport,
} from "@/src/brain/sdk";

interface MyDepartmentRequest {
  requestId: string;
  industry: string;
  goal: string;
}

interface MyDepartmentResult {
  plan: string;
}

class MarketingDepartment extends BaseDepartment<
  MyDepartmentRequest,
  MyDepartmentResult
> {
  readonly id = "marketing-department";
  readonly name = "Marketing Department";
  readonly description = "Plans marketing strategy.";

  protected validateRequest(request: MyDepartmentRequest): ValidationReport {
    return validateRequest(request, [
      { field: "requestId", required: true },
      { field: "industry", required: true },
      { field: "goal", required: true },
    ]);
  }

  protected createContextParams(request: MyDepartmentRequest) {
    return {
      requestId: request.requestId,
      request: {
        industry: request.industry,
        goal: request.goal,
        budget: 0,
        services: [],
      },
    };
  }

  protected async executeDepartment(
    context: DepartmentContext,
    request: MyDepartmentRequest,
  ): Promise<MyDepartmentResult> {
    const industry = context.knowledge.getIndustry(request.industry);
    return { plan: `Marketing plan for ${industry?.name ?? request.industry}` };
  }

  protected buildSummary(_context: DepartmentContext, result: MyDepartmentResult) {
    return {
      departmentId: this.id,
      requestId: _context.requestId,
      headline: result.plan,
      nextStep: "Review marketing plan.",
      warnings: [],
      confidence: "high",
    };
  }
}

const dept = new MarketingDepartment();
const output = await dept.run({
  requestId: "req-001",
  industry: "HVAC",
  goal: "Generate leads",
});
```

## Module Reference

```
src/brain/sdk/
├── interfaces/     Department contract, errors
├── base/           BaseDepartment abstract class
├── context/        DepartmentContext builder
├── validation/     Validation framework
├── telemetry/      TelemetryCollector
├── registry/       DepartmentRegistry
├── utils/          Lifecycle helpers
└── index.ts        Public exports
```

## Department Registry

```typescript
import { getDepartmentRegistry } from "@/src/brain/sdk";

const registry = getDepartmentRegistry();

registry.register({
  department: new MarketingDepartment(),
  tags: ["marketing", "strategy"],
  supportedTaskTypes: ["plan_marketing"],
  priority: 10,
});

registry.resolve("marketing-department");
registry.discover({ tag: "marketing" });
registry.list();
registry.unregister("marketing-department");
```

## Validation Framework

```typescript
import { validateRequest, mergeValidationReports } from "@/src/brain/sdk";

const report = validateRequest(
  request,
  [
    { field: "industry", required: true, label: "Industry" },
    { field: "budget", required: true },
  ],
  [
    (req) =>
      req.budget < 500
        ? { code: "LOW_BUDGET", message: "Budget may limit scope.", severity: "warning", field: "budget" }
        : null,
  ].filter(Boolean) as any,
);
```

Returns: `{ valid, errors, warnings, info, confidenceScore, confidence }`

## Telemetry

Internal only — no external providers.

```typescript
const collector = new TelemetryCollector("my-department", "req-001");
collector.recordLifecycleStep("validate", Date.now(), true);
await collector.trackPlanner("seo-planner", async () => { /* ... */ });
const telemetry = collector.complete(true);
// telemetry.totalDurationMs, lifecycleSteps, plannerTimings, warnings, failures
```

## Error Model

| Error | Code | When |
|---|---|---|
| `ValidationError` | `VALIDATION_FAILED` | Request validation fails |
| `PlannerError` | `PLANNER_FAILED` | Sub-planner failure |
| `ExecutionError` | `EXECUTION_FAILED` | Department execution failure |
| `KnowledgeError` | `KNOWLEDGE_UNAVAILABLE` | Knowledge registry issue |
| `ContextBuildError` | `CONTEXT_BUILD_FAILED` | Context construction failure |
| `DepartmentError` | Base class | All department errors |

## Extension Guide — Creating a New Department

1. **Define types** — `MyDepartmentRequest`, `MyDepartmentResult`
2. **Extend `BaseDepartment`** — implement 4 protected methods
3. **Use `validateRequest()`** — declarative field rules + business validators
4. **Access knowledge** — `context.knowledge.getIndustry()` etc.
5. **Track planners** — `this.createTelemetry(requestId).trackPlanner()`
6. **Register** — `getDepartmentRegistry().register({ department, tags, supportedTaskTypes, priority })`
7. **Wire to BrainService** — opt-in flag when ready (future, not required for SDK)

## Best Practices

- **Never embed business knowledge** — use `context.knowledge`
- **Preserve metadata** — pass `request.metadata` through `createContextParams`
- **Return structured results** — no free-text-only outputs
- **Use warnings, not errors** — for non-blocking quality issues
- **Keep planners composable** — one responsibility per planner
- **Do not modify existing departments** until explicit migration is approved

## Future Compatibility

The SDK supports these future departments without modification:

| Department | Task Type (example) |
|---|---|
| Website | `plan_website` |
| Marketing | `plan_marketing` |
| Automation | `plan_automation` |
| CRM | `plan_crm` |
| Voice | `plan_voice` |
| Delivery | `plan_delivery` |

Each extends `BaseDepartment` and registers with `DepartmentRegistry`.

## Relationship to Existing Architecture

| Layer | Relationship |
|---|---|
| **Agent / BaseAgent** | Lower-level task execution — unchanged |
| **Sales Department** | Existing — not migrated |
| **Department SDK** | New infrastructure for future departments |
| **AgentRegistry** | Unchanged — departments are separate registry |
| **Knowledge Layer** | Consumed via `DepartmentContext.knowledge` |
| **BrainService** | Unchanged — departments wire in when ready |
