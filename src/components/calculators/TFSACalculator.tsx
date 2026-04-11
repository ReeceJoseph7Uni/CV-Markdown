'use client';

import { useState, useCallback } from 'react';
import { Calculator, Info, AlertTriangle, Check } from 'lucide-react';

const ANNUAL_LIMIT = 46000;
const LIFETIME_LIMIT = 500000;
const PENALTY_RATE = 0.40;

interface TFSAResult {
  remainingAnnual: number;
  remainingLifetime: number;
  monthsUntilAnnualLimit: number;
  isOverContributedAnnual: boolean;
  isOverContributedLifetime: boolean;
  annualExcess: number;
  lifetimeExcess: number;
  penaltyAmount: number;
}

function formatCurrency(value: number): string {
  return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function TFSACalculator() {
  const [currentContribs, setCurrentContribs] = useState('');
  const [prevContribs, setPrevContribs] = useState('');
  const [monthlyTarget, setMonthlyTarget] = useState('');
  const [result, setResult] = useState<TFSAResult | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = useCallback(() => {
    const current = parseFloat(currentContribs.replace(/[^0-9.]/g, '')) || 0;
    const prev = parseFloat(prevContribs.replace(/[^0-9.]/g, '')) || 0;
    const monthly = parseFloat(monthlyTarget.replace(/[^0-9.]/g, '')) || 0;

    if (current < 0 || prev < 0) { setError('Contributions cannot be negative.'); return; }

    setError('');

    const remainingAnnual = ANNUAL_LIMIT - current;
    const lifetimeUsed = prev + current;
    const remainingLifetime = LIFETIME_LIMIT - lifetimeUsed;

    const isOverContributedAnnual = current > ANNUAL_LIMIT;
    const isOverContributedLifetime = lifetimeUsed > LIFETIME_LIMIT;
    const annualExcess = Math.max(0, current - ANNUAL_LIMIT);
    const lifetimeExcess = Math.max(0, lifetimeUsed - LIFETIME_LIMIT);
    const excess = Math.max(annualExcess, lifetimeExcess);
    const penaltyAmount = excess * PENALTY_RATE;

    const monthsUntilAnnualLimit =
      monthly > 0 && remainingAnnual > 0 ? Math.ceil(remainingAnnual / monthly) : 0;

    setResult({
      remainingAnnual,
      remainingLifetime,
      monthsUntilAnnualLimit,
      isOverContributedAnnual,
      isOverContributedLifetime,
      annualExcess,
      lifetimeExcess,
      penaltyAmount,
    });
  }, [currentContribs, prevContribs, monthlyTarget]);

  const tfsaProducts = [
    'Fixed Deposits',
    'Savings Accounts',
    'Unit Trusts / ETFs',
    'Money Market Funds',
    'Endowment Policies',
    'Linked Investment Accounts',
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-700 rounded-lg">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">TFSA Contribution Tracker</h2>
          <p className="text-sm text-gray-500">Tax-Free Savings Account (2025/2026)</p>
        </div>
      </div>

      {/* Rules summary */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-sm text-blue-900 space-y-1">
        <p className="font-semibold">TFSA Rules</p>
        <p>Annual contribution limit: <span className="font-medium">{formatCurrency(ANNUAL_LIMIT)}</span></p>
        <p>Lifetime contribution limit: <span className="font-medium">{formatCurrency(LIFETIME_LIMIT)}</span></p>
        <p className="text-red-700">Excess contributions are taxed at <span className="font-bold">40%</span> penalty</p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Year Contributions (so far)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">R</span>
            <input
              type="text"
              inputMode="numeric"
              value={currentContribs}
              onChange={(e) => setCurrentContribs(e.target.value)}
              placeholder="20 000"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
              aria-label="Current year TFSA contributions"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Previous Years Total Contributions
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">R</span>
            <input
              type="text"
              inputMode="numeric"
              value={prevContribs}
              onChange={(e) => setPrevContribs(e.target.value)}
              placeholder="150 000"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
              aria-label="Previous years total TFSA contributions"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Monthly Savings
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">R</span>
            <input
              type="text"
              inputMode="numeric"
              value={monthlyTarget}
              onChange={(e) => setMonthlyTarget(e.target.value)}
              placeholder="3 833"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
              aria-label="Monthly savings target"
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
        >
          Check Allowance
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Over-contribution warnings */}
          {(result.isOverContributedAnnual || result.isOverContributedLifetime) && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                <AlertTriangle className="w-5 h-5" />
                Over-Contribution Warning!
              </div>
              {result.isOverContributedAnnual && (
                <p className="text-sm text-red-700">
                  Annual excess: <strong>{formatCurrency(result.annualExcess)}</strong>
                </p>
              )}
              {result.isOverContributedLifetime && (
                <p className="text-sm text-red-700">
                  Lifetime excess: <strong>{formatCurrency(result.lifetimeExcess)}</strong>
                </p>
              )}
              <p className="text-sm text-red-700 mt-1">
                Estimated 40% penalty: <strong>{formatCurrency(result.penaltyAmount)}</strong>
              </p>
            </div>
          )}

          {/* Results grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-4 ${result.remainingAnnual >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="text-xs font-medium text-gray-600 mb-1">Remaining Annual Allowance</p>
              <p className={`text-xl font-bold ${result.remainingAnnual >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(result.remainingAnnual))}
              </p>
              {result.remainingAnnual < 0 && <p className="text-xs text-red-600">EXCEEDED</p>}
            </div>

            <div className={`rounded-xl p-4 ${result.remainingLifetime >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="text-xs font-medium text-gray-600 mb-1">Remaining Lifetime Allowance</p>
              <p className={`text-xl font-bold ${result.remainingLifetime >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(result.remainingLifetime))}
              </p>
              {result.remainingLifetime < 0 && <p className="text-xs text-red-600">EXCEEDED</p>}
            </div>
          </div>

          {result.monthsUntilAnnualLimit > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">
                At <strong>{formatCurrency(parseFloat(monthlyTarget.replace(/[^0-9.]/g, '')) || 0)}/month</strong>,
                you&apos;ll reach your annual limit in{' '}
                <strong className="text-blue-700">
                  {result.monthsUntilAnnualLimit} month{result.monthsUntilAnnualLimit !== 1 ? 's' : ''}
                </strong>
              </p>
            </div>
          )}

          {/* TFSA eligible products */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">TFSA-Eligible Products</p>
            <div className="grid grid-cols-2 gap-1">
              {tfsaProducts.map((product) => (
                <div key={product} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  {product}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Withdrawals do NOT restore your contribution room — once contributed, the space is permanently used. Consult a financial adviser before withdrawing.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
