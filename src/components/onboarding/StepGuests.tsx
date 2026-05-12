'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'

export function StepGuests() {
  const { guestCount, setField, nextStep, prevStep } = useOnboardingStore()

  return (
    <StepWrapper stepIndex={4} onNext={nextStep} onBack={prevStep} nextDisabled={guestCount <= 0}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Tamu</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Berapa jumlah tamu?</h2>
      <p className="text-nikah-muted text-sm mb-8 font-light">Perkiraan total undangan dua keluarga.</p>

      <div>
        <label className="block text-xs font-bold text-nikah-text mb-1.5">Jumlah tamu</label>
        <input
          type="number"
          inputMode="numeric"
          value={guestCount || ''}
          onChange={e => setField('guestCount', parseInt(e.target.value, 10) || 0)}
          placeholder="300"
          min={1}
          max={3000}
          className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm text-nikah-text placeholder:text-nikah-muted focus:outline-none focus:border-nikah-mauve transition"
        />
        <p className="text-nikah-muted text-xs mt-2">
          Contoh: 100–200 intimate · 300–500 standar · 500+ besar
        </p>
      </div>
    </StepWrapper>
  )
}
