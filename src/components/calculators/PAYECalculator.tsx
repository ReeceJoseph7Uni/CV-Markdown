'use client';

import { useState, useCallback } from 'react';
import { Calculator, Info, AlertTriangle } from 'lucide-react';

// 2025/2026 SARS tax brackets
const TAX_BRACKETS = [
  { min: 0,       max: 237100,  rate: 0.18, base: 0 },
  { min: 237101,  max: 370500,  rate: 0.26, base: 42678 },
  { min: 370501,  max: 512800,  rate: 0.31, base: 77362 },
  { min: 512801,  max: 673000,  rate: 0.36, base: 121475 },
  { min: 673001,  max: 857900,  rate: 0.39, base: 179147 },
  { min: 857901,  max: 1817000, rate: 0.41, base: 251258 },
  { min: 1817001, max: Infinity, rate: 0.45, base: 644489 },
];

const REBATES = {
  primary: 17235,
  secondary: 9444,
  tertiary: 3145,
};

const UIF_RATE = 0.01;
const UIF_MAX_MONTHLY = 177.12;

type AgeGroup = 'under65' | '65to74' | '75plus';

interface PAYEResult {
  annualTax: number;
  monthlyTax: number;
  uifMonthly: number;
  netMonthly: number;
  effectiveRate: number;
  marginalRate: number;
  rebatesApplied: number;
  bracket: number;
}

function formatCurrency(value: number): string {
  return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

function calculatePAYE(grossAnnual: number, ageGroup: AgeGroup): PAYEResult {
  // Calculate tax from brackets
  let tax = 0;
  let marginalRate = 0.18;
  let bracketIndex = 0;

  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    const b = TAX_BRACKETS[i];
    if (grossAnnual > b.min - 1) {
      const taxable = Math.min(grossAnnual, b.max === Infinity ? grossAnnual : b.max) - (b.min - 1);
      tax = b.base + taxable * b.rate;
      marginalRate = b.rate;
      bracketIndex = i;
    }
  }

  // Apply rebates
  let rebates = REBATES.primary;
  if (ageGroup === '65to74') rebates += REBATES.secondary;
  if (ageGroup === '75plus') rebates += REBATES.secondary + REBATES.tertiary;

  const annualTax = Math.max(0, tax - rebates);
  const monthlyTax = annualTax / 12;
  const uifMonthly = Math.min((grossAnnual / 12) * UIF_RATE, UIF_MAX_MONTHLY);
  const netMonthly = grossAnnual / 12 - monthlyTax - uifMonthly;
  const effectiveRate = grossAnnual > 0 ? annualTax / grossAnnual : 0;

  return {
    annualTax,
    monthlyTax,
    uifMonthly,
    netMonthly,
    effectiveRate,
    marginalRate,
    rebatesApplied: rebates,
    bracket: bracketIndex,
  };
}

export default function PAYECalculator() {
  const [grossInput, setGrossInput] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('under65');
  const [result, setResult] = useState<PAYEResult | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = useCallback(() => {
    const gross = parseFloat(grossInput.replace(/[^0-9.]/g, ''));
    if (!gross || gross <= 0) {
      setError('Please enter a valid annual gross salary.');
      setResult(null);
      return;
    }
    setError('');
    setResult(calculatePAYE(gross, ageGroup));
  }, [grossInput, ageGroup]);

  const bracketColors = [
    'bg-green-400',
    'bg-lime-400',
    'bg-yellow-400',
    'bg-orange-400',
    'bg-red-400',
    'bg-red-500',
    'bg-red-700',
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-700 rounded-lg">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">PAYE Income Tax Calculator</h2>
          <p className="text-sm text-gray-500">Tax Year 2025/2026</p>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Annual Gross Salary
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">R</span>
            <input
              type="text"
              inputMode="numeric"
              value={grossInput}
              onChange={(e) => setGrossInput(e.target.value)}
              placeholder="500 000"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
              aria-label="Annual gross salary in Rands"
            />
          </div>
        </div>

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

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
        >
          Calculate PAYE
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Monthly take-home highlighted */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-sm text-green-700 font-medium">Monthly Take-Home Pay</p>
            <p className="text-3xl font-bold text-green-700 mt-1">
              {formatCurrency(result.netMonthly)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Annual Tax', value: formatCurrency(result.annualTax) },
              { label: 'Monthly Tax', value: formatCurrency(result.monthlyTax) },
              { label: 'UIF (Monthly)', value: formatCurrency(result.uifMonthly) },
              { label: 'Rebates Applied', value: formatCurrency(result.rebatesApplied) },
              { label: 'Effective Tax Rate', value: formatPercent(result.effectiveRate) },
              { label: 'Marginal Tax Rate', value: formatPercent(result.marginalRate) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-base font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Bracket visualization */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Tax Bracket Bands</p>
            <div className="flex rounded-lg overflow-hidden h-6">
              {TAX_BRACKETS.map((b, i) => (
                <div
                  key={i}
                  className={`${bracketColors[i]} ${i === result.bracket ? 'ring-2 ring-inset ring-gray-900' : ''}`}
                  style={{ flex: i < 6 ? (b.max === Infinity ? 1 : b.max - b.min) / 1817000 : 0.1 }}
                  title={`${(b.rate * 100).toFixed(0)}%`}
                  role="presentation"
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>18%</span>
              <span>26%</span>
              <span>31%</span>
              <span>36%</span>
              <span>39%</span>
              <span>41%</span>
              <span>45%</span>
            </div>
          </div>

          {/* Note */}
          <div className="flex gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              PAYE is calculated using 2025/2026 SARS tax tables. UIF is capped at R177.12/month.
              This estimate excludes medical aid credits and other deductions.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
