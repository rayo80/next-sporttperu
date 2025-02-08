import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sporttnest.emetstudio.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
  env: {
    BASE_IMAGE_URL: 'https://sporttnest.emetstudio.com',
  },
};

export default nextConfig;
