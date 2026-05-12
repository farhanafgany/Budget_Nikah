import type { PressureLevel } from '@/lib/scoring'
import type { AllocationResult } from '@/lib/allocation'

const LEVEL_STYLE: Record<PressureLevel, { badge: string; label: string }> = {
  Low:    { badge: 'bg-green-100 text-green-700',  label: 'Rendah' },
  Medium: { badge: 'bg-orange-100 text-orange-700', label: 'Sedang' },
  High:   { badge: 'bg-red-100 text-red-700',      label: 'Tinggi' },
}

interface Props {
  pressureLevel: PressureLevel
  allocation: AllocationResult
}

function getBiggestCategory(allocation: AllocationResult): string {
  const labels: Record<keyof AllocationResult, string> = {
    catering: 'Catering', venue: 'Venue', decoration: 'Dekorasi',
    documentation: 'Dokumentasi', mua: 'MUA', souvenir: 'Souvenir',
    entertainment: 'Hiburan', emergencyFund: 'Dana Darurat',
  }
  const biggest = Object.entries(allocation).sort((a, b) => b[1].percentage - a[1].percentage)[0]
  return labels[biggest[0] as keyof AllocationResult] ?? biggest[0]
}

export function PressureCard({ pressureLevel, allocation }: Props) {
  const { badge, label } = LEVEL_STYLE[pressureLevel]
  const biggest = getBiggestCategory(allocation)

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-nikah-border">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve">Tekanan Budget</p>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badge}`}>{label}</span>
      </div>
      <p className="text-sm text-nikah-muted leading-relaxed">
        <span className="font-semibold text-nikah-text">{biggest}</span> mendominasi pengeluaran.{' '}
        {pressureLevel === 'High' && 'Pertimbangkan penyesuaian signifikan pada rencana ini.'}
        {pressureLevel === 'Medium' && 'Pertimbangkan menyesuaikan jumlah tamu atau gaya wedding.'}
        {pressureLevel === 'Low' && 'Rencana ini tampak seimbang dan manageable.'}
      </p>
    </div>
  )
}
