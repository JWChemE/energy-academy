/**
 * Canonical site origin for SEO (sitemap, robots, canonical URLs, OpenGraph).
 *
 * NEXT_PUBLIC_SITE_URL (set in Vercel and .env.local) takes precedence; the
 * fallback is the production domain so canonicals stay correct either way.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://energyacademyuk.org"
).replace(/\/$/, "");

export const SITE_NAME = "Energy Academy";

/** Author identity, shown on lessons and in structured data (E-E-A-T). */
export const AUTHOR = {
  name: "Jacob Willis",
  title: "Net Zero Lead",
};
