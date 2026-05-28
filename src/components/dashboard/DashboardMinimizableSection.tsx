'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { track } from '@/lib/analytics'

const STORAGE_KEY = 'budgetnikah:dashboard:minimized-sections:v1'

type DashboardSectionId = 'activity' | 'seserahan' | 'allocation'

const COLLAPSED_SECTION_STYLES: Record<DashboardSectionId, {
  padding: string
  borderColor: string
  boxShadow: string
  titleClassName: string
  titleElement: 'p' | 'span'
  headerGap: number
}> = {
  activity: {
    padding: '20px 22px',
    borderColor: 'var(--nikah-border)',
    boxShadow: '0 12px 34px rgba(90, 30, 42, 0.055)',
    titleClassName: 'text-xs font-extrabold uppercase tracking-[0.18em] text-nikah-mauve',
    titleElement: 'p',
    headerGap: 14,
  },
  seserahan: {
    padding: '22px 22px',
    borderColor: 'rgba(192,120,136,0.26)',
    boxShadow: '0 4px 20px rgba(90,30,42,0.09)',
    titleClassName: 'text-[10px] font-extrabold uppercase tracking-[0.16em] text-nikah-mauve',
    titleElement: 'span',
    headerGap: 18,
  },
  allocation: {
    padding: '24px',
    borderColor: 'var(--nikah-border)',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
    titleClassName: 'text-[11px] font-extrabold uppercase tracking-[0.13em] text-nikah-mauve',
    titleElement: 'span',
    headerGap: 12,
  },
}

interface Props {
  sectionId: DashboardSectionId
  title: string
  badge?: string
  children: (controls: { minimizeButton: ReactNode }) => ReactNode
}

function readMinimizedSections(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

function writeMinimizedSections(sectionId: DashboardSectionId, minimized: boolean) {
  if (typeof window === 'undefined') return

  const sections = new Set(readMinimizedSections())
  if (minimized) {
    sections.add(sectionId)
  } else {
    sections.delete(sectionId)
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(sections)))
  } catch {
    // Preferensi minimize hanya peningkatan UX. Kalau storage penuh/blocked, UI tetap berjalan.
  }
}

export function DashboardMinimizableSection({
  sectionId,
  title,
  badge,
  children,
}: Props) {
  const [minimized, setMinimized] = useState(false)
  const collapsedStyle = COLLAPSED_SECTION_STYLES[sectionId]

  useEffect(() => {
    setMinimized(readMinimizedSections().includes(sectionId))
  }, [sectionId])

  function updateMinimized(next: boolean) {
    setMinimized(next)
    writeMinimizedSections(sectionId, next)
    track('dashboard_feature_used', {
      feature: 'dashboard_card_visibility',
      action: next ? 'minimize' : 'restore',
      section_id: sectionId,
    })
  }

  const minimizeButton = (
    <button
      type="button"
      aria-label={`Sembunyikan ${title}`}
      onClick={() => updateMinimized(true)}
      className="inline-flex flex-shrink-0 items-center justify-center rounded-full border border-nikah-border bg-white text-nikah-muted font-extrabold transition-all hover:bg-nikah-bg hover:text-nikah-deep active:scale-[0.96]"
      style={{ width: 28, height: 28, fontSize: 16, lineHeight: 1 }}
      title={`Sembunyikan ${title}`}
    >
      <span aria-hidden="true">−</span>
    </button>
  )

  return (
    <section aria-label={title}>
      {minimized ? (
        <div
          className="bg-white border shadow-sm"
          style={{
            borderRadius: 'var(--d-radius)',
            borderColor: collapsedStyle.borderColor,
            padding: collapsedStyle.padding,
            boxShadow: collapsedStyle.boxShadow,
          }}
        >
          <div className="flex items-start justify-between" style={{ gap: collapsedStyle.headerGap }}>
            <div className="min-w-0 flex items-center" style={{ gap: 8 }}>
              {collapsedStyle.titleElement === 'p' ? (
                <p className={`truncate ${collapsedStyle.titleClassName}`} style={{ margin: 0 }}>
                  {title}
                </p>
              ) : (
                <span className={`truncate ${collapsedStyle.titleClassName}`}>
                  {title}
                </span>
              )}
              {badge && (
                <span
                  className="flex-shrink-0 rounded-full bg-nikah-bg text-nikah-muted font-bold"
                  style={{ padding: '4px 8px', fontSize: 10.5, lineHeight: 1 }}
                >
                  {badge}
                </span>
              )}
            </div>
            <button
              type="button"
              aria-expanded={false}
              aria-label={`Tampilkan ${title}`}
              onClick={() => updateMinimized(false)}
              className="flex-shrink-0 rounded-full border border-nikah-border bg-white text-nikah-deep font-extrabold transition-all hover:bg-nikah-bg active:scale-[0.98]"
              style={{ padding: '8px 11px', fontSize: 11.5 }}
            >
              Tampilkan
            </button>
          </div>
        </div>
      ) : (
        <div data-testid={`dashboard-section-${sectionId}-content`}>
          {children({ minimizeButton })}
        </div>
      )}
    </section>
  )
}
