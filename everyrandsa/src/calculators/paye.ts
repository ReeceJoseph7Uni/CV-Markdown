import type { IPAYEInput, IPAYEResult } from '../types';

// ----------------------------------------------------------------
// 2026 South African individual income tax brackets
// ----------------------------------------------------------------
interface TaxBracket {
  from: number;
  to: number;
  baseTax: number;
  marginalRate: number;
}

const TAX_BRACKETS_2026: TaxBracket[] = [
  { from: 1,         to: 237_100,    baseTax: 0,       marginalRate: 0.18 },
  { from: 237_101,   to: 370_500,    baseTax: 42_678,  marginalRate: 0.26 },
  { from: 370_501,   to: 512_800,    baseTax: 77_362,  marginalRate: 0.31 },
  { from: 512_801,   to: 673_000,    baseTax: 121_475, marginalRate: 0.36 },
  { from: 673_001,   to: 857_900,    baseTax: 179_147, marginalRate: 0.39 },
  { from: 857_901,   to: 1_817_000,  baseTax: 251_258, marginalRate: 0.41 },
  { from: 1_817_001, to: Infinity,   baseTax: 644_489, marginalRate: 0.45 },
];

/** Annual rebates for 2026 */
const PRIMARY_REBATE   = 17_235;
const SECONDARY_REBATE =  9_444; // age 65+
const TERTIARY_REBATE  =  3_145; // age 75+

/** Monthly medical-aid tax credits (2026) */
const MEDICAL_CREDIT_MAIN       = 364; // main member
const MEDICAL_CREDIT_FIRST_DEP  = 364; // first dependant
const MEDICAL_CREDIT_EXTRA_DEP  = 246; // each additional dependant

/** UIF rate and monthly cap */
const UIF_RATE          = 0.01;
const UIF_MONTHLY_CAP   = 177.12;

/** Max retirement contribution deduction: 27.5% of the greater of
 *  remuneration or taxable income, capped at R350,000 per year. */
const RETIREMENT_MAX_RATE = 0.275;
const RETIREMENT_MAX_CAP  = 350_000;

function calcGrossTax(taxableIncome: number): { grossTax: number; marginalRate: number } {
  if (taxableIncome <= 0) return { grossTax: 0, marginalRate: 0 };

  for (const bracket of TAX_BRACKETS_2026) {
    if (taxableIncome >= bracket.from && taxableIncome <= bracket.to) {
      const grossTax = bracket.baseTax + (taxableIncome - bracket.from + 1) * bracket.marginalRate;
      return { grossTax, marginalRate: bracket.marginalRate };
    }
  }
  // Fallback (should not occur)
  return { grossTax: 0, marginalRate: 0 };
}

export function calculatePAYE(input: IPAYEInput): IPAYEResult {
  const {
    grossSalary,
    age,
    medicalAidDependants = 0,
    retirementContribution = 0,
  } = input;

  // Retirement deduction (annual)
  const retirementAnnual   = retirementContribution * 12;
  const maxRetirement      = Math.min(grossSalary * RETIREMENT_MAX_RATE, RETIREMENT_MAX_CAP);
  const retirementDeduction = Math.min(retirementAnnual, maxRetirement);

  const taxableIncome = Math.max(0, grossSalary - retirementDeduction);

  const { grossTax, marginalRate } = calcGrossTax(taxableIncome);

  // Rebates
  const primaryRebate   = PRIMARY_REBATE;
  const secondaryRebate = age >= 65 ? SECONDARY_REBATE : 0;
  const tertiaryRebate  = age >= 75 ? TERTIARY_REBATE  : 0;

  // Medical aid credits (annual)
  const dependants     = Math.max(0, medicalAidDependants);
  const monthlyCredit  =
    MEDICAL_CREDIT_MAIN +
    (dependants >= 1 ? MEDICAL_CREDIT_FIRST_DEP : 0) +
    (dependants >= 2 ? (dependants - 1) * MEDICAL_CREDIT_EXTRA_DEP : 0);
  const annualCredit   = monthlyCredit * 12;

  const netTax = Math.max(
    0,
    grossTax - primaryRebate - secondaryRebate - tertiaryRebate - annualCredit,
  );

  // UIF (employee share): 1% of gross monthly, capped
  const monthlyGross = grossSalary / 12;
  const uifMonthly   = Math.min(monthlyGross * UIF_RATE, UIF_MONTHLY_CAP);
  const uifAnnual    = uifMonthly * 12;

  const totalDeductions  = netTax + uifAnnual;
  const netSalary        = grossSalary - totalDeductions;
  const effectiveTaxRate = grossSalary > 0 ? netTax / grossSalary : 0;

  return {
    grossSalary,
    taxableIncome,
    grossTax,
    primaryRebate,
    secondaryRebate,
    tertiaryRebate,
    medicalAidCredit: annualCredit,
    netTax,
    uif: uifAnnual,
    totalDeductions,
    netSalary,
    effectiveTaxRate,
    marginalTaxRate: marginalRate,
    monthlyNetSalary: netSalary / 12,
    monthlyTax:       netTax   / 12,
  };
}
