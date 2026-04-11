'use client';

import { useState } from 'react';
import { Check, Info } from 'lucide-react';

interface RateTier {
  minBalance?: number;
  maxBalance?: number | null;
  rate: number;
  isPromotional?: boolean;
}

interface Product {
  id: string;
  institutionName: string;
  productName: string;
  productType: string;
  effectiveYield?: number;
  monthlyFee?: number;
  minDeposit: number;
  accessType: string;
  taxStatus: string;
  rateTiers: RateTier[];
  isPromotional?: boolean;
  lastCheckedDate: string;
  rateType: string;
}

interface ProductCardProps {
  product: Product;
  isInCart: boolean;
  onAddToCart: (id: string) => void;
  onRemoveFromCart: (id: string) => void;
}

function formatCurrency(value: number): string {
  return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
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
    African: 'bg-amber-700',
  };
  for (const key of Object.keys(colors)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return colors[key];
  }
  return 'bg-blue-700';
}

function accessLabel(accessType: string): string {
  const map: Record<string, string> = {
    INSTANT: 'Instant Access',
    NOTICE_32_DAYS: '32-Day Notice',
    NOTICE_60_DAYS: '60-Day Notice',
    NOTICE_90_DAYS: '90-Day Notice',
    FIXED_TERM: 'Fixed Term',
    ON_DEMAND: 'On Demand',
  };
  return map[accessType] ?? accessType;
}

function bestRate(product: Product): number {
  if (!product.rateTiers || product.rateTiers.length === 0) return 0;
  return Math.max(...product.rateTiers.map((t) => t.rate));
}

function isPromotionalRate(product: Product): boolean {
  return product.isPromotional ?? product.rateTiers?.some((t) => t.isPromotional) ?? false;
}

export default function ProductCard({ product, isInCart, onAddToCart, onRemoveFromCart }: ProductCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const rate = bestRate(product);
  const isPromo = isPromotionalRate(product);
  const isTFSA = product.taxStatus === 'TFSA';
  const lastChecked = new Date(product.lastCheckedDate).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className={`relative bg-white rounded-2xl shadow-sm border transition-all ${isInCart ? 'border-blue-700 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}`}>
      {/* Promotional banner */}
      {isPromo && (
        <div className="bg-amber-500 text-white text-xs font-semibold text-center py-1 rounded-t-2xl px-3">
          🎉 Promotional Rate — Limited Time
        </div>
      )}

      <div className="p-5">
        {/* Bank logo + name */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl ${bankColor(product.institutionName)} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold text-sm">{getInitials(product.institutionName)}</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{product.institutionName}</p>
            <p className="text-sm text-gray-500 truncate">{product.productName}</p>
          </div>
          {isTFSA && (
            <span className="ml-auto flex-shrink-0 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
              TFSA
            </span>
          )}
        </div>

        {/* Rate badge */}
        <div className="text-center mb-4 bg-blue-50 rounded-xl py-3">
          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">
            {product.rateType?.replace(/_/g, ' ') ?? 'Rate'}
          </p>
          <p className={`text-4xl font-extrabold ${isPromo ? 'text-amber-600' : 'text-blue-700'}`}>
            {rate.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-500 mt-0.5">p.a.</p>
        </div>

        {/* Details grid */}
        <dl className="space-y-2 text-sm mb-4">
          {[
            { label: 'Effective Yield', value: product.effectiveYield != null ? `${product.effectiveYield.toFixed(2)}% p.a.` : '—' },
            { label: 'Monthly Fee', value: product.monthlyFee != null ? (product.monthlyFee === 0 ? 'Free' : formatCurrency(product.monthlyFee)) : '—' },
            { label: 'Min Balance', value: product.minDeposit != null ? formatCurrency(product.minDeposit) : '—' },
            { label: 'Access', value: accessLabel(product.accessType) },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <dt className="text-gray-500">{label}</dt>
              <dd className="font-medium text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Expandable details */}
        {showDetails && (
          <div className="border-t border-gray-100 pt-3 mb-4 text-xs text-gray-500 space-y-1">
            <p>Rate tiers: {product.rateTiers?.length ?? 0} tier(s)</p>
            {product.rateTiers?.map((tier, i) => (
              <p key={i}>
                {tier.minBalance != null ? formatCurrency(tier.minBalance) : '0'}
                {tier.maxBalance != null ? ` – ${formatCurrency(tier.maxBalance)}` : '+'}: <strong>{tier.rate.toFixed(2)}%</strong>
                {tier.isPromotional ? ' (promo)' : ''}
              </p>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => (isInCart ? onRemoveFromCart(product.id) : onAddToCart(product.id))}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              isInCart
                ? 'bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-700'
                : 'border border-blue-700 text-blue-700 hover:bg-blue-50 focus:ring-blue-700'
            }`}
            aria-pressed={isInCart}
          >
            {isInCart ? (
              <span className="flex items-center justify-center gap-1">
                <Check className="w-4 h-4" /> In Compare
              </span>
            ) : (
              '+ Add to Compare'
            )}
          </button>
          <button
            onClick={() => setShowDetails((v) => !v)}
            className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-expanded={showDetails}
            aria-label="View product details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Last updated */}
        <p className="text-center text-xs text-gray-400 mt-3">
          Updated {lastChecked}
        </p>
      </div>
    </div>
  );
}
