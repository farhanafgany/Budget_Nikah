'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'

export function StepDate() {
  const { weddingDate, setField, nextStep, prevStep } = useOnboardingStore()

  return (
    <StepWrapper stepIndex={2} onNext={nextStep} onBack={prevStep} nextDisabled={!weddingDate}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Tanggal</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Kapan rencananya?</h2>
      <p className="text-nikah-muted text-sm mb-8 font-light">Estimasi hari H kamu.</p>

      <div>
        <label htmlFor="weddingDate" className="block text-xs font-bold text-nikah-text mb-1.5">Tanggal rencana</label>
        <input
          id="weddingDate"
          type="date"
          value={weddingDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={e => setField('weddingDate', e.target.value)}
          className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm text-nikah-text focus:outline-none focus:border-nikah-mauve transition"
        />
      </div>
    </StepWrapper>
  )
}
