'use client';

import { useState, useCallback, useMemo } from 'react';
import { Calculator, Info } from 'lucide-react';

interface BondResult {
  loanAmount: number;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  interestRatio: number;
  transferDuty: number;
}

function formatCurrency(value: number): string {
  return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// 2024 Transfer Duty rates (SARS)
function calcTransferDuty(price: number): number {
  if (price <= 1100000) return 0;
  if (price <= 1512500) return (price - 1100000) * 0.03;
  if (price <= 2117500) return 12375 + (price - 1512500) * 0.06;
  if (price <= 2722500) return 48675 + (price - 2117500) * 0.08;
  if (price <= 12100000) return 97475 + (price - 2722500) * 0.11;
  return 1128600 + (price - 12100000) * 0.13;
}

function calcMonthly(principal: number, annualRate: number, termMonths: number): number {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
}

export default function BondCalculator() {
  const [purchasePrice, setPurchasePrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [depositMode, setDepositMode] = useState<'amount' | 'percent'>('amount');
  const [interestRate, setInterestRate] = useState('10.25');
  const [termYears, setTermYears] = useState(20);
  const [result, setResult] = useState<BondResult | null>(null);
  const [error, setError] = useState('');

  const price = useMemo(() => parseFloat(purchasePrice.replace(/[^0-9.]/g, '')) || 0, [purchasePrice]);
  const depositValue = useMemo(() => {
    const raw = parseFloat(deposit.replace(/[^0-9.]/g, '')) || 0;
    return depositMode === 'percent' ? (price * raw) / 100 : raw;
  }, [deposit, depositMode, price]);

  const loanAmount = useMemo(() => Math.max(0, price - depositValue), [price, depositValue]);

  const handleCalculate = useCallback(() => {
    const rate = parseFloat(interestRate);
    if (price <= 0) { setError('Enter a valid purchase price.'); return; }
    if (!rate || rate <= 0) { setError('Enter a valid interest rate.'); return; }
    if (depositValue >= price) { setError('Deposit cannot exceed purchase price.'); return; }

    setError('');
    const termMonths = termYears * 12;
    const monthly = calcMonthly(loanAmount, rate, termMonths);
    const totalRepayment = monthly * termMonths;
    const totalInterest = totalRepayment - loanAmount;
    const transferDuty = calcTransferDuty(price);

    setResult({
      loanAmount,
      monthlyPayment: monthly,
      totalRepayment,
      totalInterest,
      interestRatio: loanAmount > 0 ? totalInterest / loanAmount : 0,
      transferDuty,
    });
  }, [price, depositValue, interestRate, termYears, loanAmount]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-700 rounded-lg">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bond / Home Loan Calculator</h2>
          <p className="text-sm text-gray-500">Current prime rate: 10.25% p.a.</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Purchase Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">R</span>
            <input
              type="text"
              inputMode="numeric"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="1 500 000"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
              aria-label="Property purchase price"
            />
          </div>
        </div>

        {/* Deposit */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Deposit</label>
            <div className="flex gap-1 text-xs">
              {(['amount', 'percent'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setDepositMode(m)}
                  className={`px-2 py-1 rounded border transition-colors focus:outline-none focus:ring-1 focus:ring-blue-700 ${
                    depositMode === m ? 'bg-blue-700 text-white border-blue-700' : 'text-gray-600 border-gray-300 hover:border-blue-700'
                  }`}
                  aria-pressed={depositMode === m}
                >
                  {m === 'amount' ? 'R Amount' : '% Rate'}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            {depositMode === 'amount' && (
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">R</span>
            )}
            <input
              type="text"
              inputMode="numeric"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              placeholder={depositMode === 'amount' ? '150 000' : '10'}
              className={`w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900 ${depositMode === 'amount' ? 'pl-8 pr-4' : 'pl-4 pr-10'}`}
              aria-label="Deposit amount"
            />
            {depositMode === 'percent' && (
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 font-medium">%</span>
            )}
          </div>
          {price > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              Bond amount: <span className="font-medium text-gray-700">{formatCurrency(loanAmount)}</span>
            </p>
          )}
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (p.a.)</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="30"
              step="0.25"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
              aria-label="Annual interest rate"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 font-medium">% p.a.</span>
          </div>
        </div>

        {/* Term */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Loan Term: {termYears} years</label>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            step="1"
            value={termYears}
            onChange={(e) => setTermYears(parseInt(e.target.value))}
            className="w-full accent-blue-700"
            aria-label={`Loan term ${termYears} years`}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-0.5">
            <span>5 yrs</span><span>30 yrs</span>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
        >
          Calculate Bond
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-sm text-green-700 font-medium">Monthly Bond Repayment</p>
            <p className="text-3xl font-bold text-green-700 mt-1">{formatCurrency(result.monthlyPayment)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Bond Amount', value: formatCurrency(result.loanAmount) },
              { label: 'Total Repayment', value: formatCurrency(result.totalRepayment) },
              { label: 'Total Interest', value: formatCurrency(result.totalInterest) },
              { label: 'Interest : Principal', value: `${(result.interestRatio * 100).toFixed(0)}%` },
              { label: 'Transfer Duty', value: formatCurrency(result.transferDuty) },
              { label: 'Term', value: `${termYears} years` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-base font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Transfer duty note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
            <p className="font-semibold mb-1">Transfer Duty Rates (2024/2025)</p>
            <p>R0 – R1.1M: 0% &nbsp;|&nbsp; R1.1M–R1.5M: 3% &nbsp;|&nbsp; R1.5M–R2.1M: 6% &nbsp;|&nbsp; R2.1M–R2.7M: 8% &nbsp;|&nbsp; R2.7M–R12.1M: 11% &nbsp;|&nbsp; R12.1M+: 13%</p>
          </div>

          <div className="flex gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Owning vs renting: bond repayments build equity. Factor in rates, levies, insurance and maintenance (typically 1–2% of property value p.a.).
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
