'use client';

import { useState, useCallback, useMemo } from 'react';
import { CalculatorType, type CalculatorOutput, type CalculatorResult } from '@/types/calculator';
import { validateCalculatorInputs } from '@/utils/validators';
import {
  calculatePAYE,
  calculateLoanRepayment,
  calculateBond,
  calculateSavingsGrowth,
  calculateTFSA,
  calculateInterest,
  calculateDebtSnowball,
  calculateNetToGross,
} from '@/utils/calculations';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

function buildShareUrl(type: CalculatorType, inputs: Record<string, unknown>): string {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams();
  params.set('calc', type);
  for (const [key, value] of Object.entries(inputs)) {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  }
  return `${window.location.origin}/calculators/${type.toLowerCase().replace(/_/g, '-')}?${params.toString()}`;
}

function runCalculation(type: CalculatorType, inputs: Record<string, unknown>): CalculatorOutput {
  switch (type) {
    case CalculatorType.PAYE: {
      const gross = Number(inputs.grossIncome);
      const age = inputs.age ? Number(inputs.age) : 30;
      const result = calculatePAYE(gross, age);

      const summary: CalculatorResult[] = [
        { label: 'Gross Income', value: result.grossIncome, formatted: formatCurrency(result.grossIncome) },
        { label: 'Income Tax', value: result.tax, formatted: formatCurrency(result.tax), highlight: true },
        { label: 'UIF', value: result.uif, formatted: formatCurrency(result.uif) },
        { label: 'Net Income', value: result.netIncome, formatted: formatCurrency(result.netIncome), highlight: true },
      ];

      const breakdown: CalculatorResult[][] = [[
        { label: 'Effective Tax Rate', value: result.effectiveTaxRate, formatted: formatPercentage(result.effectiveTaxRate), description: 'Percentage of gross income paid in tax' },
        { label: 'Marginal Tax Rate', value: result.marginalRate * 100, formatted: formatPercentage(result.marginalRate * 100), description: 'Rate applied to your last rand of income' },
        { label: 'Rebates Applied', value: result.rebates, formatted: formatCurrency(result.rebates) },
        { label: 'Monthly Net', value: result.netIncome / 12, formatted: formatCurrency(result.netIncome / 12), highlight: true },
      ]];

      return { summary, breakdown };
    }

    case CalculatorType.LOAN_REPAYMENT: {
      const result = calculateLoanRepayment(
        Number(inputs.principal),
        Number(inputs.annualRate),
        Number(inputs.termMonths),
      );

      const summary: CalculatorResult[] = [
        { label: 'Monthly Payment', value: result.monthlyPayment, formatted: formatCurrency(result.monthlyPayment), highlight: true },
        { label: 'Total Payment', value: result.totalPayment, formatted: formatCurrency(result.totalPayment) },
        { label: 'Total Interest', value: result.totalInterest, formatted: formatCurrency(result.totalInterest) },
      ];

      const breakdown: CalculatorResult[][] = [
        result.amortization.slice(0, 12).map((row) => ({
          label: `Month ${row.month}`,
          value: row.balance,
          formatted: formatCurrency(row.balance),
          description: `Principal: ${formatCurrency(row.principal)} | Interest: ${formatCurrency(row.interest)}`,
        })),
      ];

      const chart = {
        labels: result.amortization.map((r) => `M${r.month}`),
        datasets: [
          { label: 'Balance', data: result.amortization.map((r) => r.balance), color: '#3B82F6' },
          { label: 'Principal Paid', data: result.amortization.map((r) => r.principal), color: '#10B981' },
          { label: 'Interest Paid', data: result.amortization.map((r) => r.interest), color: '#EF4444' },
        ],
      };

      return { summary, breakdown, chart };
    }

    case CalculatorType.BOND: {
      const result = calculateBond(
        Number(inputs.purchasePrice),
        Number(inputs.deposit),
        Number(inputs.annualRate),
        Number(inputs.termYears),
      );

      const summary: CalculatorResult[] = [
        { label: 'Loan Amount', value: result.loanAmount, formatted: formatCurrency(result.loanAmount) },
        { label: 'Monthly Repayment', value: result.monthlyPayment, formatted: formatCurrency(result.monthlyPayment), highlight: true },
        { label: 'Total Repayment', value: result.totalPayment, formatted: formatCurrency(result.totalPayment) },
        { label: 'Total Interest', value: result.totalInterest, formatted: formatCurrency(result.totalInterest) },
      ];

      const breakdown: CalculatorResult[][] = [
        result.amortization.slice(0, 12).map((row) => ({
          label: `Month ${row.month}`,
          value: row.balance,
          formatted: formatCurrency(row.balance),
          description: `Principal: ${formatCurrency(row.principal)} | Interest: ${formatCurrency(row.interest)}`,
        })),
      ];

      return { summary, breakdown };
    }

    case CalculatorType.SAVINGS_GROWTH: {
      const result = calculateSavingsGrowth(
        Number(inputs.principal),
        Number(inputs.monthlyDeposit),
        Number(inputs.annualRate),
        Number(inputs.years),
      );

      const summary: CalculatorResult[] = [
        { label: 'Final Balance', value: result.finalBalance, formatted: formatCurrency(result.finalBalance), highlight: true },
        { label: 'Total Contributions', value: result.totalContributions, formatted: formatCurrency(result.totalContributions) },
        { label: 'Total Interest Earned', value: result.totalInterest, formatted: formatCurrency(result.totalInterest), highlight: true },
      ];

      const breakdown: CalculatorResult[][] = [
        result.yearlyBreakdown.map((row) => ({
          label: `Year ${row.year}`,
          value: row.balance,
          formatted: formatCurrency(row.balance),
          description: `Interest: ${formatCurrency(row.interest)}`,
        })),
      ];

      const chart = {
        labels: result.yearlyBreakdown.map((r) => `Year ${r.year}`),
        datasets: [
          { label: 'Balance', data: result.yearlyBreakdown.map((r) => r.balance), color: '#3B82F6' },
          { label: 'Contributions', data: result.yearlyBreakdown.map((r) => r.contributions), color: '#10B981' },
        ],
      };

      return { summary, breakdown, chart };
    }

    case CalculatorType.TFSA: {
      const result = calculateTFSA(
        Number(inputs.currentContributions),
        Number(inputs.lifetimeContributions),
      );

      const summary: CalculatorResult[] = [
        { label: 'Remaining Annual Room', value: result.remainingAnnual, formatted: formatCurrency(result.remainingAnnual), highlight: true },
        { label: 'Remaining Lifetime Room', value: result.remainingLifetime, formatted: formatCurrency(result.remainingLifetime) },
        { label: 'Projected 5-Year Growth', value: result.projectedGrowth, formatted: formatCurrency(result.projectedGrowth) },
        { label: 'Over-Contributed', value: result.isOverContributed ? 1 : 0, formatted: result.isOverContributed ? 'Yes ⚠️' : 'No', highlight: result.isOverContributed },
      ];

      return { summary, breakdown: [] };
    }

    case CalculatorType.INTEREST: {
      const result = calculateInterest(
        Number(inputs.principal),
        Number(inputs.rate),
        Number(inputs.periods),
        (inputs.type as 'simple' | 'compound') ?? 'compound',
        inputs.compoundFrequency ? Number(inputs.compoundFrequency) : 12,
      );

      const summary: CalculatorResult[] = [
        { label: 'Interest Earned', value: result.interest, formatted: formatCurrency(result.interest), highlight: true },
        { label: 'Total Amount', value: result.total, formatted: formatCurrency(result.total) },
      ];

      return { summary, breakdown: [] };
    }

    case CalculatorType.DEBT_SNOWBALL: {
      const debts = Array.isArray(inputs.debts) ? inputs.debts : [];
      const result = calculateDebtSnowball(debts, Number(inputs.extraPayment ?? 0));

      const summary: CalculatorResult[] = [
        { label: 'Payoff Order', value: 0, formatted: result.order.join(' → ') },
        { label: 'Debt-Free Date', value: 0, formatted: result.payoffDate },
        { label: 'Interest Saved', value: result.totalInterestSaved, formatted: formatCurrency(result.totalInterestSaved), highlight: true },
      ];

      return { summary, breakdown: [] };
    }

    case CalculatorType.NET_TO_GROSS: {
      const result = calculateNetToGross(Number(inputs.netSalary));

      const summary: CalculatorResult[] = [
        { label: 'Gross Salary', value: result.grossSalary, formatted: formatCurrency(result.grossSalary), highlight: true },
        { label: 'Income Tax', value: result.tax, formatted: formatCurrency(result.tax) },
        { label: 'UIF', value: result.uif, formatted: formatCurrency(result.uif) },
        { label: 'Monthly Gross', value: result.grossSalary / 12, formatted: formatCurrency(result.grossSalary / 12) },
      ];

      return { summary, breakdown: [] };
    }

    default:
      return { summary: [], breakdown: [] };
  }
}

export function useCalculator(type: CalculatorType) {
  const [inputs, setInputs] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CalculatorOutput | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const setInput = useCallback((key: string, value: unknown) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field on change
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const calculate = useCallback(() => {
    const validationErrors = validateCalculatorInputs(inputs, type);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsCalculating(true);
    setErrors({});

    try {
      const output = runCalculation(type, inputs);
      setResult(output);
    } catch (err) {
      setErrors({ _global: err instanceof Error ? err.message : 'Calculation failed. Please check your inputs.' });
    } finally {
      setIsCalculating(false);
    }
  }, [type, inputs]);

  const reset = useCallback(() => {
    setInputs({});
    setErrors({});
    setResult(null);
    setIsCalculating(false);
  }, []);

  const shareUrl = useMemo(() => buildShareUrl(type, inputs), [type, inputs]);

  return {
    inputs,
    setInput,
    errors,
    result,
    isCalculating,
    calculate,
    reset,
    shareUrl,
  };
}
