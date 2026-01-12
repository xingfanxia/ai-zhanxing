import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Exclude native modules from bundling - they will be loaded at runtime
  serverExternalPackages: ['sweph'],

  // Webpack config for native module handling
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle native modules
      config.externals = config.externals || [];
      config.externals.push('sweph');
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
