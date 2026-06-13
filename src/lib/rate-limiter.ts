/**
 * In-memory rate limiter for API routes.
 * Limits requests to MAX_REQUESTS per WINDOW_MS per session.
 * @module lib/rate-limiter
 */

import { RATE_LIMIT } from '@/utils/constants';

/** Rate limit tracking entry */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/** Rate limit check result */
export interface RateLimitResult {
  /** Whether the request is allowed */
  readonly allowed: boolean;
  /** Remaining requests in the current window */
  readonly remaining: number;
  /** Seconds until the rate limit resets */
  readonly resetIn: number;
}

/** In-memory store for rate limit tracking */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Checks if a request from a given session is within rate limits.
 * Uses an in-memory sliding window approach.
 *
 * @param sessionId - Unique identifier for the session (IP or generated ID)
 * @returns RateLimitResult indicating whether the request is allowed
 *
 * @example
 * ```ts
 * const result = checkRateLimit('session-123');
 * if (!result.allowed) {
 *   return new Response('Too many requests', { status: 429 });
 * }
 * ```
 */
export function checkRateLimit(sessionId: string): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(sessionId);

  // No existing entry or window expired — create new window
  if (!entry || now >= entry.resetTime) {
    rateLimitStore.set(sessionId, {
      count: 1,
      resetTime: now + RATE_LIMIT.WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: RATE_LIMIT.MAX_REQUESTS - 1,
      resetIn: Math.ceil(RATE_LIMIT.WINDOW_MS / 1000),
    };
  }

  // Within window — check count
  if (entry.count >= RATE_LIMIT.MAX_REQUESTS) {
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetIn,
    };
  }

  // Within window and under limit — increment
  entry.count++;
  const resetIn = Math.ceil((entry.resetTime - now) / 1000);
  return {
    allowed: true,
    remaining: RATE_LIMIT.MAX_REQUESTS - entry.count,
    resetIn,
  };
}

/**
 * Creates rate limit headers for the API response.
 * @param result - Rate limit check result
 * @returns Headers object with rate limit information
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(RATE_LIMIT.MAX_REQUESTS),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.resetIn),
  };
}

/**
 * Extracts a session identifier from the request.
 * Falls back to a default if no identifying header is found.
 * @param request - The incoming Request object
 * @returns A string identifier for rate limiting
 */
export function getSessionId(request: Request): string {
  return (
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'default-session'
  );
}
