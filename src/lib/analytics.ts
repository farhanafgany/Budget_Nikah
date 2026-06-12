type AnalyticsProps = Record<string, string | number | boolean | null | undefined>

const DEFAULT_POSTHOG_HOST = 'https://app.posthog.com'
const ANONYMOUS_ID_KEY = 'budgetnikah-anonymous-id'
const PENDING_NAVIGATION_EVENT_KEY = 'budgetnikah-pending-navigation-event'
const ATTRIBUTION_STORAGE_KEY = 'budgetnikah-attribution'
const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000
const ATTRIBUTION_PARAM_KEYS = [
  'gclid',
  'gbraid',
  'wbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const

// Browser events go through a same-origin reverse proxy (see `rewrites` in
// next.config.mjs) so ad blockers / tracking protection that block *.posthog.com
// can't drop them. Server events keep hitting PostHog directly.
const CLIENT_INGEST_PATH = '/ingest'

function getPostHogConfig() {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  if (!apiKey) return null

  return {
    apiKey,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || DEFAULT_POSTHOG_HOST,
  }
}

function cleanProperties(properties: AnalyticsProps = {}) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined),
  )
}

type StoredAttribution = {
  expiresAt: number
  properties: AnalyticsProps
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readStoredAttribution(storage: Storage) {
  try {
    const raw = storage.getItem(ATTRIBUTION_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as unknown
    if (!isRecord(parsed) || !isRecord(parsed.properties) || typeof parsed.expiresAt !== 'number') {
      storage.removeItem(ATTRIBUTION_STORAGE_KEY)
      return null
    }

    if (parsed.expiresAt <= Date.now()) {
      storage.removeItem(ATTRIBUTION_STORAGE_KEY)
      return null
    }

    return parsed as StoredAttribution
  } catch {
    return null
  }
}

function writeStoredAttribution(storage: Storage, attribution: StoredAttribution) {
  try {
    storage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    // Attribution should never block the product flow.
  }
}

function getAttributionParams(search: string) {
  const params = new URLSearchParams(search)

  return ATTRIBUTION_PARAM_KEYS.reduce<AnalyticsProps>((acc, key) => {
    const value = params.get(key)
    if (value) acc[key] = value
    return acc
  }, {})
}

function hasAdClickId(properties: AnalyticsProps) {
  return Boolean(properties.gclid || properties.gbraid || properties.wbraid)
}

function inferTrafficSource(properties: AnalyticsProps) {
  if (hasAdClickId(properties)) return 'google_ads'
  if (typeof properties.utm_source === 'string' && properties.utm_source) return properties.utm_source
  return 'campaign'
}

function getAttributionProperties() {
  if (typeof window === 'undefined') return {}

  const urlProperties = getAttributionParams(window.location.search)
  const hasUrlAttribution = Object.keys(urlProperties).length > 0
  const storedAttribution = readStoredAttribution(window.sessionStorage)
    ?? readStoredAttribution(window.localStorage)

  if (!hasUrlAttribution) {
    if (storedAttribution) {
      writeStoredAttribution(window.sessionStorage, storedAttribution)
      return storedAttribution.properties
    }

    return {}
  }

  const properties = cleanProperties({
    ...(storedAttribution?.properties ?? {}),
    ...urlProperties,
    landing_host: window.location.hostname,
    landing_path: window.location.pathname || '/',
    landing_referrer: document.referrer || null,
    traffic_source: inferTrafficSource(urlProperties),
    has_ad_click_id: hasAdClickId(urlProperties),
    attribution_captured_at: new Date().toISOString(),
  })
  const attribution = {
    expiresAt: Date.now() + ATTRIBUTION_TTL_MS,
    properties,
  }

  writeStoredAttribution(window.sessionStorage, attribution)
  writeStoredAttribution(window.localStorage, attribution)
  return properties
}

function getBaseBrowserProperties() {
  if (typeof window === 'undefined') return {}

  return {
    referrer: document.referrer || null,
    viewport_width: window.innerWidth,
    is_mobile_viewport: window.innerWidth < 768,
  }
}

function enrichBrowserProperties(properties: AnalyticsProps = {}) {
  return cleanProperties({
    ...getBaseBrowserProperties(),
    ...getAttributionProperties(),
    ...properties,
  })
}

function getAnonymousId() {
  if (typeof window === 'undefined') return 'anonymous'

  try {
    const existing = window.localStorage.getItem(ANONYMOUS_ID_KEY)
    if (existing) return existing

    const next = crypto.randomUUID()
    window.localStorage.setItem(ANONYMOUS_ID_KEY, next)
    return next
  } catch {
    return 'anonymous'
  }
}

export function track(event: string, properties: AnalyticsProps = {}) {
  const config = getPostHogConfig()
  if (!config || typeof fetch === 'undefined') return
  // No trailing slash: Next.js 308-redirects `/capture/` -> `/capture`, and
  // sendBeacon does not follow redirects, so the event would be dropped.
  const url = `${CLIENT_INGEST_PATH}/capture`
  const body = JSON.stringify({
    api_key: config.apiKey,
    event,
    distinct_id: getAnonymousId(),
    properties: enrichBrowserProperties(properties),
  })

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const sent = navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }))
    if (sent) return
  }

  void fetch(url, {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body,
  }).catch(() => null)
}

export function rememberNavigationEvent(event: string, properties: AnalyticsProps = {}) {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(PENDING_NAVIGATION_EVENT_KEY, JSON.stringify({
      event,
      properties: cleanProperties(properties),
    }))
  } catch {
    // Navigation tracking is best-effort only.
  }
}

export function flushPendingNavigationEvent() {
  if (typeof window === 'undefined') return

  try {
    const raw = window.sessionStorage.getItem(PENDING_NAVIGATION_EVENT_KEY)
    if (!raw) return

    window.sessionStorage.removeItem(PENDING_NAVIGATION_EVENT_KEY)
    const pending = JSON.parse(raw) as { event?: string; properties?: AnalyticsProps }
    if (!pending.event) return

    track(pending.event, {
      ...(pending.properties ?? {}),
      replayed_after_navigation: true,
    })
  } catch {
    window.sessionStorage.removeItem(PENDING_NAVIGATION_EVENT_KEY)
  }
}

export async function trackServer(event: string, properties: AnalyticsProps = {}) {
  const config = getPostHogConfig()
  if (!config || typeof fetch === 'undefined') return

  try {
    await fetch(`${config.host.replace(/\/$/, '')}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: config.apiKey,
        event,
        distinct_id: 'server',
        properties: cleanProperties(properties),
      }),
    })
  } catch {
    // Analytics must never break auth, payment, or onboarding flows.
  }
}

export function bucketBudget(value: number | null | undefined) {
  if (!value || value <= 0) return 'unknown'
  if (value < 50_000_000) return '<50jt'
  if (value < 100_000_000) return '50-100jt'
  if (value < 200_000_000) return '100-200jt'
  return '>200jt'
}

export function bucketGuests(value: number | null | undefined) {
  if (!value || value <= 0) return 'unknown'
  if (value < 100) return '<100'
  if (value < 300) return '100-300'
  if (value < 600) return '300-600'
  return '>600'
}

export function scoreBand(score: number | null | undefined) {
  if (score === null || score === undefined) return 'unknown'
  if (score < 40) return 'high_risk'
  if (score < 70) return 'moderate'
  return 'healthy'
}
