// ============================================================
// EveryRandSA – Shared TypeScript Types
// ============================================================

// ----------------------------------------------------------------
// Enums
// ----------------------------------------------------------------
export enum ProductType {
  SAVINGS = 'SAVINGS',
  NOTICE_DEPOSIT = 'NOTICE_DEPOSIT',
  FIXED_DEPOSIT = 'FIXED_DEPOSIT',
  TFSA = 'TFSA',
  MONEY_MARKET = 'MONEY_MARKET',
  PERSONAL_LOAN = 'PERSONAL_LOAN',
  HOME_LOAN = 'HOME_LOAN',
  CREDIT_CARD = 'CREDIT_CARD',
  TRANSACTION_ACCOUNT = 'TRANSACTION_ACCOUNT',
  INVESTMENT = 'INVESTMENT',
}

export enum RateType {
  NOMINAL = 'NOMINAL',
  EFFECTIVE = 'EFFECTIVE',
}

export enum AccessType {
  INSTANT = 'INSTANT',
  NOTICE_7_DAYS = 'NOTICE_7_DAYS',
  NOTICE_32_DAYS = 'NOTICE_32_DAYS',
  NOTICE_60_DAYS = 'NOTICE_60_DAYS',
  NOTICE_90_DAYS = 'NOTICE_90_DAYS',
  FIXED_TERM = 'FIXED_TERM',
}

export enum TaxStatus {
  TAXABLE = 'TAXABLE',
  TAX_FREE = 'TAX_FREE',
  TAX_DEFERRED = 'TAX_DEFERRED',
}

export enum UserProfile {
  EMERGENCY_SAVINGS = 'EMERGENCY_SAVINGS',
  TFSA_INVESTOR = 'TFSA_INVESTOR',
  LARGE_BALANCE = 'LARGE_BALANCE',
  NO_FEE_PREFERENCE = 'NO_FEE_PREFERENCE',
  SHORT_TERM_PARKING = 'SHORT_TERM_PARKING',
  GENERAL = 'GENERAL',
}

// ----------------------------------------------------------------
// Domain model interfaces
// ----------------------------------------------------------------
export interface IProduct {
  id: string;
  institution: string;
  productName: string;
  productType: ProductType;
  category: string;
  eligibilityRules?: string | null;
  minDeposit?: number | null;
  minIncome?: number | null;
  maxBalance?: number | null;
  accessType: AccessType;
  noticePeriodDays?: number | null;
  monthlyFee: number;
  initiationFee: number;
  withdrawalFee: number;
  adminFee: number;
  taxStatus: TaxStatus;
  sourceUrl: string;
  lastCheckedDate: Date;
  updateFrequency: string;
  isActive: boolean;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  rates?: IProductRate[];
  comparisonScores?: IComparisonScore[];
}

export interface IProductRate {
  id: string;
  productId: string;
  minBalance: number;
  maxBalance?: number | null;
  interestRate: number;
  rateType: RateType;
  effectiveYield?: number | null;
  isPromotional: boolean;
  promotionEndDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICalculator {
  id: string;
  name: string;
  description: string;
  category: string;
  inputs: Record<string, unknown>;
  formula: string;
  outputFields: Record<string, unknown>;
  taxYear?: string | null;
  assumptions?: Record<string, unknown> | null;
  sourceRefs?: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComparisonScore {
  id: string;
  productId: string;
  userProfile: UserProfile;
  rateScore: number;
  feeScore: number;
  accessScore: number;
  minBalanceScore: number;
  tfsaScore: number;
  digitalScore: number;
  overallScore: number;
  effectiveReturn: number;
  lastCalculated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDataSource {
  id: string;
  name: string;
  description: string;
  apiEndpoint?: string | null;
  refreshSchedule: string;
  lastSyncAt?: Date | null;
  lastSyncStatus?: string | null;
  lastSyncMessage?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ----------------------------------------------------------------
// Calculator input / output interfaces
// ----------------------------------------------------------------

/** PAYE (Pay-As-You-Earn) */
export interface IPAYEInput {
  /** Annual gross salary in ZAR */
  grossSalary: number;
  /** Tax year, e.g. "2026" */
  taxYear?: string;
  /** Age of taxpayer */
  age: number;
  /** Number of medical aid dependants (excluding main member) */
  medicalAidDependants?: number;
  /** Monthly retirement annuity / pension fund contribution */
  retirementContribution?: number;
}

export interface IPAYEResult {
  grossSalary: number;
  taxableIncome: number;
  grossTax: number;
  primaryRebate: number;
  secondaryRebate: number;
  tertiaryRebate: number;
  medicalAidCredit: number;
  netTax: number;
  uif: number;
  totalDeductions: number;
  netSalary: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  monthlyNetSalary: number;
  monthlyTax: number;
}

/** Personal Loan */
export interface ILoanInput {
  /** Principal loan amount in ZAR */
  principal: number;
  /** Loan term in months */
  termMonths: number;
  /** Annual interest rate as decimal (e.g. 0.1225 for 12.25%) */
  annualRate: number;
  /** Once-off initiation fee */
  initiationFee?: number;
  /** Monthly administration fee */
  monthlyFee?: number;
}

export interface ILoanResult {
  principal: number;
  termMonths: number;
  annualRate: number;
  monthlyRepayment: number;
  totalRepayment: number;
  totalInterest: number;
  totalFees: number;
  effectiveAPR: number;
  initiationFee: number;
  monthlyFee: number;
}

/** Home Loan / Bond */
export interface IBondInput {
  /** Purchase price of the property in ZAR */
  propertyPrice: number;
  /** Deposit amount in ZAR */
  deposit: number;
  /** Loan term in years */
  termYears: number;
  /** Annual interest rate as decimal */
  annualRate: number;
  /** Monthly body corporate / HOA levy in ZAR */
  monthlyLevy?: number;
  /** Monthly rates & taxes in ZAR */
  monthlyRates?: number;
}

export interface IBondResult {
  propertyPrice: number;
  deposit: number;
  loanAmount: number;
  termYears: number;
  annualRate: number;
  monthlyBondRepayment: number;
  totalBondRepayment: number;
  totalInterest: number;
  transferDuty: number;
  estimatedTransferAttorneyFees: number;
  estimatedBondRegistrationFees: number;
  totalAcquisitionCost: number;
  monthlyLevy: number;
  monthlyRates: number;
  monthlyTotalCost: number;
}

/** Savings Growth */
export interface ISavingsInput {
  /** Initial lump-sum deposit in ZAR */
  principal: number;
  /** Regular monthly deposit in ZAR */
  monthlyDeposit?: number;
  /** Annual interest rate as decimal */
  annualRate: number;
  /** Investment term in years */
  termYears: number;
  /** Compounding frequency per year: 1 | 4 | 12 | 365 */
  compoundFrequency?: 1 | 4 | 12 | 365;
}

export interface ISavingsResult {
  principal: number;
  monthlyDeposit: number;
  annualRate: number;
  termYears: number;
  compoundFrequency: number;
  futureValue: number;
  totalDeposited: number;
  totalInterestEarned: number;
  effectiveAnnualRate: number;
  /** Month-by-month breakdown */
  schedule: ISavingsScheduleEntry[];
}

export interface ISavingsScheduleEntry {
  month: number;
  openingBalance: number;
  deposit: number;
  interestEarned: number;
  closingBalance: number;
}

/** Tax-Free Savings Account */
export interface ITFSAInput {
  /** Planned contribution for the current tax year in ZAR */
  annualContribution: number;
  /** Total contributions made in prior tax years in ZAR */
  previousContributions?: number;
  /** Tax year, e.g. "2026" */
  taxYear?: string;
  /** Current account balance (to project growth) */
  currentBalance?: number;
  /** Annual interest rate as decimal */
  annualRate?: number;
  /** Projection period in years */
  projectionYears?: number;
}

export interface ITFSAResult {
  annualContribution: number;
  previousContributions: number;
  totalContributions: number;
  annualLimit: number;
  lifetimeCap: number;
  remainingAnnualAllowance: number;
  remainingLifetimeAllowance: number;
  isOverContributed: boolean;
  overContributionAmount: number;
  projectedValue: number;
  taxYear: string;
}

/** Debt Repayment */
export interface IDebt {
  name: string;
  balance: number;
  annualRate: number;
  minimumPayment: number;
}

export interface IDebtInput {
  debts: IDebt[];
  /** Extra monthly payment above minimums in ZAR */
  extraPayment?: number;
  /** 'SNOWBALL' | 'AVALANCHE' */
  strategy?: 'SNOWBALL' | 'AVALANCHE';
}

export interface IDebtStrategyResult {
  strategy: 'SNOWBALL' | 'AVALANCHE';
  monthsToDebtFree: number;
  totalInterestPaid: number;
  totalPaid: number;
  schedule: IDebtScheduleEntry[];
}

export interface IDebtScheduleEntry {
  month: number;
  debts: {
    name: string;
    balance: number;
    payment: number;
    interestCharged: number;
  }[];
  totalPayment: number;
}

export interface IDebtResult {
  snowball: IDebtStrategyResult;
  avalanche: IDebtStrategyResult;
  interestSavedByAvalanche: number;
  monthsSavedByAvalanche: number;
}

/** Simple / Compound Interest */
export interface IInterestInput {
  principal: number;
  /** Annual rate as decimal */
  annualRate: number;
  /** Term in years */
  termYears: number;
  /** 'SIMPLE' | 'COMPOUND' */
  interestType?: 'SIMPLE' | 'COMPOUND';
  /** Compounding frequency (used only for COMPOUND): 1 | 4 | 12 | 365 */
  compoundFrequency?: 1 | 4 | 12 | 365;
}

export interface IInterestResult {
  principal: number;
  annualRate: number;
  termYears: number;
  interestType: 'SIMPLE' | 'COMPOUND';
  finalAmount: number;
  interestEarned: number;
  effectiveAnnualRate: number;
}

// ----------------------------------------------------------------
// Comparison engine interfaces
// ----------------------------------------------------------------
export interface IComparisonFilter {
  productType?: ProductType;
  institution?: string;
  /** Minimum deposit / balance available in ZAR */
  minBalance?: number;
  /** Maximum balance the user intends to deposit */
  maxBalance?: number;
  accessType?: AccessType;
  /** Maximum acceptable monthly fee in ZAR */
  maxMonthlyFee?: number;
  /** If true, only return TAX_FREE products */
  tfsaOnly?: boolean;
  userProfile?: UserProfile;
}

export interface INetValueResult {
  productId: string;
  grossInterest: number;
  totalFees: number;
  netInterest: number;
  effectiveYield: number;
}

export interface IWeightedScore {
  rate: number;
  fees: number;
  access: number;
  minBalance: number;
  tfsa: number;
  digital: number;
}

// ----------------------------------------------------------------
// API response interfaces
// ----------------------------------------------------------------
export interface IApiError {
  code: string;
  message: string;
  details?: unknown;
  statusCode: number;
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: IApiError;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    timestamp: string;
  };
}
