export enum CalculatorType {
  PAYE = 'PAYE',
  LOAN_REPAYMENT = 'LOAN_REPAYMENT',
  BOND = 'BOND',
  SAVINGS_GROWTH = 'SAVINGS_GROWTH',
  TFSA = 'TFSA',
  INTEREST = 'INTEREST',
  DEBT_SNOWBALL = 'DEBT_SNOWBALL',
  NET_TO_GROSS = 'NET_TO_GROSS',
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: 'number' | 'select' | 'radio' | 'checkbox' | 'slider';
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  helpText?: string;
  unit?: 'ZAR' | 'percent' | 'years' | 'months';
}

export interface CalculatorResult {
  label: string;
  value: number;
  formatted: string;
  highlight?: boolean;
  description?: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface CalculatorOutput {
  summary: CalculatorResult[];
  breakdown: CalculatorResult[][];
  chart?: ChartData;
}

// PAYE
export interface PAYEInputs {
  grossIncome: number;
  age?: number;
  year?: number;
}

export interface PAYEResult {
  grossIncome: number;
  tax: number;
  uif: number;
  netIncome: number;
  effectiveTaxRate: number;
  marginalRate: number;
  rebates: number;
}

// Loan
export interface LoanInputs {
  principal: number;
  annualRate: number;
  termMonths: number;
}

export interface LoanAmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortization: LoanAmortizationRow[];
}

// Bond
export interface BondInputs {
  purchasePrice: number;
  deposit: number;
  annualRate: number;
  termYears: number;
}

export interface BondResult extends LoanResult {
  loanAmount: number;
  depositAmount: number;
}

// Savings
export interface SavingsInputs {
  principal: number;
  monthlyDeposit: number;
  annualRate: number;
  years: number;
}

export interface SavingsYearlyBreakdown {
  year: number;
  balance: number;
  contributions: number;
  interest: number;
}

export interface SavingsResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  yearlyBreakdown: SavingsYearlyBreakdown[];
}

// TFSA
export interface TFSAInputs {
  currentContributions: number;
  lifetimeContributions: number;
  annualLimit?: number;
  lifetimeLimit?: number;
}

export interface TFSAResult {
  remainingAnnual: number;
  remainingLifetime: number;
  projectedGrowth: number;
  isOverContributed: boolean;
}

// Interest
export interface InterestInputs {
  principal: number;
  rate: number;
  periods: number;
  type: 'simple' | 'compound';
  compoundFrequency?: number;
}

export interface InterestResult {
  interest: number;
  total: number;
}

// Debt Snowball
export interface DebtItem {
  name: string;
  balance: number;
  minPayment: number;
  rate: number;
}

export interface DebtSnowballInputs {
  debts: DebtItem[];
  extraPayment: number;
}

export interface DebtSnowballTimelineEntry {
  month: number;
  debtName: string;
  balance: number;
  payment: number;
  isPaidOff: boolean;
}

export interface DebtSnowballResult {
  order: string[];
  payoffDate: string;
  totalInterestSaved: number;
  timeline: DebtSnowballTimelineEntry[];
}

// Net to Gross
export interface NetToGrossInputs {
  netSalary: number;
}

export interface NetToGrossResult {
  grossSalary: number;
  tax: number;
  uif: number;
}
