'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useSimulationStore } from '@/stores/simulationStore'
import { calculateAllocation } from '@/lib/allocation'
import { calculateScore } from '@/lib/scoring'
import { CHECKLIST_ITEMS } from '@/lib/checklistItems'
import { ScoreHero }          from '@/components/result/ScoreHero'
import { PremiumTease }       from '@/components/result/PremiumTease'
import { BrandLogo }          from '@/components/ui/BrandLogo'
import { createClient }       from '@/lib/supabase/client'

function ResultNavbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-nikah-border">
      <div className="max-w-[1080px] mx-auto px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <BrandLogo size="sm" />
        </Link>
        <Link
          href="/premium"
          className="inline-flex items-center justify-center rounded-full border border-nikah-deep px-4 py-2 text-xs font-bold text-nikah-deep transition-colors hover:bg-nikah-bg"
        >
          Buka rencana →
        </Link>
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
      initSimulation(onboarding.guestCount, onboarding.weddingStyle)
    }
  }, [mounted, isComplete, onboarding.guestCount, onboarding.weddingStyle, router, initSimulation])

  const { scoreResult } = useMemo(() => {
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
      scoreResult: sr,
    }
  }, [onboarding.totalBudget, onboarding.guestCount, onboarding.weddingStyle, onboarding.planningPriority, onboarding.weddingCity,
      sim.guestCount, sim.weddingStyle])

  if (!mounted || !isComplete) return null

  return (
    <main className="premium-theme min-h-screen bg-nikah-bg">
      <ResultNavbar />
      <div className="max-w-[1040px] mx-auto px-6 pb-24 md:pb-[72px]" style={{ paddingTop: 58 }}>

        <ScoreHero
          score={scoreResult.score}
          label={scoreResult.label}
          totalBudget={onboarding.totalBudget}
          guestCount={sim.guestCount || onboarding.guestCount}
          weddingDate={onboarding.weddingDate}
          checklistCount={CHECKLIST_ITEMS.length}
        />

        <PremiumTease
          isSignedIn={isSignedIn}
        />

      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-4 pt-3" style={{ background: 'linear-gradient(to top, rgba(255,255,255,1) 70%, rgba(255,255,255,0))' }}>
        <Link
          href="/premium"
          className="block w-full text-white font-bold py-4 rounded-full text-center text-sm"
          style={{ background: 'linear-gradient(160deg, #5A1E2A 0%, #3D1419 100%)', boxShadow: '0 6px 20px rgba(90,30,42,0.28)' }}
        >
          Lanjutkan persiapan — Rp 149rb →
        </Link>
      </div>
    </main>
  )
}
