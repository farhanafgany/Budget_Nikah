'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useSimulationStore } from '@/stores/simulationStore'
import { bucketBudget, bucketGuests, scoreBand, track } from '@/lib/analytics'
import { calculateAllocation } from '@/lib/allocation'
import { getCityTier } from '@/lib/cityTiers'
import { calculateScore } from '@/lib/scoring'
import { CHECKLIST_ITEMS } from '@/lib/checklistItems'
import { ScoreHero }          from '@/components/result/ScoreHero'
import { PremiumTease }       from '@/components/result/PremiumTease'
import { InsightCards }       from '@/components/result/InsightCards'
import { BrandLogo }          from '@/components/ui/BrandLogo'
import { TrackedLink }        from '@/components/analytics/TrackedLink'
import { generateInsights, generatePrimaryInsights } from '@/lib/insights'

function ResultSkeleton() {
  return (
    <main className="premium-theme min-h-screen bg-nikah-bg">
      <header className="sticky top-0 z-40 bg-white border-b border-nikah-border">
        <div className="max-w-[1080px] mx-auto px-6 md:px-8 h-14 md:h-16 flex items-center justify-between">
          <div className="h-6 w-32 bg-nikah-border rounded-full animate-pulse" />
          <div className="h-8 w-24 bg-nikah-border rounded-full animate-pulse" />
        </div>
      </header>
      <div className="max-w-[1040px] mx-auto px-6 pb-12" style={{ paddingTop: 58 }}>
        <div className="bg-white border border-nikah-border rounded-3xl p-8 animate-pulse" style={{ marginBottom: 28 }}>
          <div className="h-4 w-48 bg-nikah-border rounded-full mb-4" />
          <div className="h-16 w-24 bg-nikah-border rounded-full mb-3" />
          <div className="h-4 w-64 bg-nikah-border rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white border border-nikah-border rounded-2xl p-6 animate-pulse">
              <div className="h-4 w-32 bg-nikah-border rounded-full mb-3" />
              <div className="h-3 w-full bg-nikah-border rounded-full mb-2" />
              <div className="h-3 w-4/5 bg-nikah-border rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

function ResultNavbar({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-nikah-border">
      <div className="max-w-[1080px] mx-auto px-6 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <BrandLogo size="sm" />
        </Link>
        {/* Mobile: ajak simpan jika belum login, atau akses premium jika sudah */}
        {isSignedIn ? (
          <TrackedLink
            href="/premium"
            event="result_premium_cta_clicked"
            eventProps={{ cta_location: 'result_nav_mobile', is_signed_in: true }}
            className="md:hidden inline-flex items-center rounded-full font-bold transition-colors hover:bg-nikah-bg"
            style={{ gap: 6, padding: '10px 16px', fontSize: 12, background: 'var(--nikah-bg)', color: 'var(--nikah-deep)', border: '1px solid var(--nikah-border)' }}
          >
            Buka rencana — Rp 149rb →
          </TrackedLink>
        ) : (
          <TrackedLink
            href="/auth/signup?next=/premium"
            event="save_result_clicked"
            eventProps={{ cta_location: 'result_nav_mobile', target: 'auth_signup' }}
            className="md:hidden inline-flex items-center rounded-full font-bold transition-opacity hover:opacity-80"
            style={{ gap: 6, padding: '10px 16px', fontSize: 12, background: 'var(--nikah-deep)', color: '#fff' }}
          >
            Simpan hasil →
          </TrackedLink>
        )}
        {/* Desktop: link to premium */}
        <TrackedLink
          href="/premium"
          event="result_premium_cta_clicked"
          eventProps={{ cta_location: 'result_nav_desktop' }}
          className="hidden md:inline-flex items-center justify-center rounded-full border border-nikah-deep px-4 py-2 text-xs font-bold text-nikah-deep transition-colors hover:bg-nikah-bg"
        >
          Buka rencana →
        </TrackedLink>
      </div>
    </header>
  )
}

export default function ResultPage() {
  const router = useRouter()
  const onboarding = useOnboardingStore()
  const sim = useSimulationStore()
  const initSimulation = useSimulationStore(s => s.init)
  const [mounted, setMounted] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const resultTrackedRef = useRef(false)
  const isComplete = onboarding.isComplete()

  useEffect(() => {
    let active = true
    let unsubscribe: (() => void) | undefined

    setMounted(true)

    void import('@/lib/supabase/client')
      .then(({ createClient }) => {
        if (!active) return
        const supabase = createClient()

        supabase.auth
          .getSession()
          .then(({ data }) => {
            if (!active) return
            setIsSignedIn(Boolean(data.session?.user))
            setAuthChecked(true)
          })
          .catch(() => {
            if (!active) return
            setIsSignedIn(false)
            setAuthChecked(true)
          })

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!active) return
          setIsSignedIn(Boolean(session?.user))
          setAuthChecked(true)
        })
        unsubscribe = () => listener.subscription.unsubscribe()
      })
      .catch(() => {
        if (!active) return
        setIsSignedIn(false)
        setAuthChecked(true)
      })

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (!isComplete) {
      if (!authChecked) return
      // User sudah login tapi tidak ada data onboarding di localStorage
      // (misal: ganti perangkat, atau baru saja login). Arahkan ke dashboard
      // (atau /premium jika belum premium) daripada kembali ke onboarding.
      if (isSignedIn) {
        router.replace('/dashboard')
      } else {
        router.replace('/onboarding')
      }
    } else {
      initSimulation(onboarding.guestCount, onboarding.weddingStyle)
    }
  }, [mounted, isComplete, authChecked, isSignedIn, onboarding.guestCount, onboarding.weddingStyle, router, initSimulation])

  const { scoreResult, insights, primaryInsights } = useMemo(() => {
    const alloc = calculateAllocation({
      totalBudget: onboarding.totalBudget,
      guestCount: sim.guestCount || onboarding.guestCount,
      weddingStyle: sim.weddingStyle || onboarding.weddingStyle,
      planningPriority: onboarding.planningPriority,
    })
    const sr = calculateScore({
      totalBudget: onboarding.totalBudget,
      guestCount: sim.guestCount || onboarding.guestCount,
      weddingStyle: sim.weddingStyle || onboarding.weddingStyle,
      planningPriority: onboarding.planningPriority,
      weddingCity: onboarding.weddingCity,
      allocation: alloc,
    })
    const insightInput = {
      totalBudget: onboarding.totalBudget,
      guestCount: sim.guestCount || onboarding.guestCount,
      weddingStyle: sim.weddingStyle || onboarding.weddingStyle,
      planningPriority: onboarding.planningPriority,
      weddingCity: onboarding.weddingCity,
      allocation: alloc,
      score: sr.score,
      weddingDate: onboarding.weddingDate,
    }
    const ins = generateInsights(insightInput)
    const primary = generatePrimaryInsights(insightInput)
    return { scoreResult: sr, insights: ins, primaryInsights: primary }
  }, [onboarding.totalBudget, onboarding.guestCount, onboarding.weddingStyle, onboarding.planningPriority, onboarding.weddingCity,
      onboarding.weddingDate, sim.guestCount, sim.weddingStyle])

  useEffect(() => {
    if (!mounted || !isComplete || resultTrackedRef.current) return
    resultTrackedRef.current = true
    track('result_viewed', {
      score_band: scoreBand(scoreResult.score),
      budget_bucket: bucketBudget(onboarding.totalBudget),
      guest_bucket: bucketGuests(sim.guestCount || onboarding.guestCount),
      city_tier: onboarding.weddingCity ? getCityTier(onboarding.weddingCity) : 'unknown',
      is_signed_in: isSignedIn,
    })
  }, [mounted, isComplete, scoreResult.score, onboarding.totalBudget, onboarding.guestCount, onboarding.weddingCity, sim.guestCount, isSignedIn])

  if (!mounted || !isComplete) return <ResultSkeleton />

  return (
    <main className="premium-theme min-h-screen bg-nikah-bg">
      <ResultNavbar isSignedIn={isSignedIn} />
      <div className="max-w-[1040px] mx-auto px-6 pb-12 md:pb-[72px]" style={{ paddingTop: 58 }}>

        <ScoreHero
          score={scoreResult.score}
          label={scoreResult.label}
          totalBudget={onboarding.totalBudget}
          guestCount={sim.guestCount || onboarding.guestCount}
          weddingDate={onboarding.weddingDate}
          checklistCount={CHECKLIST_ITEMS.length}
          partnerOneName={onboarding.partnerOneName}
          weddingCity={onboarding.weddingCity}
          weddingStyle={sim.weddingStyle || onboarding.weddingStyle}
          eventType={onboarding.eventType}
          planningPriority={onboarding.planningPriority}
        />

        {insights.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <InsightCards insights={insights} primaryInsights={primaryInsights} />
          </div>
        )}

        <PremiumTease
          isSignedIn={isSignedIn}
          scoreLabel={scoreResult.label}
        />

      </div>

    </main>
  )
}
