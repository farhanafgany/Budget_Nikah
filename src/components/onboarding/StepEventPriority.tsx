'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'

const EVENT_TYPES = [
  { value: 'akad_resepsi', label: 'Akad + Resepsi', icon: '💍' },
  { value: 'resepsi',      label: 'Resepsi Saja',   icon: '🎊' },
  { value: 'akad',         label: 'Akad Saja',      icon: '📿' },
  { value: 'intimate',     label: 'Intimate',        icon: '🕯️' },
]

const PRIORITIES = [
  { value: 'hemat',      label: 'Hemat Cerdas',        desc: 'Maksimalkan nilai di setiap rupiah' },
  { value: 'balanced',   label: 'Seimbang',             desc: 'Balance antara kualitas dan budget' },
  { value: 'experience', label: 'Kesan Tak Terlupakan', desc: 'Pengalaman adalah prioritas utama' },
]

export function StepEventPriority() {
  const { eventType, planningPriority, setField, prevStep, nextStep } = useOnboardingStore()
  const canNext = !!eventType && !!planningPriority

  function handleSet<K extends 'eventType' | 'planningPriority'>(key: K, value: string) {
    setField(key, value as never)
  }

  return (
    <StepWrapper
      stepIndex={4}
      onNext={nextStep}
      onBack={prevStep}
      nextLabel="Lanjut →"
      nextDisabled={!canNext}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Prioritas</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Jenis acara & prioritas</h2>
      <p className="text-nikah-muted text-sm mb-6 font-light">
        {canNext ? '✓ Semua dipilih — tinggal detail akhir.' : 'Dua pilihan ini bantu kami membaca gaya keputusan kalian.'}
      </p>

      <div className="mb-6">
        <p className="text-xs font-bold text-nikah-text mb-3">Jenis acara</p>
        <div className="grid grid-cols-2 gap-2">
          {EVENT_TYPES.map(e => (
            <button
              key={e.value}
              onClick={() => handleSet('eventType', e.value)}
              aria-pressed={eventType === e.value}
              className={`flex flex-col items-center gap-1.5 bg-white border-2 rounded-2xl p-3 transition ${
                eventType === e.value ? 'border-nikah-deep bg-[#F5E8EC]' : 'border-nikah-border hover:border-nikah-mauve'
              }`}
            >
              <span className="text-xl">{e.icon}</span>
              <span className="text-xs font-semibold text-nikah-text text-center leading-snug">{e.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-nikah-text mb-3">Prioritas perencanaan</p>
        <div className="space-y-2">
          {PRIORITIES.map(p => (
            <button
              key={p.value}
              onClick={() => handleSet('planningPriority', p.value)}
              aria-pressed={planningPriority === p.value}
              className={`w-full flex flex-col bg-white border-2 rounded-2xl px-4 py-3 text-left transition ${
                planningPriority === p.value ? 'border-nikah-deep bg-[#F5E8EC]' : 'border-nikah-border hover:border-nikah-mauve'
              }`}
            >
              <span className="font-bold text-nikah-text text-sm">{p.label}</span>
              <span className="text-nikah-muted text-xs">{p.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </StepWrapper>
  )
}
