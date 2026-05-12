'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'

export function StepNames() {
  const { partnerOneName, partnerTwoName, setField, nextStep } = useOnboardingStore()
  const canNext = partnerOneName.trim().length > 0

  return (
    <StepWrapper stepIndex={0} onNext={nextStep} nextDisabled={!canNext}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Pasangan</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Siapa nama kalian?</h2>
      <p className="text-nikah-muted text-sm mb-8 font-light">Untuk personalisasi rencana wedding kalian.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-nikah-text mb-1.5">Nama kamu</label>
          <input
            type="text"
            value={partnerOneName}
            onChange={e => setField('partnerOneName', e.target.value)}
            placeholder="Contoh: Siti Nurhaliza"
            className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm text-nikah-text placeholder:text-nikah-muted focus:outline-none focus:border-nikah-mauve transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-nikah-text mb-1.5">Nama pasangan</label>
          <input
            type="text"
            value={partnerTwoName}
            onChange={e => setField('partnerTwoName', e.target.value)}
            placeholder="Contoh: Ahmad Dhani"
            className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm text-nikah-text placeholder:text-nikah-muted focus:outline-none focus:border-nikah-mauve transition"
          />
        </div>
      </div>
    </StepWrapper>
  )
}
