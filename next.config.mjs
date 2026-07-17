import { withSentryConfig } from '@sentry/nextjs'

const disableSentrySourceMapUpload = process.env.SENTRY_DISABLE_SOURCE_MAP_UPLOAD === '1'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  // Reverse proxy for PostHog: browser hits same-origin /ingest/* which Vercel
  // forwards to PostHog. Dodges ad blockers that block *.posthog.com directly.
  async rewrites() {
    const posthogHost = (process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com').replace(/\/$/, '')
    return [
      { source: '/ingest/:path*', destination: `${posthogHost}/:path*` },
    ]
  },
  // Link pendek untuk bio sosmed — langsung ke onboarding dengan UTM terpasang,
  // supaya trafik bio kelacak di PostHog (analytics.ts sudah simpan UTM 30 hari).
  async redirects() {
    return [
      {
        source: '/tiktok',
        destination: '/onboarding?utm_source=tiktok&utm_medium=bio&utm_campaign=ruangsakinahku',
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "farhan-afgany",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  sourcemaps: {
    disable: disableSentrySourceMapUpload,
  },

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
