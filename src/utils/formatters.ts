import { InterestType } from '@/types/product';

/**
 * Formats a number as South African Rand currency.
 * @example formatCurrency(1234.56) → "R 1,234.56"
 * @example formatCurrency(1234.56, false) → "R 1,234"
 */
export function formatCurrency(amount: number, showCents = true): string {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  };
  const formatted = new Intl.NumberFormat('en-ZA', options).format(amount);
  return `R ${formatted}`;
}

/**
 * Formats a decimal or percentage value as a percentage string.
 * @example formatPercentage(10.25) → "10.25%"
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats a number with thousands separators.
 * @example formatNumber(1234567.89, 2) → "1,234,567.89"
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a large currency amount compactly.
 * @example formatCompactCurrency(1200000) → "R 1.2M"
 * @example formatCompactCurrency(45000) → "R 45K"
 */
export function formatCompactCurrency(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000) {
    return `R ${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `R ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `R ${(amount / 1_000).toFixed(1)}K`;
  }
  return formatCurrency(amount, false);
}

/**
 * Parses a currency string into a number.
 * @example parseCurrency("R 1,234.56") → 1234.56
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/R\s?/g, '').replace(/,/g, '').trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formats a number of months into a human-readable string.
 * @example formatMonths(12) → "1 year"
 * @example formatMonths(15) → "1 year 3 months"
 * @example formatMonths(3) → "3 months"
 */
export function formatMonths(months: number): string {
  if (months <= 0) return '0 months';
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (remainingMonths > 0)
    parts.push(`${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`);

  return parts.join(' ');
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Formats a date as "15 March 2026".
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Formats a date as a relative string like "3 days ago" or "just now".
 */
export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';

  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
}

const RATE_TYPE_LABELS: Record<string, string> = {
  [InterestType.NOMINAL]: 'Nominal Rate',
  [InterestType.EFFECTIVE]: 'Effective Annual Rate',
  [InterestType.PRIME_LINKED]: 'Prime-Linked Rate',
  [InterestType.FIXED]: 'Fixed Rate',
  [InterestType.VARIABLE]: 'Variable Rate',
};

/**
 * Returns a human-readable label for an interest rate type.
 */
export function formatRateType(type: string): string {
  return RATE_TYPE_LABELS[type] ?? type;
}
