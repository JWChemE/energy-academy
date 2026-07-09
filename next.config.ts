import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * The CSP allows inline scripts ('unsafe-inline' — required by Next's own
 * bootstrapping and the JSON-LD blocks) and eval ('unsafe-eval' — required by
 * next-mdx-remote's client-side MDX runtime), but still blocks loading any
 * *external* script, style or frame — the main injection vector. connect-src
 * is limited to self plus Supabase.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-src https://www.youtube-nocookie.com https://www.youtube.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without this, an unrelated
  // package-lock.json higher up the filesystem makes Next guess the wrong root.
  turbopack: {
    root: import.meta.dirname,
  },
  // The /api/lesson route reads lesson MDX from disk at runtime to serve gated
  // (Level 2/3) content. Make sure those files are bundled into its function.
  outputFileTracingIncludes: {
    "/api/lesson": ["./content/courses/**/*.mdx"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // Jul 2026: the Breweries and Food Manufacturing sectors merged into one
  // Food & Drink sector, whose shared lessons moved into the new
  // food-drink-foundations course. Permanent redirects preserve old URLs.
  async redirects() {
    const gone = [
      ["/sectors/breweries", "/sectors/food-and-drink"],
      ["/sectors/food-manufacturing", "/sectors/food-and-drink"],
      ["/courses/food-manufacturing/food-safety-sets-the-floor", "/courses/food-drink-foundations/food-safety-sets-the-floor"],
      ["/courses/food-manufacturing/hygiene-and-washdown", "/courses/food-drink-foundations/cip-and-washdown"],
      ["/courses/food-manufacturing/effluent-water-and-fats", "/courses/food-drink-foundations/trade-effluent-and-water"],
      ["/courses/food-manufacturing/cca-and-reporting", "/courses/food-drink-foundations/cca-esos-and-reporting"],
      ["/courses/food-manufacturing/running-the-cold-plant", "/courses/food-drink-foundations/running-the-cold-plant"],
      ["/courses/food-manufacturing/compliance-check", "/courses/food-drink-foundations/compliance-check"],
      ["/courses/breweries/trade-effluent-and-water", "/courses/food-drink-foundations/trade-effluent-and-water"],
      ["/courses/breweries/food-safety-and-energy", "/courses/food-drink-foundations/food-safety-sets-the-floor"],
      ["/courses/breweries/reporting-and-schemes", "/courses/food-drink-foundations/cca-esos-and-reporting"],
      ["/courses/breweries/compliance-check", "/courses/food-drink-foundations/compliance-check"],
    ];
    return gone.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
