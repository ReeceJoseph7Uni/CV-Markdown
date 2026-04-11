import type { IInterestInput, IInterestResult } from '../types';

/**
 * Simple interest:   A = P(1 + rt)
 * Compound interest: A = P(1 + r/n)^(nt)
 */
export function calculateInterest(input: IInterestInput): IInterestResult {
  const {
    principal,
    annualRate,
    termYears,
    interestType      = 'COMPOUND',
    compoundFrequency = 12,
  } = input;

  if (principal  < 0)  throw new Error('Principal cannot be negative');
  if (annualRate < 0)  throw new Error('Annual rate cannot be negative');
  if (termYears  <= 0) throw new Error('Term must be greater than 0 years');

  let finalAmount: number;
  let effectiveAnnualRate: number;

  if (interestType === 'SIMPLE') {
    finalAmount         = principal * (1 + annualRate * termYears);
    effectiveAnnualRate = annualRate; // simple interest has no compounding
  } else {
    const n              = compoundFrequency;
    const rPerPeriod     = annualRate / n;
    finalAmount          = principal * Math.pow(1 + rPerPeriod, n * termYears);
    effectiveAnnualRate  = Math.pow(1 + rPerPeriod, n) - 1;
  }

  const interestEarned = finalAmount - principal;

  return {
    principal,
    annualRate,
    termYears,
    interestType,
    finalAmount:        round2(finalAmount),
    interestEarned:     round2(interestEarned),
    effectiveAnnualRate: round4(effectiveAnnualRate),
  };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function round4(n: number): number { return Math.round(n * 10000) / 10000; }
