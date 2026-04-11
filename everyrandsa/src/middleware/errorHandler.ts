import type { IApiError, IApiResponse } from '../types';

export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code       = code;
    this.name       = 'AppError';
  }
}

/** Map Prisma error codes to HTTP-friendly errors. */
function prismaErrorToApiError(err: unknown): IApiError | null {
  if (typeof err !== 'object' || err === null) return null;
  const e = err as { code?: string; message?: string };
  if (!e.code) return null;

  switch (e.code) {
    case 'P2025':
      return { code: 'NOT_FOUND', message: 'Resource not found', statusCode: 404 };
    case 'P2002':
      return { code: 'CONFLICT', message: 'A record with this value already exists', statusCode: 409 };
    case 'P2003':
      return { code: 'FOREIGN_KEY_VIOLATION', message: 'Related record not found', statusCode: 400 };
    case 'P2000':
      return { code: 'VALUE_TOO_LONG', message: 'Provided value exceeds maximum length', statusCode: 400 };
    default:
      return null;
  }
}

export function handleError(err: unknown): IApiResponse<never> {
  console.error('[EveryRandSA]', err);

  // Known application error
  if (err instanceof AppError) {
    return {
      success: false,
      error: {
        code:       err.code,
        message:    err.message,
        statusCode: err.statusCode,
      },
      meta: { timestamp: new Date().toISOString() },
    };
  }

  // Prisma error
  const prismaError = prismaErrorToApiError(err);
  if (prismaError) {
    return {
      success: false,
      error:   prismaError,
      meta:    { timestamp: new Date().toISOString() },
    };
  }

  // Validation errors (e.g. from calculators)
  if (err instanceof Error && err.message) {
    return {
      success: false,
      error: {
        code:       'VALIDATION_ERROR',
        message:    err.message,
        statusCode: 400,
      },
      meta: { timestamp: new Date().toISOString() },
    };
  }

  // Unknown error
  return {
    success: false,
    error: {
      code:       'INTERNAL_ERROR',
      message:    'An unexpected error occurred',
      statusCode: 500,
    },
    meta: { timestamp: new Date().toISOString() },
  };
}
