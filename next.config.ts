import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "topdev.vn", // Allow images from topdev.vn
      },
      {
        protocol: "https",
        hostname: "randomuser.me", // Allow images from randomuser.me
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Allow Google account profile images
      },
      {
        protocol: "https",
        hostname: "bkeeliwpukvnqcubbvrs.supabase.co", // Allow images from Supabase Storage
      },
    ],
  },
};

export default nextConfig;