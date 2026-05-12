'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepNames }         from '@/components/onboarding/StepNames'
import { StepCity }          from '@/components/onboarding/StepCity'
import { StepDate }          from '@/components/onboarding/StepDate'
import { StepBudget }        from '@/components/onboarding/StepBudget'
import { StepGuests }        from '@/components/onboarding/StepGuests'
import { StepStyle }         from '@/components/onboarding/StepStyle'
import { StepEventPriority } from '@/components/onboarding/StepEventPriority'

const STEPS = [
  StepNames,
  StepCity,
  StepDate,
  StepBudget,
  StepGuests,
  StepStyle,
  StepEventPriority,
]

export default function OnboardingPage() {
  const currentStep = useOnboardingStore(s => s.currentStep)
  const Step = STEPS[Math.min(currentStep, STEPS.length - 1)]
  return <Step />
}
