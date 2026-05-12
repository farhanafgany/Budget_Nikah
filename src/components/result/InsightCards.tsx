import type { Insight } from '@/lib/insights'

export function InsightCards({ insights }: { insights: Insight[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-widest text-nikah-mauve">Smart Insights</h3>
      {insights.map((insight, i) => (
        <div
          key={`${insight.type}-${i}`}
          className="bg-white rounded-2xl p-4 border border-nikah-border flex gap-3 items-start shadow-sm"
        >
          <span className="text-xl flex-shrink-0" aria-hidden="true">{insight.icon}</span>
          <p className="text-sm text-nikah-text leading-relaxed">{insight.message}</p>
        </div>
      ))}
    </div>
  )
}
