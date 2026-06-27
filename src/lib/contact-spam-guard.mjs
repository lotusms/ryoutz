/** @typedef {{ allowed: boolean; retryAfterSec?: number }} RateLimitResult */

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
export const MIN_SUBMIT_MS = 3000;
export const MAX_SUBMIT_MS = 60 * 60 * 1000;

export const FIELD_LIMITS = {
  name: 120,
  email: 254,
  phone: 24,
  comments: 4000,
  preferredDate: 10,
};

/** @type {Map<string, { count: number; resetAt: number }>} */
const rateBuckets = new Map();

/**
 * Best-effort IP limiter for serverless (per warm instance). Pair with Turnstile in production.
 * @param {Request} request
 * @returns {RateLimitResult}
 */
export function checkContactRateLimit(request) {
  const ip = getClientIp(request);
  const now = Date.now();
  let bucket = rateBuckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateBuckets.set(ip, bucket);
  }

  bucket.count += 1;

  if (bucket.count > RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  if (rateBuckets.size > 5000) {
    for (const [key, value] of rateBuckets) {
      if (now > value.resetAt) rateBuckets.delete(key);
    }
  }

  return { allowed: true };
}

/** @param {Request} request */
export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

/**
 * @param {unknown} startedAt
 * @returns {{ ok: boolean; reason?: string }}
 */
export function checkFormTiming(startedAt) {
  const t = Number(startedAt);
  if (!Number.isFinite(t) || t <= 0) {
    return { ok: false, reason: "missing-start" };
  }

  const elapsed = Date.now() - t;
  if (elapsed < MIN_SUBMIT_MS) {
    return { ok: false, reason: "too-fast" };
  }
  if (elapsed > MAX_SUBMIT_MS) {
    return { ok: false, reason: "expired" };
  }

  return { ok: true };
}

export function turnstileConfigured() {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY?.trim() &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
  );
}

/**
 * @param {string | undefined} token
 * @param {string} ip
 * @returns {Promise<{ ok: boolean; skipped?: boolean; reason?: string }>}
 */
export async function verifyTurnstileToken(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    return { ok: true, skipped: true };
  }

  const response = String(token ?? "").trim();
  if (!response) {
    return { ok: false, reason: "missing-token" };
  }

  try {
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response,
          remoteip: ip,
        }),
      },
    );

    const data = await verifyRes.json().catch(() => ({}));
    if (data?.success) {
      return { ok: true };
    }

    const codes = Array.isArray(data?.["error-codes"])
      ? data["error-codes"].join(",")
      : "verify-failed";
    return { ok: false, reason: codes };
  } catch {
    return { ok: false, reason: "verify-unavailable" };
  }
}

/**
 * @param {string} value
 * @param {number} max
 */
export function trimToMax(value, max) {
  const text = String(value ?? "").trim();
  if (text.length <= max) return text;
  return text.slice(0, max);
}
