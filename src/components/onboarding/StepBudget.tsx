'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID').format(n)
}

function parseRupiah(s: string) {
  return parseInt(s.replace(/\D/g, ''), 10) || 0
}

export function StepBudget() {
  const { totalBudget, setField, nextStep, prevStep } = useOnboardingStore()

  return (
    <StepWrapper stepIndex={3} onNext={nextStep} onBack={prevStep} nextDisabled={totalBudget <= 0}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Budget</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Berapa total budget?</h2>
      <p className="text-nikah-muted text-sm mb-8 font-light">Total biaya yang kalian siapkan.</p>

      <div>
        <label htmlFor="totalBudget" className="block text-xs font-bold text-nikah-text mb-1.5">Total budget</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-nikah-mauve">Rp</span>
          <input
            id="totalBudget"
            type="text"
            inputMode="numeric"
            value={totalBudget > 0 ? formatRupiah(totalBudget) : ''}
            onChange={e => setField('totalBudget', parseRupiah(e.target.value))}
            placeholder="50.000.000"
            className="w-full bg-white border border-nikah-border rounded-xl pl-10 pr-4 py-3 text-sm text-nikah-text placeholder:text-nikah-muted focus:outline-none focus:border-nikah-mauve transition"
          />
        </div>
        <p className="text-nikah-muted text-xs mt-2">
          Isi sesuai angka yang kalian siapkan sekarang. Nanti masih bisa disimulasikan lagi.
        </p>
      </div>
    </StepWrapper>
  )
}
