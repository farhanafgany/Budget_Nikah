import {
  bucketBudget,
  bucketGuests,
  flushPendingNavigationEvent,
  rememberNavigationEvent,
  scoreBand,
  track,
} from '@/lib/analytics'

describe('analytics helpers', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
    ;(global.fetch as jest.Mock | undefined) = jest.fn().mockResolvedValue({ ok: true })
    window.history.replaceState(null, '', '/')
    window.localStorage.clear()
    window.sessionStorage.clear()
    Object.defineProperty(navigator, 'sendBeacon', {
      configurable: true,
      value: undefined,
    })
  })

  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })

  it('does not send events when PostHog key is missing', () => {
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY

    track('landing_cta_clicked', { cta_location: 'hero' })

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('sends a minimal PostHog capture payload when configured', () => {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'ph_test_key'
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://posthog.test'

    track('landing_cta_clicked', {
      cta_location: 'hero',
      target: 'onboarding',
    })

    expect(global.fetch).toHaveBeenCalledWith(
      '/ingest/capture',
      expect.objectContaining({
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: expect.any(String),
      }),
    )
    const [, options] = (global.fetch as jest.Mock).mock.calls[0]
    expect(JSON.parse(options.body)).toEqual({
      api_key: 'ph_test_key',
      event: 'landing_cta_clicked',
      distinct_id: expect.any(String),
      properties: {
        cta_location: 'hero',
        target: 'onboarding',
        referrer: null,
        viewport_width: expect.any(Number),
        is_mobile_viewport: expect.any(Boolean),
      },
    })
  })

  it('also accepts the PostHog project token env name', () => {
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = 'ph_project_token'
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://posthog.test'

    track('page_viewed', { path: '/' })

    const [, options] = (global.fetch as jest.Mock).mock.calls[0]
    expect(JSON.parse(options.body)).toEqual(expect.objectContaining({
      api_key: 'ph_project_token',
      event: 'page_viewed',
    }))
  })

  it('adds Google Ads attribution from the landing URL to browser events', () => {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'ph_test_key'
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://posthog.test'
    window.history.replaceState(
      null,
      '',
      '/nikah/budget?gclid=test-click&utm_source=google&utm_medium=cpc&utm_campaign=bn_high_intent',
    )

    track('landing_cta_clicked', {
      cta_location: 'hero',
      target: 'onboarding',
    })

    const [, options] = (global.fetch as jest.Mock).mock.calls[0]
    expect(JSON.parse(options.body)).toEqual(expect.objectContaining({
      event: 'landing_cta_clicked',
      properties: expect.objectContaining({
        cta_location: 'hero',
        target: 'onboarding',
        gclid: 'test-click',
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'bn_high_intent',
        landing_path: '/nikah/budget',
        traffic_source: 'google_ads',
        has_ad_click_id: true,
        attribution_captured_at: expect.any(String),
      }),
    }))
  })

  it('persists attribution after route changes without query parameters', () => {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'ph_test_key'
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://posthog.test'
    window.history.replaceState(null, '', '/nikah/budget?gclid=test-click&utm_source=google')

    track('landing_cta_clicked', { cta_location: 'hero' })

    window.history.replaceState(null, '', '/result')
    track('result_viewed', { score_band: 'healthy' })

    const [, options] = (global.fetch as jest.Mock).mock.calls[1]
    expect(JSON.parse(options.body)).toEqual(expect.objectContaining({
      event: 'result_viewed',
      properties: expect.objectContaining({
        score_band: 'healthy',
        gclid: 'test-click',
        utm_source: 'google',
        landing_path: '/nikah/budget',
        traffic_source: 'google_ads',
      }),
    }))
  })

  it('uses sendBeacon for browser events when available', () => {
    const sendBeacon = jest.fn().mockReturnValue(true)
    Object.defineProperty(navigator, 'sendBeacon', {
      configurable: true,
      value: sendBeacon,
    })
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'ph_test_key'
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://posthog.test'

    track('result_premium_cta_clicked', { cta_location: 'result_inline_mobile' })

    expect(sendBeacon).toHaveBeenCalledWith(
      '/ingest/capture',
      expect.any(Blob),
    )
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('can replay a pending navigation event after route changes', () => {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'ph_test_key'
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://posthog.test'

    rememberNavigationEvent('result_premium_cta_clicked', {
      cta_location: 'result_inline_mobile',
    })
    flushPendingNavigationEvent()

    const [, options] = (global.fetch as jest.Mock).mock.calls[0]
    expect(JSON.parse(options.body)).toEqual(expect.objectContaining({
      event: 'result_premium_cta_clicked',
      properties: expect.objectContaining({
        cta_location: 'result_inline_mobile',
        replayed_after_navigation: true,
      }),
    }))
    expect(window.sessionStorage.getItem('budgetnikah-pending-navigation-event')).toBeNull()
  })

  it('buckets product-sensitive values for analytics properties', () => {
    expect(bucketBudget(25_000_000)).toBe('<50jt')
    expect(bucketBudget(75_000_000)).toBe('50-100jt')
    expect(bucketBudget(150_000_000)).toBe('100-200jt')
    expect(bucketBudget(250_000_000)).toBe('>200jt')
    expect(bucketBudget(0)).toBe('unknown')

    expect(bucketGuests(80)).toBe('<100')
    expect(bucketGuests(250)).toBe('100-300')
    expect(bucketGuests(450)).toBe('300-600')
    expect(bucketGuests(900)).toBe('>600')
    expect(bucketGuests(0)).toBe('unknown')

    expect(scoreBand(32)).toBe('high_risk')
    expect(scoreBand(55)).toBe('moderate')
    expect(scoreBand(82)).toBe('healthy')
  })
})
