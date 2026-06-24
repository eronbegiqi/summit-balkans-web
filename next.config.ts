import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
