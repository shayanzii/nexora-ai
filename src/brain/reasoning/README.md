# Nexora Brain — Strategic Reasoning Layer

The Strategic Reasoning Layer performs **pure business reasoning** — no website generation, no code generation, no marketing copy generation. It consumes the Knowledge Layer, sales analysis, and proposal data to produce structured strategic outputs.

## Architecture

```
src/brain/reasoning/
├── index.ts                    # Public API
├── types.ts                    # Strongly typed interfaces
├── business-analysis/          # BusinessAnalysisEngine
├── opportunities/              # OpportunityEngine
├── recommendations/            # RecommendationEngine
├── solution-design/            # SolutionDesigner
└── strategy/                   # StrategicReasoner (orchestrator)
```

## Pipeline

```
StrategicReasoner
    │
    ├── BusinessAnalysisEngine    → business type, goals, risks, SWOT, journey, bottlenecks
    ├── OpportunityEngine         → automation, AI, marketing, ops, revenue opportunities
    ├── RecommendationEngine      → scored, prioritized recommendations with rationale
    ├── SolutionDesigner          → complete integrated business solution
    └── Strategy synthesis        → strategy, roadmap, expected impact
```

## Usage

```typescript
import { StrategicReasoner } from "@/src/brain/reasoning";

const reasoner = new StrategicReasoner();

// From a project request
const input = reasoner.buildInput({
  requestId: "req-001",
  request: {
    industry: "HVAC",
    goal: "Generate more leads after hours",
    budget: 3000,
    services: ["chatbot", "receptionist"],
  },
});

const output = reasoner.reason(input);

if (output.success && output.result) {
  console.log(output.result.strategy);
  console.log(output.result.solution.components);
  console.log(output.result.roadmap);
  console.log(output.result.expectedImpact);
}
```

### With Sales Pipeline Data

```typescript
import { StrategicReasoner, generateProposalForRequest } from "@/src/brain";

const salesResult = await runSalesDepartment(request);
const proposal = generateProposalForRequest(request);

const reasoner = new StrategicReasoner();
const input = reasoner.buildInput({
  requestId: "req-001",
  request,
  salesResult,
  proposal,
});

const { result } = reasoner.reason(input);
```

## Engines

### BusinessAnalysisEngine

Analyses:
- Business type (from industry knowledge)
- Goals (parsed from request)
- Risks (from sales pricing or inferred)
- Strengths and weaknesses
- Customer journey (5 stages with touchpoints, pain points, opportunities)
- Growth bottlenecks

### OpportunityEngine

Discovers opportunities across five categories:
- **Automation** — from industry automation profiles
- **AI** — from recommended AI services and goal hints
- **Marketing** — from website and social media recommendations
- **Operational** — from industry playbooks
- **Revenue** — from KPIs and goal analysis

### RecommendationEngine

Prioritizes all opportunities into scored recommendations:
- Weighted scoring: impact (40%), effort (30%), goal alignment (20%), urgency (10%)
- Priority tiers: critical, high, medium, low
- Every recommendation includes a **rationale** explaining WHY

### SolutionDesigner

Builds a **complete business solution** — not just a service list:

```
Website + Chatbot + CRM + Email Automation + Analytics + Booking
```

Components include services, capabilities (analytics, email automation), and integrations with phase assignments and dependency mapping.

### StrategicReasoner

Final orchestrator. Consumes:
- Knowledge Layer (industry profiles, playbooks, services, pricing)
- Sales analysis (discovery, business analysis, pricing risks)
- Proposal (challenges, services, price range, timeline)

Returns:
- **Business Strategy** — vision, objectives, positioning, advantages
- **Business Solution** — integrated component architecture
- **Priority Roadmap** — phased delivery plan
- **Expected Business Impact** — short/medium/long-term outcomes with KPIs

## Design Rules

- **Reasoning only** — no deliverable generation (websites, code, marketing copy)
- **Knowledge-driven** — industry data consumed via `getKnowledgeRegistry()`, never duplicated
- **Strongly typed** — all inputs and outputs defined in `types.ts`
- **Isolated** — does not modify runtime, website, or knowledge modules
- **Composable** — each engine can be used independently or via `StrategicReasoner`

## Output Shape

```typescript
interface StrategicReasoningResult {
  requestId: string;
  generatedAt: string;
  businessAnalysis: BusinessAnalysisResult;
  opportunities: OpportunityAnalysis;
  recommendations: RecommendationResult;
  solution: BusinessSolution;
  strategy: BusinessStrategy;
  roadmap: PriorityRoadmapPhase[];
  expectedImpact: ExpectedBusinessImpact;
  executiveSummary: string;
  nextStep: string;
}
```
