'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'
import { TIER_A_CITIES, TIER_B_CITIES, TIER_C_CITIES } from '@/lib/cityTiers'

export function StepCity() {
  const { weddingCity, setField, nextStep, prevStep } = useOnboardingStore()

  return (
    <StepWrapper stepIndex={1} onNext={nextStep} onBack={prevStep} nextDisabled={!weddingCity}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Lokasi</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Di kota mana?</h2>
      <p className="text-nikah-muted text-sm mb-6 font-light">Harga layanan berbeda di tiap kota.</p>

      <div>
        <label htmlFor="weddingCity" className="block text-xs font-bold text-nikah-text mb-1.5">Kota pernikahan</label>
        <select
          id="weddingCity"
          value={weddingCity}
          onChange={e => setField('weddingCity', e.target.value)}
          className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm text-nikah-text focus:outline-none focus:border-nikah-mauve transition"
        >
          <option value="">Pilih kota...</option>
          <optgroup label="Kota Besar (Tier A)">
            {TIER_A_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </optgroup>
          <optgroup label="Kota Menengah (Tier B)">
            {TIER_B_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </optgroup>
          <optgroup label="Kota Lainnya">
            {TIER_C_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </optgroup>
        </select>
      </div>
    </StepWrapper>
  )
}
