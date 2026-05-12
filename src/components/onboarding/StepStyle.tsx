'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'

const STYLES = [
  { value: 'simple',      label: 'Simple',      icon: '🌿', desc: 'Bersih, minimalis, tanpa berlebihan' },
  { value: 'elegant',     label: 'Elegant',     icon: '🌸', desc: 'Rapi, berkelas, detail yang indah' },
  { value: 'luxury',      label: 'Luxury',      icon: '💎', desc: 'Mewah, grand, kesan yang tak terlupakan' },
  { value: 'traditional', label: 'Traditional', icon: '🏮', desc: 'Adat dan budaya sebagai jiwa acara' },
  { value: 'modern',      label: 'Modern',      icon: '✨', desc: 'Kontemporer, stylish, penuh karakter' },
]

export function StepStyle() {
  const { weddingStyle, setField, nextStep, prevStep } = useOnboardingStore()

  return (
    <StepWrapper stepIndex={5} onNext={nextStep} onBack={prevStep} nextDisabled={!weddingStyle}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Gaya</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Gaya wedding impian?</h2>
      <p className="text-nikah-muted text-sm mb-6 font-light">Pilih yang paling menggambarkan visi kalian.</p>

      <div className="space-y-3">
        {STYLES.map(s => (
          <button
            key={s.value}
            onClick={() => setField('weddingStyle', s.value)}
            className={`w-full flex items-center gap-4 bg-white border-2 rounded-2xl px-4 py-3.5 text-left transition ${
              weddingStyle === s.value
                ? 'border-nikah-deep bg-[#F5E8EC]'
                : 'border-nikah-border hover:border-nikah-mauve'
            }`}
          >
            <span className="text-2xl flex-shrink-0">{s.icon}</span>
            <div>
              <p className="font-bold text-nikah-text text-sm">{s.label}</p>
              <p className="text-nikah-muted text-xs">{s.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </StepWrapper>
  )
}
