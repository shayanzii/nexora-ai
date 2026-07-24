/** Calculates gross profit and profit margin from revenue and cost. */
export function calculateProfit(
  oneTimePrice: number,
  estimatedCost: number,
): { grossProfit: number; profitMargin: number } {
  const grossProfit = Math.max(0, oneTimePrice - estimatedCost);
  const profitMargin =
    oneTimePrice > 0 ? Math.round((grossProfit / oneTimePrice) * 100) : 0;

  return { grossProfit, profitMargin };
}
