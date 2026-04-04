import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
}

// ---------------------------------------------------------------------------
// In-memory sliding window store (replaces Redis sorted sets)
// ---------------------------------------------------------------------------

const windows = new Map<string, number[]>();

// ---------------------------------------------------------------------------
// Pre-defined rate limit configurations per route group
// ---------------------------------------------------------------------------

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  auth: { maxRequests: 10, windowSeconds: 900, keyPrefix: 'rl:auth' },
  inpi: { maxRequests: 30, windowSeconds: 60, keyPrefix: 'rl:inpi' },
  analytics: { maxRequests: 100, windowSeconds: 60, keyPrefix: 'rl:analytics' },
  report: { maxRequests: 5, windowSeconds: 900, keyPrefix: 'rl:report' },
  authenticated: { maxRequests: 60, windowSeconds: 60, keyPrefix: 'rl:auth-general' },
  public: { maxRequests: 30, windowSeconds: 60, keyPrefix: 'rl:public' },
};

// ---------------------------------------------------------------------------
// Rate limit middleware
// ---------------------------------------------------------------------------

export async function withRateLimit(
  req: NextRequest,
  config: RateLimitConfig,
  handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
  const identifier = getClientIdentifier(req);
  const key = `${config.keyPrefix ?? 'rl:default'}:${identifier}`;

  const result = checkRateLimit(key, config);

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);

    return NextResponse.json(
      {
        error: {
          code: 'RATE_LIMITED',
          message: 'Muitas requisicoes. Tente novamente mais tarde.',
          retryAfter,
        },
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
          'Retry-After': String(retryAfter),
        },
      },
    );
  }

  const response = await handler();

  response.headers.set('X-RateLimit-Limit', String(result.limit));
  response.headers.set('X-RateLimit-Remaining', String(result.remaining));
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)));

  return response;
}

export async function withAutoRateLimit(
  req: NextRequest,
  handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
  const config = detectRouteConfig(req);
  return withRateLimit(req, config, handler);
}

// ---------------------------------------------------------------------------
// Core rate limit check using in-memory sliding window
// ---------------------------------------------------------------------------

function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const windowStart = now - config.windowSeconds * 1000;
  const resetAt = now + config.windowSeconds * 1000;

  let timestamps = windows.get(key) ?? [];
  timestamps = timestamps.filter((t) => t > windowStart);
  timestamps.push(now);
  windows.set(key, timestamps);

  const currentCount = timestamps.length;
  const allowed = currentCount <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - currentCount);

  return { allowed, remaining, limit: config.maxRequests, resetAt };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;

  const userAgent = req.headers.get('user-agent') ?? 'unknown';
  return `anon:${hashString(userAgent)}`;
}

function detectRouteConfig(req: NextRequest): RateLimitConfig {
  const pathname = new URL(req.url).pathname;

  if (pathname.startsWith('/api/auth/')) return RATE_LIMITS.auth;
  if (pathname.startsWith('/api/inpi/')) return RATE_LIMITS.inpi;
  if (pathname.startsWith('/api/analytics/')) return RATE_LIMITS.analytics;
  if (pathname.includes('/report')) return RATE_LIMITS.report;

  const hasSession = req.cookies.has('rc_session') || req.headers.has('Authorization');
  if (hasSession) return RATE_LIMITS.authenticated;

  return RATE_LIMITS.public;
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
