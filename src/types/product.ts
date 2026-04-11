export enum ProductType {
  SAVINGS_ACCOUNT = 'SAVINGS_ACCOUNT',
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

export enum AccessType {
  INSTANT = 'INSTANT',
  NOTICE_32_DAYS = 'NOTICE_32_DAYS',
  NOTICE_60_DAYS = 'NOTICE_60_DAYS',
  NOTICE_90_DAYS = 'NOTICE_90_DAYS',
  FIXED_TERM = 'FIXED_TERM',
  ON_DEMAND = 'ON_DEMAND',
}

export enum InterestType {
  NOMINAL = 'NOMINAL',
  EFFECTIVE = 'EFFECTIVE',
  PRIME_LINKED = 'PRIME_LINKED',
  FIXED = 'FIXED',
  VARIABLE = 'VARIABLE',
}

export interface RateTier {
  minBalance: number;
  maxBalance: number | null;
  rate: number;
  isPromotional?: boolean;
  promotionEndDate?: string;
}

export interface Fee {
  type: string;
  amount: number;
  description: string;
  isMonthly?: boolean;
}

export interface EligibilityRules {
  minAge?: number;
  maxAge?: number;
  residencyRequired?: boolean;
  employmentRequired?: boolean;
  minCreditScore?: number;
  notes?: string;
}

export interface ComparisonScore {
  overall: number;
  rateScore: number;
  accessScore: number;
  feeScore: number;
  digitalScore: number;
}

export interface Product {
  id: string;
  institutionName: string;
  productName: string;
  productType: ProductType;
  category: string;
  eligibilityRules: EligibilityRules;
  minDeposit: number;
  minIncome?: number;
  rateTiers: RateTier[];
  fees: Fee[];
  noticePeriodDays?: number;
  taxStatus: 'TFSA' | 'taxable' | 'exempt';
  accessType: AccessType;
  sourceUrl: string;
  lastCheckedDate: string;
  updateFrequency: 'daily' | 'weekly' | 'monthly';
  notes?: string;
  disclaimer?: string;
  bankLogoUrl?: string;
  isActive: boolean;
  effectiveYield?: number;
  monthlyFee?: number;
  rateType: InterestType;
  isPromotional?: boolean;
  promotionEndDate?: string;
  digitalEaseScore?: number;
  comparisonScore?: ComparisonScore;
}

export interface SavingsProduct extends Product {
  productType:
    | ProductType.SAVINGS_ACCOUNT
    | ProductType.NOTICE_DEPOSIT
    | ProductType.FIXED_DEPOSIT
    | ProductType.TFSA
    | ProductType.MONEY_MARKET;
  interestPaymentFrequency: 'monthly' | 'quarterly' | 'annually' | 'maturity';
  isCapitalised: boolean;
  termMonths?: number;
  annualContributionLimit?: number;
  lifetimeContributionLimit?: number;
}

export interface LoanProduct extends Product {
  productType: ProductType.PERSONAL_LOAN | ProductType.HOME_LOAN | ProductType.CREDIT_CARD;
  maxLoanAmount?: number;
  minLoanAmount?: number;
  maxTermMonths?: number;
  minTermMonths?: number;
  initiationFee?: number;
  serviceFeMonthly?: number;
  creditLifeInsurance?: boolean;
  linkedToRepo?: boolean;
  repoSpread?: number;
}
