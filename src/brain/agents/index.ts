export { BaseAgent } from "./base-agent";
export { CEOAgent } from "./ceo-agent";
export { SalesDepartment, SalesAgent } from "./sales/department";
export {
  LeadQualificationAgent,
  DiscoveryAgent,
  BusinessAnalysisAgent,
  ProposalAgent,
  ProposalEngineAgent,
  PricingAgent,
  FollowUpAgent,
  createDefaultSalesDepartmentAgents,
} from "./sales/department";
export { RequirementsAnalystAgent } from "./requirements-analyst-agent";
export { ServiceArchitectAgent } from "./service-architect-agent";
export { BudgetPlannerAgent } from "./budget-planner-agent";
export { DeliveryPlannerAgent } from "./delivery-planner-agent";

import { BudgetPlannerAgent } from "./budget-planner-agent";
import { DeliveryPlannerAgent } from "./delivery-planner-agent";
import { RequirementsAnalystAgent } from "./requirements-analyst-agent";
import { SalesDepartment } from "./sales/department";
import { ServiceArchitectAgent } from "./service-architect-agent";
import type { Agent } from "../types/agent";

/** Creates the default set of specialist agents (excluding CEO). */
export function createDefaultSpecialistAgents(): Agent[] {
  return [
    new SalesDepartment(),
    new RequirementsAnalystAgent(),
    new ServiceArchitectAgent(),
    new BudgetPlannerAgent(),
    new DeliveryPlannerAgent(),
  ];
}

export {
  SALES_EXAMPLE_COMPLETE_REQUEST,
  SALES_EXAMPLE_INCOMPLETE_REQUEST,
  SALES_EXAMPLE_MINIMAL_REQUEST,
  SALES_EXAMPLE_REGULATED_REQUEST,
  SALES_EXAMPLE_REQUESTS,
  SALES_EXAMPLE_UNDER_BUDGET_REQUEST,
} from "./sales/examples";
export type { SalesExampleRequestKey } from "./sales/examples";
