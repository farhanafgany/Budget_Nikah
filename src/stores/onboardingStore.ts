import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface OnboardingData {
  partnerOneName: string
  partnerTwoName: string
  weddingCity: string
  weddingDate: string
  totalBudget: number
  guestCount: number
  weddingStyle: string
  eventType: string
  planningPriority: string
}

interface OnboardingStore extends OnboardingData {
  currentStep: number
  isComplete: () => boolean
  setField: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

const INITIAL: OnboardingData = {
  partnerOneName: '',
  partnerTwoName: '',
  weddingCity: '',
  weddingDate: '',
  totalBudget: 0,
  guestCount: 0,
  weddingStyle: '',
  eventType: '',
  planningPriority: '',
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      ...INITIAL,
      currentStep: 0,
      isComplete: () => {
        const s = get()
        return !!(s.partnerOneName && s.weddingCity && s.totalBudget && s.guestCount && s.weddingStyle && s.planningPriority)
      },
      setField: (key, value) => set({ [key]: value } as Partial<OnboardingStore>),
      nextStep: () => set(s => ({ currentStep: s.currentStep + 1 })),
      prevStep: () => set(s => ({ currentStep: Math.max(0, s.currentStep - 1) })),
      reset: () => set({ ...INITIAL, currentStep: 0 }),
    }),
    { name: 'budgetnikah-onboarding' }
  )
)
