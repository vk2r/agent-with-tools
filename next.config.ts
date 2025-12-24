import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@mastra/*"],
  reactStrictMode: false,
  devIndicators: false,
  reactCompiler: true,
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
