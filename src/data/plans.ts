export interface Plan {
  /** Stable id, used for keys and i18n label lookups. */
  id: "starter" | "growth" | "business" | "scale" | "enterprise";
  /** Display name (brand names are not translated). */
  name: string;
  /** Monthly request allowance. `null` means "from X" / custom. */
  requests: number;
  /** Base monthly price in EUR without AI. `null` for custom pricing. */
  priceMonthly: number | null;
  /** Whether this plan is the recommended / most popular one. */
  popular?: boolean;
  /** Whether this is the enterprise / contact-sales plan. */
  enterprise?: boolean;
}

/** AI analysis surcharge factor (≈ +40%). */
export const AI_FACTOR = 1.4;

/** Annual billing: 2 months free => pay for 10 months. */
export const YEARLY_MONTHS = 10;

export const plans: Plan[] = [
  { id: "starter", name: "Starter", requests: 1000, priceMonthly: 9 },
  { id: "growth", name: "Growth", requests: 10000, priceMonthly: 29 },
  {
    id: "business",
    name: "Business",
    requests: 50000,
    priceMonthly: 79,
    popular: true,
  },
  { id: "scale", name: "Scale", requests: 200000, priceMonthly: 199 },
  {
    id: "enterprise",
    name: "Enterprise",
    requests: 500000,
    priceMonthly: null,
    enterprise: true,
  },
];

/** Price with optional AI surcharge, rounded to whole euros. */
export function priceWithAi(base: number, withAi: boolean): number {
  return withAi ? Math.round(base * AI_FACTOR) : base;
}

/** Yearly total (2 months free) for a given monthly base price. */
export function yearlyTotal(monthly: number): number {
  return monthly * YEARLY_MONTHS;
}

/** Effective monthly price when billed yearly. */
export function monthlyWhenYearly(monthly: number): number {
  return Math.round((monthly * YEARLY_MONTHS) / 12);
}
