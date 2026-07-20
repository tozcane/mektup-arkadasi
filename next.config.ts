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
        hostname: "dgnbckbiuxgknddklllz.supabase.co",
      },
      {
        protocol: "https",
        hostname: "imgcdn.ensonhaber.com",
      },
    ],
  },
};

export default nextConfig;