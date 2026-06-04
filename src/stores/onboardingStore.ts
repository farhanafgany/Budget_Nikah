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

const ONBOARDING_STORAGE_KEY = 'budgetnikah-onboarding'
const ONBOARDING_SEQUENCE_VERSION = 1
const EMPTY_PERSISTED_STATE = JSON.stringify({
  state: { ...INITIAL, currentStep: 0 },
  version: ONBOARDING_SEQUENCE_VERSION,
})

function getResumeStep(state: Partial<OnboardingData>) {
  if (!state.weddingCity) return 0
  if (!state.totalBudget || state.totalBudget <= 0) return 1
  if (!state.guestCount || state.guestCount <= 0) return 2
  if (!state.weddingStyle) return 3
  if (!state.eventType || !state.planningPriority) return 4
  if (!state.weddingDate) return 5
  if (!state.partnerOneName) return 6
  return 7
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      ...INITIAL,
      currentStep: 0,
      isComplete: () => {
        const s = get()
        return !!(s.partnerOneName && s.weddingCity && s.totalBudget && s.guestCount && s.weddingStyle && s.eventType && s.planningPriority)
      },
      setField: (key, value) => set({ [key]: value } as Partial<OnboardingStore>),
      nextStep: () => set(s => ({ currentStep: s.currentStep + 1 })),
      prevStep: () => set(s => ({ currentStep: Math.max(0, s.currentStep - 1) })),
      reset: () => set({ ...INITIAL, currentStep: 0 }),
    }),
    {
      name: ONBOARDING_STORAGE_KEY,
      version: ONBOARDING_SEQUENCE_VERSION,
      migrate: (persistedState) => {
        const state = (persistedState && typeof persistedState === 'object')
          ? persistedState as Partial<OnboardingData>
          : {}

        return {
          ...INITIAL,
          ...state,
          currentStep: getResumeStep(state),
        }
      },
    }
  )
)

export async function clearOnboardingStore() {
  useOnboardingStore.getState().reset()
  useOnboardingStore.persist.clearStorage()
  const resetPersistedState = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, EMPTY_PERSISTED_STATE)
    }
  }
  resetPersistedState()
  await new Promise(resolve => setTimeout(resolve, 0))
  resetPersistedState()
}
