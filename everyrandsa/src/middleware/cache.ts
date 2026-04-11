import { cache } from '../lib/cache';
import type { IApiResponse } from '../types';

const DEFAULT_TTL = parseInt(process.env.CACHE_TTL_SECONDS ?? '300', 10);

/**
 * Wraps an async handler with a cache layer.
 * The cache key is derived from the URL + sorted query-string parameters.
 *
 * Usage:
 *   const result = await withCache(cacheKey, ttl, async () => handler());
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number = DEFAULT_TTL,
  fetcher: () => Promise<IApiResponse<T>>,
): Promise<IApiResponse<T>> {
  const cached = cache.get<IApiResponse<T>>(key);
  if (cached) return cached;

  const result = await fetcher();
  if (result.success) {
    cache.set(key, result, ttlSeconds);
  }
  return result;
}

/**
 * Build a deterministic cache key from a path and query parameters.
 */
export function buildCacheKey(path: string, params: Record<string, unknown> = {}): string {
  const sortedParams = Object.keys(params)
    .sort()
    .filter(k => params[k] !== undefined && params[k] !== null)
    .map(k => `${k}=${String(params[k])}`)
    .join('&');
  return sortedParams ? `${path}?${sortedParams}` : path;
}
