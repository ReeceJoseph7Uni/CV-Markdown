'use client';

import { useState, useCallback, useMemo } from 'react';
import { Calculator, Info, Plus, Trash2, AlertTriangle } from 'lucide-react';

type Strategy = 'snowball' | 'avalanche';

interface DebtEntry {
  id: string;
  name: string;
  balance: string;
  minPayment: string;
  rate: string;
}

interface DebtPayoffInfo {
  name: string;
  monthsToPayoff: number;
  interestPaid: number;
  order: number;
}

interface DebtResult {
  totalMonths: number;
  totalInterestPaid: number;
  interestSavedVsMinimum: number;
  payoffOrder: DebtPayoffInfo[];
  firstDebtProgress: Array<{ month: number; balance: number; payment: number }>;
}

function formatCurrency(value: number): string {
  return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function calculateDebtPayoff(entries: DebtEntry[], extra: number, strategy: Strategy): DebtResult {
  const debts = entries
    .map((e) => ({
      id: e.id,
      name: e.name || 'Debt',
      balance: parseFloat(e.balance.replace(/[^0-9.]/g, '')) || 0,
      minPayment: parseFloat(e.minPayment.replace(/[^0-9.]/g, '')) || 0,
      rate: parseFloat(e.rate) || 0,
    }))
    .filter((d) => d.balance > 0);

  if (debts.length === 0) return { totalMonths: 0, totalInterestPaid: 0, interestSavedVsMinimum: 0, payoffOrder: [], firstDebtProgress: [] };

  // Sort by strategy
  const sorted = [...debts].sort((a, b) =>
    strategy === 'snowball' ? a.balance - b.balance : b.rate - a.rate,
  );

  // Calculate minimum-only interest (for comparison)
  let minOnlyInterest = 0;
  for (const d of debts) {
    const r = d.rate / 100 / 12;
    if (r > 0 && d.minPayment > d.balance * r) {
      const n = Math.ceil(-Math.log(1 - (d.balance * r) / d.minPayment) / Math.log(1 + r));
      minOnlyInterest += d.minPayment * n - d.balance;
    } else {
      minOnlyInterest += d.balance * 0.5; // rough estimate if min < interest
    }
  }

  // Snowball/Avalanche simulation
  const state = sorted.map((d) => ({ ...d, currentBalance: d.balance }));
  const payoffInfo: DebtPayoffInfo[] = [];
  const firstDebtProgress: Array<{ month: number; balance: number; payment: number }> = [];
  let month = 0;
  let totalInterest = 0;
  let extraPool = extra;

  while (state.some((d) => d.currentBalance > 0) && month < 1200) {
    month++;
    let availableExtra = extraPool;

    for (let i = 0; i < state.length; i++) {
      const d = state[i];
      if (d.currentBalance <= 0) continue;

      const monthlyRate = d.rate / 100 / 12;
      const interestThisMonth = d.currentBalance * monthlyRate;
      totalInterest += interestThisMonth;

      // Focus extra on first active debt (snowball/avalanche target)
      const isTarget = i === state.findIndex((x) => x.currentBalance > 0);
      const payment = Math.min(d.currentBalance + interestThisMonth, d.minPayment + (isTarget ? availableExtra : 0));
      const principalPaid = payment - interestThisMonth;

      if (isTarget && i === 0) {
        firstDebtProgress.push({ month, balance: Math.max(0, d.currentBalance - principalPaid), payment });
      }

      d.currentBalance = Math.max(0, d.currentBalance - principalPaid);

      if (d.currentBalance <= 0.01) {
        d.currentBalance = 0;
        if (!payoffInfo.find((p) => p.name === d.name)) {
          payoffInfo.push({
            name: d.name,
            monthsToPayoff: month,
            interestPaid: 0, // simplified
            order: payoffInfo.length + 1,
          });
          // Freed minimum payment goes to extra pool
          availableExtra += d.minPayment;
          extraPool += d.minPayment;
        }
      }
    }
  }

  return {
    totalMonths: month,
    totalInterestPaid: totalInterest,
    interestSavedVsMinimum: Math.max(0, minOnlyInterest - totalInterest),
    payoffOrder: payoffInfo,
    firstDebtProgress: firstDebtProgress.slice(0, 24),
  };
}

export default function DebtCalculator() {
  const [debts, setDebts] = useState<DebtEntry[]>([
    { id: uid(), name: 'Credit Card', balance: '', minPayment: '', rate: '' },
  ]);
  const [extraPayment, setExtraPayment] = useState('');
  const [strategy, setStrategy] = useState<Strategy>('snowball');
  const [result, setResult] = useState<DebtResult | null>(null);
  const [error, setError] = useState('');

  const addDebt = useCallback(() => {
    setDebts((prev) => [...prev, { id: uid(), name: '', balance: '', minPayment: '', rate: '' }]);
  }, []);

  const removeDebt = useCallback((id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const updateDebt = useCallback((id: string, field: keyof Omit<DebtEntry, 'id'>, value: string) => {
    setDebts((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  }, []);

  const totalDebt = useMemo(() =>
    debts.reduce((sum, d) => sum + (parseFloat(d.balance.replace(/[^0-9.]/g, '')) || 0), 0),
    [debts],
  );

  const handleCalculate = useCallback(() => {
    const valid = debts.every(
      (d) =>
        (parseFloat(d.balance.replace(/[^0-9.]/g, '')) || 0) > 0 &&
        (parseFloat(d.minPayment.replace(/[^0-9.]/g, '')) || 0) > 0 &&
        (parseFloat(d.rate) || 0) > 0,
    );
    if (!valid) { setError('Fill in balance, minimum payment, and rate for each debt.'); return; }
    setError('');
    const extra = parseFloat(extraPayment.replace(/[^0-9.]/g, '')) || 0;
    setResult(calculateDebtPayoff(debts, extra, strategy));
  }, [debts, extraPayment, strategy]);

  const payoffDate = useMemo(() => {
    if (!result) return '';
    const d = new Date();
    d.setMonth(d.getMonth() + result.totalMonths);
    return d.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });
  }, [result]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-700 rounded-lg">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Debt Payoff Calculator</h2>
          <p className="text-sm text-gray-500">Snowball vs Avalanche strategy</p>
        </div>
      </div>

      {/* Debt entries */}
      <div className="space-y-3 mb-4">
        {debts.map((debt, idx) => (
          <div key={debt.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Debt #{idx + 1}</span>
              {debts.length > 1 && (
                <button
                  onClick={() => removeDebt(debt.id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                  aria-label={`Remove debt ${idx + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              type="text"
              value={debt.name}
              onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
              placeholder="Debt name (e.g. Credit Card)"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none"
              aria-label="Debt name"
            />
            <div className="grid grid-cols-3 gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400 text-sm">R</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={debt.balance}
                  onChange={(e) => updateDebt(debt.id, 'balance', e.target.value)}
                  placeholder="Balance"
                  className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none"
                  aria-label="Debt balance"
                />
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400 text-sm">R</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={debt.minPayment}
                  onChange={(e) => updateDebt(debt.id, 'minPayment', e.target.value)}
                  placeholder="Min pay"
                  className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none"
                  aria-label="Minimum monthly payment"
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={debt.rate}
                  onChange={(e) => updateDebt(debt.id, 'rate', e.target.value)}
                  placeholder="Rate %"
                  className="w-full pl-3 pr-7 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none"
                  aria-label="Annual interest rate"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 text-sm">%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addDebt}
        className="flex items-center gap-2 text-blue-700 hover:text-blue-800 text-sm font-medium mb-4 focus:outline-none focus:ring-2 focus:ring-blue-700 rounded"
      >
        <Plus className="w-4 h-4" /> Add Another Debt
      </button>

      {totalDebt > 0 && (
        <p className="text-sm text-gray-500 mb-4">
          Total debt: <span className="font-semibold text-gray-900">{formatCurrency(totalDebt)}</span>
        </p>
      )}

      <div className="space-y-4 mb-6">
        {/* Extra payment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Extra Monthly Payment</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">R</span>
            <input
              type="text"
              inputMode="numeric"
              value={extraPayment}
              onChange={(e) => setExtraPayment(e.target.value)}
              placeholder="500"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-gray-900"
              aria-label="Extra monthly payment"
            />
          </div>
        </div>

        {/* Strategy */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payoff Strategy</label>
          <div className="grid grid-cols-2 gap-2">
            {([
              { value: 'snowball', label: '❄️ Snowball', desc: 'Lowest balance first' },
              { value: 'avalanche', label: '🏔️ Avalanche', desc: 'Highest rate first' },
            ] as { value: Strategy; label: string; desc: string }[]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStrategy(opt.value)}
                className={`py-3 px-4 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 text-left ${
                  strategy === opt.value
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-700'
                }`}
                aria-pressed={strategy === opt.value}
              >
                <div className="font-semibold">{opt.label}</div>
                <div className={`text-xs mt-0.5 ${strategy === opt.value ? 'text-blue-100' : 'text-gray-500'}`}>
                  {opt.desc}
                </div>
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
          Calculate Payoff Plan
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-xs text-green-700 font-medium">Debt Free Date</p>
              <p className="text-lg font-bold text-green-700 mt-1">{payoffDate}</p>
              <p className="text-xs text-green-600">{result.totalMonths} months</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs text-blue-700 font-medium">Interest Saved</p>
              <p className="text-lg font-bold text-blue-700 mt-1">{formatCurrency(result.interestSavedVsMinimum)}</p>
              <p className="text-xs text-blue-600">vs minimum payments</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-0.5">Total Interest Paid</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(result.totalInterestPaid)}</p>
          </div>

          {/* Payoff order */}
          {result.payoffOrder.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Debt Payoff Order</h3>
              <div className="space-y-2">
                {result.payoffOrder.map((info) => (
                  <div key={info.name} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                    <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {info.order}
                    </span>
                    <span className="flex-1 text-sm font-medium text-gray-800">{info.name}</span>
                    <span className="text-xs text-gray-500">Month {info.monthsToPayoff}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
            🎉 <strong>Stay the course!</strong> Every extra rand accelerates your path to debt freedom. The snowball builds momentum; the avalanche saves maximum interest.
          </div>

          <div className="flex gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Results are estimates. Avalanche typically saves more interest; Snowball provides quicker psychological wins by eliminating smaller debts first.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
