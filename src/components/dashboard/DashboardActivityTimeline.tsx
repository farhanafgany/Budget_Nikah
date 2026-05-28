'use client'

import { useState, type ReactNode } from 'react'
import type { DashboardActivityItem, DashboardActivityTone } from '@/lib/dashboardActivity'

interface Props {
  items: DashboardActivityItem[]
  headerAction?: ReactNode
}

const TONE_STYLES: Record<DashboardActivityTone, { dot: string; bg: string; text: string }> = {
  good: { dot: '#2F7A3F', bg: '#F0FDF4', text: '#166534' },
  info: { dot: '#C47986', bg: '#FFF8F5', text: 'var(--nikah-deep)' },
  warning: { dot: '#B98C54', bg: '#FFFBEB', text: '#92400E' },
  critical: { dot: '#B42318', bg: '#FEF2F2', text: '#991B1B' },
}

export function DashboardActivityTimeline({ items, headerAction }: Props) {
  const [expanded, setExpanded] = useState(false)
  const hiddenItemCount = Math.max(items.length - 1, 0)
  const visibleItems = expanded ? items : items.slice(0, 1)

  return (
    <div
      className="bg-white border border-nikah-border shadow-sm"
      style={{
        borderRadius: 'var(--d-radius)',
        padding: '20px 22px',
        boxShadow: '0 12px 34px rgba(90, 30, 42, 0.055)',
      }}
    >
      <div className="flex items-start justify-between" style={{ gap: 14, marginBottom: 12 }}>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-nikah-mauve" style={{ margin: 0 }}>
            Aktivitas Terbaru
          </p>
          <p className="text-nikah-muted" style={{ fontSize: 12, lineHeight: 1.45, margin: '6px 0 0' }}>
            Update terakhir dari tabungan, vendor, dan checklist.
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center justify-end" style={{ gap: 8 }}>
          <span
            className="text-xs font-extrabold rounded-full"
            style={{
              color: 'var(--nikah-muted)',
              background: 'var(--nikah-bg)',
              padding: '6px 10px',
              whiteSpace: 'nowrap',
            }}
          >
            {items.length} update
          </span>
          {headerAction}
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid" style={{ gap: 10 }}>
          {visibleItems.map((item, index) => {
            const style = TONE_STYLES[item.tone]
            return (
              <a
                key={item.id}
                href={item.href}
                className="grid grid-cols-[auto_1fr] text-left transition-all hover:brightness-[0.98] active:scale-[0.985]"
                style={{
                  gap: 11,
                  textDecoration: 'none',
                  borderRadius: 14,
                  padding: '11px 12px',
                  background: index === 0 ? style.bg : 'transparent',
                  border: index === 0 ? `1px solid ${style.dot}22` : '1px solid transparent',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: style.dot,
                    marginTop: 5,
                    boxShadow: `0 0 0 4px ${style.dot}18`,
                  }}
                />
                <span className="min-w-0">
                  <span className="block font-extrabold text-nikah-text" style={{ fontSize: 13.5, lineHeight: 1.35 }}>
                    {item.title}
                  </span>
                  <span className="block text-nikah-muted" style={{ fontSize: 12, lineHeight: 1.45, marginTop: 2 }}>
                    {item.body}
                  </span>
                  <span className="inline-flex font-bold rounded-full" style={{ marginTop: 7, padding: '4px 8px', fontSize: 10.5, color: style.text, background: style.bg }}>
                    {item.meta}
                  </span>
                </span>
              </a>
            )
          })}
          {hiddenItemCount > 0 && (
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded(current => !current)}
              className="w-full rounded-full border border-nikah-border bg-white text-sm font-extrabold text-nikah-deep transition-all hover:bg-nikah-bg active:scale-[0.99]"
              style={{ padding: '10px 12px' }}
            >
              {expanded ? 'Tutup aktivitas' : `Lihat semua aktivitas (${hiddenItemCount} lagi)`}
            </button>
          )}
        </div>
      ) : (
        <div className="bg-nikah-bg" style={{ borderRadius: 14, padding: '13px 14px' }}>
          <p className="font-bold text-nikah-text" style={{ fontSize: 13, margin: '0 0 4px' }}>
            Belum ada aktivitas yang bisa ditampilkan.
          </p>
          <p className="text-nikah-muted" style={{ fontSize: 12, lineHeight: 1.45, margin: 0 }}>
            Tambah tabungan, catat pembayaran vendor, atau selesaikan checklist agar timeline ini mulai terisi.
          </p>
        </div>
      )}
    </div>
  )
}
