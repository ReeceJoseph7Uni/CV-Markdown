import type {
  IProduct,
  IProductRate,
  IComparisonScore,
  INetValueResult,
  IWeightedScore,
  UserProfile,
  TaxStatus,
} from '../types';
import { AccessType } from '../types';

// ----------------------------------------------------------------
// Profile weight table
// ----------------------------------------------------------------
export const PROFILE_WEIGHTS: Record<string, IWeightedScore> = {
  EMERGENCY_SAVINGS:  { rate: 0.25, fees: 0.20, access: 0.35, minBalance: 0.15, tfsa: 0.00, digital: 0.05 },
  TFSA_INVESTOR:      { rate: 0.30, fees: 0.15, access: 0.10, minBalance: 0.10, tfsa: 0.30, digital: 0.05 },
  LARGE_BALANCE:      { rate: 0.40, fees: 0.15, access: 0.15, minBalance: 0.05, tfsa: 0.20, digital: 0.05 },
  NO_FEE_PREFERENCE:  { rate: 0.20, fees: 0.45, access: 0.15, minBalance: 0.10, tfsa: 0.05, digital: 0.05 },
  SHORT_TERM_PARKING: { rate: 0.20, fees: 0.20, access: 0.40, minBalance: 0.10, tfsa: 0.00, digital: 0.10 },
  GENERAL:            { rate: 0.30, fees: 0.25, access: 0.20, minBalance: 0.10, tfsa: 0.10, digital: 0.05 },
};

// ----------------------------------------------------------------
// Helper normalisation functions (0–100 scale)
// ----------------------------------------------------------------

/** Higher rate → higher score. Rates expected as decimals (e.g. 0.09). */
function normaliseRate(rate: number, maxRate: number): number {
  if (maxRate === 0) return 0;
  return Math.min(100, (rate / maxRate) * 100);
}

/** Lower fee → higher score. Fee in ZAR/month. */
function normaliseFee(fee: number): number {
  if (fee === 0)    return 100;
  if (fee <= 50)    return 80;
  if (fee <= 100)   return 60;
  if (fee <= 200)   return 40;
  if (fee <= 500)   return 20;
  return 10;
}

/** Instant access scores highest; fixed-term scores lowest. */
function normaliseAccess(accessType: string): number {
  const scores: Record<string, number> = {
    INSTANT:        100,
    NOTICE_7_DAYS:   80,
    NOTICE_32_DAYS:  60,
    NOTICE_60_DAYS:  45,
    NOTICE_90_DAYS:  30,
    FIXED_TERM:      15,
  };
  return scores[accessType] ?? 50;
}

/** Lower minimum balance → more accessible → higher score. */
function normaliseMinBalance(minDeposit: number | null | undefined): number {
  const m = minDeposit ?? 0;
  if (m === 0)          return 100;
  if (m <= 1_000)       return 90;
  if (m <= 5_000)       return 75;
  if (m <= 10_000)      return 60;
  if (m <= 50_000)      return 40;
  if (m <= 100_000)     return 25;
  return 10;
}

/** TFSA (tax-free) products score 100; others 0. */
function normaliseTfsa(taxStatus: string): number {
  return taxStatus === ('TAX_FREE' as TaxStatus) ? 100 : 0;
}

/**
 * Digital score: heuristic based on institution.
 * Newer digital banks score higher; traditional banks are mid-range.
 */
function normaliseDigital(institution: string): number {
  const lower = institution.toLowerCase();
  if (['tymebank', 'discovery', 'african bank'].some(b => lower.includes(b))) return 90;
  if (['capitec', 'investec'].some(b => lower.includes(b)))                    return 80;
  if (['fnb', 'first national'].some(b => lower.includes(b)))                  return 70;
  if (['standard bank', 'absa', 'nedbank'].some(b => lower.includes(b)))       return 60;
  return 50;
}

/** Best applicable rate for a given product given its rate tiers. */
function bestRate(rates: IProductRate[]): number {
  if (!rates || rates.length === 0) return 0;
  return Math.max(...rates.map(r => r.interestRate));
}

// ----------------------------------------------------------------
// Public API
// ----------------------------------------------------------------

/**
 * Score a single product against a user profile.
 * Returns a partial IComparisonScore (without db fields).
 */
export function scoreProduct(
  product: IProduct,
  rates: IProductRate[],
  profile: UserProfile,
): Omit<IComparisonScore, 'id' | 'createdAt' | 'updatedAt' | 'lastCalculated'> {
  const weights = PROFILE_WEIGHTS[profile as string];
  if (!weights) throw new Error(`Unknown user profile: ${profile}`);

  const maxMarketRate = 0.12; // normalisation ceiling ~12% p.a.
  const topRate       = bestRate(rates);

  const rateScore       = normaliseRate(topRate, maxMarketRate);
  const feeScore        = normaliseFee(product.monthlyFee + product.adminFee);
  const accessScore     = normaliseAccess(product.accessType as string);
  const minBalanceScore = normaliseMinBalance(product.minDeposit);
  const tfsaScore       = normaliseTfsa(product.taxStatus as string);
  const digitalScore    = normaliseDigital(product.institution);

  const overallScore =
    rateScore       * weights.rate       +
    feeScore        * weights.fees       +
    accessScore     * weights.access     +
    minBalanceScore * weights.minBalance +
    tfsaScore       * weights.tfsa       +
    digitalScore    * weights.digital;

  return {
    productId:      product.id,
    userProfile:    profile,
    rateScore:      round2(rateScore),
    feeScore:       round2(feeScore),
    accessScore:    round2(accessScore),
    minBalanceScore: round2(minBalanceScore),
    tfsaScore:      round2(tfsaScore),
    digitalScore:   round2(digitalScore),
    overallScore:   round2(overallScore),
    effectiveReturn: round4(topRate),
  };
}

/**
 * Calculate net interest value for a product after fees.
 */
export function calculateNetValue(
  product: IProduct,
  rates: IProductRate[],
  balance: number,
): INetValueResult {
  const topRate       = bestRate(rates);
  const grossInterest = balance * topRate;
  const annualFees    = (product.monthlyFee + product.adminFee) * 12 + product.initiationFee;
  const netInterest   = grossInterest - annualFees;
  const effectiveYield = balance > 0 ? netInterest / balance : 0;

  return {
    productId:      product.id,
    grossInterest:  round2(grossInterest),
    totalFees:      round2(annualFees),
    netInterest:    round2(netInterest),
    effectiveYield: round4(effectiveYield),
  };
}

/**
 * Rank products by overall score for a given profile.
 * Returns scores sorted descending.
 */
export function rankProducts(
  products: IProduct[],
  ratesMap: IProductRate[][],
  profile: UserProfile,
): ReturnType<typeof scoreProduct>[] {
  const scores = products.map((product, i) =>
    scoreProduct(product, ratesMap[i] ?? [], profile),
  );
  return scores.sort((a, b) => b.overallScore - a.overallScore);
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function round4(n: number): number { return Math.round(n * 10000) / 10000; }
