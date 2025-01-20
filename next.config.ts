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
    ],
  },
};

export default nextConfig;
