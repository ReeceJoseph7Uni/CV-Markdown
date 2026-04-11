import { filterProducts }                              from '../src/comparison/filters';
import { scoreProduct, calculateNetValue, rankProducts, PROFILE_WEIGHTS } from '../src/comparison/scoring';
import type { IProduct, IProductRate }                 from '../src/types';
import { ProductType, AccessType, TaxStatus, UserProfile } from '../src/types';

// ----------------------------------------------------------------
// Test fixtures
// ----------------------------------------------------------------
function makeProduct(overrides: Partial<IProduct> = {}): IProduct {
  return {
    id:              overrides.id              ?? 'prod-1',
    institution:     overrides.institution     ?? 'TestBank',
    productName:     overrides.productName     ?? 'Test Savings',
    productType:     overrides.productType     ?? ProductType.SAVINGS,
    category:        overrides.category        ?? 'Savings',
    accessType:      overrides.accessType      ?? AccessType.INSTANT,
    monthlyFee:      overrides.monthlyFee      ?? 0,
    initiationFee:   overrides.initiationFee   ?? 0,
    withdrawalFee:   overrides.withdrawalFee   ?? 0,
    adminFee:        overrides.adminFee        ?? 0,
    taxStatus:       overrides.taxStatus       ?? TaxStatus.TAXABLE,
    sourceUrl:       'https://example.com',
    lastCheckedDate: new Date(),
    updateFrequency: 'MONTHLY',
    isActive:        overrides.isActive        ?? true,
    createdAt:       new Date(),
    updatedAt:       new Date(),
    ...overrides,
  };
}

function makeRate(overrides: Partial<IProductRate> = {}): IProductRate {
  return {
    id:            overrides.id            ?? 'rate-1',
    productId:     overrides.productId     ?? 'prod-1',
    minBalance:    overrides.minBalance    ?? 0,
    maxBalance:    overrides.maxBalance    ?? null,
    interestRate:  overrides.interestRate  ?? 0.08,
    rateType:      overrides.rateType      ?? 'NOMINAL' as IProductRate['rateType'],
    effectiveYield: overrides.effectiveYield ?? null,
    isPromotional: overrides.isPromotional ?? false,
    promotionEndDate: null,
    createdAt:     new Date(),
    updatedAt:     new Date(),
    ...overrides,
  };
}

// ----------------------------------------------------------------
// Filter tests
// ----------------------------------------------------------------
describe('filterProducts', () => {
  const products: IProduct[] = [
    makeProduct({ id: 'p1', productType: ProductType.SAVINGS, institution: 'FNB', monthlyFee: 0, taxStatus: TaxStatus.TAXABLE, accessType: AccessType.INSTANT }),
    makeProduct({ id: 'p2', productType: ProductType.TFSA, institution: 'Capitec', monthlyFee: 0, taxStatus: TaxStatus.TAX_FREE, accessType: AccessType.INSTANT }),
    makeProduct({ id: 'p3', productType: ProductType.SAVINGS, institution: 'Absa', monthlyFee: 150, taxStatus: TaxStatus.TAXABLE, accessType: AccessType.NOTICE_32_DAYS }),
    makeProduct({ id: 'p4', productType: ProductType.FIXED_DEPOSIT, institution: 'Nedbank', monthlyFee: 0, taxStatus: TaxStatus.TAXABLE, accessType: AccessType.FIXED_TERM }),
    makeProduct({ id: 'p5', productType: ProductType.SAVINGS, institution: 'TymeBank', monthlyFee: 0, taxStatus: TaxStatus.TAXABLE, accessType: AccessType.INSTANT, isActive: false }),
  ];

  test('Returns only active products by default', () => {
    const result = filterProducts(products, {});
    expect(result.every(p => p.isActive)).toBe(true);
    expect(result.find(p => p.id === 'p5')).toBeUndefined();
  });

  test('Filters by productType', () => {
    const result = filterProducts(products, { productType: ProductType.SAVINGS });
    expect(result.every(p => p.productType === ProductType.SAVINGS)).toBe(true);
    expect(result.length).toBe(2); // p1 and p3 (p5 inactive)
  });

  test('Filters by institution (case-insensitive substring)', () => {
    const result = filterProducts(products, { institution: 'fnb' });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('p1');
  });

  test('Filters by accessType', () => {
    const result = filterProducts(products, { accessType: AccessType.INSTANT });
    expect(result.every(p => p.accessType === AccessType.INSTANT)).toBe(true);
  });

  test('Filters by maxMonthlyFee', () => {
    const result = filterProducts(products, { maxMonthlyFee: 0 });
    expect(result.every(p => p.monthlyFee === 0)).toBe(true);
    expect(result.find(p => p.id === 'p3')).toBeUndefined();
  });

  test('Filters tfsaOnly – returns only TAX_FREE products', () => {
    const result = filterProducts(products, { tfsaOnly: true });
    expect(result.every(p => p.taxStatus === TaxStatus.TAX_FREE)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('p2');
  });

  test('Combined filters narrow results', () => {
    const result = filterProducts(products, {
      productType:   ProductType.SAVINGS,
      accessType:    AccessType.INSTANT,
      maxMonthlyFee: 0,
    });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('p1');
  });
});

// ----------------------------------------------------------------
// Scoring weight tests
// ----------------------------------------------------------------
describe('PROFILE_WEIGHTS', () => {
  test('All profile weights sum to 1.0', () => {
    for (const [profile, w] of Object.entries(PROFILE_WEIGHTS)) {
      const total = w.rate + w.fees + w.access + w.minBalance + w.tfsa + w.digital;
      expect(total).toBeCloseTo(1.0, 5);
      // Sanity-label printed on failure
      expect(profile + ':ok').toBe(profile + ':ok');
    }
  });

  test('All weight values are non-negative', () => {
    for (const w of Object.values(PROFILE_WEIGHTS)) {
      expect(w.rate).toBeGreaterThanOrEqual(0);
      expect(w.fees).toBeGreaterThanOrEqual(0);
      expect(w.access).toBeGreaterThanOrEqual(0);
      expect(w.minBalance).toBeGreaterThanOrEqual(0);
      expect(w.tfsa).toBeGreaterThanOrEqual(0);
      expect(w.digital).toBeGreaterThanOrEqual(0);
    }
  });
});

// ----------------------------------------------------------------
// scoreProduct tests
// ----------------------------------------------------------------
describe('scoreProduct', () => {
  const product = makeProduct();
  const rates   = [makeRate({ interestRate: 0.09 })];

  test('Returns scores between 0 and 100', () => {
    const score = scoreProduct(product, rates, UserProfile.GENERAL);
    expect(score.rateScore).toBeGreaterThanOrEqual(0);
    expect(score.rateScore).toBeLessThanOrEqual(100);
    expect(score.overallScore).toBeGreaterThanOrEqual(0);
    expect(score.overallScore).toBeLessThanOrEqual(100);
  });

  test('TAX_FREE product scores higher on tfsaScore', () => {
    const taxable  = makeProduct({ id: 'tx', taxStatus: TaxStatus.TAXABLE });
    const taxFree  = makeProduct({ id: 'tf', taxStatus: TaxStatus.TAX_FREE });
    const sTaxable = scoreProduct(taxable, rates, UserProfile.TFSA_INVESTOR);
    const sTaxFree = scoreProduct(taxFree,  rates, UserProfile.TFSA_INVESTOR);
    expect(sTaxFree.tfsaScore).toBeGreaterThan(sTaxable.tfsaScore);
  });

  test('INSTANT access scores higher than FIXED_TERM', () => {
    const instant   = makeProduct({ id: 'ins', accessType: AccessType.INSTANT });
    const fixed     = makeProduct({ id: 'fix', accessType: AccessType.FIXED_TERM });
    const sInstant  = scoreProduct(instant, rates, UserProfile.EMERGENCY_SAVINGS);
    const sFixed    = scoreProduct(fixed,   rates, UserProfile.EMERGENCY_SAVINGS);
    expect(sInstant.accessScore).toBeGreaterThan(sFixed.accessScore);
  });

  test('Zero monthly fee scores higher fee score than fee-bearing product', () => {
    const noFee   = makeProduct({ id: 'nf', monthlyFee: 0 });
    const withFee = makeProduct({ id: 'wf', monthlyFee: 200 });
    const sNoFee  = scoreProduct(noFee,   rates, UserProfile.NO_FEE_PREFERENCE);
    const sWithFee = scoreProduct(withFee, rates, UserProfile.NO_FEE_PREFERENCE);
    expect(sNoFee.feeScore).toBeGreaterThan(sWithFee.feeScore);
  });

  test('Higher interest rate → higher rate score', () => {
    const lowRates  = [makeRate({ interestRate: 0.04 })];
    const highRates = [makeRate({ interestRate: 0.10 })];
    const sLow  = scoreProduct(product, lowRates,  UserProfile.GENERAL);
    const sHigh = scoreProduct(product, highRates, UserProfile.GENERAL);
    expect(sHigh.rateScore).toBeGreaterThan(sLow.rateScore);
  });

  test('Throws for unknown profile', () => {
    expect(() =>
      scoreProduct(product, rates, 'UNKNOWN_PROFILE' as UserProfile),
    ).toThrow();
  });
});

// ----------------------------------------------------------------
// calculateNetValue tests
// ----------------------------------------------------------------
describe('calculateNetValue', () => {
  test('Gross interest equals balance × rate', () => {
    const product = makeProduct({ monthlyFee: 0, adminFee: 0, initiationFee: 0 });
    const rates   = [makeRate({ interestRate: 0.10 })];
    const result  = calculateNetValue(product, rates, 100_000);
    expect(result.grossInterest).toBeCloseTo(10_000, 0);
    expect(result.netInterest).toBeCloseTo(10_000, 0);
    expect(result.effectiveYield).toBeCloseTo(0.10, 3);
  });

  test('Fees reduce net interest', () => {
    const product = makeProduct({ monthlyFee: 100, adminFee: 0, initiationFee: 500 });
    const rates   = [makeRate({ interestRate: 0.10 })];
    const result  = calculateNetValue(product, rates, 100_000);
    // Annual fees = 100*12 + 500 = 1700
    expect(result.totalFees).toBeCloseTo(1_700, 0);
    expect(result.netInterest).toBeCloseTo(8_300, 0);
  });

  test('Returns correct productId', () => {
    const product = makeProduct({ id: 'my-product' });
    const result  = calculateNetValue(product, [makeRate()], 50_000);
    expect(result.productId).toBe('my-product');
  });
});

// ----------------------------------------------------------------
// rankProducts tests
// ----------------------------------------------------------------
describe('rankProducts', () => {
  test('Products are sorted descending by overallScore', () => {
    const p1 = makeProduct({ id: 'p1', monthlyFee: 500 }); // penalised by fees
    const p2 = makeProduct({ id: 'p2', monthlyFee: 0   }); // no fee penalty
    const r1 = [makeRate({ productId: 'p1', interestRate: 0.06 })];
    const r2 = [makeRate({ productId: 'p2', interestRate: 0.10 })];

    const scores = rankProducts([p1, p2], [r1, r2], UserProfile.GENERAL);
    expect(scores[0].overallScore).toBeGreaterThanOrEqual(scores[1].overallScore);
  });

  test('Returns same number of scores as products', () => {
    const products = [makeProduct({ id: 'a' }), makeProduct({ id: 'b' }), makeProduct({ id: 'c' })];
    const ratesMap = products.map(p => [makeRate({ productId: p.id })]);
    const scores   = rankProducts(products, ratesMap, UserProfile.EMERGENCY_SAVINGS);
    expect(scores.length).toBe(3);
  });
});
