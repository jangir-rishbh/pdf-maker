import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-lib', 'jspdf', 'jszip'],
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
