// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://4ec6964cbc2c5b6b20601105a0e6c57e@o4510504340160512.ingest.us.sentry.io/4510507365302272',

  environment: process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || 'development',

  // Add profiling integration
  integrations: [nodeProfilingIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Profile 100% of sampled transactions
  profilesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Add custom tags for better filtering
  initialScope: {
    tags: {
      service: 'uri-frontend',
      runtime: 'server',
    },
  },
});
