import { calculatePAYE }     from '../src/calculators/paye';
import { calculateLoan }     from '../src/calculators/loan';
import { calculateBond }     from '../src/calculators/bond';
import { calculateSavings }  from '../src/calculators/savings';
import { calculateTFSA }     from '../src/calculators/tfsa';
import { calculateDebt }     from '../src/calculators/debt';
import { calculateInterest } from '../src/calculators/interest';

// ----------------------------------------------------------------
// PAYE tests
// ----------------------------------------------------------------
describe('calculatePAYE', () => {
  test('R300,000 gross salary – below secondary rebate threshold', () => {
    const result = calculatePAYE({ grossSalary: 300_000, age: 35 });
    expect(result.grossSalary).toBe(300_000);
    expect(result.taxableIncome).toBe(300_000);
    expect(result.netTax).toBeGreaterThan(0);
    expect(result.netSalary).toBeLessThan(300_000);
    expect(result.netSalary + result.netTax + result.uif).toBeCloseTo(300_000, 0);
    expect(result.effectiveTaxRate).toBeGreaterThan(0);
    expect(result.effectiveTaxRate).toBeLessThan(1);
    expect(result.marginalTaxRate).toBe(0.26);
  });

  test('R600,000 gross salary – middle bracket', () => {
    const result = calculatePAYE({ grossSalary: 600_000, age: 40 });
    expect(result.marginalTaxRate).toBe(0.36);
    expect(result.netTax).toBeGreaterThan(0);
    expect(result.effectiveTaxRate).toBeGreaterThan(0.1);
  });

  test('R1,000,000 gross salary – 41% bracket', () => {
    const result = calculatePAYE({ grossSalary: 1_000_000, age: 45 });
    expect(result.marginalTaxRate).toBe(0.41);
    expect(result.effectiveTaxRate).toBeGreaterThan(0.2);
  });

  test('R2,000,000 gross salary – top 45% bracket', () => {
    const result = calculatePAYE({ grossSalary: 2_000_000, age: 50 });
    expect(result.marginalTaxRate).toBe(0.45);
    expect(result.effectiveTaxRate).toBeGreaterThan(0.3);
  });

  test('Age 65+ receives secondary rebate', () => {
    const young  = calculatePAYE({ grossSalary: 300_000, age: 50 });
    const senior = calculatePAYE({ grossSalary: 300_000, age: 65 });
    expect(senior.secondaryRebate).toBeGreaterThan(0);
    expect(senior.netTax).toBeLessThan(young.netTax);
  });

  test('Age 75+ receives tertiary rebate', () => {
    const result = calculatePAYE({ grossSalary: 300_000, age: 75 });
    expect(result.tertiaryRebate).toBeGreaterThan(0);
  });

  test('Medical aid credits reduce net tax', () => {
    const noMed = calculatePAYE({ grossSalary: 500_000, age: 40, medicalAidDependants: 0 });
    const withMed = calculatePAYE({ grossSalary: 500_000, age: 40, medicalAidDependants: 2 });
    expect(withMed.medicalAidCredit).toBeGreaterThan(noMed.medicalAidCredit);
    expect(withMed.netTax).toBeLessThan(noMed.netTax);
  });

  test('Retirement contribution reduces taxable income', () => {
    const noRa = calculatePAYE({ grossSalary: 500_000, age: 40, retirementContribution: 0 });
    const withRa = calculatePAYE({ grossSalary: 500_000, age: 40, retirementContribution: 3_000 });
    expect(withRa.taxableIncome).toBeLessThan(noRa.taxableIncome);
  });

  test('UIF is capped at R177.12/month', () => {
    const rich = calculatePAYE({ grossSalary: 2_000_000, age: 40 });
    expect(rich.uif / 12).toBeCloseTo(177.12, 1);
  });

  test('Zero tax for very low income', () => {
    const result = calculatePAYE({ grossSalary: 50_000, age: 35 });
    expect(result.netTax).toBe(0);
  });
});

// ----------------------------------------------------------------
// Loan tests
// ----------------------------------------------------------------
describe('calculateLoan', () => {
  test('Basic amortization – R100,000 over 24 months at 12.25%', () => {
    const result = calculateLoan({ principal: 100_000, termMonths: 24, annualRate: 0.1225 });
    expect(result.monthlyRepayment).toBeGreaterThan(0);
    expect(result.totalRepayment).toBeCloseTo(result.monthlyRepayment * 24, 0);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalInterest).toBeLessThan(result.principal);
  });

  test('Total repayment equals monthly * term', () => {
    const result = calculateLoan({ principal: 50_000, termMonths: 60, annualRate: 0.15 });
    expect(result.totalRepayment).toBeCloseTo(result.monthlyRepayment * 60, 0);
  });

  test('Zero interest rate – repayment equals principal / term', () => {
    const result = calculateLoan({ principal: 12_000, termMonths: 12, annualRate: 0 });
    expect(result.monthlyRepayment).toBeCloseTo(1_000, 0);
    expect(result.totalInterest).toBeCloseTo(0, 0);
  });

  test('Fees increase effective APR above nominal rate', () => {
    const noFees   = calculateLoan({ principal: 50_000, termMonths: 24, annualRate: 0.12 });
    const withFees = calculateLoan({ principal: 50_000, termMonths: 24, annualRate: 0.12, initiationFee: 1_000, monthlyFee: 69 });
    expect(withFees.effectiveAPR).toBeGreaterThan(noFees.effectiveAPR);
  });

  test('Throws on negative principal', () => {
    expect(() => calculateLoan({ principal: -1, termMonths: 12, annualRate: 0.1 })).toThrow();
  });
});

// ----------------------------------------------------------------
// Bond / Transfer Duty tests
// ----------------------------------------------------------------
describe('calculateBond', () => {
  test('Property R1,000,000 – no transfer duty (below R1.1M threshold)', () => {
    const result = calculateBond({ propertyPrice: 1_000_000, deposit: 100_000, termYears: 20, annualRate: 0.1025 });
    expect(result.transferDuty).toBe(0);
  });

  test('Property R1,500,000 – 3% bracket', () => {
    const result = calculateBond({ propertyPrice: 1_500_000, deposit: 150_000, termYears: 20, annualRate: 0.1025 });
    // 3% on (1,500,000 - 1,100,000) = 3% of 400,000 = 12,000
    expect(result.transferDuty).toBeCloseTo(12_000, -1);
  });

  test('Property R2,000,000 – 6% bracket', () => {
    const result = calculateBond({ propertyPrice: 2_000_000, deposit: 200_000, termYears: 20, annualRate: 0.1025 });
    // R12,375 + 6% on (2,000,000 - 1,512,500) = 12,375 + 29,250 = 41,625
    expect(result.transferDuty).toBeCloseTo(41_625, -1);
  });

  test('Monthly total cost includes levy and rates', () => {
    const result = calculateBond({
      propertyPrice: 1_500_000, deposit: 150_000, termYears: 20,
      annualRate: 0.1025, monthlyLevy: 1_500, monthlyRates: 800,
    });
    expect(result.monthlyTotalCost).toBeCloseTo(result.monthlyBondRepayment + 1_500 + 800, 0);
  });

  test('Total interest is positive for non-zero rate', () => {
    const result = calculateBond({ propertyPrice: 2_000_000, deposit: 400_000, termYears: 20, annualRate: 0.1025 });
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  test('Throws when deposit >= property price', () => {
    expect(() => calculateBond({ propertyPrice: 1_000_000, deposit: 1_000_000, termYears: 20, annualRate: 0.1 })).toThrow();
  });
});

// ----------------------------------------------------------------
// Savings tests
// ----------------------------------------------------------------
describe('calculateSavings', () => {
  test('Compound growth – no monthly deposit', () => {
    const result = calculateSavings({ principal: 10_000, annualRate: 0.10, termYears: 10 });
    // A = 10000 * (1 + 0.10/12)^120 ≈ 27,070
    expect(result.futureValue).toBeGreaterThan(25_000);
    expect(result.futureValue).toBeLessThan(30_000);
  });

  test('Monthly deposits increase future value', () => {
    const noDeposit   = calculateSavings({ principal: 10_000, annualRate: 0.08, termYears: 5 });
    const withDeposit = calculateSavings({ principal: 10_000, monthlyDeposit: 500, annualRate: 0.08, termYears: 5 });
    expect(withDeposit.futureValue).toBeGreaterThan(noDeposit.futureValue);
  });

  test('Total deposited = principal + monthly * months', () => {
    const result = calculateSavings({ principal: 5_000, monthlyDeposit: 200, annualRate: 0.07, termYears: 3 });
    expect(result.totalDeposited).toBeCloseTo(5_000 + 200 * 36, 0);
  });

  test('Schedule length matches term in months', () => {
    const result = calculateSavings({ principal: 1_000, annualRate: 0.05, termYears: 2 });
    expect(result.schedule.length).toBe(24);
  });

  test('Annual compounding vs monthly – monthly gives higher return', () => {
    const monthly  = calculateSavings({ principal: 10_000, annualRate: 0.10, termYears: 5, compoundFrequency: 12 });
    const annually = calculateSavings({ principal: 10_000, annualRate: 0.10, termYears: 5, compoundFrequency: 1 });
    expect(monthly.futureValue).toBeGreaterThan(annually.futureValue);
  });
});

// ----------------------------------------------------------------
// TFSA tests
// ----------------------------------------------------------------
describe('calculateTFSA', () => {
  test('Standard contribution within limits', () => {
    const result = calculateTFSA({ annualContribution: 30_000, previousContributions: 100_000 });
    expect(result.isOverContributed).toBe(false);
    expect(result.remainingAnnualAllowance).toBe(16_000);
    expect(result.remainingLifetimeAllowance).toBe(370_000);
  });

  test('Annual over-contribution detected', () => {
    const result = calculateTFSA({ annualContribution: 50_000 });
    expect(result.isOverContributed).toBe(true);
    expect(result.overContributionAmount).toBe(4_000);
  });

  test('Lifetime over-contribution detected', () => {
    const result = calculateTFSA({ annualContribution: 10_000, previousContributions: 495_000 });
    expect(result.isOverContributed).toBe(true);
    expect(result.overContributionAmount).toBe(5_000);
  });

  test('Annual limit is R46,000', () => {
    const result = calculateTFSA({ annualContribution: 0 });
    expect(result.annualLimit).toBe(46_000);
  });

  test('Lifetime cap is R500,000', () => {
    const result = calculateTFSA({ annualContribution: 0 });
    expect(result.lifetimeCap).toBe(500_000);
  });

  test('Projected value increases with positive rate', () => {
    const noGrowth  = calculateTFSA({ annualContribution: 30_000, annualRate: 0,    projectionYears: 10, currentBalance: 50_000 });
    const withGrowth = calculateTFSA({ annualContribution: 30_000, annualRate: 0.09, projectionYears: 10, currentBalance: 50_000 });
    expect(withGrowth.projectedValue).toBeGreaterThan(noGrowth.projectedValue);
  });
});

// ----------------------------------------------------------------
// Debt tests
// ----------------------------------------------------------------
describe('calculateDebt', () => {
  const debts = [
    { name: 'Credit Card',  balance: 15_000, annualRate: 0.20, minimumPayment: 450 },
    { name: 'Personal Loan', balance: 30_000, annualRate: 0.15, minimumPayment: 800 },
    { name: 'Store Card',   balance:  5_000, annualRate: 0.24, minimumPayment: 200 },
  ];

  test('Both strategies complete (months > 0)', () => {
    const result = calculateDebt({ debts, extraPayment: 500 });
    expect(result.snowball.monthsToDebtFree).toBeGreaterThan(0);
    expect(result.avalanche.monthsToDebtFree).toBeGreaterThan(0);
  });

  test('Avalanche pays less total interest than snowball', () => {
    const result = calculateDebt({ debts, extraPayment: 500 });
    expect(result.avalanche.totalInterestPaid).toBeLessThanOrEqual(result.snowball.totalInterestPaid);
  });

  test('Interest saved by avalanche is non-negative', () => {
    const result = calculateDebt({ debts, extraPayment: 500 });
    expect(result.interestSavedByAvalanche).toBeGreaterThanOrEqual(0);
  });

  test('Extra payment reduces time to debt-free', () => {
    const noExtra   = calculateDebt({ debts });
    const withExtra = calculateDebt({ debts, extraPayment: 1_000 });
    expect(withExtra.snowball.monthsToDebtFree).toBeLessThan(noExtra.snowball.monthsToDebtFree);
  });

  test('Throws when debts array is empty', () => {
    expect(() => calculateDebt({ debts: [] })).toThrow();
  });

  test('Schedule entries sum totalPayment correctly', () => {
    const result = calculateDebt({ debts, extraPayment: 200 });
    const first  = result.snowball.schedule[0];
    expect(first).toBeDefined();
    expect(first.totalPayment).toBeGreaterThan(0);
  });
});

// ----------------------------------------------------------------
// Interest calculator tests
// ----------------------------------------------------------------
describe('calculateInterest', () => {
  test('Simple interest – A = P(1 + rt)', () => {
    const result = calculateInterest({ principal: 10_000, annualRate: 0.10, termYears: 2, interestType: 'SIMPLE' });
    expect(result.finalAmount).toBeCloseTo(12_000, 0);
    expect(result.interestEarned).toBeCloseTo(2_000, 0);
  });

  test('Compound interest > simple interest (same params)', () => {
    const simple   = calculateInterest({ principal: 10_000, annualRate: 0.10, termYears: 5, interestType: 'SIMPLE' });
    const compound = calculateInterest({ principal: 10_000, annualRate: 0.10, termYears: 5, interestType: 'COMPOUND' });
    expect(compound.finalAmount).toBeGreaterThan(simple.finalAmount);
  });

  test('Effective annual rate > nominal for compound', () => {
    const result = calculateInterest({ principal: 10_000, annualRate: 0.10, termYears: 1, interestType: 'COMPOUND', compoundFrequency: 12 });
    expect(result.effectiveAnnualRate).toBeGreaterThan(0.10);
  });

  test('Throws on zero termYears', () => {
    expect(() => calculateInterest({ principal: 1_000, annualRate: 0.05, termYears: 0 })).toThrow();
  });
});
