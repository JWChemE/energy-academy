import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without this, an unrelated
  // package-lock.json higher up the filesystem makes Next guess the wrong root.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
