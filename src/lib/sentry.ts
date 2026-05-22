import * as Sentry from '@sentry/nextjs'

export function captureApiError(error: unknown, route: string) {
  // API routes often return JSON errors; capture the original exception first.
  Sentry.captureException(error, {
    tags: {
      route,
      source: 'api-route',
    },
  })
}

