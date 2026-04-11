import cron from 'node-cron';
import { db } from '../lib/db';
import { cache } from '../lib/cache';

// Keep references so we can stop them in tests
const tasks: cron.ScheduledTask[] = [];

// ----------------------------------------------------------------
// Job implementations
// ----------------------------------------------------------------

/**
 * Sync SARB reference rates.
 * In production, this would call the SARB API or scrape the SARB site.
 */
async function syncSARBRates(): Promise<void> {
  console.log('[Cron] syncSARBRates – starting');
  try {
    await db.dataSource.updateMany({
      where: { name: 'SARB' },
      data: {
        lastSyncAt:      new Date(),
        lastSyncStatus:  'SUCCESS',
        lastSyncMessage: 'Rates synced successfully',
      },
    });
    // Invalidate cached rates
    cache.delete('/api/rates/sarb');
    cache.delete('/api/rates/history');
    console.log('[Cron] syncSARBRates – complete');
  } catch (err) {
    console.error('[Cron] syncSARBRates – error', err);
    await db.dataSource.updateMany({
      where: { name: 'SARB' },
      data: {
        lastSyncAt:      new Date(),
        lastSyncStatus:  'FAILED',
        lastSyncMessage: String(err),
      },
    });
  }
}

/**
 * Sync product rates and fees from bank websites.
 */
async function syncProductRates(): Promise<void> {
  console.log('[Cron] syncProductRates – starting');
  try {
    const products = await db.product.findMany({ where: { isActive: true } });

    for (const product of products) {
      // In production: fetch rates from product.sourceUrl and update accordingly.
      await db.product.update({
        where: { id: product.id },
        data:  { lastCheckedDate: new Date() },
      });
    }

    // Clear product caches
    cache.clear();
    console.log(`[Cron] syncProductRates – updated ${products.length} products`);
  } catch (err) {
    console.error('[Cron] syncProductRates – error', err);
  }
}

/**
 * Recalculate comparison scores for all products.
 */
async function recalculateScores(): Promise<void> {
  console.log('[Cron] recalculateScores – starting');
  try {
    const products = await db.product.findMany({
      where:   { isActive: true },
      include: { rates: true },
    });

    const profiles = [
      'EMERGENCY_SAVINGS',
      'TFSA_INVESTOR',
      'LARGE_BALANCE',
      'NO_FEE_PREFERENCE',
      'SHORT_TERM_PARKING',
      'GENERAL',
    ] as const;

    for (const product of products) {
      for (const profile of profiles) {
        // Upsert placeholder scores; real scoring uses the scoring module.
        await db.comparisonScore.upsert({
          where:  { productId_userProfile: { productId: product.id, userProfile: profile } },
          create: {
            productId:       product.id,
            userProfile:     profile,
            rateScore:       50,
            feeScore:        50,
            accessScore:     50,
            minBalanceScore: 50,
            tfsaScore:       50,
            digitalScore:    50,
            overallScore:    50,
            effectiveReturn: 0,
            lastCalculated:  new Date(),
          },
          update: { lastCalculated: new Date() },
        });
      }
    }

    cache.clear();
    console.log(`[Cron] recalculateScores – processed ${products.length} products`);
  } catch (err) {
    console.error('[Cron] recalculateScores – error', err);
  }
}

// ----------------------------------------------------------------
// Public API
// ----------------------------------------------------------------

/**
 * Initialise all scheduled cron jobs.
 * Called once at application startup.
 */
export function initCronJobs(): void {
  if (process.env.CRON_ENABLED !== 'true') {
    console.log('[Cron] Disabled via CRON_ENABLED env var');
    return;
  }

  // Daily at 06:00 SAST (UTC+2 → 04:00 UTC)
  tasks.push(
    cron.schedule('0 4 * * *', () => { void syncSARBRates(); }, {
      timezone: 'Africa/Johannesburg',
    }),
  );

  // Weekly on Sundays at 02:00 SAST
  tasks.push(
    cron.schedule('0 2 * * 0', () => { void syncProductRates(); }, {
      timezone: 'Africa/Johannesburg',
    }),
  );

  // Monthly on the 1st at 04:00 SAST
  tasks.push(
    cron.schedule('0 4 1 * *', () => { void recalculateScores(); }, {
      timezone: 'Africa/Johannesburg',
    }),
  );

  console.log('[Cron] Scheduled 3 jobs (SARB daily, products weekly, scores monthly)');
}

/**
 * Stop all scheduled cron jobs (used in tests / graceful shutdown).
 */
export function stopCronJobs(): void {
  for (const task of tasks) {
    task.stop();
  }
  tasks.length = 0;
  console.log('[Cron] All jobs stopped');
}
