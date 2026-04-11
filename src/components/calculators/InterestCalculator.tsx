'use client';

import { useState, useCallback } from 'react';
import { Calculator, Info } from 'lucide-react';

type CompoundFreq = 'simple' | 'monthly' | 'quarterly' | 'annually';
type PeriodUnit = 'months' | 'years';

interface InterestResult {
  totalInterest: number;
  finalBalance: number;
  effectiveAnnualRate: number;
  simpleInterest: number;
  simpleBalance: number;
  compoundAdvantage: number;
}

function formatCurrency(value: number): string {
  return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getCompoundFreqLabel(f: CompoundFreq): string {
  const map: Record<CompoundFreq, string> = {
    simple: 'Simple Interest',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    annually: 'Annually',
  };
  return map[f];
}

function compoundsPerYear(f: CompoundFreq): number {
  return f === 'monthly' ? 12 : f === 'quarterly' ? 4 : 1;
}

function calculateInterest(
  principal: number,
  ratePercent: number,
  periodMonths: number,
  freq: CompoundFreq,
): InterestResult {
  const r = ratePercent / 100;
  const years = periodMonths / 12;

  // Simple interest
  const simpleInterest = principal * r * years;
  const simpleBalance = principal + simpleInterest;

  // Compound (or simple if selected)
  let finalBalance: number;
  let effectiveAnnualRate: number;

  if (freq === 'simple') {
    finalBalance = simpleBalance;
    effectiveAnnualRate = r;
  } else {
    const n = compoundsPerYear(freq);
    finalBalance = principal * Math.pow(1 + r / n, n * years);
    effectiveAnnualRate = Math.pow(1 + r / n, n) - 1;
  }

  const totalInterest = finalBalance - principal;
  const compoundAdvantage = finalBalance - simpleBalance;

  return { totalInterest, finalBalance, effectiveAnnualRate, simpleInterest, simpleBalance, compoundAdvantage };
}

export default function InterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [period, setPeriod] = useState('12');
  const [periodUnit, setPeriodUnit] = useState<PeriodUnit>('months');
  const [freq, setFreq] = useState<CompoundFreq>('monthly');
  const [result, setResult] = useState<InterestResult | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = useCallback(() => {
    const p = parseFloat(principal.replace(/[^0-9.]/g, ''));
    const r = parseFloat(rate);
    const periodRaw = parseFloat(period);

    if (!p || p <= 0) { setError('Enter a valid principal amount.'); return; }
    if (!r || r <= 0) { setError('Enter a valid interest rate.'); return; }
    if (!periodRaw || periodRaw <= 0) { setError('Enter a valid period.'); return; }

    setError('');
    const months = periodUnit === 'years' ? periodRaw * 12 : periodRaw;
    setResult(calculateInterest(p, r, months, freq));
  }, [principal, rate, period, periodUnit, freq]);

  const freqOptions: CompoundFreq[] = ['simple', 'monthly', 'quarterly', 'annually'];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-700 rounded-lg">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Interest Calculator</h2>
          <p className="text-sm text-gray-500">Simple vs compound interest comparison</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Principal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Principal Amount</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">R</span>
            <input
              type="text"
              inputMode="numeric"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="50 000"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
              aria-label="Principal amount"
            />
          </div>
        </div>

        {/* Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (p.a.)</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.25"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="8.5"
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
              aria-label="Annual interest rate"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 font-medium">% p.a.</span>
          </div>
        </div>

        {/* Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Investment Period</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="flex-1 pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
              aria-label="Investment period"
            />
            <div className="flex gap-1">
              {(['months', 'years'] as PeriodUnit[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setPeriodUnit(u)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 capitalize ${
                    periodUnit === u
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-700'
                  }`}
                  aria-pressed={periodUnit === u}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Compound frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Compounding</label>
          <div className="grid grid-cols-2 gap-2">
            {freqOptions.map((f) => (
              <button
                key={f}
                onClick={() => setFreq(f)}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 ${
                  freq === f
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-700'
                }`}
                aria-pressed={freq === f}
              >
                {getCompoundFreqLabel(f)}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
        >
          Calculate Interest
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-sm text-green-700 font-medium">Final Balance</p>
            <p className="text-3xl font-bold text-green-700 mt-1">{formatCurrency(result.finalBalance)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Interest Earned', value: formatCurrency(result.totalInterest) },
              { label: 'Effective Annual Rate', value: `${(result.effectiveAnnualRate * 100).toFixed(4)}% p.a.` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-base font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Simple vs Compound comparison */}
          {freq !== 'simple' && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Simple vs Compound Comparison
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { label: 'Simple Interest', interest: result.simpleInterest, balance: result.simpleBalance },
                  { label: getCompoundFreqLabel(freq) + ' Compound', interest: result.totalInterest, balance: result.finalBalance },
                ].map(({ label, interest, balance }) => (
                  <div key={label} className="px-4 py-3 flex justify-between items-center">
                    <span className="text-sm text-gray-700">{label}</span>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(balance)}</p>
                      <p className="text-xs text-green-700">+{formatCurrency(interest)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {result.compoundAdvantage > 0 && (
                <div className="bg-green-50 px-4 py-2 text-sm text-green-700">
                  Compound advantage: <strong>{formatCurrency(result.compoundAdvantage)}</strong> extra
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              More frequent compounding increases effective yield. Always compare quoted rates using the Effective Annual Rate (EAR) for apples-to-apples comparisons.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
