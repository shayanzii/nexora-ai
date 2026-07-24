/** Error codes for the Pricing Engine. */
export type PricingErrorCode =
  | "VALIDATION_ERROR"
  | "CATALOG_ERROR"
  | "CALCULATION_ERROR"
  | "NO_SERVICES";

export class PricingError extends Error {
  constructor(
    message: string,
    readonly code: PricingErrorCode,
    readonly details?: Readonly<Record<string, unknown>>,
  ) {
    super(message);
    this.name = "PricingError";
  }
}

export class PricingValidationError extends PricingError {
  constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super(message, "VALIDATION_ERROR", details);
    this.name = "PricingValidationError";
  }
}

export class PricingCatalogError extends PricingError {
  constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super(message, "CATALOG_ERROR", details);
    this.name = "PricingCatalogError";
  }
}

export class PricingCalculationError extends PricingError {
  constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super(message, "CALCULATION_ERROR", details);
    this.name = "PricingCalculationError";
  }
}
