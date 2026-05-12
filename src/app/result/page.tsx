'use client'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useSimulationStore } from '@/stores/simulationStore'
import { calculateAllocation } from '@/lib/allocation'
import { calculateScore, calculatePressureLevel } from '@/lib/scoring'
import { generateInsights } from '@/lib/insights'
import { ScoreHero }          from '@/components/result/ScoreHero'
import { PressureCard }       from '@/components/result/PressureCard'
import { InsightCards }       from '@/components/result/InsightCards'
import { SimulationControls } from '@/components/result/SimulationControls'
import { PremiumTease }       from '@/components/result/PremiumTease'

const AllocationChart = dynamic(() => import('@/components/result/AllocationChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl p-5 border border-nikah-border animate-pulse">
      <div className="h-3 w-24 bg-nikah-border rounded mb-4" />
      <div className="h-48 bg-nikah-bg rounded-xl" />
    </div>
  ),
})

export default function ResultPage() {
  const router = useRouter()
  const onboarding = useOnboardingStore()
  const sim = useSimulationStore()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!onboarding.isComplete()) {
      router.replace('/onboarding')
    } else {
      sim.init(onboarding.guestCount, onboarding.weddingStyle)
    }
  }, [])

  const { allocation, scoreResult, pressureLevel, insights } = useMemo(() => {
    const alloc = calculateAllocation({
      totalBudget: onboarding.totalBudget,
      guestCount: sim.guestCount,
      weddingStyle: sim.weddingStyle,
      planningPriority: onboarding.planningPriority,
    })
    const sr = calculateScore({
      totalBudget: onboarding.totalBudget,
      guestCount: sim.guestCount,
      weddingStyle: sim.weddingStyle,
      planningPriority: onboarding.planningPriority,
      weddingCity: onboarding.weddingCity,
      allocation: alloc,
    })
    return {
      allocation: alloc,
      scoreResult: sr,
      pressureLevel: calculatePressureLevel(sr.score),
      insights: generateInsights({
        totalBudget: onboarding.totalBudget,
        guestCount: sim.guestCount,
        weddingStyle: sim.weddingStyle,
        planningPriority: onboarding.planningPriority,
        weddingCity: onboarding.weddingCity,
        allocation: alloc,
        score: sr.score,
        weddingDate: onboarding.weddingDate,
      }),
    }
  }, [onboarding.totalBudget, onboarding.planningPriority, onboarding.weddingCity,
      onboarding.weddingDate, sim.guestCount, sim.weddingStyle])

  if (!onboarding.isComplete()) return null

  return (
    <main className="min-h-screen bg-nikah-bg pb-32">
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <ScoreHero
          score={scoreResult.score}
          label={scoreResult.label}
          totalBudget={onboarding.totalBudget}
          weddingDate={onboarding.weddingDate}
        />
        <PressureCard pressureLevel={pressureLevel} allocation={allocation} />
        <AllocationChart allocation={allocation} />
        <InsightCards insights={insights} />
        <SimulationControls />
        <PremiumTease />
      </div>

      {/* Sticky save CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/90 backdrop-blur border-t border-nikah-border">
        <Link
          href="/auth/login"
          className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center"
        >
          Simpan Hasil Ini →
        </Link>
      </div>
    </main>
  )
}
