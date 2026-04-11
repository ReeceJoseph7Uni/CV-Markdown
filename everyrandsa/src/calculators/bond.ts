import type { IBondInput, IBondResult } from '../types';

// ----------------------------------------------------------------
// 2026 South African Transfer Duty thresholds
// ----------------------------------------------------------------
interface TransferDutyBracket {
  from: number;
  to: number;
  baseDuty: number;
  rate: number;
}

const TRANSFER_DUTY_2026: TransferDutyBracket[] = [
  { from: 0,          to: 1_100_000,  baseDuty: 0,           rate: 0.00 },
  { from: 1_100_001,  to: 1_512_500,  baseDuty: 0,           rate: 0.03 },
  { from: 1_512_501,  to: 2_117_500,  baseDuty: 12_375,      rate: 0.06 },
  { from: 2_117_501,  to: 2_722_500,  baseDuty: 48_675,      rate: 0.08 },
  { from: 2_722_501,  to: 12_100_000, baseDuty: 97_075,      rate: 0.11 },
  { from: 12_100_001, to: Infinity,   baseDuty: 1_128_600,   rate: 0.13 },
];

function calcTransferDuty(price: number): number {
  if (price <= 0) return 0;

  for (const b of TRANSFER_DUTY_2026) {
    if (price >= b.from && price <= b.to) {
      return b.baseDuty + (price - b.from + (b.from === 0 ? 0 : 1)) * b.rate;
    }
  }
  return 0;
}

/**
 * Rough estimate of conveyancing (transfer attorney) fees.
 * Based on published tariff guidelines – approximated here.
 */
function estimateTransferAttorneyFees(price: number): number {
  if (price <= 100_000)    return 4_000;
  if (price <= 200_000)    return 5_500;
  if (price <= 500_000)    return 8_000;
  if (price <= 1_000_000)  return 13_000;
  if (price <= 2_000_000)  return 20_000;
  if (price <= 5_000_000)  return 30_000;
  if (price <= 10_000_000) return 50_000;
  return 80_000;
}

/**
 * Rough estimate of bond registration attorney fees.
 */
function estimateBondRegistrationFees(loanAmount: number): number {
  if (loanAmount <= 100_000)    return 4_500;
  if (loanAmount <= 200_000)    return 6_000;
  if (loanAmount <= 500_000)    return 9_000;
  if (loanAmount <= 1_000_000)  return 14_000;
  if (loanAmount <= 2_000_000)  return 21_000;
  if (loanAmount <= 5_000_000)  return 32_000;
  if (loanAmount <= 10_000_000) return 52_000;
  return 85_000;
}

export function calculateBond(input: IBondInput): IBondResult {
  const {
    propertyPrice,
    deposit,
    termYears,
    annualRate,
    monthlyLevy  = 0,
    monthlyRates = 0,
  } = input;

  if (propertyPrice <= 0) throw new Error('Property price must be greater than 0');
  if (deposit < 0)        throw new Error('Deposit cannot be negative');
  if (deposit >= propertyPrice) throw new Error('Deposit cannot exceed property price');
  if (termYears <= 0)     throw new Error('Term must be greater than 0 years');
  if (annualRate < 0)     throw new Error('Annual rate cannot be negative');

  const loanAmount   = propertyPrice - deposit;
  const termMonths   = termYears * 12;
  const monthlyRate  = annualRate / 12;

  // Monthly bond repayment
  let monthlyBondRepayment: number;
  if (monthlyRate === 0) {
    monthlyBondRepayment = loanAmount / termMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, termMonths);
    monthlyBondRepayment = (loanAmount * monthlyRate * factor) / (factor - 1);
  }

  const totalBondRepayment = monthlyBondRepayment * termMonths;
  const totalInterest      = totalBondRepayment - loanAmount;

  // Acquisition costs
  const transferDuty                  = calcTransferDuty(propertyPrice);
  const estimatedTransferAttorneyFees = estimateTransferAttorneyFees(propertyPrice);
  const estimatedBondRegistrationFees = estimateBondRegistrationFees(loanAmount);
  const totalAcquisitionCost          =
    propertyPrice +
    transferDuty +
    estimatedTransferAttorneyFees +
    estimatedBondRegistrationFees;

  const monthlyTotalCost =
    monthlyBondRepayment + monthlyLevy + monthlyRates;

  return {
    propertyPrice,
    deposit,
    loanAmount:                         round2(loanAmount),
    termYears,
    annualRate,
    monthlyBondRepayment:               round2(monthlyBondRepayment),
    totalBondRepayment:                 round2(totalBondRepayment),
    totalInterest:                      round2(totalInterest),
    transferDuty:                       round2(transferDuty),
    estimatedTransferAttorneyFees:      round2(estimatedTransferAttorneyFees),
    estimatedBondRegistrationFees:      round2(estimatedBondRegistrationFees),
    totalAcquisitionCost:               round2(totalAcquisitionCost),
    monthlyLevy,
    monthlyRates,
    monthlyTotalCost:                   round2(monthlyTotalCost),
  };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
