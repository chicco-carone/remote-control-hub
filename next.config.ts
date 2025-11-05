import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  reactCompiler: true,
  allowedDevOrigins: ["gyrostatic-unfactiously-amparo.ngrok-free.dev"],
};

export default nextConfig;
