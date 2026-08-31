import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

// Product/category media is served from the Cloudflare R2 public origin
// (an r2.dev URL or a custom domain). Allow next/image to optimise it.
const r2Host = (() => {
  try {
    return process.env.R2_PUBLIC_BASE_URL
      ? new URL(process.env.R2_PUBLIC_BASE_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: r2Host
      ? [{ protocol: "https", hostname: r2Host }]
      : [],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
