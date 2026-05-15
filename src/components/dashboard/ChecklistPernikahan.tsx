'use client'
import { useState, useTransition } from 'react'
import { CHECKLIST_ITEMS, type ChecklistTimeline } from '@/lib/checklistItems'
import { updateChecklistItems } from '@/app/dashboard/actions'
import { ClipboardList } from 'lucide-react'

const TIMELINE_LABELS: Record<ChecklistTimeline, string> = {
  12: '12 Bulan Sebelum',
  6:  '6 Bulan Sebelum',
  3:  '3 Bulan Sebelum',
  1:  '1 Bulan Sebelum',
  0:  '1 Minggu Sebelum',
}

const TIMELINES: ChecklistTimeline[] = [12, 6, 3, 1, 0]

interface Props {
  checkedIds: string[]
}

export function ChecklistPernikahan({ checkedIds }: Props) {
  const [localChecked, setLocalChecked] = useState<string[]>(checkedIds)
  const [active, setActive] = useState<ChecklistTimeline>(12)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const totalDone = localChecked.length
  const activeItems = CHECKLIST_ITEMS.filter(i => i.monthsBefore === active)
  const activeDone = activeItems.filter(i => localChecked.includes(i.id)).length

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
    <div className="bg-white border border-nikah-border shadow-sm" style={{ borderRadius: 'var(--d-radius)', padding: 'var(--d-pad-card)' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
        <span className="inline-flex items-center" style={{ gap: 8 }}>
          <span
            className="inline-flex items-center justify-center text-nikah-deep"
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #F5E8EC, #EDD6DE)',
            }}
          >
            <ClipboardList size={16} strokeWidth={1.8} />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-nikah-mauve">
            Checklist Pernikahan
          </span>
        </span>
        <span className="text-xs font-bold text-nikah-text">
          {isPending ? 'Menyimpan...' : `${totalDone}/${CHECKLIST_ITEMS.length}`}
        </span>
      </div>

      {error && <p className="text-xs text-red-600" style={{ margin: '0 0 10px' }}>{error}</p>}

      <div
        role="tablist"
        className="flex bg-nikah-bg rounded-full overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{
          gap: 4,
          padding: 4,
          marginBottom: 14,
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        {TIMELINES.map(timeline => (
          <button
            key={timeline}
            type="button"
            role="tab"
            aria-pressed={active === timeline}
            onClick={() => setActive(timeline)}
            className={active === timeline ? 'bg-nikah-deep text-white' : 'text-nikah-muted'}
            style={{
              flex: '1 0 auto',
              padding: '8px 14px',
              border: 0,
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {timeline === 0 ? 'H-1 minggu' : `${timeline} bln`}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between" style={{ margin: '14px 0 4px' }}>
        <h4 className="font-extrabold text-nikah-text" style={{ fontSize: 12, margin: 0 }}>{TIMELINE_LABELS[active]}</h4>
        <span className="text-nikah-muted" style={{ fontSize: 11 }}>{activeDone}/{activeItems.length}</span>
      </div>

      <div className="grid" style={{ gap: 2 }}>
        {activeItems.map(item => {
          const checked = localChecked.includes(item.id)
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              data-checked={checked}
              className="w-full flex items-center text-left border-0 bg-transparent transition-colors hover:bg-nikah-bg"
              style={{ gap: 12, padding: 'var(--d-row-pad) 10px', borderRadius: 10 }}
            >
              <span
                data-checked={checked}
                className={`flex-shrink-0 inline-flex items-center justify-center border-2 transition-all ${
                  checked
                    ? 'bg-nikah-deep border-nikah-deep'
                    : 'border-nikah-border bg-white'
                }`}
                style={{ width: 20, height: 20, borderRadius: 6 }}
              >
                {checked && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className={`flex-1 ${checked ? 'line-through text-nikah-muted' : 'text-nikah-text'}`} style={{ fontSize: 14 }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
