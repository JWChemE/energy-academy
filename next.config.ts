import type { NextConfig } from "next";

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
};

export default nextConfig;
