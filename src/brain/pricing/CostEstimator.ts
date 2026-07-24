import type { PricingCatalog } from "./PricingCatalog";
import type { PricingLineItem } from "./PricingTypes";

/** Estimates internal implementation cost from catalog cost rates. */
export function estimateImplementationCost(
  oneTimeItems: readonly PricingLineItem[],
  catalog: PricingCatalog,
): number {
  const config = catalog.getConfig();

  return oneTimeItems.reduce((total, item) => {
    const service = item.serviceId ? catalog.getService(item.serviceId) : undefined;
    const rate = service?.implementationCostRate ?? config.defaultImplementationCostRate;
    return total + Math.round(item.amount * rate);
  }, 0);
}
