'use client'
import { useSimulationStore } from '@/stores/simulationStore'

const STYLES = ['simple', 'elegant', 'luxury', 'traditional', 'modern']
const STYLE_LABELS: Record<string, string> = {
  simple:'Simple', elegant:'Elegant', luxury:'Luxury', traditional:'Traditional', modern:'Modern',
}

export function SimulationControls() {
  const { guestCount, weddingStyle, setGuestCount, setWeddingStyle } = useSimulationStore()

  return (
    <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-4">Simulasi Skenario</h3>

      {/* Guest count slider */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-nikah-text">Jumlah Tamu</span>
          <span className="text-sm font-extrabold text-nikah-deep">{guestCount} orang</span>
        </div>
        <input
          type="range"
          min={50}
          max={1000}
          step={25}
          value={guestCount}
          onChange={e => setGuestCount(Number(e.target.value))}
          className="w-full accent-nikah-deep"
          aria-label="Jumlah tamu"
        />
        <div className="flex justify-between text-[10px] text-nikah-muted mt-1">
          <span>50</span><span>1000</span>
        </div>
      </div>

      {/* Style switcher */}
      <div>
        <span className="text-xs font-bold text-nikah-text block mb-2">Gaya Wedding</span>
        <div className="flex flex-wrap gap-2">
          {STYLES.map(s => (
            <button
              key={s}
              onClick={() => setWeddingStyle(s)}
              aria-pressed={weddingStyle === s}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                weddingStyle === s
                  ? 'bg-nikah-deep text-white border-nikah-deep'
                  : 'bg-nikah-bg text-nikah-muted border-nikah-border hover:border-nikah-mauve'
              }`}
            >
              {STYLE_LABELS[s]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
