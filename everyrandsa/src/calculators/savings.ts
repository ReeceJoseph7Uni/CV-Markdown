import type { ISavingsInput, ISavingsResult, ISavingsScheduleEntry } from '../types';

/**
 * Future value with regular monthly contributions:
 *   FV = P(1 + r/n)^(nt)  +  PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
 *
 * where:
 *   P   = principal
 *   PMT = monthly deposit
 *   r   = annual rate (decimal)
 *   n   = compounding frequency per year
 *   t   = term in years
 */
export function calculateSavings(input: ISavingsInput): ISavingsResult {
  const {
    principal,
    monthlyDeposit    = 0,
    annualRate,
    termYears,
    compoundFrequency = 12,
  } = input;

  if (principal    < 0)  throw new Error('Principal cannot be negative');
  if (monthlyDeposit < 0) throw new Error('Monthly deposit cannot be negative');
  if (annualRate   < 0)  throw new Error('Annual rate cannot be negative');
  if (termYears    <= 0) throw new Error('Term must be greater than 0 years');

  const n          = compoundFrequency;
  const totalMonths = termYears * 12;
  const rPerPeriod = annualRate / n;

  // Build month-by-month schedule for clarity
  const schedule: ISavingsScheduleEntry[] = [];
  let balance = principal;

  for (let month = 1; month <= totalMonths; month++) {
    const openingBalance = balance;
    // Deposit at start of month
    balance += monthlyDeposit;

    // Interest for the month: pro-rate compounding periods
    // Each calendar month = n/12 compounding periods
    const periodsThisMonth = n / 12;
    const interestEarned   = balance * (Math.pow(1 + rPerPeriod, periodsThisMonth) - 1);
    balance += interestEarned;

    schedule.push({
      month,
      openingBalance: round2(openingBalance),
      deposit:        round2(monthlyDeposit),
      interestEarned: round2(interestEarned),
      closingBalance: round2(balance),
    });
  }

  const futureValue        = balance;
  const totalDeposited     = principal + monthlyDeposit * totalMonths;
  const totalInterestEarned = futureValue - totalDeposited;

  // Effective Annual Rate = (1 + r/n)^n - 1
  const effectiveAnnualRate = Math.pow(1 + rPerPeriod, n) - 1;

  return {
    principal,
    monthlyDeposit,
    annualRate,
    termYears,
    compoundFrequency: n,
    futureValue:           round2(futureValue),
    totalDeposited:        round2(totalDeposited),
    totalInterestEarned:   round2(totalInterestEarned),
    effectiveAnnualRate:   round4(effectiveAnnualRate),
    schedule,
  };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function round4(n: number): number { return Math.round(n * 10000) / 10000; }
