/**
 * In-Memory Rate Limiting
 *
 * Simple sliding window rate limiter for API endpoints.
 * Uses in-memory storage - suitable for single-instance deployments.
 * For multi-instance deployments, consider using Redis (e.g., Upstash).
 *
 * Tiers:
 * - global: 100 requests per minute per IP (for unauthenticated requests)
 * - user: 50 requests per minute per user (for authenticated requests)
 * - sensitive: 10 requests per minute (for operations like credit deduction)
 */

export type RateLimitTier = 'global' | 'user' | 'sensitive';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Rate limit configurations by tier
const RATE_LIMIT_CONFIG: Record<RateLimitTier, RateLimitConfig> = {
  global: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  user: {
    maxRequests: 50,
    windowMs: 60 * 1000, // 1 minute
  },
  sensitive: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
};

// In-memory store for rate limit entries
// Key format: `${tier}:${identifier}`
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval to prevent memory leaks (run every 5 minutes)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Cleans up expired entries from the store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Starts the cleanup interval if not already running
 */
function ensureCleanupInterval(): void {
  if (cleanupInterval === null) {
    cleanupInterval = setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL_MS);
    // Prevent the interval from keeping the process alive
    if (cleanupInterval.unref) {
      cleanupInterval.unref();
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // Unix timestamp in seconds when the limit resets
  limit: number;
}

/**
 * Checks and updates rate limit for an identifier
 *
 * @param identifier - Unique identifier (IP address or user ID)
 * @param tier - Rate limit tier to apply
 * @returns Rate limit result with success status and metadata
 *
 * @example
 * // For IP-based rate limiting
 * const result = await checkRateLimit(clientIP, 'global');
 *
 * // For user-based rate limiting
 * const result = await checkRateLimit(userId, 'user');
 *
 * // For sensitive operations
 * const result = await checkRateLimit(userId, 'sensitive');
 */
export async function checkRateLimit(
  identifier: string,
  tier: RateLimitTier
): Promise<RateLimitResult> {
  ensureCleanupInterval();

  const config = RATE_LIMIT_CONFIG[tier];
  const key = `${tier}:${identifier}`;
  const now = Date.now();

  let entry = rateLimitStore.get(key);

  // If no entry or entry has expired, create a new one
  if (!entry || entry.resetAt <= now) {
    entry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);

    return {
      success: true,
      remaining: config.maxRequests - 1,
      reset: Math.ceil(entry.resetAt / 1000),
      limit: config.maxRequests,
    };
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      reset: Math.ceil(entry.resetAt / 1000),
      limit: config.maxRequests,
    };
  }

  // Increment counter
  entry.count += 1;
  rateLimitStore.set(key, entry);

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    reset: Math.ceil(entry.resetAt / 1000),
    limit: config.maxRequests,
  };
}

/**
 * Gets the client IP from a Next.js request
 * Handles various proxy headers in order of trust
 *
 * @param request - Next.js Request object
 * @returns Client IP address or 'unknown' if not found
 */
export function getClientIP(request: Request): string {
  // Check headers in order of typical proxy chain
  const headers = request.headers;

  // X-Forwarded-For is the standard header
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP (original client) from the chain
    const firstIP = forwardedFor.split(',')[0].trim();
    if (firstIP) return firstIP;
  }

  // X-Real-IP is used by some proxies (e.g., Nginx)
  const realIP = headers.get('x-real-ip');
  if (realIP) return realIP;

  // CF-Connecting-IP for Cloudflare
  const cfIP = headers.get('cf-connecting-ip');
  if (cfIP) return cfIP;

  // Vercel-specific header
  const vercelIP = headers.get('x-vercel-forwarded-for');
  if (vercelIP) {
    const firstIP = vercelIP.split(',')[0].trim();
    if (firstIP) return firstIP;
  }

  return 'unknown';
}

/**
 * Creates a 429 Too Many Requests response with proper headers
 *
 * @param result - Rate limit result from checkRateLimit
 * @param locale - Locale for error message (defaults to 'en')
 * @returns Response object with 429 status
 */
export function createRateLimitResponse(
  result: RateLimitResult,
  locale: string = 'en'
): Response {
  const retryAfter = Math.max(0, result.reset - Math.floor(Date.now() / 1000));

  const message =
    locale === 'zh-CN'
      ? `请求过于频繁，请在 ${retryAfter} 秒后重试`
      : `Too many requests, please retry after ${retryAfter} seconds`;

  return new Response(
    JSON.stringify({
      success: false,
      error: 'RATE_LIMITED',
      message,
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.reset),
      },
    }
  );
}

/**
 * Adds rate limit headers to an existing response
 *
 * @param response - The response to add headers to
 * @param result - Rate limit result from checkRateLimit
 * @returns New Response with rate limit headers
 */
export function addRateLimitHeaders(
  response: Response,
  result: RateLimitResult
): Response {
  const newHeaders = new Headers(response.headers);
  newHeaders.set('X-RateLimit-Limit', String(result.limit));
  newHeaders.set('X-RateLimit-Remaining', String(result.remaining));
  newHeaders.set('X-RateLimit-Reset', String(result.reset));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

// Export config for testing
export const RATE_LIMIT_TIERS = RATE_LIMIT_CONFIG;
