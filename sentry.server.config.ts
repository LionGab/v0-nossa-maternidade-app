// @ts-check
/**
 * Sentry Server Configuration
 * Configuração do Sentry para o servidor (Node.js)
 */

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,

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
      delete event.request.headers?.["X-API-Key"]
    }

    // Filter sensitive data from extra context
    if (event.extra) {
      delete event.extra.password
      delete event.extra.token
      delete event.extra.apiKey
    }

    // Only send errors in production
    if (process.env.NODE_ENV !== "production") {
      return null
    }

    return event
  },

  // Configure which integrations to use
  // @sentry/nextjs includes default integrations automatically
  integrations: [],
})
