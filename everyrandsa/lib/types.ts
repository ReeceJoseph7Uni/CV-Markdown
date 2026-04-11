// EveryRandSA – Shared TypeScript Types

export type ProductType = 'savings' | 'loan' | 'investment';
export type ProductCategory =
  | 'savings_account'
  | 'notice_deposit'
  | 'fixed_deposit'
  | 'tfsa'
  | 'money_market'
  | 'personal_loan'
  | 'home_loan'
  | 'credit_card'
  | 'transaction_account';
export type ProductStatus = 'active' | 'archived' | 'review_needed';
export type RateType = 'nominal' | 'effective';
export type DataVerificationStatus = 'verified' | 'unverified';
export type CompoundingFrequency = 'daily' | 'monthly' | 'quarterly' | 'annually';
export type UpdateFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export interface RateTier {
  minBalance: number;
  maxBalance: number | null;
  rate: number;
}

export interface Fee {
  name: string;
  amount: number;
  type: 'fixed' | 'percentage';
}

export interface Product {
  id: string;
  name: string;
  institution: string;
  type: ProductType;
  category: ProductCategory;
  description: string;
  status: ProductStatus;
  // Financial
  interestRate: number;
  rateType: RateType;
  isPromotional: boolean;
  promotionEndDate?: string;
  rateTiers: RateTier[];
  compoundingFrequency: CompoundingFrequency;
  // Fees
  monthlyFee: number;
  withdrawalFee: number;
  adminFee: number;
  openingFee: number;
  closurePenalty: number;
  otherFees: Fee[];
  // Requirements
  minDeposit: number;
  minIncome?: number;
  maxBalance?: number;
  minTerm?: number;
  accessType: '24/7' | 'business_hours' | 'notice_period';
  noticePeriodDays?: number;
  isTfsaEligible: boolean;
  taxTreatment: 'regular_income' | 'tax_free';
  // Tracking
  sourceUrl: string;
  lastCheckedDate: string;
  lastCheckedBy: string;
  verificationStatus: DataVerificationStatus;
  nextReviewDate: string;
  updateFrequency: UpdateFrequency;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface RateHistory {
  id: string;
  productId: string;
  productName: string;
  institution: string;
  oldRate: number;
  newRate: number;
  effectiveDate: string;
  changedBy: string;
  reason: string;
  notes: string;
  createdAt: string;
}

export type CalculatorStatus = 'active' | 'beta' | 'archived';
export type InputType = 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'select' | 'slider';
export type OutputFormat = 'currency' | 'percentage' | 'number';

export interface CalculatorInput {
  id: string;
  name: string;
  label: string;
  type: InputType;
  required: boolean;
  min?: number;
  max?: number;
  helpText: string;
  options?: string[];
  order: number;
}

export interface CalculatorOutput {
  id: string;
  name: string;
  label: string;
  format: OutputFormat;
  description: string;
  order: number;
}

export interface TestCase {
  id: string;
  name: string;
  inputs: Record<string, number | string>;
  expectedOutputs: Record<string, number | string>;
  passed?: boolean;
}

export interface Calculator {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  status: CalculatorStatus;
  featured: boolean;
  inputs: CalculatorInput[];
  outputs: CalculatorOutput[];
  formula: string;
  taxYear: number;
  dataSources: string[];
  testCases: TestCase[];
  usageToday: number;
  usageWeek: number;
  usageMonth: number;
  lastModified: string;
  createdAt: string;
}

export type SourceType = 'api' | 'manual' | 'scraping';
export type SyncStatus = 'success' | 'failed' | 'warning' | 'running';
export type RefreshFrequency = 'daily' | 'weekly' | 'monthly' | 'manual';

export interface SyncLog {
  id: string;
  sourceId: string;
  timestamp: string;
  duration: number;
  recordsProcessed: number;
  recordsAdded: number;
  recordsUpdated: number;
  recordsDeleted: number;
  errors: string[];
  status: SyncStatus;
}

export interface DataSource {
  id: string;
  name: string;
  type: SourceType;
  endpoint: string;
  apiKey?: string;
  refreshFrequency: RefreshFrequency;
  lastSync?: SyncLog;
  nextScheduledSync?: string;
  syncHistory: SyncLog[];
  isActive: boolean;
  createdAt: string;
}

export interface ProfileWeight {
  interestRate: number;
  fees: number;
  accessFlexibility: number;
  minBalanceRequirement: number;
  tfsaEligibility: number;
  digitalEaseOfUse: number;
  userProfileMatch: number;
}

export interface ComparisonProfile {
  id: string;
  name: string;
  description: string;
  weights: ProfileWeight;
  productTypes: ProductType[];
  categories: ProductCategory[];
  minBalance?: number;
  minIncome?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  lastLogin: string;
  createdAt: string;
}

export interface SystemSettings {
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  alertRecipients: string[];
  defaultRefreshFrequency: RefreshFrequency;
  dataRetentionDays: number;
  rateChangeSensitivity: number;
  autoArchiveOutdated: boolean;
  autoArchiveThresholdDays: number;
}

export interface DashboardMetrics {
  totalProducts: number;
  productsByType: Record<ProductType, number>;
  dataFreshnessPercent: number;
  lastSyncTimestamps: Record<string, string>;
  syncFailures: number;
  popularCalculators: Array<{ name: string; usage: number }>;
  mostComparedProducts: Array<{ name: string; comparisons: number }>;
  productsAddedThisMonth: number;
  ratesUpdatedThisMonth: number;
  errorsFixed: number;
  systemHealth: 'healthy' | 'degraded' | 'down';
}
