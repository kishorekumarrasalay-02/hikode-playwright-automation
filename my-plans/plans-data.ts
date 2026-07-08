export type BillingPeriod = 'Monthly' | 'Pay 3 Months' | 'Pay 6 Months' | 'Pay 12 Months';

export type PlanTier = 'Plan A' | 'Plan B' | 'Plan C';

export const BILLING_PERIODS: BillingPeriod[] = [
  'Monthly',
  'Pay 3 Months',
  'Pay 6 Months',
  'Pay 12 Months',
];

export const PLAN_TIERS: PlanTier[] = ['Plan A', 'Plan B', 'Plan C'];

export const PLAN_TIER_INDEX: Record<PlanTier, number> = {
  'Plan A': 0,
  'Plan B': 1,
  'Plan C': 2,
};
