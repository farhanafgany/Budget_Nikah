type AnalyticsProps = Record<string, string | number | boolean | null | undefined>

const DEFAULT_POSTHOG_HOST = 'https://app.posthog.com'
const ANONYMOUS_ID_KEY = 'budgetnikah-anonymous-id'
const PENDING_NAVIGATION_EVENT_KEY = 'budgetnikah-pending-navigation-event'

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
  const url = `${config.host.replace(/\/$/, '')}/capture/`
  const body = JSON.stringify({
    api_key: config.apiKey,
    event,
    distinct_id: getAnonymousId(),
    properties: cleanProperties(properties),
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
