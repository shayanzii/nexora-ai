export { SalesDepartment, SalesAgent } from "./sales-department";
export type { SalesDepartmentOptions } from "./sales-department";
export { LeadQualificationAgent } from "./lead-qualification-agent";
export { DiscoveryAgent } from "./discovery-agent";
export { BusinessAnalysisAgent, ProposalAgent } from "./business-analysis-agent";
export { ProposalEngineAgent } from "./proposal-engine-agent";
export { PricingAgent } from "./pricing-agent";
export { FollowUpAgent } from "./follow-up-agent";

import { BusinessAnalysisAgent } from "./business-analysis-agent";
import { DiscoveryAgent } from "./discovery-agent";
import { FollowUpAgent } from "./follow-up-agent";
import { LeadQualificationAgent } from "./lead-qualification-agent";
import { PricingAgent } from "./pricing-agent";
import { ProposalEngineAgent } from "./proposal-engine-agent";
import type { SalesDepartmentAgents } from "../../../types/sales";

/** Creates the default set of sales department sub-agents. */
export function createDefaultSalesDepartmentAgents(): SalesDepartmentAgents {
  return {
    leadQualification: new LeadQualificationAgent(),
    discovery: new DiscoveryAgent(),
    businessAnalysis: new BusinessAnalysisAgent(),
    pricing: new PricingAgent(),
    proposalEngine: new ProposalEngineAgent(),
    followUp: new FollowUpAgent(),
  };
}
