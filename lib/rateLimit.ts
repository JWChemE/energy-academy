import type { NextRequest } from "next/server";

/**
 * Small in-memory sliding-window rate limiter for the API routes.
 *
 * On serverless (Vercel) this is per-instance, so it's burst protection
 * rather than a hard global cap — enough to blunt scraping of the lesson API
 * and brute-force attempts on account deletion. If the site ever needs a
 * strict global limit, swap this for a shared store (Upstash/Redis) behind
 * the same function signature.
 */
const buckets = new Map<string, number[]>();

/** Returns true if the request is allowed, false if it should be rejected (429). */
export function rateLimit(
  req: NextRequest,
  name: string,
  limit: number,
  windowMs: number,
): boolean {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const key = `${name}:${ip}`;
  const now = Date.now();

  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);

  // Opportunistic cleanup so the map can't grow without bound.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return true;
}
