import type { ITFSAInput, ITFSAResult } from '../types';

/** TFSA limits from 1 March 2026 */
const TFSA_ANNUAL_LIMIT  = 46_000;
const TFSA_LIFETIME_CAP  = 500_000;

export function calculateTFSA(input: ITFSAInput): ITFSAResult {
  const {
    annualContribution,
    previousContributions  = 0,
    taxYear                = '2026',
    currentBalance         = 0,
    annualRate             = 0,
    projectionYears        = 10,
  } = input;

  if (annualContribution < 0)  throw new Error('Annual contribution cannot be negative');
  if (previousContributions < 0) throw new Error('Previous contributions cannot be negative');

  const totalContributions       = previousContributions + annualContribution;
  const remainingAnnualAllowance = Math.max(0, TFSA_ANNUAL_LIMIT - annualContribution);
  const remainingLifetime        = Math.max(0, TFSA_LIFETIME_CAP - totalContributions);
  const isOverContributed        = totalContributions > TFSA_LIFETIME_CAP ||
                                   annualContribution > TFSA_ANNUAL_LIMIT;
  const overContributionAmount   = Math.max(
    0,
    Math.max(annualContribution - TFSA_ANNUAL_LIMIT, totalContributions - TFSA_LIFETIME_CAP),
  );

  // Project growth using compound interest (monthly compounding)
  let balance = currentBalance;
  const monthlyRate   = annualRate / 12;
  const monthlyContrib = annualContribution / 12;

  for (let year = 0; year < projectionYears; year++) {
    for (let month = 0; month < 12; month++) {
      balance += monthlyContrib;
      balance *= 1 + monthlyRate;
    }
  }

  return {
    annualContribution,
    previousContributions,
    totalContributions:       round2(totalContributions),
    annualLimit:              TFSA_ANNUAL_LIMIT,
    lifetimeCap:              TFSA_LIFETIME_CAP,
    remainingAnnualAllowance: round2(remainingAnnualAllowance),
    remainingLifetimeAllowance: round2(remainingLifetime),
    isOverContributed,
    overContributionAmount:   round2(overContributionAmount),
    projectedValue:           round2(balance),
    taxYear,
  };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
