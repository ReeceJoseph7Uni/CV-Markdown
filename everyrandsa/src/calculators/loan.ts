import type { ILoanInput, ILoanResult } from '../types';

/**
 * Monthly amortization repayment formula:
 *   M = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
export function calculateLoan(input: ILoanInput): ILoanResult {
  const {
    principal,
    termMonths,
    annualRate,
    initiationFee = 0,
    monthlyFee    = 0,
  } = input;

  if (principal <= 0)    throw new Error('Principal must be greater than 0');
  if (termMonths <= 0)   throw new Error('Term must be greater than 0 months');
  if (annualRate  < 0)   throw new Error('Annual rate cannot be negative');

  const monthlyRate = annualRate / 12;

  let monthlyRepayment: number;

  if (monthlyRate === 0) {
    // Interest-free loan
    monthlyRepayment = principal / termMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, termMonths);
    monthlyRepayment = (principal * monthlyRate * factor) / (factor - 1);
  }

  const totalRepayment  = monthlyRepayment * termMonths + initiationFee;
  const totalFees       = initiationFee + monthlyFee * termMonths;
  const totalInterest   = totalRepayment - principal - totalFees;

  // Effective APR: solve for rate where NPV of all cash flows = 0
  // We include initiation fee in the effective cost calculation.
  const netPrincipal = principal - initiationFee;
  const effectiveAPR = approximateAPR(netPrincipal, monthlyRepayment + monthlyFee, termMonths);

  return {
    principal,
    termMonths,
    annualRate,
    monthlyRepayment: round2(monthlyRepayment),
    totalRepayment:   round2(totalRepayment),
    totalInterest:    round2(Math.max(0, totalInterest)),
    totalFees:        round2(totalFees),
    effectiveAPR:     round4(effectiveAPR),
    initiationFee,
    monthlyFee,
  };
}

/**
 * Newton-Raphson approximation of the effective monthly rate,
 * then converted to an annual rate.
 *
 * Solves: netProceeds = PMT * (1 - (1+r)^(-n)) / r
 */
function approximateAPR(
  netProceeds: number,
  totalMonthlyPayment: number,
  n: number,
): number {
  if (netProceeds <= 0 || totalMonthlyPayment <= 0) return 0;

  let r = 0.01; // initial guess: 1% per month

  for (let i = 0; i < 500; i++) {
    const invFactor = Math.pow(1 + r, -n);          // (1+r)^-n
    const annuity   = (1 - invFactor) / r;           // PV annuity factor
    const f         = totalMonthlyPayment * annuity - netProceeds;

    // Derivative of the annuity factor w.r.t. r:
    // d/dr[(1-(1+r)^-n)/r] = [r*n*(1+r)^(-n-1) - (1-(1+r)^-n)] / r^2
    const dAnnuity = (r * n * invFactor / (1 + r) - (1 - invFactor)) / (r * r);
    const df       = totalMonthlyPayment * dAnnuity;

    if (Math.abs(df) < 1e-15) break;
    const delta = f / df;
    const newR  = r - delta;

    // Guard: keep rate positive
    r = newR > 0 ? newR : r / 2;

    if (Math.abs(delta) < 1e-10) break;
  }

  return r * 12; // convert to annual
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function round4(n: number): number { return Math.round(n * 10000) / 10000; }
