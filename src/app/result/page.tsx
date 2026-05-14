'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useSimulationStore } from '@/stores/simulationStore'
import { calculateAllocation } from '@/lib/allocation'
import { calculateScore } from '@/lib/scoring'
import { generateInsights } from '@/lib/insights'
import { calculateMonthlySavings, monthsUntilDate } from '@/lib/savings'
import { CHECKLIST_ITEMS } from '@/lib/checklistItems'
import { ScoreHero }          from '@/components/result/ScoreHero'
import { InsightCards }       from '@/components/result/InsightCards'
import { SimulationControls } from '@/components/result/SimulationControls'
import { PremiumTease }       from '@/components/result/PremiumTease'
import AllocationChart        from '@/components/result/AllocationChart'
import { BrandLogo }          from '@/components/ui/BrandLogo'
import { createClient }       from '@/lib/supabase/client'

function ResultNavbar({ isSignedIn }: { isSignedIn: boolean }) {
  const saveHref = '/auth/login?next=/result/saved'

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-nikah-border">
      <div className="max-w-[1080px] mx-auto px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <BrandLogo size="sm" />
        </Link>
        <Link
          href={isSignedIn ? '/dashboard' : saveHref}
          className="inline-flex items-center justify-center rounded-full border border-nikah-deep px-4 py-2 text-xs font-bold text-nikah-deep transition-colors hover:bg-nikah-bg"
        >
          {isSignedIn ? 'Dashboard →' : 'Simpan & Kelola →'}
        </Link>
      </div>
    </header>
  )
}

export default function ResultPage() {
  const router = useRouter()
  const onboarding = useOnboardingStore()
  const sim = useSimulationStore()
  const [mounted, setMounted] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const isComplete = onboarding.isComplete()

  useEffect(() => {
    setMounted(true)
    const supabase = createClient()

    supabase.auth.getSession().then(({ data }) => {
      setIsSignedIn(Boolean(data.session?.user))
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(Boolean(session?.user))
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (!isComplete) {
      router.replace('/onboarding')
    } else {
      sim.init(onboarding.guestCount, onboarding.weddingStyle)
    }
  }, [mounted, isComplete, onboarding.guestCount, onboarding.weddingStyle, router, sim.init])

  const { allocation, scoreResult, insights } = useMemo(() => {
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
    return {
      allocation: alloc,
      scoreResult: sr,
      insights: generateInsights({
        totalBudget: onboarding.totalBudget,
        guestCount: sim.guestCount || onboarding.guestCount,
        weddingStyle: sim.weddingStyle || onboarding.weddingStyle,
        planningPriority: onboarding.planningPriority,
        weddingCity: onboarding.weddingCity,
        allocation: alloc,
        score: sr.score,
        weddingDate: onboarding.weddingDate,
      }),
    }
  }, [onboarding.totalBudget, onboarding.guestCount, onboarding.weddingStyle, onboarding.planningPriority, onboarding.weddingCity,
      onboarding.weddingDate, sim.guestCount, sim.weddingStyle])

  if (!mounted || !isComplete) return null

  const months = monthsUntilDate(onboarding.weddingDate)
  const monthlySavings = calculateMonthlySavings(onboarding.totalBudget, 0, months)

  return (
    <main className="min-h-screen bg-nikah-bg" style={{ paddingBottom: 60 }}>
      <ResultNavbar isSignedIn={isSignedIn} />
      <div className="max-w-[1080px] mx-auto px-6 pt-9">

        <ScoreHero
          score={scoreResult.score}
          label={scoreResult.label}
          totalBudget={onboarding.totalBudget}
          weddingDate={onboarding.weddingDate}
        />

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-5 mt-5">

          {/* Left: allocation + insights */}
          <div className="flex flex-col gap-5">
            <AllocationChart allocation={allocation} />
            <InsightCards insights={insights} />
          </div>

          {/* Right: simulation + premium */}
          <div className="flex flex-col gap-5">
            <SimulationControls />
            <PremiumTease
              totalBudget={onboarding.totalBudget}
              monthlySavings={monthlySavings}
              checklistCount={CHECKLIST_ITEMS.length}
              isSignedIn={isSignedIn}
            />
          </div>
        </div>

      </div>
    </main>
  )
}
