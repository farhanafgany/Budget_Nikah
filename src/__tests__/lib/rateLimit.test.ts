jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({})),
}))

const mockLimit = jest.fn()

jest.mock('next/server', () => ({
  NextResponse: {
    json: (_body: unknown, init?: { status?: number; headers?: Record<string, string> }) => ({
      status: init?.status ?? 200,
      headers: {
        get: (key: string) => init?.headers?.[key] ?? null,
      },
    }),
  },
}))

jest.mock('@upstash/ratelimit', () => ({
  Ratelimit: Object.assign(
    jest.fn().mockImplementation(() => ({
      limit: mockLimit,
    })),
    {
      slidingWindow: jest.fn((limit, window) => ({ limit, window })),
    },
  ),
}))

import { checkRateLimit } from '@/lib/rateLimit'

describe('checkRateLimit', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv }
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('allows requests when Upstash env vars are missing', async () => {
    const result = await checkRateLimit({ headers: new Headers() } as Request, {
      key: 'payment:create',
      limit: 5,
      window: '10 m',
    })

    expect(result).toBeNull()
    expect(mockLimit).not.toHaveBeenCalled()
  })

  it('returns 429 when the request exceeds the configured limit', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://upstash.test'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token'
    mockLimit.mockResolvedValue({
      success: false,
      limit: 5,
      remaining: 0,
      reset: 1234567890,
    })

    const result = await checkRateLimit(
      { headers: new Headers({ 'x-forwarded-for': '203.0.113.10, 10.0.0.1' }) } as Request,
      {
        key: 'payment:create',
        limit: 5,
        window: '10 m',
      },
    )

    expect(result?.status).toBe(429)
    expect(result?.headers.get('X-RateLimit-Limit')).toBe('5')
    expect(mockLimit).toHaveBeenCalledWith('payment:create:203.0.113.10')
  })

  it('allows requests when Upstash fails', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://upstash.test'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token'
    mockLimit.mockRejectedValue(new Error('redis down'))
    jest.spyOn(console, 'warn').mockImplementation(() => {})

    const result = await checkRateLimit({ headers: new Headers() } as Request, {
      key: 'auth:password',
      limit: 5,
      window: '10 m',
    })

    expect(result).toBeNull()
    expect(console.warn).toHaveBeenCalled()
  })
})
