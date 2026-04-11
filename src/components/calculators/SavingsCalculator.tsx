'use client';

import { useState, useCallback } from 'react';
import { Calculator, Info } from 'lucide-react';

interface YearlyBreakdown {
  year: number;
  balance: number;
  contributions: number;
  interest: number;
}

interface SavingsResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  growthMultiple: number;
  breakdown: YearlyBreakdown[];
}

function formatCurrency(value: number): string {
  return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function calculateSavings(
  principal: number,
  monthly: number,
  annualRate: number,
  years: number,
  compoundFreq: 'monthly' | 'annually',
): SavingsResult {
  const breakdown: YearlyBreakdown[] = [];
  let balance = principal;
  let totalContributions = principal;
  const r = annualRate / 100;

  for (let y = 1; y <= years; y++) {
    if (compoundFreq === 'monthly') {
      const monthlyRate = r / 12;
      for (let m = 0; m < 12; m++) {
        balance = (balance + monthly) * (1 + monthlyRate);
        totalContributions += monthly;
      }
    } else {
      // Annual compounding – contributions assumed at year-start
      totalContributions += monthly * 12;
      balance = (balance + monthly * 12) * (1 + r);
    }

    breakdown.push({
      year: y,
      balance,
      contributions: totalContributions,
      interest: balance - totalContributions,
    });
  }

  const totalInterest = balance - totalContributions;
  const growthMultiple = totalContributions > 0 ? balance / totalContributions : 1;

  return { finalBalance: balance, totalContributions, totalInterest, growthMultiple, breakdown };
}

export default function SavingsCalculator() {
  const [initial, setInitial] = useState('');
  const [monthlyContrib, setMonthlyContrib] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [years, setYears] = useState('10');
  const [compoundFreq, setCompoundFreq] = useState<'monthly' | 'annually'>('monthly');
  const [result, setResult] = useState<SavingsResult | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = useCallback(() => {
    const p = parseFloat(initial.replace(/[^0-9.]/g, '')) || 0;
    const m = parseFloat(monthlyContrib.replace(/[^0-9.]/g, '')) || 0;
    const r = parseFloat(annualRate);
    const y = parseInt(years);

    if (p < 0 || m < 0) { setError('Amounts must be zero or positive.'); return; }
    if (!r || r <= 0) { setError('Enter a valid interest rate.'); return; }
    if (!y || y <= 0) { setError('Enter a valid investment period.'); return; }
    if (p === 0 && m === 0) { setError('Enter an initial deposit or monthly contribution.'); return; }

    setError('');
    setResult(calculateSavings(p, m, r, y, compoundFreq));
  }, [initial, monthlyContrib, annualRate, years, compoundFreq]);

  const displayBreakdown = result ? (result.breakdown.length <= 10 ? result.breakdown : result.breakdown.slice(0, 10)) : [];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-700 rounded-lg">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Savings Growth Calculator</h2>
          <p className="text-sm text-gray-500">See how your money grows over time</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Initial deposit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Initial Deposit</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">R</span>
            <input
              type="text"
              inputMode="numeric"
              value={initial}
              onChange={(e) => setInitial(e.target.value)}
              placeholder="10 000"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
              aria-label="Initial deposit amount"
            />
          </div>
        </div>

        {/* Monthly contribution */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">R</span>
            <input
              type="text"
              inputMode="numeric"
              value={monthlyContrib}
              onChange={(e) => setMonthlyContrib(e.target.value)}
              placeholder="500"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
              aria-label="Monthly contribution amount"
            />
          </div>
        </div>

        {/* Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Annual Interest Rate</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="50"
              step="0.25"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              placeholder="8.5"
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
              aria-label="Annual interest rate"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 font-medium">% p.a.</span>
          </div>
        </div>

        {/* Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Investment Period (years)</label>
          <input
            type="number"
            min="1"
            max="50"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
            aria-label="Investment period in years"
          />
        </div>

        {/* Compounding frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Compounding Frequency</label>
          <div className="flex gap-2">
            {(['monthly', 'annually'] as const).map((freq) => (
              <button
                key={freq}
                onClick={() => setCompoundFreq(freq)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 capitalize ${
                  compoundFreq === freq
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-700'
                }`}
                aria-pressed={compoundFreq === freq}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
        >
          Calculate Growth
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
              { label: 'Total Contributions', value: formatCurrency(result.totalContributions) },
              { label: 'Total Interest Earned', value: formatCurrency(result.totalInterest) },
              { label: 'Growth Multiple', value: `${result.growthMultiple.toFixed(2)}x` },
              { label: 'Interest on Contributions', value: `${((result.totalInterest / result.totalContributions) * 100).toFixed(1)}%` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-base font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Year-by-year table */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Year-by-Year Breakdown {result.breakdown.length > 10 ? '(first 10 years)' : ''}
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs">
                    <th className="px-3 py-2 text-left">Year</th>
                    <th className="px-3 py-2 text-right">Contributions</th>
                    <th className="px-3 py-2 text-right">Interest</th>
                    <th className="px-3 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {displayBreakdown.map((row) => (
                    <tr key={row.year} className="border-t border-gray-100">
                      <td className="px-3 py-2 font-medium text-gray-800">Year {row.year}</td>
                      <td className="px-3 py-2 text-right text-gray-700">{formatCurrency(row.contributions)}</td>
                      <td className="px-3 py-2 text-right text-green-700">{formatCurrency(row.interest)}</td>
                      <td className="px-3 py-2 text-right font-semibold text-gray-900">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Consider a Tax-Free Savings Account (TFSA) to shelter returns from tax — annual limit R46,000 and lifetime limit R500,000.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
