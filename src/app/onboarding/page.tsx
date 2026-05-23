'use client'
import { useEffect } from 'react'
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
  StepNames,
  StepCity,
  StepDate,
  StepBudget,
  StepGuests,
  StepStyle,
  StepEventPriority,
  StepConfirmation,
]

const STEP_NAMES = ['names', 'city', 'date', 'budget', 'guests', 'style', 'event_priority', 'confirmation']

export default function OnboardingPage() {
  const currentStep = useOnboardingStore(s => s.currentStep)
  const totalBudget = useOnboardingStore(s => s.totalBudget)
  const guestCount = useOnboardingStore(s => s.guestCount)
  const weddingCity = useOnboardingStore(s => s.weddingCity)

  useEffect(() => {
    if (currentStep === 0) {
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
