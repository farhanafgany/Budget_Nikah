'use client'
import { useRef, useState, useTransition } from 'react'
import { CHECKLIST_ITEMS, type ChecklistTimeline } from '@/lib/checklistItems'
import { updateChecklistItems } from '@/app/dashboard/actions'
import { useHandleActionError } from '@/hooks/useDashboardAction'
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
  const [retryFn, setRetryFn] = useState<(() => void) | null>(null)
  const [, startTransition] = useTransition()
  const handleActionError = useHandleActionError()
  // Ref untuk rollback delta per-item, aman terhadap concurrent toggles.
  const localCheckedRef = useRef<string[]>(checkedIds)
  localCheckedRef.current = localChecked

  const totalDone = localChecked.length
  const totalCount = CHECKLIST_ITEMS.length
  const totalProgress = totalCount > 0 ? Math.round((totalDone / totalCount) * 100) : 0
  const activeItems = CHECKLIST_ITEMS.filter(i => i.monthsBefore === active)
  const activeDone = activeItems.filter(i => localChecked.includes(i.id)).length
  const visibleItems = expanded ? activeItems : activeItems.slice(0, PREVIEW_COUNT)
  const hiddenCount = Math.max(0, activeItems.length - PREVIEW_COUNT)
  const phaseCompleted = activeItems.length > 0 && activeDone === activeItems.length

  const PHASE_CELEBRATION: Record<ChecklistTimeline, string> = {
    12: 'Fondasi sudah kuat. Langkah awal yang paling penting sudah terlewati.',
    6:  'Pertengahan perjalanan — dan kalian melewatinya dengan baik.',
    3:  'Detail sudah rapi. H-3 bulan bukan waktu yang mudah, tapi kalian melakukannya.',
    1:  'Hampir tiba! Semua persiapan satu bulan sudah beres.',
    0:  'Selesai semuanya. Kalian benar-benar siap untuk hari yang ditunggu.',
  }

  function saveChecked(target: string[], onFail: () => void) {
    startTransition(async () => {
      const result = await updateChecklistItems(target)
      const err = handleActionError(result.error)
      if (err) {
        onFail()
        setError('Checklist belum tersimpan.')
        setRetryFn(() => () => {
          setLocalChecked(target)
          setError('')
          setRetryFn(null)
          saveChecked(target, onFail)
        })
      } else {
        setRetryFn(null)
      }
    })
  }

  function handleToggle(id: string) {
    const wasChecked = localCheckedRef.current.includes(id)
    const newChecked = wasChecked
      ? localCheckedRef.current.filter(i => i !== id)
      : [...localCheckedRef.current, id]
    setLocalChecked(newChecked)
    setError('')
    setRetryFn(null)
    saveChecked(newChecked, () => {
      // Undo hanya perubahan item ini — aman meski ada toggle lain yang concurrent.
      setLocalChecked(prev =>
        wasChecked ? [...prev, id] : prev.filter(i => i !== id)
      )
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
        <div
          className="text-nikah-deep"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontStyle: 'italic', fontWeight: 500, fontSize: 36, lineHeight: 1 }}
        >
          {totalDone}/{totalCount}
        </div>
        <div className="text-nikah-muted font-bold uppercase" style={{ fontSize: 10, letterSpacing: '0.14em', marginTop: 5 }}>
          item selesai
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-3 py-2" style={{ margin: '0 0 10px', gap: 8 }}>
          <p className="text-xs text-red-700 font-medium" style={{ margin: 0 }}>{error}</p>
          {retryFn && (
            <button
              type="button"
              onClick={retryFn}
              className="text-xs font-bold text-red-700 underline underline-offset-2 hover:no-underline flex-shrink-0"
            >
              Coba lagi
            </button>
          )}
        </div>
      )}

      {/* Tabs — horizontal scroll, no wrapping */}
      <div
        role="tablist"
        className="bg-nikah-bg rounded-[18px]"
        style={{
          display: 'flex',
          gap: 4,
          padding: 4,
          marginBottom: 14,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {TIMELINES.map(timeline => {
          const doneCnt = CHECKLIST_ITEMS.filter(i => i.monthsBefore === timeline && localChecked.includes(i.id)).length
          const totalCnt = CHECKLIST_ITEMS.filter(i => i.monthsBefore === timeline).length
          const isActive = active === timeline
          return (
            <button
              key={timeline}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActive(timeline)
                setExpanded(false)
              }}
              className={`active:scale-[0.95] active:brightness-90 ${isActive ? 'bg-nikah-deep text-white' : 'text-nikah-muted'}`}
              style={{
                flexShrink: 0,
                padding: '10px 14px',
                border: 0,
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {timeline === 0 ? 'H-1 mgg' : `${timeline} bln`}
              {doneCnt === totalCnt && totalCnt > 0 && (
                <span style={{ marginLeft: 4, opacity: 0.85 }}>✓</span>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between" style={{ margin: '0 0 8px' }}>
        <h4 className="font-extrabold text-nikah-text" style={{ fontSize: 12, margin: 0 }}>{TIMELINE_LABELS[active]}</h4>
        <span className="text-nikah-muted" style={{ fontSize: 11 }}>{activeDone} dari {activeItems.length} selesai</span>
      </div>

      {phaseCompleted && (
        <div
          style={{
            borderRadius: 14,
            padding: '12px 14px',
            marginBottom: 10,
            background: 'linear-gradient(135deg, #DCEAD9 0%, #EBF5E8 100%)',
            border: '1px solid rgba(74,124,90,0.2)',
          }}
        >
          <p className="font-bold" style={{ fontSize: 13, color: '#3A6B4A', margin: '0 0 2px' }}>
            ✓ Fase ini selesai!
          </p>
          <p style={{ fontSize: 12, color: '#4A7C5A', margin: 0, lineHeight: 1.45 }}>
            {PHASE_CELEBRATION[active]}
          </p>
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--nikah-border)' }}>
        {visibleItems.map((item, idx) => {
          const checked = localChecked.includes(item.id)
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              data-checked={checked}
              className="w-full flex items-center text-left border-0 bg-transparent transition-all hover:bg-nikah-bg active:scale-[0.985] active:brightness-90"
              style={{
                gap: 12,
                padding: '13px 8px',
                borderBottom: idx < visibleItems.length - 1 ? '1px solid var(--nikah-border)' : 'none',
              }}
            >
              <span
                data-checked={checked}
                className={`flex-shrink-0 inline-flex items-center justify-center border-2 transition-all ${
                  checked
                    ? 'bg-nikah-deep border-nikah-deep'
                    : 'border-nikah-border bg-white'
                }`}
                style={{ width: 24, height: 24, borderRadius: 7 }}
              >
                {checked && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span
                className={`flex-1 ${checked ? 'text-nikah-muted' : 'text-nikah-text'}`}
                style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  textDecoration: checked ? 'line-through' : 'none',
                  textDecorationColor: 'var(--nikah-muted)',
                }}
              >
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
          className="w-full inline-flex items-center justify-center text-nikah-deep font-bold transition-all hover:bg-nikah-bg active:scale-[0.97] active:brightness-90"
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
