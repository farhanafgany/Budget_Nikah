import type { Insight } from '@/lib/insights'
import { TrackedLink } from '@/components/analytics/TrackedLink'
import { Lightbulb, Lock } from 'lucide-react'

const DOT_COLOR: Record<string, string> = {
  good: '#4CAF82',
  warn: '#E0A235',
  info: 'var(--nikah-mauve)',
}

export function InsightCards({ insights }: { insights: Insight[] }) {
  return (
    <div className="bg-white rounded-[20px] border border-nikah-border shadow-sm" style={{ padding: 28 }}>
      <div className="flex items-center justify-between gap-3" style={{ marginBottom: 6 }}>
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-nikah-bg text-nikah-deep">
            <Lightbulb size={15} strokeWidth={1.8} />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-nikah-mauve">
            Catatan untuk Kalian
          </span>
        </span>
      </div>
      <p className="text-nikah-muted" style={{ fontSize: 13, lineHeight: 1.5, margin: '0 0 16px' }}>
        Kami menemukan beberapa hal dari jawaban kalian. Langkah menyelesaikannya tersusun di dalam rencana lengkap.
      </p>

      <div style={{ display: 'grid', gap: 10 }}>
        {insights.map((it, i) => (
          <div
            key={i}
            style={{
              padding: '13px 14px', background: 'var(--nikah-bg)', borderRadius: 12,
            }}
          >
            {/* Temuan — terbaca */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span
                style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: DOT_COLOR[it.kind] ?? 'var(--nikah-mauve)',
                  marginTop: 6, flexShrink: 0, display: 'block',
                }}
              />
              <strong style={{ color: 'var(--nikah-text)', fontWeight: 700, fontSize: 13.5, lineHeight: 1.4 }}>
                {it.title}
              </strong>
            </div>

            {/* Langkah penyelesaian — terkunci, tidak dirender ke DOM */}
            <div
              className="flex items-center"
              style={{ gap: 9, marginTop: 9, marginLeft: 20 }}
              aria-label="Langkah penyelesaian terkunci"
            >
              <Lock size={12} strokeWidth={1.8} aria-hidden="true" style={{ color: 'var(--nikah-mauve)', flexShrink: 0 }} />
              <span
                aria-hidden="true"
                style={{
                  flex: 1, maxWidth: ['74%', '60%', '68%'][i % 3], height: 8, borderRadius: 999,
                  background: 'linear-gradient(90deg, #E7D6DC 0%, #EFE3E6 100%)',
                }}
              />
              <span className="text-nikah-muted" style={{ fontSize: 11, flexShrink: 0, whiteSpace: 'nowrap' }}>
                Cara menyelesaikan
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <TrackedLink
        href="/premium"
        event="result_premium_cta_clicked"
        eventProps={{ cta_location: 'result_insight_lock' }}
        className="inline-flex items-center justify-center w-full md:w-auto font-extrabold transition hover:brightness-105 active:scale-[0.99]"
        style={{
          gap: 8, marginTop: 18, borderRadius: 999, padding: '13px 24px', fontSize: 14,
          color: '#4A1822',
          background: 'linear-gradient(180deg, #E8D7A8 0%, #C9A961 100%)',
          boxShadow: '0 8px 22px rgba(90,30,42,0.12), inset 0 1px 0 rgba(255,255,255,0.34)',
        }}
      >
        <Lock size={14} strokeWidth={2} aria-hidden="true" />
        Buka langkah penyelesaian — Rp 149rb
      </TrackedLink>
    </div>
  )
}
