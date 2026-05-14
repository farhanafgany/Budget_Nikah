'use client'
import { useSimulationStore } from '@/stores/simulationStore'
import { Lightbulb, SlidersHorizontal } from 'lucide-react'

const STYLES = ['simple', 'elegant', 'luxury', 'traditional', 'modern']
const STYLE_LABELS: Record<string, string> = {
  simple: 'Simple', elegant: 'Elegant', luxury: 'Luxury', traditional: 'Traditional', modern: 'Modern',
}

export function SimulationControls() {
  const { guestCount, weddingStyle, setGuestCount, setWeddingStyle } = useSimulationStore()

  return (
    <div className="bg-white rounded-[20px] border border-nikah-border shadow-sm" style={{ padding: 28 }}>
      <div className="flex items-center justify-between gap-3" style={{ marginBottom: 4 }}>
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-nikah-bg text-nikah-deep">
            <SlidersHorizontal size={15} strokeWidth={1.8} />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-nikah-mauve">
            Simulasi Skenario
          </span>
        </span>
        <span className="text-xs font-semibold text-nikah-muted">Live update</span>
      </div>

      {/* Guest count block */}
      <div style={{ padding: '14px 0', borderBottom: '1px solid var(--nikah-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontSize: 13, fontWeight: 700, color: 'var(--nikah-text)' }}>
          <span>Jumlah Tamu</span>
          <span style={{ color: 'var(--nikah-deep)', fontWeight: 800 }}>{guestCount} orang</span>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--nikah-muted)', marginTop: 2 }}>
          <span>50</span>
          <span>525</span>
          <span>1000</span>
        </div>
      </div>

      {/* Style block */}
      <div style={{ padding: '14px 0' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--nikah-text)', marginBottom: 8 }}>
          Gaya Wedding
        </div>
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

      {/* Tip */}
      <div style={{ background: '#FFFBF1', border: '1px solid #F2E2C2', color: '#8A6A2E', borderRadius: 12, padding: '10px 14px', fontSize: 12, lineHeight: 1.45, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Lightbulb size={14} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
        <span>Kurangi tamu atau pilih gaya lebih sederhana untuk skor lebih tinggi.</span>
      </div>
    </div>
  )
}
