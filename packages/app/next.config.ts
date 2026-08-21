import type {NextConfig} from 'next';

import {withPayload} from '@payloadcms/next/withPayload';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{pathname: '/api/media/file/**'}],
  },
  // Single deployable: OpenNext packages this Next app as one Cloudflare Worker.
  // The Worker serves the public site, Payload admin (/admin), and Payload API
  // (/api/*) from the same runtime.
  serverExternalPackages: ['jose', 'pg-cloudflare'],
  webpack: config => {
    config.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };
    return config;
  },
};

// Registers the next-intl request config (src/i18n/request.ts) so getTranslations
// / NextIntlClientProvider can resolve messages during SSR/prerender.
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// withPayload wires Payload's admin/API route handlers into the same Next build.
export default withPayload(withNextIntl(nextConfig), {
  devBundleServerPackages: false,
});
