/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');
const withPWA = require('next-pwa')({
  dest: 'public',
  maximumFileSizeToCacheInBytes: 4000000,
});

const nextConfig = withPWA({
  output: 'standalone',
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'res.cloudinary.com',
      'document.uricreative.com',
      'salmon-mud-00dcf2503.4.azurestaticapps.net',
      'media.licdn.com',
      'images.unsplash.com',
      'source.unsplash.com',
      'cdn.prod.website-files.com',
      'www.bellanaija.com',
    ],
  },
  async redirects() {
    return [
      {
        source: '/resources/blog',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/resources/blog/:path*',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/uri-insights/:path*',
        destination: 'http://localhost:8001/:path*',
      },
      {
        source: '/email-verification',
        destination: '/auth/email-verification',
      },
      { source: '/forgot-password', destination: '/auth/forgot-password' },
      { source: '/login', destination: '/auth/login' },
      { source: '/reset-password', destination: '/auth/reset-password' },
      { source: '/signup-as', destination: '/auth/signup-as' },
      {
        source: '/password-reset-successful',
        destination: '/auth/password-reset-successful',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/firebase-messaging-sw.js',
        headers: [{ key: 'Service-Worker-Allowed', value: '/' }],
      },
    ];
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
});

module.exports = withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'uri-o0',
  project: 'javascript-nextjs-user',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
