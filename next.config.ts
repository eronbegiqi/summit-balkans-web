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
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "gsap"],
  },
};

export default nextConfig;
