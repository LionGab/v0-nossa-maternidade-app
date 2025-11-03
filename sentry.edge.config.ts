// @ts-check
/**
 * Sentry Edge Configuration
 * Configuração do Sentry para Edge Runtime (middleware, etc)
 */

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of the transactions for performance monitoring.
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
})
