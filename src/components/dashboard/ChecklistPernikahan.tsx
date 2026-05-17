'use client'
import { useState, useTransition } from 'react'
import { CHECKLIST_ITEMS, type ChecklistTimeline } from '@/lib/checklistItems'
import { updateChecklistItems } from '@/app/dashboard/actions'
import { ChevronDown } from 'lucide-react'

const TIMELINE_LABELS: Record<ChecklistTimeline, string> = {
  12: '12 Bulan Sebelum',
  6:  '6 Bulan Sebelum',
  3:  '3 Bulan Sebelum',
  1:  '1 Bulan Sebelum',
  0:  '1 Minggu Sebelum',
}

const TIMELINES: ChecklistTimeline[] = [12, 6, 3, 1, 0]
const PREVIEW_COUNT = 5

interface Props {
  checkedIds: string[]
}

function MiniProgressRing({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: 50,
        height: 50,
        borderRadius: '50%',
        background: `radial-gradient(circle at center, var(--landing-card, #fff) 57%, transparent 58%), conic-gradient(var(--landing-deep, var(--nikah-deep)) 0% ${pct}%, #EEDCE0 ${pct}% 100%)`,
        flexShrink: 0,
      }}
      aria-label={`${pct}% selesai`}
    >
      <div
        className="text-nikah-deep"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontStyle: 'italic', fontSize: 15, lineHeight: 1 }}
      >
        {pct}%
      </div>
    </div>
  )
}

export function ChecklistPernikahan({ checkedIds }: Props) {
  const [localChecked, setLocalChecked] = useState<string[]>(checkedIds)
  const [active, setActive] = useState<ChecklistTimeline>(12)
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState('')
  const [, startTransition] = useTransition()

  const totalDone = localChecked.length
  const totalCount = CHECKLIST_ITEMS.length
  const totalProgress = totalCount > 0 ? Math.round((totalDone / totalCount) * 100) : 0
  const activeItems = CHECKLIST_ITEMS.filter(i => i.monthsBefore === active)
  const activeDone = activeItems.filter(i => localChecked.includes(i.id)).length
  const visibleItems = expanded ? activeItems : activeItems.slice(0, PREVIEW_COUNT)
  const hiddenCount = Math.max(0, activeItems.length - PREVIEW_COUNT)

  function handleToggle(id: string) {
    const wasChecked = localChecked.includes(id)
    const newChecked = wasChecked
      ? localChecked.filter(i => i !== id)
      : [...localChecked, id]
    setLocalChecked(newChecked)
    setError('')
    startTransition(async () => {
      const result = await updateChecklistItems(newChecked)
      if (result.error) {
        setLocalChecked(localChecked)
        setError('Checklist belum tersimpan. Coba centang ulang.')
      }
    })
  }

  return (
    <div
      className="bg-white border border-nikah-border shadow-sm"
      style={{ borderRadius: 'var(--d-radius)', padding: '22px 22px', boxShadow: '0 12px 30px rgba(90, 30, 42, 0.05)' }}
    >
      <div className="flex items-start justify-between" style={{ marginBottom: 14, gap: 18 }}>
        <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-nikah-mauve">
          Checklist Pernikahan
        </span>
        <MiniProgressRing value={totalProgress} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <div>
          <div
            className="text-nikah-deep"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontStyle: 'italic', fontSize: 30, lineHeight: 1 }}
          >
            {totalDone}/{totalCount} selesai
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-600" style={{ margin: '0 0 10px' }}>{error}</p>}

      <div
        role="tablist"
        className="flex flex-wrap bg-nikah-bg rounded-[18px]"
        style={{
          gap: 4,
          padding: 4,
          marginBottom: 12,
        }}
      >
        {TIMELINES.map(timeline => (
          <button
            key={timeline}
            type="button"
            role="tab"
            aria-selected={active === timeline}
            onClick={() => {
              setActive(timeline)
              setExpanded(false)
            }}
            className={active === timeline ? 'bg-nikah-deep text-white' : 'text-nikah-muted'}
            style={{
              flex: '1 1 86px',
              padding: '7px 12px',
              border: 0,
              borderRadius: 999,
              fontSize: 11.5,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {timeline === 0 ? 'H-1 mgg' : `${timeline} bln`}{' '}
            <span style={{ opacity: 0.72 }}>
              {CHECKLIST_ITEMS.filter(i => i.monthsBefore === timeline && localChecked.includes(i.id)).length}/{CHECKLIST_ITEMS.filter(i => i.monthsBefore === timeline).length}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between" style={{ margin: '12px 0 4px' }}>
        <h4 className="font-extrabold text-nikah-text" style={{ fontSize: 12, margin: 0 }}>{TIMELINE_LABELS[active]}</h4>
        <span className="text-nikah-muted" style={{ fontSize: 11 }}>{activeDone}/{activeItems.length}</span>
      </div>

      <div className="grid" style={{ gap: 3 }}>
        {visibleItems.map(item => {
          const checked = localChecked.includes(item.id)
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              data-checked={checked}
              className="w-full flex items-center text-left border-0 bg-transparent transition-colors hover:bg-nikah-bg"
              style={{ gap: 11, padding: '8px 10px', borderRadius: 10 }}
            >
              <span
                data-checked={checked}
                className={`flex-shrink-0 inline-flex items-center justify-center border-2 transition-all ${
                  checked
                    ? 'bg-nikah-deep border-nikah-deep'
                    : 'border-nikah-border bg-white'
                }`}
                style={{ width: 19, height: 19, borderRadius: 6 }}
              >
                {checked && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className={`flex-1 ${checked ? 'line-through text-nikah-muted' : 'text-nikah-text'}`} style={{ fontSize: 13.5, lineHeight: 1.35 }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(value => !value)}
          className="w-full inline-flex items-center justify-center text-nikah-deep font-bold transition-colors hover:bg-nikah-bg"
          style={{
            gap: 6,
            marginTop: 12,
            padding: '9px 14px',
            border: '1px solid var(--landing-border, var(--nikah-border))',
            borderRadius: 999,
            fontSize: 12,
            background: 'transparent',
          }}
        >
          {expanded ? 'Sembunyikan' : `Lihat semua (${hiddenCount} lagi)`}
          <ChevronDown
            size={15}
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s',
            }}
          />
        </button>
      )}
    </div>
  )
}
