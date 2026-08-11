import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep production builds out of the dev server's `.next` directory. This
  // prevents `next build` from deleting development manifests during HMR.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
};

export default nextConfig;
