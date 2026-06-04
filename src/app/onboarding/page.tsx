'use client'
import { useEffect, useRef } from 'react'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { bucketBudget, bucketGuests, track } from '@/lib/analytics'
import { getCityTier } from '@/lib/cityTiers'
import { StepNames }         from '@/components/onboarding/StepNames'
import { StepCity }          from '@/components/onboarding/StepCity'
import { StepDate }          from '@/components/onboarding/StepDate'
import { StepBudget }        from '@/components/onboarding/StepBudget'
import { StepGuests }        from '@/components/onboarding/StepGuests'
import { StepStyle }         from '@/components/onboarding/StepStyle'
import { StepEventPriority } from '@/components/onboarding/StepEventPriority'
import { StepConfirmation }  from '@/components/onboarding/StepConfirmation'

const STEPS = [
  StepCity,
  StepBudget,
  StepGuests,
  StepStyle,
  StepEventPriority,
  StepDate,
  StepNames,
  StepConfirmation,
]

const STEP_NAMES = ['city', 'budget', 'guests', 'style', 'event_priority', 'date', 'names', 'confirmation']

export default function OnboardingPage() {
  const currentStep = useOnboardingStore(s => s.currentStep)
  const totalBudget = useOnboardingStore(s => s.totalBudget)
  const guestCount = useOnboardingStore(s => s.guestCount)
  const weddingCity = useOnboardingStore(s => s.weddingCity)
  const startedTrackedRef = useRef(false)
  const lastViewedStepRef = useRef<number | null>(null)

  useEffect(() => {
    if (lastViewedStepRef.current === currentStep) return
    lastViewedStepRef.current = currentStep

    if (currentStep === 0 && !startedTrackedRef.current) {
      startedTrackedRef.current = true
      track('onboarding_started')
    }

    track('onboarding_step_viewed', {
      step_index: currentStep,
      step_name: STEP_NAMES[currentStep] ?? 'unknown',
      budget_bucket: bucketBudget(totalBudget),
      guest_bucket: bucketGuests(guestCount),
      city_tier: weddingCity ? getCityTier(weddingCity) : 'unknown',
    })
  }, [currentStep, totalBudget, guestCount, weddingCity])

  const Step = STEPS[Math.min(currentStep, STEPS.length - 1)]
  return (
    <Step />
  )
}
