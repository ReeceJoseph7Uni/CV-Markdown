'use client';

import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import FilterSidebar from "@/components/comparison/FilterSidebar";
import ProductCard from "@/components/comparison/ProductCard";
import ComparisonGrid from "@/components/comparison/ComparisonGrid";
import SortDropdown from "@/components/comparison/SortDropdown";
import { DisclaimerBanner } from "@/components/common/DisclaimerBanner";
import { TrustBadge } from "@/components/common/TrustBadge";
import { PiggyBank } from "lucide-react";

// ─── Mock product data ───────────────────────────────────────────────────────

const SAVINGS_PRODUCTS = [
  {
    id: "std-bank-puresave",
    institutionName: "Standard Bank",
    productName: "PureSave",
    productType: "SAVINGS_ACCOUNT",
    rateType: "VARIABLE",
    rateTiers: [
      { minBalance: 0, maxBalance: 9999, rate: 5.5 },
      { minBalance: 10000, maxBalance: 49999, rate: 6.25 },
      { minBalance: 50000, maxBalance: null, rate: 7.0 },
    ],
    effectiveYield: 6.25,
    monthlyFee: 0,
    minDeposit: 0,
    accessType: "INSTANT",
    taxStatus: "taxable" as const,
    isPromotional: false,
    lastCheckedDate: "2026-03-01",
    isActive: true,
  },
  {
    id: "fnb-savings-pocket",
    institutionName: "FNB",
    productName: "Savings Pocket",
    productType: "SAVINGS_ACCOUNT",
    rateType: "VARIABLE",
    rateTiers: [
      { minBalance: 0, maxBalance: null, rate: 6.5 },
    ],
    effectiveYield: 6.5,
    monthlyFee: 0,
    minDeposit: 0,
    accessType: "INSTANT",
    taxStatus: "taxable" as const,
    isPromotional: false,
    lastCheckedDate: "2026-03-01",
    isActive: true,
  },
  {
    id: "absa-tfsa",
    institutionName: "ABSA",
    productName: "Tax Free Savings Account",
    productType: "TFSA",
    rateType: "VARIABLE",
    rateTiers: [
      { minBalance: 0, maxBalance: null, rate: 7.5 },
    ],
    effectiveYield: 7.5,
    monthlyFee: 0,
    minDeposit: 100,
    accessType: "INSTANT",
    taxStatus: "TFSA" as const,
    isPromotional: false,
    lastCheckedDate: "2026-03-01",
    isActive: true,
  },
  {
    id: "nedbank-justsave",
    institutionName: "Nedbank",
    productName: "JustSave",
    productType: "SAVINGS_ACCOUNT",
    rateType: "VARIABLE",
    rateTiers: [
      { minBalance: 0, maxBalance: 4999, rate: 4.75 },
      { minBalance: 5000, maxBalance: null, rate: 6.0 },
    ],
    effectiveYield: 5.8,
    monthlyFee: 0,
    minDeposit: 20,
    accessType: "INSTANT",
    taxStatus: "taxable" as const,
    isPromotional: false,
    lastCheckedDate: "2026-03-01",
    isActive: true,
  },
  {
    id: "capitec-tfsa",
    institutionName: "Capitec",
    productName: "Tax Free Savings",
    productType: "TFSA",
    rateType: "VARIABLE",
    rateTiers: [
      { minBalance: 0, maxBalance: null, rate: 8.25, isPromotional: true },
    ],
    effectiveYield: 8.25,
    monthlyFee: 0,
    minDeposit: 0,
    accessType: "INSTANT",
    taxStatus: "TFSA" as const,
    isPromotional: true,
    lastCheckedDate: "2026-03-01",
    isActive: true,
  },
  {
    id: "african-bank-32day",
    institutionName: "African Bank",
    productName: "32-Day Notice",
    productType: "NOTICE_DEPOSIT",
    rateType: "FIXED",
    rateTiers: [
      { minBalance: 1000, maxBalance: null, rate: 9.5 },
    ],
    effectiveYield: 9.5,
    monthlyFee: 0,
    minDeposit: 1000,
    accessType: "NOTICE_32_DAYS",
    taxStatus: "taxable" as const,
    isPromotional: false,
    lastCheckedDate: "2026-03-01",
    isActive: true,
  },
  {
    id: "investec-prime-saver",
    institutionName: "Investec",
    productName: "Prime Saver",
    productType: "SAVINGS_ACCOUNT",
    rateType: "PRIME_LINKED",
    rateTiers: [
      { minBalance: 100000, maxBalance: null, rate: 9.75 },
    ],
    effectiveYield: 9.75,
    monthlyFee: 95,
    minDeposit: 100000,
    accessType: "INSTANT",
    taxStatus: "taxable" as const,
    isPromotional: false,
    lastCheckedDate: "2026-03-01",
    isActive: true,
  },
  {
    id: "tymebank-goalset",
    institutionName: "TymeBank",
    productName: "GoalSave",
    productType: "SAVINGS_ACCOUNT",
    rateType: "VARIABLE",
    rateTiers: [
      { minBalance: 0, maxBalance: null, rate: 10.0 },
    ],
    effectiveYield: 10.0,
    monthlyFee: 0,
    minDeposit: 0,
    accessType: "NOTICE_90_DAYS",
    taxStatus: "taxable" as const,
    isPromotional: false,
    lastCheckedDate: "2026-03-01",
    isActive: true,
  },
  {
    id: "nedbank-tfsa",
    institutionName: "Nedbank",
    productName: "Tax Free Savings",
    productType: "TFSA",
    rateType: "VARIABLE",
    rateTiers: [
      { minBalance: 0, maxBalance: null, rate: 7.0 },
    ],
    effectiveYield: 7.0,
    monthlyFee: 0,
    minDeposit: 100,
    accessType: "INSTANT",
    taxStatus: "TFSA" as const,
    isPromotional: false,
    lastCheckedDate: "2026-03-01",
    isActive: true,
  },
  {
    id: "fnb-60day-notice",
    institutionName: "FNB",
    productName: "60-Day Notice Deposit",
    productType: "NOTICE_DEPOSIT",
    rateType: "FIXED",
    rateTiers: [
      { minBalance: 5000, maxBalance: null, rate: 8.75 },
    ],
    effectiveYield: 8.75,
    monthlyFee: 0,
    minDeposit: 5000,
    accessType: "NOTICE_60_DAYS",
    taxStatus: "taxable" as const,
    isPromotional: false,
    lastCheckedDate: "2026-03-01",
    isActive: true,
  },
];

// ─── Filter groups ────────────────────────────────────────────────────────────

const FILTER_GROUPS = [
  {
    id: "taxStatus",
    label: "TFSA Eligible",
    type: "toggle" as const,
  },
  {
    id: "accessType",
    label: "Access Type",
    type: "checkbox" as const,
    options: [
      { value: "INSTANT", label: "Instant Access" },
      { value: "NOTICE_32_DAYS", label: "32-Day Notice" },
      { value: "NOTICE_60_DAYS", label: "60-Day Notice" },
      { value: "NOTICE_90_DAYS", label: "90-Day Notice" },
    ],
  },
  {
    id: "monthlyFee",
    label: "Monthly Fee",
    type: "checkbox" as const,
    options: [
      { value: "free", label: "No Monthly Fee" },
      { value: "paid", label: "Has Monthly Fee" },
    ],
  },
];

const SORT_OPTIONS = [
  { value: "rate_desc", label: "Highest Rate First" },
  { value: "rate_asc", label: "Lowest Rate First" },
  { value: "fee_asc", label: "Lowest Fee First" },
  { value: "minDeposit_asc", label: "Lowest Min Deposit" },
];

const BEST_FOR_FILTERS = [
  { id: "emergency", label: "Emergency Savings", filters: { accessType: ["INSTANT"] } },
  { id: "tfsa", label: "TFSA", filters: { taxStatus: true } },
  { id: "nofee", label: "No Fees", filters: { monthlyFee: ["free"] } },
  { id: "highbal", label: "High Balance", filters: {} },
];

type FilterValue = string | string[] | boolean | [number, number];
type ActiveFilters = Record<string, FilterValue>;

export default function CompareSavingsPage() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [sort, setSort] = useState("rate_desc");
  const [comparisonCart, setComparisonCart] = useState<string[]>([]);

  const handleFilterChange = (groupId: string, value: FilterValue) => {
    setActiveFilters((prev) => ({ ...prev, [groupId]: value }));
  };

  const handleClearAll = () => setActiveFilters({});

  const handleAddToCart = (id: string) => {
    if (comparisonCart.length < 4) setComparisonCart((prev) => [...prev, id]);
  };

  const handleRemoveFromCart = (id: string) => {
    setComparisonCart((prev) => prev.filter((i) => i !== id));
  };

  const filtered = useMemo(() => {
    let products = [...SAVINGS_PRODUCTS];

    // TFSA toggle
    if (activeFilters.taxStatus === true) {
      products = products.filter((p) => p.taxStatus === "TFSA");
    }

    // Access type
    const accessFilter = activeFilters.accessType as string[] | undefined;
    if (accessFilter && accessFilter.length > 0) {
      products = products.filter((p) => accessFilter.includes(p.accessType));
    }

    // Monthly fee
    const feeFilter = activeFilters.monthlyFee as string[] | undefined;
    if (feeFilter && feeFilter.length > 0) {
      products = products.filter((p) => {
        if (feeFilter.includes("free") && p.monthlyFee === 0) return true;
        if (feeFilter.includes("paid") && (p.monthlyFee ?? 0) > 0) return true;
        return false;
      });
    }

    // Sort
    products.sort((a, b) => {
      const aRate = Math.max(...a.rateTiers.map((t) => t.rate));
      const bRate = Math.max(...b.rateTiers.map((t) => t.rate));
      switch (sort) {
        case "rate_desc": return bRate - aRate;
        case "rate_asc": return aRate - bRate;
        case "fee_asc": return (a.monthlyFee ?? 0) - (b.monthlyFee ?? 0);
        case "minDeposit_asc": return a.minDeposit - b.minDeposit;
        default: return 0;
      }
    });

    return products;
  }, [activeFilters, sort]);

  const cartProducts = SAVINGS_PRODUCTS.filter((p) => comparisonCart.includes(p.id));

  return (
    <Layout breadcrumbs={[{ label: "Compare", href: "/compare/savings" }, { label: "Savings Accounts" }]}>
      <DisclaimerBanner />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <PiggyBank size={22} />
            </div>
            <TrustBadge compact />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Compare Savings Accounts</h1>
          <p className="text-slate-600 max-w-xl">
            Compare savings accounts and TFSA products from major South African banks. Rates reflect effective yield after fees.
          </p>
        </div>

        {/* Best For quick filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm text-slate-500 self-center mr-1">Best for:</span>
          {BEST_FOR_FILTERS.map((bf) => (
            <button
              key={bf.id}
              onClick={() => setActiveFilters(bf.filters as ActiveFilters)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 text-sm rounded-full transition-colors font-medium"
            >
              {bf.label}
            </button>
          ))}
          {Object.keys(activeFilters).length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-sm rounded-full transition-colors font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <FilterSidebar
              filterGroups={FILTER_GROUPS}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort + count row */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-slate-500">
                Showing <strong>{filtered.length}</strong> products
              </p>
              <SortDropdown
                sortOptions={SORT_OPTIONS}
                currentSort={sort}
                onSortChange={setSort}
              />
            </div>

            {/* Comparison grid (when 2+ in cart) */}
            {cartProducts.length >= 2 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">
                  Comparing {cartProducts.length} products
                </h2>
                <ComparisonGrid
                  products={cartProducts}
                  onRemove={handleRemoveFromCart}
                />
              </div>
            )}

            {/* Product grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
                <PiggyBank className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-slate-700 mb-2">No products match your filters</h2>
                <p className="text-slate-500 text-sm">Try adjusting your filters to see more options.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isInCart={comparisonCart.includes(product.id)}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                  />
                ))}
              </div>
            )}

            {comparisonCart.length > 0 && comparisonCart.length < 2 && (
              <p className="mt-4 text-sm text-slate-500 text-center">
                Add {2 - comparisonCart.length} more product{2 - comparisonCart.length > 1 ? "s" : ""} to start comparing
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
