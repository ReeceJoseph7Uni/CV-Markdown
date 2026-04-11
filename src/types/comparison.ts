export interface SortOption {
  value: string;
  label: string;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'toggle';
  options?: FilterOption[];
  min?: number;
  max?: number;
}

export type ActiveFilters = Record<string, string | string[] | boolean | [number, number]>;

export interface ComparisonCart {
  items: string[];
  maxItems: number;
}

export enum UserProfile {
  EMERGENCY_SAVINGS = 'EMERGENCY_SAVINGS',
  TFSA = 'TFSA',
  LARGE_BALANCE = 'LARGE_BALANCE',
  NO_FEE = 'NO_FEE',
  SHORT_TERM = 'SHORT_TERM',
}

export interface ProfileWeights {
  rate: number;
  access: number;
  fees: number;
  digital: number;
  taxBenefit: number;
}

export const PROFILE_WEIGHTS: Record<UserProfile, ProfileWeights> = {
  [UserProfile.EMERGENCY_SAVINGS]: {
    rate: 0.3,
    access: 0.4,
    fees: 0.2,
    digital: 0.05,
    taxBenefit: 0.05,
  },
  [UserProfile.TFSA]: {
    rate: 0.35,
    access: 0.1,
    fees: 0.1,
    digital: 0.05,
    taxBenefit: 0.4,
  },
  [UserProfile.LARGE_BALANCE]: {
    rate: 0.6,
    access: 0.15,
    fees: 0.1,
    digital: 0.05,
    taxBenefit: 0.1,
  },
  [UserProfile.NO_FEE]: {
    rate: 0.25,
    access: 0.2,
    fees: 0.45,
    digital: 0.05,
    taxBenefit: 0.05,
  },
  [UserProfile.SHORT_TERM]: {
    rate: 0.4,
    access: 0.3,
    fees: 0.2,
    digital: 0.05,
    taxBenefit: 0.05,
  },
};

export enum SortableField {
  RATE = 'rate',
  MONTHLY_FEE = 'monthlyFee',
  MIN_DEPOSIT = 'minDeposit',
  EFFECTIVE_YIELD = 'effectiveYield',
  DIGITAL_EASE = 'digitalEaseScore',
  NAME = 'institutionName',
  LAST_CHECKED = 'lastCheckedDate',
}

export enum ComparisonView {
  GRID = 'GRID',
  TABLE = 'TABLE',
  LIST = 'LIST',
}
