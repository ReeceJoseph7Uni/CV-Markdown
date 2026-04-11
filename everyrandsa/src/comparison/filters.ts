import type {
  IProduct,
  IComparisonFilter,
  TaxStatus,
} from '../types';

/**
 * Filter a list of products according to the provided IComparisonFilter.
 * All filter fields are optional; only specified fields are applied.
 */
export function filterProducts(
  products: IProduct[],
  filter: IComparisonFilter,
): IProduct[] {
  return products.filter(p => {
    // Only active products
    if (!p.isActive) return false;

    if (filter.productType && p.productType !== filter.productType) return false;

    if (filter.institution) {
      const inst = filter.institution.toLowerCase();
      if (!p.institution.toLowerCase().includes(inst)) return false;
    }

    if (filter.accessType && p.accessType !== filter.accessType) return false;

    if (filter.maxMonthlyFee !== undefined && p.monthlyFee > filter.maxMonthlyFee) return false;

    if (filter.tfsaOnly && (p.taxStatus as TaxStatus) !== 'TAX_FREE') return false;

    // Balance eligibility
    if (filter.minBalance !== undefined && p.maxBalance !== null && p.maxBalance !== undefined) {
      if (filter.minBalance > p.maxBalance) return false;
    }

    if (filter.maxBalance !== undefined && p.minDeposit !== null && p.minDeposit !== undefined) {
      if (filter.maxBalance < p.minDeposit) return false;
    }

    return true;
  });
}
