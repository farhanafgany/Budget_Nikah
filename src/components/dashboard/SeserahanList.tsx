'use client'
import { useState, useTransition } from 'react'
import { SESERAHAN_ITEMS } from '@/lib/seserahanItems'
import { toggleSeserahanItem } from '@/app/dashboard/actions'

interface Props {
  isPremium: boolean
  checkedIds: string[]
}

export function SeserahanList({ isPremium, checkedIds }: Props) {
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
      await toggleSeserahanItem(id, !wasChecked, localChecked)
    })
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve">
          <span aria-hidden="true">💍</span> Seserahan
        </p>
        <span className="text-xs font-bold text-nikah-text">
          {totalDone}/{SESERAHAN_ITEMS.length} disiapkan
        </span>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {SESERAHAN_ITEMS.map(item => {
          const checked = localChecked.includes(item.id)
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              disabled={!isPremium}
              className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${
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
              <span aria-hidden="true" className="text-base">{item.icon}</span>
              <span className={`text-sm flex-1 ${checked ? 'line-through text-nikah-muted' : 'text-nikah-text'}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>

      {!isPremium && (
        <p className="text-xs text-nikah-muted text-center mt-4 pt-4 border-t border-nikah-border">
          Beli akses untuk menandai seserahan yang sudah disiapkan
        </p>
      )}
    </div>
  )
}
