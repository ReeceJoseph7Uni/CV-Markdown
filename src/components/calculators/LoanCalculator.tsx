'use client';

import { useState, useCallback } from 'react';
import { Calculator, Info } from 'lucide-react';

interface AmortizationRow {
  year: number;
  openingBalance: number;
  totalPaid: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

interface LoanResult {
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  interestPercent: number;
  yearlyBreakdown: AmortizationRow[];
}

function formatCurrency(value: number): string {
  return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function calculateLoan(principal: number, annualRate: number, termMonths: number): LoanResult {
  const r = annualRate / 100 / 12;
  const n = termMonths;

  let monthlyPayment: number;
  if (r === 0) {
    monthlyPayment = principal / n;
  } else {
    monthlyPayment = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const totalRepayment = monthlyPayment * n;
  const totalInterest = totalRepayment - principal;
  const interestPercent = (totalInterest / principal) * 100;

  // Yearly breakdown (first 5 years)
  const yearlyBreakdown: AmortizationRow[] = [];
  let balance = principal;
  const yearsToShow = Math.min(5, Math.ceil(termMonths / 12));

  for (let y = 1; y <= yearsToShow; y++) {
    const monthsThisYear = Math.min(12, termMonths - (y - 1) * 12);
    const openingBalance = balance;
    let yearInterest = 0;
    let yearPrincipal = 0;

    for (let m = 0; m < monthsThisYear; m++) {
      const interestThisMonth = balance * r;
      const principalThisMonth = Math.min(monthlyPayment - interestThisMonth, balance);
      yearInterest += interestThisMonth;
      yearPrincipal += principalThisMonth;
      balance -= principalThisMonth;
      if (balance < 0) balance = 0;
    }

    yearlyBreakdown.push({
      year: y,
      openingBalance,
      totalPaid: (yearInterest + yearPrincipal),
      principalPaid: yearPrincipal,
      interestPaid: yearInterest,
      closingBalance: balance,
    });
  }

  return { monthlyPayment, totalRepayment, totalInterest, interestPercent, yearlyBreakdown };
}

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [termYears, setTermYears] = useState('5');
  const [termMonths, setTermMonths] = useState('0');
  const [result, setResult] = useState<LoanResult | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = useCallback(() => {
    const principal = parseFloat(loanAmount.replace(/[^0-9.]/g, ''));
    const rate = parseFloat(interestRate);
    const months = parseInt(termYears || '0') * 12 + parseInt(termMonths || '0');

    if (!principal || principal <= 0) { setError('Enter a valid loan amount.'); return; }
    if (!rate || rate <= 0) { setError('Enter a valid interest rate.'); return; }
    if (months <= 0) { setError('Enter a valid loan term.'); return; }

    setError('');
    setResult(calculateLoan(principal, rate, months));
  }, [loanAmount, interestRate, termYears, termMonths]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-700 rounded-lg">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Loan Repayment Calculator</h2>
          <p className="text-sm text-gray-500">Personal loan, vehicle finance & more</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Loan Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">R</span>
            <input
              type="text"
              inputMode="numeric"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="100 000"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
              aria-label="Loan amount in Rands"
            />
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Annual Interest Rate</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.25"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="18.75"
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
              aria-label="Annual interest rate percentage"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 font-medium">% p.a.</span>
          </div>
        </div>

        {/* Term */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term</label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="number"
                min="0"
                max="30"
                value={termYears}
                onChange={(e) => setTermYears(e.target.value)}
                placeholder="5"
                className="w-full pl-4 pr-14 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
                aria-label="Loan term years"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm">years</span>
            </div>
            <div className="flex-1 relative">
              <input
                type="number"
                min="0"
                max="11"
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
                placeholder="0"
                className="w-full pl-4 pr-16 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
                aria-label="Loan term additional months"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm">months</span>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
        >
          Calculate Repayment
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Highlighted monthly payment */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-sm text-green-700 font-medium">Monthly Repayment</p>
            <p className="text-3xl font-bold text-green-700 mt-1">{formatCurrency(result.monthlyPayment)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Repayment', value: formatCurrency(result.totalRepayment) },
              { label: 'Total Interest Paid', value: formatCurrency(result.totalInterest) },
              { label: 'Interest as % of Loan', value: `${result.interestPercent.toFixed(1)}%` },
              { label: 'Interest : Principal', value: `${(result.totalInterest / parseFloat(loanAmount.replace(/[^0-9.]/g, ''))).toFixed(2)}x` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-base font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Yearly breakdown */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Amortization Summary (first {result.yearlyBreakdown.length} year{result.yearlyBreakdown.length !== 1 ? 's' : ''})
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs">
                    <th className="px-3 py-2 text-left">Year</th>
                    <th className="px-3 py-2 text-right">Principal</th>
                    <th className="px-3 py-2 text-right">Interest</th>
                    <th className="px-3 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="border-t border-gray-100">
                      <td className="px-3 py-2 font-medium text-gray-800">Year {row.year}</td>
                      <td className="px-3 py-2 text-right text-green-700">{formatCurrency(row.principalPaid)}</td>
                      <td className="px-3 py-2 text-right text-red-600">{formatCurrency(row.interestPaid)}</td>
                      <td className="px-3 py-2 text-right text-gray-700">{formatCurrency(row.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Compare initiation fees (typically R1,207.50 + 11.5% of amount above R10,000 capped at R11,989.00) when choosing between lenders.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
