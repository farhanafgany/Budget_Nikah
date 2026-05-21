'use client'
import { useState } from 'react'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'

export function StepNames() {
  const { partnerOneName, partnerTwoName, setField, nextStep } = useOnboardingStore()
  const [showHint, setShowHint] = useState(false)
  const canNext = partnerOneName.trim().length > 0

  function handleNext() {
    if (!canNext) { setShowHint(true); return }
    nextStep()
  }

  return (
    <StepWrapper stepIndex={0} onNext={handleNext} nextDisabled={false}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Pasangan</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Siapa nama kalian?</h2>
      <p className="text-nikah-muted text-sm mb-8 font-light">Untuk personalisasi rencana wedding kalian.</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="partnerOneName" className="block text-xs font-bold text-nikah-text mb-1.5">Nama kamu</label>
          <input
            id="partnerOneName"
            type="text"
            autoFocus
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

      {partnerOneName && (
        <div
          className="mt-8 border border-nikah-border rounded-2xl px-4 py-4"
          style={{ background: 'linear-gradient(135deg, #FFFCF8 0%, #F8F1EA 100%)' }}
        >
          <p className="text-xs font-bold text-nikah-mauve uppercase tracking-widest mb-2">Hanya 6 langkah lagi</p>
          <p className="text-nikah-text text-sm font-medium" style={{ lineHeight: 1.55 }}>
            Hai {partnerOneName.split(' ')[0]}! Kami akan hitung estimasi biaya, kesiapan, dan panduan prioritas
            khusus untuk situasi kalian — dalam 2 menit.
          </p>
          <p className="text-nikah-muted text-xs mt-2">🔒 Data tersimpan di perangkat kalian, tidak dikirim ke mana pun tanpa izin.</p>
        </div>
      )}
    </StepWrapper>
  )
}
