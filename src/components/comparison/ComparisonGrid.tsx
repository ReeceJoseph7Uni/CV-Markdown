'use client';

import { X } from 'lucide-react';

interface RateTier {
  minBalance?: number;
  maxBalance?: number | null;
  rate: number;
  isPromotional?: boolean;
}

interface ComparisonProduct {
  id: string;
  institutionName: string;
  productName: string;
  effectiveYield?: number;
  monthlyFee?: number;
  minDeposit: number;
  accessType: string;
  taxStatus: string;
  rateTiers: RateTier[];
  rateType: string;
  noticePeriodDays?: number;
}

interface ComparisonGridProps {
  products: ComparisonProduct[];
  onRemove: (id: string) => void;
}

function formatCurrency(value: number): string {
  return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function bestRate(product: ComparisonProduct): number {
  if (!product.rateTiers || product.rateTiers.length === 0) return 0;
  return Math.max(...product.rateTiers.map((t) => t.rate));
}

function accessLabel(accessType: string): string {
  const map: Record<string, string> = {
    INSTANT: 'Instant',
    NOTICE_32_DAYS: '32-Day Notice',
    NOTICE_60_DAYS: '60-Day Notice',
    NOTICE_90_DAYS: '90-Day Notice',
    FIXED_TERM: 'Fixed Term',
    ON_DEMAND: 'On Demand',
  };
  return map[accessType] ?? accessType;
}

function bankColor(name: string): string {
  const colors: Record<string, string> = {
    ABSA: 'bg-red-600',
    FNB: 'bg-orange-600',
    Nedbank: 'bg-green-700',
    Standard: 'bg-blue-700',
    Capitec: 'bg-purple-700',
    Investec: 'bg-slate-800',
    Discovery: 'bg-pink-600',
    TymeBank: 'bg-teal-600',
  };
  for (const key of Object.keys(colors)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return colors[key];
  }
  return 'bg-blue-700';
}

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 3).toUpperCase();
}

type RowConfig = {
  label: string;
  key: string;
  getValue: (p: ComparisonProduct) => number | string;
  format: (v: number | string) => string;
  higherIsBetter?: boolean;
};

const ROWS: RowConfig[] = [
  {
    label: 'Interest Rate',
    key: 'rate',
    getValue: (p) => bestRate(p),
    format: (v) => `${(v as number).toFixed(2)}% p.a.`,
    higherIsBetter: true,
  },
  {
    label: 'Monthly Fee',
    key: 'fee',
    getValue: (p) => p.monthlyFee ?? 0,
    format: (v) => (v === 0 ? 'Free' : formatCurrency(v as number)),
    higherIsBetter: false,
  },
  {
    label: 'Effective Yield',
    key: 'yield',
    getValue: (p) => p.effectiveYield ?? bestRate(p),
    format: (v) => `${(v as number).toFixed(2)}% p.a.`,
    higherIsBetter: true,
  },
  {
    label: 'Min Balance',
    key: 'minBalance',
    getValue: (p) => p.minDeposit,
    format: (v) => formatCurrency(v as number),
    higherIsBetter: false,
  },
  {
    label: 'Access Type',
    key: 'access',
    getValue: (p) => accessLabel(p.accessType),
    format: (v) => v as string,
  },
  {
    label: 'TFSA Eligible',
    key: 'tfsa',
    getValue: (p) => (p.taxStatus === 'TFSA' ? 'Yes' : 'No'),
    format: (v) => v as string,
    higherIsBetter: true,
  },
  {
    label: 'Notice Period',
    key: 'notice',
    getValue: (p) => (p.noticePeriodDays != null ? `${p.noticePeriodDays} days` : '—'),
    format: (v) => v as string,
  },
];

function isBest(row: RowConfig, products: ComparisonProduct[], idx: number): boolean {
  if (row.higherIsBetter === undefined) return false;
  const values = products.map((p) => row.getValue(p));
  const numericValues = values.filter((v) => typeof v === 'number') as number[];
  if (numericValues.length === 0) {
    // String comparison: TFSA "Yes" is best
    if (row.key === 'tfsa') {
      return values[idx] === 'Yes' && values.some((v) => v === 'Yes');
    }
    return false;
  }
  const best = row.higherIsBetter ? Math.max(...numericValues) : Math.min(...numericValues);
  return values[idx] === best;
}

export default function ComparisonGrid({ products, onRemove }: ComparisonGridProps) {
  if (products.length < 2) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-sm">Select at least 2 products to compare.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {/* Sticky attribute column header */}
            <th
              className="sticky left-0 z-10 bg-gray-50 border-b border-gray-200 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-36"
              scope="col"
            >
              Attribute
            </th>
            {products.map((product) => (
              <th
                key={product.id}
                className="bg-white border-b border-gray-200 px-4 py-3 text-center min-w-[180px]"
                scope="col"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-between w-full">
                    <div className={`w-8 h-8 rounded-lg ${bankColor(product.institutionName)} flex items-center justify-center`}>
                      <span className="text-white font-bold text-xs">{getInitials(product.institutionName)}</span>
                    </div>
                    <button
                      onClick={() => onRemove(product.id)}
                      className="text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                      aria-label={`Remove ${product.institutionName} from comparison`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-left w-full">
                    <p className="text-sm font-semibold text-gray-900 truncate">{product.institutionName}</p>
                    <p className="text-xs text-gray-500 truncate">{product.productName}</p>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, rowIdx) => (
            <tr
              key={row.key}
              className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
            >
              {/* Sticky attribute label */}
              <td
                className={`sticky left-0 z-10 px-4 py-3 text-sm font-medium text-gray-700 border-b border-gray-100 ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                {row.label}
              </td>

              {products.map((product, colIdx) => {
                const value = row.getValue(product);
                const formatted = row.format(value);
                const best = isBest(row, products, colIdx);

                return (
                  <td
                    key={product.id}
                    className={`px-4 py-3 text-center text-sm border-b border-gray-100 transition-colors ${
                      best
                        ? 'bg-green-50 text-green-700 font-semibold'
                        : 'text-gray-800'
                    }`}
                  >
                    {best && (
                      <span className="inline-block text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full mb-1 font-semibold">
                        Best
                      </span>
                    )}
                    <div>{formatted}</div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
