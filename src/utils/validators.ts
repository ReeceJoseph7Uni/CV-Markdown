// South African TFSA limits (2025/2026)
const TFSA_ANNUAL_LIMIT = 46_000;
const TFSA_LIFETIME_LIMIT = 500_000;

// Reasonable bounds
const MAX_REASONABLE_INCOME = 100_000_000;
const MAX_REASONABLE_LOAN = 50_000_000;

/**
 * Returns an error message if the value is empty/null/undefined, otherwise null.
 */
export function validateRequired(value: unknown, fieldName: string): string | null {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required.`;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return `${fieldName} is required.`;
  }
  return null;
}

/**
 * Validates that a number is positive and within optional min/max bounds.
 */
export function validatePositiveNumber(
  value: number,
  fieldName: string,
  min?: number,
  max?: number,
): string | null {
  if (!isFinite(value) || isNaN(value)) {
    return `${fieldName} must be a valid number.`;
  }
  const effectiveMin = min ?? 0;
  if (value < effectiveMin) {
    return `${fieldName} must be at least ${effectiveMin}.`;
  }
  if (max !== undefined && value > max) {
    return `${fieldName} must be no more than ${max}.`;
  }
  return null;
}

/**
 * Validates that a value is a valid percentage (0–100).
 */
export function validatePercentage(value: number, fieldName: string): string | null {
  if (!isFinite(value) || isNaN(value)) {
    return `${fieldName} must be a valid number.`;
  }
  if (value < 0 || value > 100) {
    return `${fieldName} must be between 0% and 100%.`;
  }
  return null;
}

/**
 * Validates a gross or net income value for South African context.
 */
export function validateIncome(value: number): string | null {
  if (!isFinite(value) || isNaN(value)) {
    return 'Income must be a valid number.';
  }
  if (value <= 0) {
    return 'Income must be greater than R 0.';
  }
  if (value > MAX_REASONABLE_INCOME) {
    return `Income seems unreasonably high. Please check your entry.`;
  }
  return null;
}

/**
 * Validates a loan/bond amount.
 */
export function validateLoanAmount(value: number): string | null {
  if (!isFinite(value) || isNaN(value)) {
    return 'Loan amount must be a valid number.';
  }
  if (value <= 0) {
    return 'Loan amount must be greater than R 0.';
  }
  if (value > MAX_REASONABLE_LOAN) {
    return `Loan amount exceeds the maximum supported value of R ${MAX_REASONABLE_LOAN.toLocaleString('en-ZA')}.`;
  }
  return null;
}

/**
 * Validates a loan or savings term.
 */
export function validateTerm(value: number, unit: 'years' | 'months'): string | null {
  if (!isFinite(value) || isNaN(value) || !Number.isInteger(value)) {
    return `Term must be a whole number of ${unit}.`;
  }
  if (value <= 0) {
    return `Term must be at least 1 ${unit === 'years' ? 'year' : 'month'}.`;
  }
  const maxYears = 50;
  const maxMonths = maxYears * 12;
  const limitLabel = `${maxYears} years`;

  if (unit === 'years' && value > maxYears) {
    return `Term cannot exceed ${limitLabel}.`;
  }
  if (unit === 'months' && value > maxMonths) {
    return `Term cannot exceed ${maxMonths} months (${limitLabel}).`;
  }
  return null;
}

/**
 * Validates TFSA contributions against SARS annual and lifetime limits.
 */
export function validateTFSAContribution(
  currentYearContributions: number,
  lifetimeContributions: number,
  annualLimit = TFSA_ANNUAL_LIMIT,
  lifetimeLimit = TFSA_LIFETIME_LIMIT,
): string | null {
  if (currentYearContributions < 0) {
    return 'Annual contribution cannot be negative.';
  }
  if (lifetimeContributions < 0) {
    return 'Lifetime contribution cannot be negative.';
  }
  if (currentYearContributions > annualLimit) {
    return `Annual TFSA contribution cannot exceed R ${annualLimit.toLocaleString('en-ZA')}. Excess contributions are subject to a 40% penalty tax.`;
  }
  if (lifetimeContributions > lifetimeLimit) {
    return `Lifetime TFSA contributions cannot exceed R ${lifetimeLimit.toLocaleString('en-ZA')}. Excess contributions are subject to a 40% penalty tax.`;
  }
  return null;
}

type FieldValidator = (value: unknown) => string | null;

const CALCULATOR_VALIDATORS: Record<string, Record<string, FieldValidator>> = {
  PAYE: {
    grossIncome: (v) => validateIncome(Number(v)),
    age: (v) => (v !== undefined && v !== '' ? validatePositiveNumber(Number(v), 'Age', 0, 120) : null),
  },
  LOAN_REPAYMENT: {
    principal: (v) => validateLoanAmount(Number(v)),
    annualRate: (v) => validatePercentage(Number(v), 'Interest rate'),
    termMonths: (v) => validateTerm(Number(v), 'months'),
  },
  BOND: {
    purchasePrice: (v) => validateLoanAmount(Number(v)),
    deposit: (v) => validatePositiveNumber(Number(v), 'Deposit', 0),
    annualRate: (v) => validatePercentage(Number(v), 'Interest rate'),
    termYears: (v) => validateTerm(Number(v), 'years'),
  },
  SAVINGS_GROWTH: {
    principal: (v) => validatePositiveNumber(Number(v), 'Initial deposit', 0),
    monthlyDeposit: (v) => validatePositiveNumber(Number(v), 'Monthly deposit', 0),
    annualRate: (v) => validatePercentage(Number(v), 'Interest rate'),
    years: (v) => validateTerm(Number(v), 'years'),
  },
  TFSA: {
    currentContributions: (v) => validatePositiveNumber(Number(v), 'Current year contributions', 0),
    lifetimeContributions: (v) => validatePositiveNumber(Number(v), 'Lifetime contributions', 0),
  },
  INTEREST: {
    principal: (v) => validatePositiveNumber(Number(v), 'Principal', 0.01),
    rate: (v) => validatePercentage(Number(v), 'Interest rate'),
    periods: (v) => validatePositiveNumber(Number(v), 'Periods', 1),
  },
  NET_TO_GROSS: {
    netSalary: (v) => validateIncome(Number(v)),
  },
};

/**
 * Validates all inputs for a given calculator type and returns a map of field → error message.
 */
export function validateCalculatorInputs(
  inputs: Record<string, unknown>,
  type: string,
): Record<string, string> {
  const errors: Record<string, string> = {};
  const validators = CALCULATOR_VALIDATORS[type];

  if (!validators) return errors;

  for (const [field, validator] of Object.entries(validators)) {
    const error = validator(inputs[field]);
    if (error) {
      errors[field] = error;
    }
  }

  // Cross-field validation
  if (type === 'BOND') {
    const price = Number(inputs.purchasePrice);
    const deposit = Number(inputs.deposit);
    if (!errors.purchasePrice && !errors.deposit && deposit >= price) {
      errors.deposit = 'Deposit cannot be equal to or greater than the purchase price.';
    }
  }

  if (type === 'TFSA') {
    const annual = Number(inputs.currentContributions);
    const lifetime = Number(inputs.lifetimeContributions);
    const tfError = validateTFSAContribution(annual, lifetime);
    if (tfError) {
      errors.currentContributions = tfError;
    }
  }

  return errors;
}
