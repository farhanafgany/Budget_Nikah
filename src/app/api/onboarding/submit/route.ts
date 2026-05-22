import { NextResponse } from 'next/server'
import { calculateAllocation } from '@/lib/allocation'
import { bucketBudget, bucketGuests, scoreBand, trackServer } from '@/lib/analytics'
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

  let body: { onboarding?: OnboardingInput }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const onboarding = body.onboarding
  if (!onboarding?.partnerOneName || !onboarding.weddingCity || !onboarding.totalBudget || !onboarding.guestCount || !onboarding.weddingStyle || !onboarding.planningPriority) {
    return NextResponse.json({ error: 'Data onboarding belum lengkap.' }, { status: 400 })
  }

  const { data: account } = await supabase
    .from('app_users')
    .select('is_premium')
    .eq('id', user.id)
    .single()

  if (account?.is_premium) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const allocation = calculateAllocation({
    totalBudget: onboarding.totalBudget,
    guestCount: onboarding.guestCount,
    weddingStyle: onboarding.weddingStyle,
    planningPriority: onboarding.planningPriority,
  })
  const scoreResult = calculateScore({
    totalBudget: onboarding.totalBudget,
    guestCount: onboarding.guestCount,
    weddingStyle: onboarding.weddingStyle,
    planningPriority: onboarding.planningPriority,
    weddingCity: onboarding.weddingCity,
    allocation,
  })

  // Server-side submit keeps profile writes behind auth + rate limit.
  try {
    const { error } = await supabase.from('wedding_profiles').upsert({
      user_id: user.id,
      partner_one_name: onboarding.partnerOneName,
      partner_two_name: onboarding.partnerTwoName ?? '',
      wedding_city: onboarding.weddingCity,
      city_tier: getCityTier(onboarding.weddingCity),
      wedding_date: onboarding.weddingDate || null,
      total_budget: onboarding.totalBudget,
      guest_count: onboarding.guestCount,
      wedding_style: onboarding.weddingStyle,
      event_type: onboarding.eventType ?? '',
      planning_priority: onboarding.planningPriority,
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

  await trackServer('onboarding_sync_success', {
    budget_bucket: bucketBudget(onboarding.totalBudget),
    guest_bucket: bucketGuests(onboarding.guestCount),
    city_tier: getCityTier(onboarding.weddingCity),
    score_band: scoreBand(scoreResult.score),
  })
  return NextResponse.json({ ok: true })
}
