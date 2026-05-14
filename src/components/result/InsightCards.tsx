import type { Insight } from '@/lib/insights'
import { Lightbulb } from 'lucide-react'

const DOT_COLOR: Record<string, string> = {
  good: '#4CAF82',
  warn: '#E0A235',
  info: 'var(--nikah-mauve)',
}

export function InsightCards({ insights }: { insights: Insight[] }) {
  return (
    <div className="bg-white rounded-[20px] border border-nikah-border shadow-sm" style={{ padding: 28 }}>
      <div className="flex items-center justify-between gap-3" style={{ marginBottom: 12 }}>
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-nikah-bg text-nikah-deep">
            <Lightbulb size={15} strokeWidth={1.8} />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-nikah-mauve">
            Smart Insights
          </span>
        </span>
      </div>
      <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
        {insights.map((it, i) => (
          <div
            key={i}
            style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              padding: 12, background: 'var(--nikah-bg)', borderRadius: 12,
              fontSize: 13, lineHeight: 1.45,
            }}
          >
            <span
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: DOT_COLOR[it.kind] ?? 'var(--nikah-mauve)',
                marginTop: 6, flexShrink: 0, display: 'block',
              }}
            />
            <div>
              <strong style={{ color: 'var(--nikah-text)', fontWeight: 700 }}>{it.title}</strong>
              {' '}
              <span style={{ color: 'var(--nikah-muted)', fontWeight: 300 }}>{it.body}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
