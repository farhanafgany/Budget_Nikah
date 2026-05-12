import type { ReadinessLabel } from '@/lib/scoring'

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
}

export function ScoreHero({ score, label }: Props) {
  return (
    <div className="bg-gradient-to-b from-[#F5E8EC] to-[#EDD6DE] rounded-3xl p-7 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-3">Hasil Analisis</p>
      <div className="text-[64px] font-extrabold text-nikah-deep leading-none mb-2">{score}</div>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-3">Wedding Readiness Score</p>
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 ${LABEL_COLORS[label]}`}>
        ✓ {label}
      </span>
      <p className="text-nikah-text text-sm font-light leading-relaxed italic">
        &ldquo;{QUOTES[label]}&rdquo;
      </p>
    </div>
  )
}
