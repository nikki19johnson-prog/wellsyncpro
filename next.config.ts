import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin images from Supabase storage if needed
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "adpescktqpnyvhtwhqkh.supabase.co",
      },
    ],
  },
};

export default nextConfig;
