import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['sporttnest.emetstudio.com', 'cdn.shopify.com'], // Agrega los dominios permitidos
  },
  env: {
    BASE_IMAGE_URL: 'https://sporttnest.emetstudio.com',
  },
};

export default nextConfig;
