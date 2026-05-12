'use client'
import { useState, useTransition } from 'react'
import { CHECKLIST_ITEMS, type ChecklistTimeline } from '@/lib/checklistItems'
import { toggleChecklistItem } from '@/app/dashboard/actions'

const TIMELINE_LABELS: Record<ChecklistTimeline, string> = {
  12: '12 Bulan Sebelum',
  6:  '6 Bulan Sebelum',
  3:  '3 Bulan Sebelum',
  1:  '1 Bulan Sebelum',
  0:  '1 Minggu Sebelum',
}

const TIMELINES: ChecklistTimeline[] = [12, 6, 3, 1, 0]

interface Props {
  isPremium: boolean
  checkedIds: string[]
}

export function ChecklistPernikahan({ isPremium, checkedIds }: Props) {
  const [localChecked, setLocalChecked] = useState<string[]>(checkedIds)
  const [, startTransition] = useTransition()

  const totalDone = localChecked.length

  function handleToggle(id: string) {
    if (!isPremium) return
    const wasChecked = localChecked.includes(id)
    const newChecked = wasChecked
      ? localChecked.filter(i => i !== id)
      : [...localChecked, id]
    setLocalChecked(newChecked)
    startTransition(async () => {
      await toggleChecklistItem(id, !wasChecked, localChecked)
    })
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve">
          <span aria-hidden="true">✅</span> Checklist Pernikahan
        </p>
        <span className="text-xs font-bold text-nikah-text">
          {totalDone}/{CHECKLIST_ITEMS.length}
        </span>
      </div>

      <div className="space-y-5">
        {TIMELINES.map(timeline => {
          const items = CHECKLIST_ITEMS.filter(i => i.monthsBefore === timeline)
          const groupDone = items.filter(i => localChecked.includes(i.id)).length
          return (
            <div key={timeline}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-nikah-text">{TIMELINE_LABELS[timeline]}</p>
                <span className="text-[11px] text-nikah-muted">{groupDone}/{items.length}</span>
              </div>
              <div className="space-y-1.5">
                {items.map(item => {
                  const checked = localChecked.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleToggle(item.id)}
                      disabled={!isPremium}
                      className={`w-full flex items-center gap-3 text-left p-2.5 rounded-xl transition-colors ${
                        isPremium ? 'hover:bg-nikah-bg' : 'cursor-default'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                        checked
                          ? 'bg-nikah-deep border-nikah-deep'
                          : 'border-nikah-border bg-white'
                      }`}>
                        {checked && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm ${checked ? 'line-through text-nikah-muted' : 'text-nikah-text'}`}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {!isPremium && (
        <p className="text-xs text-nikah-muted text-center mt-4 pt-4 border-t border-nikah-border">
          Beli akses untuk mulai mencentang persiapan kamu
        </p>
      )}
    </div>
  )
}
