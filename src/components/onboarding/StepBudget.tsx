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
            placeholder="80.000.000"
            className="w-full bg-white border border-nikah-border rounded-xl pl-10 pr-4 py-3 text-sm text-nikah-text placeholder:text-nikah-muted focus:outline-none focus:border-nikah-mauve transition"
          />
        </div>
        <p className="text-nikah-muted text-xs mt-2">
          Isi angka yang kalian siapkan sekarang — bisa diubah nanti.
        </p>
        {/* Referensi cepat */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: 'Sederhana', value: 50_000_000, hint: '≤ 200 tamu' },
            { label: 'Menengah',  value: 100_000_000, hint: '250–400 tamu' },
            { label: 'Besar',     value: 200_000_000, hint: '500+ tamu' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setField('totalBudget', opt.value)}
              className={`rounded-xl border text-left px-3 py-2.5 transition ${
                totalBudget === opt.value
                  ? 'border-nikah-deep bg-[#F5E8EC]'
                  : 'border-nikah-border bg-white hover:border-nikah-mauve'
              }`}
            >
              <p className="font-bold text-nikah-text" style={{ fontSize: 11 }}>{opt.label}</p>
              <p className="text-nikah-mauve font-bold" style={{ fontSize: 11 }}>
                {opt.value >= 1_000_000 ? `${opt.value / 1_000_000}jt` : opt.value}
              </p>
              <p className="text-nikah-muted" style={{ fontSize: 10 }}>{opt.hint}</p>
            </button>
          ))}
        </div>
      </div>
    </StepWrapper>
  )
}
