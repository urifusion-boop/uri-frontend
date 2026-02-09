/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
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
        source: '/uri-transactions/:path*',
        destination: 'http://localhost:9001/:path*',
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

// Sentry completely disabled in all environments
module.exports = nextConfig;
