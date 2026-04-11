// Simple sliding-window in-memory rate limiter (per IP address)

interface WindowEntry {
  count: number;
  windowStart: number;
}

const MAX_REQUESTS  = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? '100', 10);
const WINDOW_MS     = parseInt(process.env.RATE_LIMIT_WINDOW_MS    ?? '900000', 10); // 15 min

const store = new Map<string, WindowEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now   = Date.now();
  const entry = store.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // New window
    store.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: now + WINDOW_MS };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed:   false,
      remaining: 0,
      resetAt:   entry.windowStart + WINDOW_MS,
    };
  }

  entry.count++;
  return {
    allowed:   true,
    remaining: MAX_REQUESTS - entry.count,
    resetAt:   entry.windowStart + WINDOW_MS,
  };
}

/** Periodically clear expired entries to prevent memory leaks. */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > WINDOW_MS) store.delete(key);
  }
}, WINDOW_MS);
