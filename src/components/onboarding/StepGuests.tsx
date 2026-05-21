'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'

function formatRupiah(n: number) {
  if (n >= 1_000_000) return `Rp ${Math.round(n / 1_000_000)}jt`
  if (n >= 1_000) return `Rp ${Math.round(n / 1_000)}rb`
  return `Rp ${n.toLocaleString('id-ID')}`
}

function getBudgetPerGuestColor(perGuest: number): string {
  if (perGuest >= 250_000) return 'text-green-700'
  if (perGuest >= 150_000) return 'text-nikah-deep'
  return 'text-orange-600'
}

function getBudgetPerGuestLabel(perGuest: number): string {
  if (perGuest >= 350_000) return 'Cukup untuk catering Elegant–Luxury'
  if (perGuest >= 250_000) return 'Cukup untuk catering Elegant'
  if (perGuest >= 150_000) return 'Cukup untuk catering Simple–Standar'
  if (perGuest >= 80_000)  return 'Sangat ketat — perlu simulasi lebih dalam'
  return 'Budget per tamu terlalu kecil untuk estimasi akurat'
}

export function StepGuests() {
  const { guestCount, totalBudget, setField, nextStep, prevStep } = useOnboardingStore()
  const perGuest = guestCount > 0 && totalBudget > 0 ? Math.round(totalBudget / guestCount) : 0

  return (
    <StepWrapper stepIndex={4} onNext={nextStep} onBack={prevStep} nextDisabled={guestCount <= 0}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Tamu</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Berapa jumlah tamu?</h2>
      <p className="text-nikah-muted text-sm mb-8 font-light">Perkiraan total undangan dua keluarga.</p>

      <div>
        <label htmlFor="guestCount" className="block text-xs font-bold text-nikah-text mb-1.5">Jumlah tamu</label>
        <input
          id="guestCount"
          type="text"
          inputMode="numeric"
          value={guestCount || ''}
          onChange={e => setField('guestCount', parseInt(e.target.value.replace(/\D/g, ''), 10) || 0)}
          placeholder="300"
          className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm text-nikah-text placeholder:text-nikah-muted focus:outline-none focus:border-nikah-mauve transition"
        />
        <p className="text-nikah-muted text-xs mt-2">
          Contoh: 100–200 intimate · 300–500 standar · 500+ besar
        </p>
      </div>

      {perGuest > 0 && (
        <div
          className="mt-6 border border-nikah-border rounded-2xl px-4 py-4"
          style={{ background: 'linear-gradient(135deg, #FFFCF8 0%, #F8F1EA 100%)' }}
        >
          <p className="text-xs font-bold text-nikah-muted uppercase tracking-widest mb-1">Estimasi budget per tamu</p>
          <div className="flex items-baseline gap-2 mt-1 mb-1">
            <span className={`text-2xl font-extrabold ${getBudgetPerGuestColor(perGuest)}`} style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontStyle: 'italic' }}>
              {formatRupiah(perGuest)}
            </span>
            <span className="text-sm font-semibold text-nikah-muted">per tamu</span>
          </div>
          <p className="text-nikah-muted text-xs">{getBudgetPerGuestLabel(perGuest)}</p>
        </div>
      )}
    </StepWrapper>
  )
}
