import type { AllocationResult } from '@/lib/allocation'
import { Coins } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

const LABELS: Record<keyof AllocationResult, string> = {
  catering: 'Catering', venue: 'Venue', decoration: 'Dekorasi',
  documentation: 'Dokumentasi', mua: 'MUA & Busana', souvenir: 'Souvenir',
  entertainment: 'Hiburan', emergencyFund: 'Dana Darurat',
}

const DONUT_COLORS = ['#6B3545', '#C07888', '#C8A860', '#B98F5E', '#8C4F62', '#A38C6C', '#E8C0CC', '#9A7888']

export default function AllocationChart({ allocation }: { allocation: AllocationResult }) {
  const data = (Object.entries(allocation) as [keyof AllocationResult, { percentage: number }][])
    .filter(([, v]) => v.percentage > 0)
    .sort((a, b) => b[1].percentage - a[1].percentage)
    .map(([key, val], i) => ({
      name: LABELS[key],
      percentage: val.percentage,
      color: DONUT_COLORS[i % DONUT_COLORS.length],
    }))

  const total = data.reduce((s, d) => s + d.percentage, 0) || 100
  let prevAngle = 0
  const conicStops = data.map(d => {
    const start = prevAngle
    const end = prevAngle + (d.percentage / total) * 360
    prevAngle = end
    return `${d.color} ${start}deg ${end}deg`
  })
  const totalEstimate = (Object.values(allocation) as { estimatedAmount: number }[])
    .reduce((sum, item) => sum + item.estimatedAmount, 0)

  return (
    <div className="bg-white rounded-[20px] border border-nikah-border shadow-sm" style={{ padding: 28 }}>
      <div className="flex items-center justify-between gap-3" style={{ marginBottom: 20 }}>
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-nikah-bg text-nikah-deep">
            <Coins size={15} strokeWidth={1.8} />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-nikah-mauve">
            Alokasi Budget
          </span>
        </span>
        <span className="text-xs font-semibold text-nikah-muted">
          Total {formatRupiah(totalEstimate)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center justify-items-center sm:justify-items-stretch">
        {/* CSS conic donut */}
        <div
          style={{
            width: 180, height: 180, borderRadius: '50%', flexShrink: 0, position: 'relative',
            background: `conic-gradient(${conicStops.join(', ')})`,
          }}
        >
          <div
            style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: 88, height: 88, background: '#fff', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            <span style={{ fontSize: 11, color: 'var(--nikah-muted)', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>
              {data.length}<br />kategori
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-x-3.5 gap-y-2 w-full content-center">
          {data.map(d => (
            <div key={d.name} style={{ display: 'grid', gridTemplateColumns: '10px 1fr auto', gap: 8, alignItems: 'center', fontSize: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
              <span style={{ color: 'var(--nikah-text)', fontWeight: 500 }}>{d.name}</span>
              <span style={{ color: 'var(--nikah-muted)', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{Math.round(d.percentage)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
