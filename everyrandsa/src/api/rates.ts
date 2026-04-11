import { db } from '../lib/db';
import { withCache, buildCacheKey } from '../middleware/cache';
import { handleError, AppError } from '../middleware/errorHandler';
import type { IApiResponse, IDataSource } from '../types';

// ----------------------------------------------------------------
// Current SARB reference rates (updated daily by cron)
// ----------------------------------------------------------------
const SARB_RATES = {
  repoRate:  0.0675,   // 6.75%
  primeRate: 0.1025,   // 10.25%
  asOf:      '2026-02-01',
};

const TFSA_LIMITS = {
  annualLimit:  46_000,
  lifetimeCap:  500_000,
  effectiveDate: '2026-03-01',
  taxYear:       '2026',
};

// ----------------------------------------------------------------
// GET /api/rates/sarb
// ----------------------------------------------------------------
export async function getSARBRates(): Promise<IApiResponse<typeof SARB_RATES>> {
  const cacheKey = buildCacheKey('/api/rates/sarb');

  return withCache(cacheKey, 3600, async () => {
    // In production this would fetch from SARB; return static values for now.
    return {
      success: true,
      data:    SARB_RATES,
      meta:    { timestamp: new Date().toISOString() },
    };
  });
}

// ----------------------------------------------------------------
// GET /api/rates/tfsa-limits
// ----------------------------------------------------------------
export async function getTFSALimits(): Promise<IApiResponse<typeof TFSA_LIMITS>> {
  return {
    success: true,
    data:    TFSA_LIMITS,
    meta:    { timestamp: new Date().toISOString() },
  };
}

// ----------------------------------------------------------------
// GET /api/rates/history
// ----------------------------------------------------------------
interface RateHistoryEntry {
  date:      string;
  repoRate:  number;
  primeRate: number;
}

const RATE_HISTORY: RateHistoryEntry[] = [
  { date: '2024-03-27', repoRate: 0.0825, primeRate: 0.1075 },
  { date: '2024-09-19', repoRate: 0.0800, primeRate: 0.1050 },
  { date: '2024-11-21', repoRate: 0.0775, primeRate: 0.1025 },
  { date: '2025-01-30', repoRate: 0.0750, primeRate: 0.1000 },
  { date: '2025-03-20', repoRate: 0.0725, primeRate: 0.0975 },
  { date: '2025-05-29', repoRate: 0.0700, primeRate: 0.0950 },
  { date: '2025-09-18', repoRate: 0.0675, primeRate: 0.0925 },
  { date: '2026-01-30', repoRate: 0.0675, primeRate: 0.1025 },
];

export async function getRateHistory(): Promise<IApiResponse<RateHistoryEntry[]>> {
  const cacheKey = buildCacheKey('/api/rates/history');

  return withCache(cacheKey, 86_400, async () => ({
    success: true,
    data:    RATE_HISTORY,
    meta:    { total: RATE_HISTORY.length, timestamp: new Date().toISOString() },
  }));
}

// ----------------------------------------------------------------
// GET /api/data-sources
// ----------------------------------------------------------------
export async function getDataSources(): Promise<IApiResponse<IDataSource[]>> {
  const cacheKey = buildCacheKey('/api/data-sources');

  return withCache(cacheKey, 300, async () => {
    try {
      const sources = await db.dataSource.findMany({
        where:   { isActive: true },
        orderBy: { name: 'asc' },
      });

      return {
        success: true,
        data:    sources as unknown as IDataSource[],
        meta:    { total: sources.length, timestamp: new Date().toISOString() },
      };
    } catch (err) {
      return handleError(err) as IApiResponse<IDataSource[]>;
    }
  });
}

// ----------------------------------------------------------------
// POST /api/admin/data-sources/refresh
// ----------------------------------------------------------------
export async function triggerRefresh(
  sourceId: string,
): Promise<IApiResponse<{ queued: boolean; sourceId: string }>> {
  try {
    const source = await db.dataSource.findUnique({ where: { id: sourceId } });
    if (!source) throw new AppError('Data source not found', 404, 'NOT_FOUND');

    await db.dataSource.update({
      where: { id: sourceId },
      data:  { lastSyncStatus: 'QUEUED', lastSyncMessage: 'Manual refresh triggered' },
    });

    return {
      success: true,
      data:    { queued: true, sourceId },
      meta:    { timestamp: new Date().toISOString() },
    };
  } catch (err) {
    return handleError(err) as IApiResponse<{ queued: boolean; sourceId: string }>;
  }
}
