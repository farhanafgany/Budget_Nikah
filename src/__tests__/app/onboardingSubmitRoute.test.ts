jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      body,
      status: init?.status ?? 200,
    }),
  },
}))

jest.mock('@/lib/rateLimit', () => ({
  checkRateLimit: jest.fn(),
}))

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('@/lib/analytics', () => ({
  bucketBudget: jest.fn(() => 'bucket'),
  bucketGuests: jest.fn(() => 'bucket'),
  scoreBand: jest.fn(() => 'band'),
  trackServer: jest.fn(),
}))

jest.mock('@/lib/sentry', () => ({
  captureApiError: jest.fn(),
}))

import { POST } from '@/app/api/onboarding/submit/route'
import { EXISTING_PROFILE_CONFIRMATION_REQUIRED } from '@/lib/authFlow'
import { checkRateLimit } from '@/lib/rateLimit'
import { createClient } from '@/lib/supabase/server'

const onboarding = {
  partnerOneName: 'Nadia',
  partnerTwoName: 'Rafi',
  weddingCity: 'Bandung',
  weddingDate: '2027-05-22',
  totalBudget: 100_000_000,
  guestCount: 300,
  weddingStyle: 'elegant',
  eventType: 'akad_resepsi',
  planningPriority: 'balanced',
}

const storedOnboarding = {
  partner_one_name: onboarding.partnerOneName,
  partner_two_name: onboarding.partnerTwoName,
  wedding_city: onboarding.weddingCity,
  wedding_date: onboarding.weddingDate,
  total_budget: onboarding.totalBudget,
  guest_count: onboarding.guestCount,
  wedding_style: onboarding.weddingStyle,
  event_type: onboarding.eventType,
  planning_priority: onboarding.planningPriority,
}

function makeRequest(replaceExisting: unknown = false) {
  return {
    json: jest.fn().mockResolvedValue({ onboarding, replaceExisting }),
  } as unknown as Request
}

function setUpSupabase(existingProfile: typeof storedOnboarding | null, isPremium = false) {
  const maybeSingleProfile = jest.fn().mockResolvedValue({
    data: existingProfile,
    error: null,
  })
  const upsert = jest.fn().mockResolvedValue({ error: null })
  const maybeSingleAccount = jest.fn().mockResolvedValue({
    data: { is_premium: isPremium },
    error: null,
  })
  const from = jest.fn((table: string) => {
    if (table === 'wedding_profiles') {
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({ maybeSingle: maybeSingleProfile })),
        })),
        upsert,
      }
    }

    return {
      select: jest.fn(() => ({
        eq: jest.fn(() => ({ maybeSingle: maybeSingleAccount })),
      })),
    }
  })

  jest.mocked(createClient).mockResolvedValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }),
    },
    from,
  } as never)

  return { maybeSingleProfile, upsert }
}

describe('POST /api/onboarding/submit profile replacement safety', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(checkRateLimit).mockResolvedValue(null)
  })

  it('requires explicit confirmation before overwriting an existing profile', async () => {
    const { upsert } = setUpSupabase({ ...storedOnboarding, total_budget: 80_000_000 }, true)

    const response = await POST(makeRequest()) as unknown as { status: number; body: { code: string; isPremium: boolean } }

    expect(response.status).toBe(409)
    expect(response.body.code).toBe(EXISTING_PROFILE_CONFIRMATION_REQUIRED)
    expect(response.body.isPremium).toBe(true)
    expect(upsert).not.toHaveBeenCalled()
  })

  it('allows a confirmed replacement of an existing profile', async () => {
    const { maybeSingleProfile, upsert } = setUpSupabase({ ...storedOnboarding, total_budget: 80_000_000 })

    const response = await POST(makeRequest(true)) as unknown as { status: number }

    expect(response.status).toBe(200)
    expect(maybeSingleProfile).not.toHaveBeenCalled()
    expect(upsert).toHaveBeenCalled()
  })

  it('does not accept a truthy non-boolean replacement flag', async () => {
    const { upsert } = setUpSupabase({ ...storedOnboarding, total_budget: 80_000_000 })

    const response = await POST(makeRequest('true')) as unknown as { status: number }

    expect(response.status).toBe(409)
    expect(upsert).not.toHaveBeenCalled()
  })

  it('accepts an idempotent retry when the stored plan already matches the draft', async () => {
    const { upsert } = setUpSupabase(storedOnboarding)

    const response = await POST(makeRequest()) as unknown as { status: number }

    expect(response.status).toBe(200)
    expect(upsert).toHaveBeenCalled()
  })

  it('saves a first profile without requiring a decision', async () => {
    const { upsert } = setUpSupabase(null)

    const response = await POST(makeRequest()) as unknown as { status: number }

    expect(response.status).toBe(200)
    expect(upsert).toHaveBeenCalled()
  })
})
