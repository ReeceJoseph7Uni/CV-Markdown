// Product types
export type ProductType = 'savings' | 'loan' | 'investment' | 'credit_card' | 'transaction';
export type ProductStatus = 'active' | 'inactive' | 'archived';
export type DataSource = 'SARB_API' | 'SARS' | 'website_scrape' | 'manual_entry' | 'csv_upload';
export type RefreshFrequency = 'daily' | 'weekly' | 'monthly' | 'manual';
export type RateType = 'nominal' | 'effective';

export interface RateTier {
  minBalance: number;
  maxBalance: number | null;
  rate: number;
}

export interface Product {
  id: string;
  name: string;
  institution: string;
  productType: ProductType;
  category: string;
  description: string;
  applyUrl: string;
  // Rates
  interestRate: number;
  rateType: RateType;
  isPromotional: boolean;
  promotionalStartDate?: string;
  promotionalEndDate?: string;
  rateTiers: RateTier[];
  minBalance: number;
  maxBalance?: number;
  // Fees
  monthlyFee: number;
  withdrawalFee: number;
  transactionFee: number;
  setupFee: number;
  closurePenalty: number;
  inactivityFee: number;
  // Terms
  noticePeriodDays: number;
  minDeposit: number;
  maxDeposit?: number;
  lockInMonths: number;
  isTfsaEligible: boolean;
  isRetirementEligible: boolean;
  taxStatus: string;
  // Eligibility
  minIncome?: number;
  creditScoreRequirement?: string;
  ageRequirement?: string;
  residencyRequirement: string;
  specialConditions?: string;
  // Data management
  dataSource: DataSource;
  sourceUrl: string;
  lastCheckedDate: string;
  nextRefreshDate: string;
  refreshFrequency: RefreshFrequency;
  apiEndpoint?: string;
  // Admin
  adminNotes?: string;
  publicDisclaimer?: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface RateChange {
  id: string;
  productId: string;
  productName: string;
  institution: string;
  oldRate: number;
  newRate: number;
  changedAt: string;
  changedBy: string;
  reason?: string;
}

export interface Calculator {
  id: string;
  name: string;
  description: string;
  status: 'enabled' | 'disabled';
  lastUpdated: string;
  testCaseCount: number;
  formula: string;
  inputs: CalculatorInput[];
  outputs: CalculatorOutput[];
}

export interface CalculatorInput {
  id: string;
  name: string;
  label: string;
  type: 'number' | 'currency' | 'percentage' | 'date' | 'dropdown';
  defaultValue?: string | number;
  min?: number;
  max?: number;
  helpText?: string;
  required: boolean;
  options?: string[];
}

export interface CalculatorOutput {
  id: string;
  name: string;
  label: string;
  format: 'currency' | 'percentage' | 'number' | 'date';
  showBreakdown: boolean;
}

export interface DataSourceConfig {
  id: string;
  name: string;
  type: 'SARB_API' | 'SARS' | 'website_scrape' | 'csv_upload' | 'custom_api';
  endpoint?: string;
  apiKey?: string;
  refreshSchedule: string;
  lastSyncAt?: string;
  lastSyncStatus: 'success' | 'failure' | 'partial' | 'pending';
  nextScheduledSync?: string;
  isActive: boolean;
}

export interface SyncLog {
  id: string;
  sourceId: string;
  sourceName: string;
  startedAt: string;
  completedAt?: string;
  status: 'running' | 'success' | 'failure' | 'partial';
  recordsProcessed: number;
  recordsUpdated: number;
  errors: string[];
  duration?: number;
}

export interface ComparisonProfile {
  id: string;
  name: string;
  description: string;
  weights: {
    interestRate: number;
    fees: number;
    accessibility: number;
    minBalance: number;
    tfsaEligibility?: number;
    tierMatching?: number;
    noticePeriod?: number;
  };
  mustBeTfsa?: boolean;
  isDefault: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

export interface AnalyticsData {
  calculatorUsage: { name: string; uses: number }[];
  productViews: { name: string; views: number; institution: string }[];
  trafficOverTime: { date: string; visitors: number; pageViews: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
  profileUsage: { name: string; uses: number }[];
}

export interface DashboardMetrics {
  totalProducts: number;
  productsByType: { type: string; count: number }[];
  lastSyncAt: string;
  dataFreshness: 'fresh' | 'stale' | 'critical';
  staleProducts: number;
  activeUsers: number;
  recentActivity: ActivityItem[];
  dataQualityIssues: DataQualityIssue[];
}

export interface ActivityItem {
  id: string;
  type: 'product_update' | 'rate_change' | 'sync' | 'alert';
  description: string;
  user?: string;
  timestamp: string;
}

export interface DataQualityIssue {
  type: 'missing_field' | 'duplicate' | 'orphaned' | 'validation_error';
  count: number;
  description: string;
}
