'use client'
import { useEffect, useState } from 'react'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepNames }         from '@/components/onboarding/StepNames'
import { StepCity }          from '@/components/onboarding/StepCity'
import { StepDate }          from '@/components/onboarding/StepDate'
import { StepBudget }        from '@/components/onboarding/StepBudget'
import { StepGuests }        from '@/components/onboarding/StepGuests'
import { StepStyle }         from '@/components/onboarding/StepStyle'
import { StepEventPriority } from '@/components/onboarding/StepEventPriority'
import { StepConfirmation }  from '@/components/onboarding/StepConfirmation'

const STEPS = [
  StepNames,
  StepCity,
  StepDate,
  StepBudget,
  StepGuests,
  StepStyle,
  StepEventPriority,
  StepConfirmation,
]

function WelcomeBackBanner({ step, name }: { step: number; name: string }) {
  const [visible, setVisible] = useState(true)
  if (!visible || step === 0 || !name) return null
  return (
    <div
      className="fixed top-14 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{ padding: '0 16px' }}
    >
      <div
        className="pointer-events-auto flex items-center gap-3 bg-white border border-nikah-border rounded-full shadow-md"
        style={{ padding: '8px 16px 8px 12px', fontSize: 13 }}
      >
        <span className="text-nikah-deep">👋</span>
        <span className="text-nikah-text font-medium">
          Lanjut dari langkah {step + 1}, {name}
        </span>
        <button
          onClick={() => setVisible(false)}
          className="text-nikah-muted hover:text-nikah-text transition ml-1 text-base leading-none"
          aria-label="Tutup"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  const currentStep = useOnboardingStore(s => s.currentStep)
  const name = useOnboardingStore(s => s.partnerOneName)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Hanya tampilkan banner jika user kembali ke tengah-tengah (bukan dari awal)
    if (currentStep > 0 && name) setShowBanner(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const Step = STEPS[Math.min(currentStep, STEPS.length - 1)]
  return (
    <>
      {showBanner && <WelcomeBackBanner step={currentStep} name={name} />}
      <Step />
    </>
  )
}
