import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://5f090bd5a472ece70d4fb583bd01f3d1@o4510299490746368.ingest.us.sentry.io/4510299554578432',
  sendDefaultPii: true,
  enableLogs: true,
  tracesSampleRate: 1.0,
});