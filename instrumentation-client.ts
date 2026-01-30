// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { dashboardIntegration } from './lib/sentry-dashboard-integration';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://4ec6964cbc2c5b6b20601105a0e6c57e@o4510504340160512.ingest.us.sentry.io/4510507365302272',

  environment: process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || 'development',

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.feedbackIntegration({
      colorScheme: 'system',
      autoInject: true, // Auto-show feedback button for users
      buttonLabel: 'Report Feedback',
      submitButtonLabel: 'Send Feedback',
      formTitle: 'Report an Issue',
      messagePlaceholder: 'What did you expect to happen?',
      successMessageText: 'Thank you for your feedback!',
    }),
    // Custom integration: Send exceptions to YOUR custom dashboard
    dashboardIntegration(),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Profile 100% of sampled transactions for browser profiling
  profilesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // For user-facing app, capture more sessions (70%) to understand user behavior
  replaysSessionSampleRate: 0.7,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Add custom tags for better filtering
  initialScope: {
    tags: {
      service: 'uri-frontend',
      runtime: 'browser',
    },
  },

  // Custom context and user enrichment
  beforeSend(event, hint) {
    // Add custom context based on user session
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent;
      event.contexts = {
        ...event.contexts,
        browser_info: {
          user_agent: userAgent,
          language: window.navigator.language,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          color_depth: window.screen.colorDepth,
          pixel_ratio: window.devicePixelRatio,
        },
      };

      // Add performance info if available (Chrome-specific API)
      if (window.performance && 'memory' in window.performance) {
        const memory = (window.performance as any).memory;
        event.contexts.performance = {
          memory_limit: memory.jsHeapSizeLimit,
          memory_used: memory.usedJSHeapSize,
        };
      }
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
