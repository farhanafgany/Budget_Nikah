import type { ReadinessLabel } from '@/lib/scoring'
import { calculateMonthlySavings, monthsUntilDate } from '@/lib/savings'

const QUOTES: Record<ReadinessLabel, string> = {
  'Healthy':   'Rencana kamu cukup realistis dan bisa dikelola dengan baik.',
  'Moderate':  'Ada beberapa hal yang perlu diperhatikan agar rencana ini lebih kuat.',
  'High Risk': 'Rencana ini perlu beberapa penyesuaian agar tidak terasa terlalu berat.',
}

const PILL_STYLE: Record<ReadinessLabel, { background: string; color: string }> = {
  'Healthy':   { background: '#DFF3E2', color: '#2F7A3F' },
  'Moderate':  { background: '#FFEFD9', color: '#B86614' },
  'High Risk': { background: '#FFDDDD', color: '#B0282A' },
}

const EM_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-fraunces, Georgia, serif)',
  fontStyle: 'italic',
  fontWeight: 500,
  color: 'var(--nikah-deep)',
}

function shortRupiah(value: number) {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1).replace('.0', '')}M`
  }
  if (value >= 1_000_000) return `Rp ${Math.round(value / 1_000_000)}jt`
  if (value >= 1_000) return `Rp ${Math.round(value / 1_000)}rb`
  return `Rp ${value}`
}

interface Props {
  score: number
  label: ReadinessLabel
  totalBudget: number
  weddingDate: string
}

export function ScoreHero({ score, label, totalBudget, weddingDate }: Props) {
  const months = Math.max(0, monthsUntilDate(weddingDate || null))
  const monthlySavings = calculateMonthlySavings(totalBudget, 0, months)
  const scorePct = Math.min(100, Math.max(0, score))
  const pill = PILL_STYLE[label]

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #F5E8EC 0%, #EDD6DE 70%, #F8E1E7 100%)',
        borderRadius: 'var(--d-radius, 26px)',
        padding: '28px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <p
        className="text-xs font-bold uppercase"
        style={{ color: 'var(--nikah-deep)', letterSpacing: '0.16em', marginBottom: 18 }}
      >
        Hasil Analisis
      </p>

      {/* Ring + text */}
      <div className="flex flex-col sm:flex-row items-center gap-9">

        {/* Score ring */}
        <div
          style={{
            width: 200, height: 200, borderRadius: '50%', flexShrink: 0,
            background: `conic-gradient(var(--nikah-deep) ${scorePct}%, rgba(107,53,69,0.12) ${scorePct}% 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 28px rgba(107,53,69,0.18), inset 0 0 0 1px rgba(255,255,255,0.4)',
          }}
        >
          <div
            style={{
              width: 152, height: 152, borderRadius: '50%', background: '#fff',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 4, boxShadow: 'inset 0 0 0 1px var(--nikah-border)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontWeight: 500, color: 'var(--nikah-deep)', fontSize: 76, lineHeight: 1, letterSpacing: '-0.03em' }}>
              {score}
            </div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--nikah-mauve)' }}>
              Estimasi
            </div>
          </div>
        </div>

        {/* Text area */}
        <div className="flex-1 text-center sm:text-left">
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 14px', borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', ...pill }}>
            {label}
          </span>

          <p style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, margin: '14px 0 10px', color: 'var(--nikah-text)' }}>
            Estimasi Readiness Awal: <em style={EM_STYLE}>{score}</em>
          </p>

          <p style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontStyle: 'italic', color: 'var(--nikah-text)', fontSize: 17, lineHeight: 1.5, margin: '0 0 18px', maxWidth: 520, fontWeight: 400 }}>
            “{QUOTES[label]}”
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { lbl: 'Estimasi total', val: shortRupiah(totalBudget) },
              { lbl: 'Nabung/bulan',  val: shortRupiah(monthlySavings) },
              { lbl: 'Sisa waktu',   val: `${months} bln` },
            ].map(s => (
              <div key={s.lbl} style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(6px)', borderRadius: 14, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.6)' }}>
                <span style={{ fontSize: 11, color: 'var(--nikah-muted)', display: 'block', marginBottom: 4 }}>{s.lbl}</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--nikah-deep)' }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
