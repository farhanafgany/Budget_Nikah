'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'

function defaultDate() {
  const d = new Date()
  d.setMonth(d.getMonth() + 12)
  return d.toISOString().split('T')[0]
}

function monthsUntil(dateStr: string): number {
  const now = new Date()
  const target = new Date(dateStr)
  return Math.max(0, (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth()))
}

export function StepDate() {
  const { weddingDate, setField, nextStep, prevStep } = useOnboardingStore()

  function handleNext() {
    if (!weddingDate) setField('weddingDate', defaultDate())
    nextStep()
  }

  const months = weddingDate ? monthsUntil(weddingDate) : null

  return (
    <StepWrapper stepIndex={5} onNext={handleNext} onBack={prevStep}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Tanggal</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Kapan rencananya?</h2>
      <p className="text-nikah-muted text-sm mb-8 font-light">
        Estimasi hari H kalian. Belum pasti? Kosongkan saja — bisa diubah nanti.
      </p>

      <div>
        <label htmlFor="weddingDate" className="block text-xs font-bold text-nikah-text mb-1.5">
          Tanggal rencana <span className="text-nikah-muted font-normal">(opsional)</span>
        </label>
        <input
          id="weddingDate"
          type="date"
          value={weddingDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={e => setField('weddingDate', e.target.value)}
          className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm text-nikah-text focus:outline-none focus:border-nikah-mauve transition"
        />
        {months !== null && months > 0 && (
          <p className="text-nikah-muted text-xs mt-2">
            ✓ Sisa waktu sekitar <strong className="text-nikah-text">{months} bulan</strong> — checklist akan disesuaikan.
          </p>
        )}
        {!weddingDate && (
          <p className="text-nikah-muted text-xs mt-2">
            Jika dikosongkan, kami pakai estimasi 12 bulan ke depan.
          </p>
        )}
      </div>
    </StepWrapper>
  )
}
