import type {
  PAYEResult,
  LoanResult,
  LoanAmortizationRow,
  BondResult,
  SavingsResult,
  SavingsYearlyBreakdown,
  TFSAResult,
  InterestResult,
  DebtItem,
  DebtSnowballResult,
  DebtSnowballTimelineEntry,
  NetToGrossResult,
} from '@/types/calculator';

// ---------------------------------------------------------------------------
// 2025/2026 Tax Year Constants
// ---------------------------------------------------------------------------
interface TaxBracket {
  min: number;
  max: number | null;
  baseTax: number;
  rate: number;
}

const TAX_BRACKETS_2026: TaxBracket[] = [
  { min: 0,        max: 237_100,   baseTax: 0,          rate: 0.18 },
  { min: 237_101,  max: 370_500,   baseTax: 42_678,     rate: 0.26 },
  { min: 370_501,  max: 512_800,   baseTax: 77_362,     rate: 0.31 },
  { min: 512_801,  max: 673_000,   baseTax: 121_475,    rate: 0.36 },
  { min: 673_001,  max: 857_900,   baseTax: 179_147,    rate: 0.39 },
  { min: 857_901,  max: 1_817_000, baseTax: 251_258,    rate: 0.41 },
  { min: 1_817_001, max: null,     baseTax: 644_489,    rate: 0.45 },
];

const PRIMARY_REBATE = 17_235;
const SECONDARY_REBATE = 9_444;   // 65+
const TERTIARY_REBATE = 3_145;    // 75+

const UIF_RATE = 0.01;
const UIF_MONTHLY_CAP = 177.12;

const TFSA_ANNUAL_LIMIT = 46_000;
const TFSA_LIFETIME_LIMIT = 500_000;

// ---------------------------------------------------------------------------
// PAYE
// ---------------------------------------------------------------------------

/**
 * Calculates PAYE (Pay As You Earn) tax for South Africa using 2026 brackets.
 * grossIncome is the annual gross salary.
 */
export function calculatePAYE(grossIncome: number, age = 30): PAYEResult {
  // Determine applicable tax bracket
  const bracket = TAX_BRACKETS_2026.find(
    (b) => grossIncome >= b.min && (b.max === null || grossIncome <= b.max),
  ) ?? TAX_BRACKETS_2026[TAX_BRACKETS_2026.length - 1];

  const rawTax = bracket.baseTax + (grossIncome - bracket.min) * bracket.rate;

  // Rebates
  let rebates = PRIMARY_REBATE;
  if (age >= 65) rebates += SECONDARY_REBATE;
  if (age >= 75) rebates += TERTIARY_REBATE;

  const tax = Math.max(0, rawTax - rebates);
  const marginalRate = bracket.rate;
  const effectiveTaxRate = grossIncome > 0 ? (tax / grossIncome) * 100 : 0;

  // UIF: employee pays 1% capped at R177.12/month (R2,125.44/year)
  const monthlyIncome = grossIncome / 12;
  const uifMonthly = Math.min(monthlyIncome * UIF_RATE, UIF_MONTHLY_CAP);
  const uif = uifMonthly * 12;

  const netIncome = grossIncome - tax - uif;

  return {
    grossIncome,
    tax: Math.round(tax * 100) / 100,
    uif: Math.round(uif * 100) / 100,
    netIncome: Math.round(netIncome * 100) / 100,
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
    marginalRate,
    rebates,
  };
}

// ---------------------------------------------------------------------------
// Loan Repayment
// ---------------------------------------------------------------------------

/**
 * Calculates monthly repayment, total payment, total interest and full amortisation schedule.
 */
export function calculateLoanRepayment(
  principal: number,
  annualRate: number,
  termMonths: number,
): LoanResult {
  const monthlyRate = annualRate / 100 / 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / termMonths;
  } else {
    monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
  }

  const amortization: LoanAmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= termMonths; month++) {
    const interestCharge = balance * monthlyRate;
    const principalCharge = Math.min(monthlyPayment - interestCharge, balance);
    balance = Math.max(0, balance - principalCharge);

    amortization.push({
      month,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalCharge * 100) / 100,
      interest: Math.round(interestCharge * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }

  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    amortization,
  };
}

// ---------------------------------------------------------------------------
// Bond Calculator
// ---------------------------------------------------------------------------

/**
 * Calculates a home loan (bond) repayment after deducting a deposit.
 */
export function calculateBond(
  purchasePrice: number,
  deposit: number,
  annualRate: number,
  termYears: number,
): BondResult {
  const loanAmount = purchasePrice - deposit;
  const termMonths = termYears * 12;
  const loanResult = calculateLoanRepayment(loanAmount, annualRate, termMonths);

  return {
    ...loanResult,
    loanAmount: Math.round(loanAmount * 100) / 100,
    depositAmount: Math.round(deposit * 100) / 100,
  };
}

// ---------------------------------------------------------------------------
// Savings Growth
// ---------------------------------------------------------------------------

/**
 * Projects savings growth with optional recurring deposits.
 */
export function calculateSavingsGrowth(
  principal: number,
  monthlyDeposit: number,
  annualRate: number,
  years: number,
): SavingsResult {
  const monthlyRate = annualRate / 100 / 12;
  const yearlyBreakdown: SavingsYearlyBreakdown[] = [];

  let balance = principal;
  let totalContributions = principal;

  for (let year = 1; year <= years; year++) {
    const startBalance = balance;
    let yearlyContributions = 0;

    for (let month = 1; month <= 12; month++) {
      const interest = balance * monthlyRate;
      balance += interest + monthlyDeposit;
      yearlyContributions += monthlyDeposit;
    }

    totalContributions += yearlyContributions;

    yearlyBreakdown.push({
      year,
      balance: Math.round(balance * 100) / 100,
      contributions: Math.round((totalContributions) * 100) / 100,
      interest: Math.round((balance - startBalance - yearlyContributions) * 100) / 100,
    });
  }

  const totalInterest = balance - totalContributions;

  return {
    finalBalance: Math.round(balance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    yearlyBreakdown,
  };
}

// ---------------------------------------------------------------------------
// TFSA
// ---------------------------------------------------------------------------

/**
 * Calculates remaining TFSA contribution room.
 */
export function calculateTFSA(
  currentYearContributions: number,
  lifetimeContributions: number,
  annualLimit = TFSA_ANNUAL_LIMIT,
  lifetimeLimit = TFSA_LIFETIME_LIMIT,
): TFSAResult {
  const remainingAnnual = Math.max(0, annualLimit - currentYearContributions);
  const remainingLifetime = Math.max(0, lifetimeLimit - lifetimeContributions);
  const isOverContributed =
    currentYearContributions > annualLimit || lifetimeContributions > lifetimeLimit;

  // Simple 5-year projected growth at a typical 8% p.a. using remaining annual room
  const projectedGrowth = remainingAnnual > 0
    ? remainingAnnual * (Math.pow(1.08, 5) - 1)
    : 0;

  return {
    remainingAnnual: Math.round(remainingAnnual * 100) / 100,
    remainingLifetime: Math.round(remainingLifetime * 100) / 100,
    projectedGrowth: Math.round(projectedGrowth * 100) / 100,
    isOverContributed,
  };
}

// ---------------------------------------------------------------------------
// Interest
// ---------------------------------------------------------------------------

/**
 * Calculates simple or compound interest.
 */
export function calculateInterest(
  principal: number,
  rate: number,
  periods: number,
  type: 'simple' | 'compound',
  compoundFrequency = 1,
): InterestResult {
  let total: number;

  if (type === 'simple') {
    total = principal * (1 + (rate / 100) * periods);
  } else {
    total = principal * Math.pow(1 + rate / 100 / compoundFrequency, compoundFrequency * periods);
  }

  const interest = total - principal;

  return {
    interest: Math.round(interest * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

// ---------------------------------------------------------------------------
// Debt Snowball
// ---------------------------------------------------------------------------

/**
 * Calculates the debt snowball payoff order and timeline.
 * Debts are sorted smallest-balance-first; freed-up payments roll into the next debt.
 */
export function calculateDebtSnowball(
  debts: DebtItem[],
  extraPayment: number,
): DebtSnowballResult {
  // Sort by balance ascending (snowball method)
  const sorted = [...debts].sort((a, b) => a.balance - b.balance);
  const order = sorted.map((d) => d.name);

  // Work on mutable copies
  const working = sorted.map((d) => ({ ...d, remainingBalance: d.balance }));
  const timeline: DebtSnowballTimelineEntry[] = [];

  let month = 0;
  const availableExtra = extraPayment;
  const maxMonths = 600; // 50 years safety cap

  while (working.some((d) => d.remainingBalance > 0) && month < maxMonths) {
    month++;
    let rollingExtra = availableExtra;

    for (const debt of working) {
      if (debt.remainingBalance <= 0) {
        rollingExtra += debt.minPayment; // snowball: roll freed payment forward
        continue;
      }

      const monthlyRate = debt.rate / 100 / 12;
      const interestCharge = debt.remainingBalance * monthlyRate;
      const payment = Math.min(debt.minPayment + rollingExtra, debt.remainingBalance + interestCharge);
      debt.remainingBalance = Math.max(0, debt.remainingBalance + interestCharge - payment);
      rollingExtra = 0; // extra applied only to first active debt

      const isPaidOff = debt.remainingBalance === 0;
      timeline.push({
        month,
        debtName: debt.name,
        balance: Math.round(debt.remainingBalance * 100) / 100,
        payment: Math.round(payment * 100) / 100,
        isPaidOff,
      });
    }
  }

  // Calculate interest saved vs minimum-only scenario
  // Total interest in snowball = total paid - total principal
  const totalPrincipal = sorted.reduce((sum, d) => sum + d.balance, 0);
  const snowballTotalPaid = timeline.reduce((sum, t) => sum + t.payment, 0);
  const snowballTotalInterest = Math.max(0, snowballTotalPaid - totalPrincipal);

  const minOnlyTotalInterest = sorted.reduce((sum, d) => {
    const r = d.rate / 100 / 12;
    if (r === 0) return sum;
    // Guard: minimum payment must exceed monthly interest to eventually pay off
    const monthlyInterest = d.balance * r;
    if (d.minPayment <= monthlyInterest) {
      // Payment doesn't cover interest — debt can never be paid off with minimums
      // Use a large representative value (e.g., 10 years of interest-only payments)
      return sum + monthlyInterest * 120;
    }
    const n = -Math.log(1 - (r * d.balance) / d.minPayment) / Math.log(1 + r);
    const totalPaid = d.minPayment * Math.ceil(n);
    return sum + Math.max(0, totalPaid - d.balance);
  }, 0);

  const totalInterestSaved = Math.max(0, minOnlyTotalInterest - snowballTotalInterest);

  // Payoff date
  const now = new Date();
  now.setMonth(now.getMonth() + month);
  const payoffDate = now.toISOString().split('T')[0];

  return {
    order,
    payoffDate,
    totalInterestSaved: Math.round(totalInterestSaved * 100) / 100,
    timeline,
  };
}

// ---------------------------------------------------------------------------
// Net to Gross
// ---------------------------------------------------------------------------

/**
 * Reverse-engineers the gross salary that produces a given net salary after PAYE and UIF.
 * Uses binary search since the tax function is non-linear.
 */
export function calculateNetToGross(netSalary: number): NetToGrossResult {
  let low = netSalary;
  let high = netSalary * 3;
  let grossSalary = netSalary;

  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const { tax, uif } = calculatePAYE(mid);
    const estimatedNet = mid - tax - uif;

    if (Math.abs(estimatedNet - netSalary) < 0.01) {
      grossSalary = mid;
      break;
    }

    if (estimatedNet < netSalary) {
      low = mid;
    } else {
      high = mid;
    }

    grossSalary = mid;
  }

  const { tax, uif } = calculatePAYE(grossSalary);

  return {
    grossSalary: Math.round(grossSalary * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    uif: Math.round(uif * 100) / 100,
  };
}
