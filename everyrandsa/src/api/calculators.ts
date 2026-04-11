import { handleError } from '../middleware/errorHandler';
import {
  calculatePAYE,
  calculateLoan,
  calculateBond,
  calculateSavings,
  calculateTFSA,
  calculateInterest,
  calculateDebt,
} from '../calculators';
import type {
  IApiResponse,
  IPAYEInput,   IPAYEResult,
  ILoanInput,   ILoanResult,
  IBondInput,   IBondResult,
  ISavingsInput, ISavingsResult,
  ITFSAInput,   ITFSAResult,
  IInterestInput, IInterestResult,
  IDebtInput,   IDebtResult,
} from '../types';

function ok<T>(data: T): IApiResponse<T> {
  return { success: true, data, meta: { timestamp: new Date().toISOString() } };
}

// POST /api/calculators/paye
export async function handlePAYE(body: unknown): Promise<IApiResponse<IPAYEResult>> {
  try {
    validateRequired(body, ['grossSalary', 'age']);
    const result = calculatePAYE(body as IPAYEInput);
    return ok(result);
  } catch (err) {
    return handleError(err) as IApiResponse<IPAYEResult>;
  }
}

// POST /api/calculators/loan
export async function handleLoan(body: unknown): Promise<IApiResponse<ILoanResult>> {
  try {
    validateRequired(body, ['principal', 'termMonths', 'annualRate']);
    const result = calculateLoan(body as ILoanInput);
    return ok(result);
  } catch (err) {
    return handleError(err) as IApiResponse<ILoanResult>;
  }
}

// POST /api/calculators/bond
export async function handleBond(body: unknown): Promise<IApiResponse<IBondResult>> {
  try {
    validateRequired(body, ['propertyPrice', 'deposit', 'termYears', 'annualRate']);
    const result = calculateBond(body as IBondInput);
    return ok(result);
  } catch (err) {
    return handleError(err) as IApiResponse<IBondResult>;
  }
}

// POST /api/calculators/savings
export async function handleSavings(body: unknown): Promise<IApiResponse<ISavingsResult>> {
  try {
    validateRequired(body, ['principal', 'annualRate', 'termYears']);
    const result = calculateSavings(body as ISavingsInput);
    return ok(result);
  } catch (err) {
    return handleError(err) as IApiResponse<ISavingsResult>;
  }
}

// POST /api/calculators/tfsa
export async function handleTFSA(body: unknown): Promise<IApiResponse<ITFSAResult>> {
  try {
    validateRequired(body, ['annualContribution']);
    const result = calculateTFSA(body as ITFSAInput);
    return ok(result);
  } catch (err) {
    return handleError(err) as IApiResponse<ITFSAResult>;
  }
}

// POST /api/calculators/interest
export async function handleInterest(body: unknown): Promise<IApiResponse<IInterestResult>> {
  try {
    validateRequired(body, ['principal', 'annualRate', 'termYears']);
    const result = calculateInterest(body as IInterestInput);
    return ok(result);
  } catch (err) {
    return handleError(err) as IApiResponse<IInterestResult>;
  }
}

// POST /api/calculators/debt
export async function handleDebt(body: unknown): Promise<IApiResponse<IDebtResult>> {
  try {
    validateRequired(body, ['debts']);
    const result = calculateDebt(body as IDebtInput);
    return ok(result);
  } catch (err) {
    return handleError(err) as IApiResponse<IDebtResult>;
  }
}

// ----------------------------------------------------------------
// Input validation helper
// ----------------------------------------------------------------
function validateRequired(body: unknown, fields: string[]): void {
  if (typeof body !== 'object' || body === null) {
    throw new Error('Request body must be a JSON object');
  }
  const obj = body as Record<string, unknown>;
  for (const field of fields) {
    if (obj[field] === undefined || obj[field] === null) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}
