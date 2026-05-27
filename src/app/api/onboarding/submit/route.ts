import { NextResponse } from 'next/server'
import { calculateAllocation } from '@/lib/allocation'
import { bucketBudget, bucketGuests, scoreBand, trackServer } from '@/lib/analytics'
import { EXISTING_PROFILE_CONFIRMATION_REQUIRED } from '@/lib/authFlow'
import { getCityTier } from '@/lib/cityTiers'
import { checkRateLimit } from '@/lib/rateLimit'
import { calculatePressureLevel, calculateScore } from '@/lib/scoring'
import { captureApiError } from '@/lib/sentry'
import { createClient } from '@/lib/supabase/server'

interface OnboardingInput {
  partnerOneName?: string
  partnerTwoName?: string
  weddingCity?: string
  weddingDate?: string
  totalBudget?: number
  guestCount?: number
  weddingStyle?: string
  eventType?: string
  planningPriority?: string
}

interface StoredPlanningProfile {
  partner_one_name: string | null
  partner_two_name: string | null
  wedding_city: string | null
  wedding_date: string | null
  total_budget: number | null
  guest_count: number | null
  wedding_style: string | null
  event_type: string | null
  planning_priority: string | null
}

function matchesStoredPlan(profile: StoredPlanningProfile, onboarding: Required<OnboardingInput>): boolean {
  return profile.partner_one_name === onboarding.partnerOneName
    && (profile.partner_two_name ?? '') === onboarding.partnerTwoName
    && profile.wedding_city === onboarding.weddingCity
    && (profile.wedding_date ?? '') === onboarding.weddingDate
    && profile.total_budget === onboarding.totalBudget
    && profile.guest_count === onboarding.guestCount
    && profile.wedding_style === onboarding.weddingStyle
    && (profile.event_type ?? '') === onboarding.eventType
    && profile.planning_priority === onboarding.planningPriority
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Login diperlukan untuk menyimpan onboarding.' }, { status: 401 })
  }

  const limited = await checkRateLimit(request, {
    key: 'onboarding:submit',
    limit: 10,
    window: '10 m',
    identifier: user.id,
  })
  if (limited) return limited

  let body: { onboarding?: OnboardingInput; replaceExisting?: boolean }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const onboarding = body.onboarding
  if (!onboarding?.partnerOneName || !onboarding.weddingCity || !onboarding.totalBudget || !onboarding.guestCount || !onboarding.weddingStyle || !onboarding.planningPriority) {
    return NextResponse.json({ error: 'Data onboarding belum lengkap.' }, { status: 400 })
  }
  const normalizedOnboarding = {
    partnerOneName: onboarding.partnerOneName,
    partnerTwoName: onboarding.partnerTwoName ?? '',
    weddingCity: onboarding.weddingCity,
    weddingDate: onboarding.weddingDate ?? '',
    totalBudget: onboarding.totalBudget,
    guestCount: onboarding.guestCount,
    weddingStyle: onboarding.weddingStyle,
    eventType: onboarding.eventType ?? '',
    planningPriority: onboarding.planningPriority,
  }

  if (body.replaceExisting !== true) {
    const { data: existingProfile, error: existingProfileError } = await supabase
      .from('wedding_profiles')
      .select('partner_one_name, partner_two_name, wedding_city, wedding_date, total_budget, guest_count, wedding_style, event_type, planning_priority')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingProfileError) {
      captureApiError(existingProfileError, '/api/onboarding/submit')
      return NextResponse.json({ error: existingProfileError.message }, { status: 500 })
    }

    if (existingProfile && !matchesStoredPlan(existingProfile as StoredPlanningProfile, normalizedOnboarding)) {
      const { data: existingAccount, error: existingAccountError } = await supabase
        .from('app_users')
        .select('is_premium')
        .eq('id', user.id)
        .maybeSingle()

      if (existingAccountError) {
        captureApiError(existingAccountError, '/api/onboarding/submit')
      }

      return NextResponse.json({
        error: 'Rencana tersimpan sudah ada. Konfirmasi diperlukan untuk menggantinya.',
        code: EXISTING_PROFILE_CONFIRMATION_REQUIRED,
        isPremium: Boolean(existingAccount?.is_premium),
      }, { status: 409 })
    }
  }

  const allocation = calculateAllocation({
    totalBudget: normalizedOnboarding.totalBudget,
    guestCount: normalizedOnboarding.guestCount,
    weddingStyle: normalizedOnboarding.weddingStyle,
    planningPriority: normalizedOnboarding.planningPriority,
  })
  const scoreResult = calculateScore({
    totalBudget: normalizedOnboarding.totalBudget,
    guestCount: normalizedOnboarding.guestCount,
    weddingStyle: normalizedOnboarding.weddingStyle,
    planningPriority: normalizedOnboarding.planningPriority,
    weddingCity: normalizedOnboarding.weddingCity,
    allocation,
  })

  // Server-side submit keeps profile writes behind auth + rate limit.
  try {
    const { error } = await supabase.from('wedding_profiles').upsert({
      user_id: user.id,
      partner_one_name: normalizedOnboarding.partnerOneName,
      partner_two_name: normalizedOnboarding.partnerTwoName,
      wedding_city: normalizedOnboarding.weddingCity,
      city_tier: getCityTier(normalizedOnboarding.weddingCity),
      wedding_date: normalizedOnboarding.weddingDate || null,
      total_budget: normalizedOnboarding.totalBudget,
      guest_count: normalizedOnboarding.guestCount,
      wedding_style: normalizedOnboarding.weddingStyle,
      event_type: normalizedOnboarding.eventType,
      planning_priority: normalizedOnboarding.planningPriority,
      readiness_score: scoreResult.score,
      pressure_level: calculatePressureLevel(scoreResult.score),
      allocation_result: allocation,
    }, { onConflict: 'user_id' })

    if (error) {
      await trackServer('onboarding_sync_failed', { reason: 'upsert_failed' })
      captureApiError(error, '/api/onboarding/submit')
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  } catch (error) {
    await trackServer('onboarding_sync_failed', { reason: 'exception' })
    captureApiError(error, '/api/onboarding/submit')
    const message = error instanceof Error ? error.message : 'Gagal menyimpan onboarding.'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  const { data: account, error: accountError } = await supabase
    .from('app_users')
    .select('is_premium')
    .eq('id', user.id)
    .maybeSingle()

  if (accountError) {
    captureApiError(accountError, '/api/onboarding/submit')
  }

  await trackServer('onboarding_sync_success', {
    budget_bucket: bucketBudget(normalizedOnboarding.totalBudget),
    guest_bucket: bucketGuests(normalizedOnboarding.guestCount),
    city_tier: getCityTier(normalizedOnboarding.weddingCity),
    score_band: scoreBand(scoreResult.score),
  })
  return NextResponse.json({ ok: true, isPremium: Boolean(account?.is_premium) })
}
