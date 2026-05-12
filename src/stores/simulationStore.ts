import { create } from 'zustand'

interface SimulationStore {
  guestCount: number
  weddingStyle: string
  setGuestCount: (n: number) => void
  setWeddingStyle: (s: string) => void
  init: (guestCount: number, weddingStyle: string) => void
}

export const useSimulationStore = create<SimulationStore>((set) => ({
  guestCount: 0,
  weddingStyle: '',
  setGuestCount: (guestCount) => set({ guestCount }),
  setWeddingStyle: (weddingStyle) => set({ weddingStyle }),
  init: (guestCount, weddingStyle) => set({ guestCount, weddingStyle }),
}))
