import type { PricingCatalog } from "./PricingCatalog";
import type { PaymentPlan, PaymentPlanType } from "./PricingTypes";

/** Builds a payment schedule from catalog payment plan definitions. */
export function buildPaymentPlan(
  catalog: PricingCatalog,
  oneTimePrice: number,
  planType: PaymentPlanType,
): PaymentPlan {
  const definition =
    catalog.getPaymentPlan(planType) ?? catalog.getPaymentPlan("50-50");

  if (!definition) {
    throw new Error("Pricing catalog missing payment plan definitions.");
  }

  return {
    type: definition.type,
    name: definition.name,
    description: definition.description,
    installments: definition.installments.map((installment) => ({
      label: installment.label,
      percentage: installment.percentage,
      amount: Math.round((oneTimePrice * installment.percentage) / 100),
      due: installment.due,
    })),
  };
}
