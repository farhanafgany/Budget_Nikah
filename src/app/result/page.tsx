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

function ResultNavbar({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-nikah-border">
      <div className="max-w-[1080px] mx-auto px-6 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <BrandLogo size="sm" />
        </Link>
        {/* Mobile: ajak simpan jika belum login, atau akses premium jika sudah */}
        {isSignedIn ? (
          <Link
            href="/premium"
            className="md:hidden inline-flex items-center rounded-full font-bold transition-colors hover:bg-nikah-bg"
            style={{ gap: 6, padding: '6px 14px', fontSize: 12, background: 'var(--nikah-bg)', color: 'var(--nikah-deep)', border: '1px solid var(--nikah-border)' }}
          >
            Buka rencana →
          </Link>
        ) : (
          <Link
            href="/auth/login?next=/premium"
            className="md:hidden inline-flex items-center rounded-full font-bold transition-opacity hover:opacity-80"
            style={{ gap: 6, padding: '6px 14px', fontSize: 12, background: 'var(--nikah-deep)', color: '#fff' }}
          >
            Simpan hasil →
          </Link>
        )}
        {/* Desktop: link to premium */}
        <Link
          href="/premium"
          className="hidden md:inline-flex items-center justify-center rounded-full border border-nikah-deep px-4 py-2 text-xs font-bold text-nikah-deep transition-colors hover:bg-nikah-bg"
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
  }, [mounted, isComplete, isSignedIn, onboarding.guestCount, onboarding.weddingStyle, router, initSimulation])

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
        />

        <PremiumTease
          isSignedIn={isSignedIn}
        />

      </div>

    </main>
  )
}
