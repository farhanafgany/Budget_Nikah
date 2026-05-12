import type { ReadinessLabel } from '@/lib/scoring'
import { calculateMonthlySavings, monthsUntilDate } from '@/lib/savings'
import { formatRupiah } from '@/lib/utils'

const QUOTES: Record<ReadinessLabel, string> = {
  'Healthy':   'Rencana kamu cukup realistis dan bisa dikelola dengan baik.',
  'Moderate':  'Ada beberapa hal yang perlu diperhatikan agar rencana ini lebih kuat.',
  'High Risk': 'Rencana ini perlu beberapa penyesuaian agar tidak terasa terlalu berat.',
}

const LABEL_COLORS: Record<ReadinessLabel, string> = {
  'Healthy':   'bg-green-100 text-green-700',
  'Moderate':  'bg-orange-100 text-orange-700',
  'High Risk': 'bg-red-100 text-red-700',
}

interface Props {
  score: number
  label: ReadinessLabel
  totalBudget: number
  weddingDate: string
}

export function ScoreHero({ score, label, totalBudget, weddingDate }: Props) {
  const months = monthsUntilDate(weddingDate || null)
  const monthlySavings = calculateMonthlySavings(totalBudget, 0, months)

  return (
    <div className="bg-gradient-to-b from-[#F5E8EC] to-[#EDD6DE] rounded-3xl p-7 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-3">Hasil Analisis</p>
      <div className="text-[64px] font-extrabold text-nikah-deep leading-none mb-2">{score}</div>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-3">Wedding Readiness Score</p>
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 ${LABEL_COLORS[label]}`}>
        <span aria-hidden="true">✓</span> {label}
      </span>
      <p className="text-nikah-text text-sm font-light leading-relaxed italic mb-4">
        &ldquo;{QUOTES[label]}&rdquo;
      </p>
      <div className="bg-white/60 rounded-2xl px-4 py-3 inline-block">
        <p className="text-xs text-nikah-muted mb-0.5">Estimasi nabung per bulan</p>
        <p className="text-xl font-extrabold text-nikah-deep">{formatRupiah(monthlySavings)}/bln</p>
        <p className="text-[10px] text-nikah-muted mt-0.5">selama {months} bulan ke depan</p>
      </div>
    </div>
  )
}
