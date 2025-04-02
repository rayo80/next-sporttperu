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
      {
        protocol: 'https',
        hostname: 'pub-a15fad1bb05e4ecbb92c9d83b643a721.r2.dev',
      },
    ],
  },
  env: {
    BASE_IMAGE_URL: 'https://sporttnest.emetstudio.com',
  },
};

export default nextConfig;
