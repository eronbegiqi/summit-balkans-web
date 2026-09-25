import type { NextConfig } from "next";

// Report-only: violations are POSTed to /api/csp-report and logged, nothing is
// blocked. Once the logs are quiet, rename the header to Content-Security-Policy.
// 'unsafe-inline' scripts are needed for Next's inline bootstrap, GA and JSON-LD;
// dropping it means moving to nonces (per-request rendering), not worth it yet.
const isDev = process.env.NODE_ENV !== "production";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://va.vercel-scripts.com https://vercel.live`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://pub-84f4670fd13a4a1e978382d986a3ecad.r2.dev https://media.summitbalkans.com https://summitbalkans.com https://picsum.photos https://fastly.picsum.photos https://*.basemaps.cartocdn.com https://unpkg.com https://*.google-analytics.com https://*.googletagmanager.com https://vercel.live https://vercel.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://va.vercel-scripts.com https://vercel.live",
  "frame-src https://www.google.com https://vercel.live",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "report-uri /api/csp-report",
].join("; ");

const nextConfig: NextConfig = {
  // Emit modern JS only — drops legacy polyfills/transpilation for browsers we don't support.
  // (Saves the "legacy JavaScript" payload flagged by Lighthouse.)
  images: {
    // Serve AVIF first, then WebP, before falling back to the original format.
    formats: ["image/avif", "image/webp"],
    // Allowed `quality` values for next/image (Next 16 requires this to be explicit).
    qualities: [60, 70, 75, 85],
    // Cache optimized images at the edge for 31 days.
    minimumCacheTTL: 60 * 60 * 24 * 31,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "summitbalkans.com",
      },
      {
        protocol: "https",
        hostname: "media.summitbalkans.com",
      },
      {
        protocol: "https", hostname: "pub-84f4670fd13a4a1e978382d986a3ecad.r2.dev"
      },
      {
        // Placeholder gallery photos until real images are uploaded.
        protocol: "https", hostname: "picsum.photos",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "gsap"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy-Report-Only", value: csp },
        ],
      },
      {
        source: "/:all*\\.(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
