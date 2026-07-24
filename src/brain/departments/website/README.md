# Website Department — Sprint 1

The Website Department produces **reasoning-only** `WebsitePlan` artifacts. It does not generate HTML, React, or visual designs. Sprint 1 delivers the department core: lifecycle, schemas, validation, input normalization, and placeholder planner outputs.

## Status

| Sprint | Scope | Status |
|---|---|---|
| **Sprint 1** | Core lifecycle, v1.1 schemas, placeholders | **Complete** |
| Sprint 2 | Brand, Journey, Architecture planners | Planned |
| Sprint 3 | Pages, Conversion, SEO planners | Planned |
| Sprint 4 | BuilderFeedback regeneration loop | Planned |

## Architecture

```
WebsiteDepartmentRequest
        ↓
   InputBuilder (normalize + completeness)
        ↓
   Placeholder Planners (Sprint 1 stubs)
        ↓
   OutputAssembler → WebsitePlan + WebsiteDepartmentResult
```

Built on the [Department SDK](../../sdk/README.md) — extends `BaseDepartment` and follows the standard lifecycle:

```
Validate → Build Context → Execute → Summarize → Telemetry → Return
```

## File Structure

```
website/
├── website-department.ts   # BaseDepartment implementation
├── schema.ts               # v1.1 public types (WebsitePlan, requests, feedback)
├── types.ts                # Internal constants and planner contracts
├── input-builder.ts        # Request normalization + completeness scoring
├── placeholders.ts         # Sprint 1 placeholder planner outputs
├── output-assembler.ts     # WebsitePlan assembly
├── utils.ts                # Shared pure helpers (status, regulated, options)
├── index.ts                # Public exports + registry registration
└── README.md
```

## Schema Version

All plans use `schemaVersion: "1.1.0"`.

v1.1 additions over v1.0:

- `brandIdentity` — strategic brand layer (no UI tokens)
- `userJourney` — five-stage journey with CTAs, objections, metrics
- `siteArchitecture.architectureDecision` — scored architecture engine output
- `BuilderFeedback` — iterative regeneration contract (input only in Sprint 1)

## Quick Start

```typescript
import {
  getWebsiteDepartment,
  InputBuilder,
  WEBSITE_PLAN_SCHEMA_VERSION,
  type WebsiteDepartmentRequest,
} from "@/src/brain/departments/website";

const request: WebsiteDepartmentRequest = {
  requestId: "req-web-001",
  clientName: "Summit HVAC",
  industry: "HVAC",
  country: "Canada",
  goals: ["Generate emergency service leads"],
  targetAudience: "Homeowners needing heating and cooling service",
  services: ["website", "ai-chatbots"],
  budget: 4500,
  timeline: "6 weeks",
  regulated: false,
};

const department = getWebsiteDepartment();
const result = await department.runWebsitePlan(request);

console.log(result.websitePlan?.schemaVersion); // "1.1.0"
console.log(result.status);                     // "complete" | "partial" | "failed"
console.log(result.stepsExecuted);              // includes placeholder planners
```

### Validation and Status

```typescript
const department = getWebsiteDepartment();

// Validation only (SDK ValidationReport)
const report = department.validate(request);
if (!report.valid) {
  console.log(report.errors);
}

// Full lifecycle with SDK telemetry
const runResult = await department.run(request);
console.log(runResult.telemetry.lifecycleSteps);
console.log(runResult.summary?.confidence); // "low" | "medium" | "high"
```

### Build from Brain Input Params

```typescript
import { InputBuilder } from "@/src/brain/departments/website";

const request = InputBuilder.fromParams({
  requestId: "req-001",
  request: {
    industry: "Dental",
    goal: "Book new patient appointments",
    budget: 3500,
    services: ["website"],
    metadata: {
      businessName: "Bright Smile Dental",
      country: "Canada",
      targetAudience: "Local families",
      timeline: "4 weeks",
    },
  },
});
```

## Registry

The department auto-registers on module import:

| Property | Value |
|---|---|
| ID | `website-department` |
| Task type | `plan_website` |
| Tags | `website`, `planning`, `department` |
| Priority | `10` |

Manual registration:

```typescript
import { registerWebsiteDepartment, getDepartmentRegistry } from "@/src/brain";

registerWebsiteDepartment(getDepartmentRegistry());
const resolved = getDepartmentRegistry().resolve("website-department");
```

## Validation

Uses SDK `validateRequest()` with:

- Required fields: `requestId`, `clientName`, `industry`, `country`, `goals`, `targetAudience`, `services`, `budget`
- Business rules: budget > 0 (error), low budget warning, missing timeline warning

## Placeholder Planners (Sprint 1)

Real planners are deferred. Sprint 1 executes these stub steps:

| Planner ID | Output |
|---|---|
| `brand-planner` | Placeholder `BrandIdentity` |
| `journey-planner` | Five-stage `UserJourney` |
| `architecture-planner` | Scored `ArchitectureDecision` |
| `pages-planner` | Home, Services, Contact pages |
| `conversion-planner` | CTA + lead capture strategy |
| `seo-planner` | Baseline `SEOPlan` |

Each placeholder is clearly labeled in plan assumptions and summaries.

## BuilderFeedback (v1.1)

Regeneration entry point for future sprints:

```typescript
const result = await department.runWebsitePlan(request, feedback);
// result.regenerationApplied === true
// result.websitePlan.version === 2
```

Sprint 1 records feedback issue IDs as remaining — resolution logic arrives in Sprint 4.

## Extension Guide — Adding a Planner (Sprint 2+)

1. Create `planners/<name>-planner.ts` implementing a focused interface.
2. Replace the matching stub in `placeholders.ts`.
3. Wire planner into `WebsiteDepartment.executeDepartment()`.
4. Add planner-specific tests.
5. Do **not** change public schemas without a schema version bump.

## Best Practices

1. **Keep plans reasoning-only** — no CSS, hex colors, or component specs.
2. **Preserve metadata** — always pass client discovery fields through `InputBuilder`.
3. **Use knowledge registry** — read industry profiles from `DepartmentContext.knowledge`.
4. **Report completeness honestly** — partial status when input is incomplete.
5. **Version plans** — increment `version` on regeneration, link `priorPlanId`.

## Testing

```bash
npm run test:brain:website
```

## Backward Compatibility

- Does not modify Sales Department, Brain Runtime, or public APIs.
- Additive exports from `@/src/brain` only.
- Existing `/api/brain` behavior unchanged until explicitly wired.
