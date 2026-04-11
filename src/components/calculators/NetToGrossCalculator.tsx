'use client';

import { useState, useCallback } from 'react';
import { Calculator, Info } from 'lucide-react';

// 2025/2026 SARS brackets (same as PAYECalculator)
const TAX_BRACKETS = [
  { min: 0,       max: 237100,  rate: 0.18, base: 0 },
  { min: 237101,  max: 370500,  rate: 0.26, base: 42678 },
  { min: 370501,  max: 512800,  rate: 0.31, base: 77362 },
  { min: 512801,  max: 673000,  rate: 0.36, base: 121475 },
  { min: 673001,  max: 857900,  rate: 0.39, base: 179147 },
  { min: 857901,  max: 1817000, rate: 0.41, base: 251258 },
  { min: 1817001, max: Infinity, rate: 0.45, base: 644489 },
];

const REBATES = { primary: 17235, secondary: 9444, tertiary: 3145 };
const UIF_RATE = 0.01;
const UIF_MAX_MONTHLY = 177.12;

type AgeGroup = 'under65' | '65to74' | '75plus';

interface NetToGrossResult {
  grossAnnual: number;
  grossMonthly: number;
  annualTax: number;
  monthlyTax: number;
  uifMonthly: number;
  netMonthly: number;
  reconciliation: number;
}

function formatCurrency(value: number): string {
  return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function taxOnAnnualGross(grossAnnual: number, ageGroup: AgeGroup): { tax: number; uifMonthly: number } {
  let tax = 0;
  for (const b of TAX_BRACKETS) {
    if (grossAnnual > b.min - 1) {
      const taxable = Math.min(grossAnnual, b.max === Infinity ? grossAnnual : b.max) - (b.min - 1);
      tax = b.base + taxable * b.rate;
    }
  }
  let rebates = REBATES.primary;
  if (ageGroup === '65to74') rebates += REBATES.secondary;
  if (ageGroup === '75plus') rebates += REBATES.secondary + REBATES.tertiary;
  const annualTax = Math.max(0, tax - rebates);
  const uifMonthly = Math.min((grossAnnual / 12) * UIF_RATE, UIF_MAX_MONTHLY);
  return { tax: annualTax, uifMonthly };
}

function findGrossFromNet(netMonthly: number, ageGroup: AgeGroup): NetToGrossResult {
  // Binary search for gross
  let lo = netMonthly;
  let hi = netMonthly * 3;

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const annualGross = mid * 12;
    const { tax, uifMonthly } = taxOnAnnualGross(annualGross, ageGroup);
    const calculatedNet = mid - tax / 12 - uifMonthly;
    if (calculatedNet < netMonthly) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  const grossMonthly = (lo + hi) / 2;
  const grossAnnual = grossMonthly * 12;
  const { tax: annualTax, uifMonthly } = taxOnAnnualGross(grossAnnual, ageGroup);
  const monthlyTax = annualTax / 12;
  const netMonthlyActual = grossMonthly - monthlyTax - uifMonthly;

  return {
    grossAnnual,
    grossMonthly,
    annualTax,
    monthlyTax,
    uifMonthly,
    netMonthly: netMonthlyActual,
    reconciliation: netMonthlyActual - netMonthly,
  };
}

export default function NetToGrossCalculator() {
  const [netInput, setNetInput] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('under65');
  const [result, setResult] = useState<NetToGrossResult | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = useCallback(() => {
    const net = parseFloat(netInput.replace(/[^0-9.]/g, ''));
    if (!net || net <= 0) {
      setError('Please enter a valid net monthly salary.');
      setResult(null);
      return;
    }
    setError('');
    setResult(findGrossFromNet(net, ageGroup));
  }, [netInput, ageGroup]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-700 rounded-lg">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Net-to-Gross Salary Converter</h2>
          <p className="text-sm text-gray-500">Work backwards from take-home pay</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Net salary input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Net Monthly Take-Home Pay
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">R</span>
            <input
              type="text"
              inputMode="numeric"
              value={netInput}
              onChange={(e) => setNetInput(e.target.value)}
              placeholder="25 000"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
              aria-label="Net monthly take-home pay"
            />
          </div>
        </div>

        {/* Age group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
          <div className="flex gap-2 flex-wrap">
            {(
              [
                { value: 'under65', label: 'Under 65' },
                { value: '65to74', label: '65 – 74' },
                { value: '75plus', label: '75+' },
              ] as { value: AgeGroup; label: string }[]
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setAgeGroup(opt.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 ${
                  ageGroup === opt.value
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-700'
                }`}
                aria-pressed={ageGroup === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
        >
          Find Gross Salary
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Highlighted gross */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-700 font-medium">Required Gross Monthly Salary</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">{formatCurrency(result.grossMonthly)}</p>
            <p className="text-sm text-blue-600 mt-1">Annual: {formatCurrency(result.grossAnnual)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Monthly Tax (PAYE)', value: formatCurrency(result.monthlyTax) },
              { label: 'Annual Tax', value: formatCurrency(result.annualTax) },
              { label: 'UIF Contribution', value: formatCurrency(result.uifMonthly) },
              { label: 'Total Deductions', value: formatCurrency(result.monthlyTax + result.uifMonthly) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-base font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Reconciliation */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Reconciliation
            </div>
            <div className="px-4 py-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross monthly</span>
                <span className="font-medium text-gray-900">{formatCurrency(result.grossMonthly)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>– PAYE tax</span>
                <span>– {formatCurrency(result.monthlyTax)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>– UIF</span>
                <span>– {formatCurrency(result.uifMonthly)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                <span className="text-green-700">= Net take-home</span>
                <span className="text-green-700">{formatCurrency(result.netMonthly)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-xs text-yellow-800">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              This is an estimate based on 2025/2026 SARS tables. Actual deductions depend on medical aid, retirement annuity, and other factors. Consult your employer&apos;s payroll for the precise figure.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
