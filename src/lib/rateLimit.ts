import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type RateLimitWindow = `${number} ${'s' | 'm' | 'h' | 'd'}`

interface RateLimitOptions {
  key: string
  limit: number
  window: RateLimitWindow
  identifier?: string
}

const limiters = new Map<string, Ratelimit>()

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return (
    forwardedFor ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'anonymous'
  )
}

function getLimiter(limit: number, window: RateLimitWindow) {
  const cacheKey = `${limit}:${window}`
  const cached = limiters.get(cacheKey)
  if (cached) return cached

  const limiter = new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    }),
    limiter: Ratelimit.slidingWindow(limit, window),
    analytics: true,
  })

  limiters.set(cacheKey, limiter)
  return limiter
}

export async function checkRateLimit(request: Request, options: RateLimitOptions) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }

  try {
    // Key includes route group + identity so each sensitive action is isolated.
    const identity = options.identifier ?? getClientIp(request)
    const result = await getLimiter(options.limit, options.window).limit(`${options.key}:${identity}`)

    if (result.success) return null

    return NextResponse.json(
      { error: 'Terlalu banyak percobaan. Tunggu sebentar, lalu coba lagi.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': String(result.remaining),
          'X-RateLimit-Reset': String(result.reset),
        },
      },
    )
  } catch (error) {
    // Fail open supaya auth/payment tidak tumbang saat Upstash sedang bermasalah.
    console.warn('Rate limit check failed', error)
    return null
  }
}
