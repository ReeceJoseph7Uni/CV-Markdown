import { db } from '../lib/db';
import { withCache, buildCacheKey } from '../middleware/cache';
import { handleError, AppError } from '../middleware/errorHandler';
import { filterProducts } from '../comparison/filters';
import { scoreProduct, rankProducts } from '../comparison/scoring';
import type {
  IApiResponse,
  IProduct,
  IComparisonFilter,
  UserProfile,
} from '../types';

const PRODUCTS_TTL = 300; // 5 minutes

// ----------------------------------------------------------------
// GET /api/products
// ----------------------------------------------------------------
export async function listProducts(
  filter: IComparisonFilter = {},
): Promise<IApiResponse<IProduct[]>> {
  const cacheKey = buildCacheKey('/api/products', filter as Record<string, unknown>);

  return withCache(cacheKey, PRODUCTS_TTL, async () => {
    try {
      const raw = await db.product.findMany({
        where: {
          isActive:    true,
          ...(filter.productType   ? { productType:   filter.productType   } : {}),
          ...(filter.institution   ? { institution:   { contains: filter.institution, mode: 'insensitive' } } : {}),
          ...(filter.accessType    ? { accessType:    filter.accessType    } : {}),
          ...(filter.tfsaOnly      ? { taxStatus:     'TAX_FREE'           } : {}),
          ...(filter.maxMonthlyFee !== undefined ? { monthlyFee: { lte: filter.maxMonthlyFee } } : {}),
        },
        include: { rates: true },
        orderBy: { institution: 'asc' },
      });

      const products = raw as unknown as IProduct[];
      const filtered = filterProducts(products, filter);

      return {
        success: true,
        data:    filtered,
        meta:    { total: filtered.length, timestamp: new Date().toISOString() },
      };
    } catch (err) {
      return handleError(err) as IApiResponse<IProduct[]>;
    }
  });
}

// ----------------------------------------------------------------
// GET /api/products/:id
// ----------------------------------------------------------------
export async function getProduct(id: string): Promise<IApiResponse<IProduct>> {
  const cacheKey = buildCacheKey(`/api/products/${id}`);

  return withCache(cacheKey, PRODUCTS_TTL, async () => {
    try {
      const product = await db.product.findUnique({
        where:   { id },
        include: { rates: true, comparisonScores: true },
      });

      if (!product) throw new AppError('Product not found', 404, 'NOT_FOUND');

      return {
        success: true,
        data:    product as unknown as IProduct,
        meta:    { timestamp: new Date().toISOString() },
      };
    } catch (err) {
      return handleError(err) as IApiResponse<IProduct>;
    }
  });
}

// ----------------------------------------------------------------
// POST /api/products/compare
// ----------------------------------------------------------------
export async function compareProducts(
  productIds: string[],
  profile: UserProfile,
): Promise<IApiResponse<ReturnType<typeof scoreProduct>[]>> {
  try {
    if (!productIds || productIds.length === 0) {
      throw new AppError('At least one product ID is required', 400, 'VALIDATION_ERROR');
    }

    const products = await db.product.findMany({
      where:   { id: { in: productIds }, isActive: true },
      include: { rates: true },
    });

    const typedProducts  = products as unknown as IProduct[];
    const ratesMap       = typedProducts.map(p => p.rates ?? []);
    const scores         = rankProducts(typedProducts, ratesMap, profile);

    return {
      success: true,
      data:    scores,
      meta:    { total: scores.length, timestamp: new Date().toISOString() },
    };
  } catch (err) {
    return handleError(err) as IApiResponse<ReturnType<typeof scoreProduct>[]>;
  }
}

// ----------------------------------------------------------------
// GET /api/products/top
// ----------------------------------------------------------------
export async function getTopProducts(
  profile: UserProfile,
  limit = 10,
): Promise<IApiResponse<ReturnType<typeof scoreProduct>[]>> {
  const cacheKey = buildCacheKey('/api/products/top', { profile, limit });

  return withCache(cacheKey, PRODUCTS_TTL, async () => {
    try {
      const products = await db.product.findMany({
        where:   { isActive: true },
        include: { rates: true },
      });

      const typedProducts = products as unknown as IProduct[];
      const ratesMap      = typedProducts.map(p => p.rates ?? []);
      const scores        = rankProducts(typedProducts, ratesMap, profile).slice(0, limit);

      return {
        success: true,
        data:    scores,
        meta:    { total: scores.length, timestamp: new Date().toISOString() },
      };
    } catch (err) {
      return handleError(err) as IApiResponse<ReturnType<typeof scoreProduct>[]>;
    }
  });
}

// ----------------------------------------------------------------
// POST /api/admin/products
// ----------------------------------------------------------------
export async function createProduct(
  data: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt' | 'rates' | 'comparisonScores'>,
): Promise<IApiResponse<IProduct>> {
  try {
    const product = await db.product.create({
      data: data as Parameters<typeof db.product.create>[0]['data'],
    });

    return {
      success: true,
      data:    product as unknown as IProduct,
      meta:    { timestamp: new Date().toISOString() },
    };
  } catch (err) {
    return handleError(err) as IApiResponse<IProduct>;
  }
}

// ----------------------------------------------------------------
// PUT /api/admin/products/:id
// ----------------------------------------------------------------
export async function updateProduct(
  id: string,
  data: Partial<Omit<IProduct, 'id' | 'createdAt' | 'updatedAt' | 'rates' | 'comparisonScores'>>,
): Promise<IApiResponse<IProduct>> {
  try {
    const product = await db.product.update({
      where: { id },
      data:  data as Parameters<typeof db.product.update>[0]['data'],
    });

    return {
      success: true,
      data:    product as unknown as IProduct,
      meta:    { timestamp: new Date().toISOString() },
    };
  } catch (err) {
    return handleError(err) as IApiResponse<IProduct>;
  }
}
