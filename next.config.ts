import type { NextConfig } from "next";

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
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "gsap"],
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:all*\.(svg|jpg|jpeg|png|webp|avif|gif|css|js)",
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
