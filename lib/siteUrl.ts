/**
 * Canonical site origin for SEO (sitemap, robots, canonical URLs, OpenGraph).
 *
 * Set NEXT_PUBLIC_SITE_URL in Vercel (and .env.local) to the real production
 * domain, e.g. https://www.energyacademy.co.uk — no trailing slash. Until
 * it's set, we fall back to the Vercel deployment URL so links still resolve.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "https://energy-academy.vercel.app")
).replace(/\/$/, "");

export const SITE_NAME = "Energy Academy";
