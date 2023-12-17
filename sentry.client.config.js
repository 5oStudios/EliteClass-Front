// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (process.env.NODE_ENV === "production") { 
  Sentry.init({
    dsn: SENTRY_DSN || 'https://de6719383d6d4eaba227f615af2fc436@o1305736.ingest.sentry.io/6547856',
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
  });
  Sentry.setTag("side", "clientSide");
  Sentry.setUser({ id: localStorage?.getItem('user_id') || 'user_not_defined_zk' });
}
