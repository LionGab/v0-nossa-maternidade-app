// @ts-check
/**
 * Sentry Client Configuration
 * Configuração do Sentry para o cliente (browser)
 */

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of the transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === "development",

  // Filter out sensitive data
  beforeSend(event, hint) {
    // Remove sensitive information from event
    if (event.request) {
      delete event.request.headers?.["Authorization"]
      delete event.request.headers?.["Cookie"]
    }

    // Only send errors in production
    if (process.env.NODE_ENV !== "production") {
      return null
    }

    return event
  },

  // Configure which integrations to use
  // @sentry/nextjs includes BrowserTracing and Replay automatically
  // Custom integrations can be added here if needed
  integrations: [],

  // Set sample rate for session replay
  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
})
