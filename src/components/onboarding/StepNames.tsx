'use client'
import { useState } from 'react'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'

export function StepNames() {
  const { partnerOneName, partnerTwoName, setField, nextStep, prevStep } = useOnboardingStore()
  const [showHint, setShowHint] = useState(false)
  const canNext = partnerOneName.trim().length > 0

  function handleNext() {
    if (!canNext) { setShowHint(true); return false }
    nextStep()
  }

  return (
    <StepWrapper stepIndex={6} onNext={handleNext} onBack={prevStep} nextDisabled={false}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Nama</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Mau kami panggil siapa?</h2>
      <p className="text-nikah-muted text-sm mb-8 font-light">
        Cukup nama panggilan kamu. Nama pasangan boleh dikosongkan.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="partnerOneName" className="block text-xs font-bold text-nikah-text mb-1.5">Nama kamu</label>
          <input
            id="partnerOneName"
            type="text"
            value={partnerOneName}
            onChange={e => { setField('partnerOneName', e.target.value); setShowHint(false) }}
            placeholder="Contoh: Siti Nurhaliza"
            className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-nikah-text placeholder:text-nikah-muted focus:outline-none transition ${showHint ? 'border-red-400 focus:border-red-400' : 'border-nikah-border focus:border-nikah-mauve'}`}
          />
          {showHint && (
            <p className="text-red-500 text-xs mt-1.5">Isi nama kamu dulu untuk lanjut.</p>
          )}
        </div>
        <div>
          <label htmlFor="partnerTwoName" className="block text-xs font-bold text-nikah-text mb-1.5">Nama pasangan</label>
          <input
            id="partnerTwoName"
            type="text"
            value={partnerTwoName}
            onChange={e => setField('partnerTwoName', e.target.value)}
            placeholder="Contoh: Ahmad Dhani"
            className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm text-nikah-text placeholder:text-nikah-muted focus:outline-none focus:border-nikah-mauve transition"
          />
        </div>
      </div>

      <p className="text-nikah-muted text-xs mt-4">
        Data onboarding tersimpan di perangkat kalian dan tidak dikirim tanpa izin.
      </p>

      {partnerOneName && (
        <div
          className="mt-8 border border-nikah-border rounded-2xl px-4 py-4"
          style={{ background: 'linear-gradient(135deg, #FFFCF8 0%, #F8F1EA 100%)' }}
        >
          <p className="text-xs font-bold text-nikah-mauve uppercase tracking-widest mb-2">Satu langkah lagi</p>
          <p className="text-nikah-text text-sm font-medium" style={{ lineHeight: 1.55 }}>
            Hai {partnerOneName.split(' ')[0]}! Setelah ini kami rangkum estimasi biaya, kesiapan, dan prioritas
            yang cocok untuk situasi kalian.
          </p>
        </div>
      )}
    </StepWrapper>
  )
}
