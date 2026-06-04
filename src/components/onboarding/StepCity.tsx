'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'
import { CitySearchSelect } from './CitySearchSelect'

export function StepCity() {
  const { weddingCity, setField, nextStep } = useOnboardingStore()

  return (
    <StepWrapper stepIndex={0} onNext={nextStep} nextDisabled={!weddingCity}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Lokasi</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Di kota mana?</h2>
      <p className="text-nikah-muted text-sm mb-6 font-light">Mulai dari kota dulu supaya estimasi biaya lebih realistis.</p>

      <div>
        <label className="block text-xs font-bold text-nikah-text mb-1.5">Kota pernikahan</label>
        <CitySearchSelect
          value={weddingCity}
          onChange={city => setField('weddingCity', city)}
        />
        {weddingCity && (
          <p className="text-nikah-muted text-xs mt-2">
            ✓ Kalkulasi disesuaikan untuk {weddingCity}
          </p>
        )}
      </div>
    </StepWrapper>
  )
}
