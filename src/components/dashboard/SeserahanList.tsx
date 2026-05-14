'use client'
import { useState, useTransition } from 'react'
import { SESERAHAN_ITEMS } from '@/lib/seserahanItems'
import { toggleSeserahanItem } from '@/app/dashboard/actions'
import { ChevronDown, Gem } from 'lucide-react'

interface Props {
  checkedIds: string[]
}

const PREVIEW_COUNT = 3

export function SeserahanList({ checkedIds }: Props) {
  const [localChecked, setLocalChecked] = useState<string[]>(checkedIds)
  const [expanded, setExpanded] = useState(false)
  const [, startTransition] = useTransition()

  const totalDone = localChecked.length
  const visibleItems = expanded ? SESERAHAN_ITEMS : SESERAHAN_ITEMS.slice(0, PREVIEW_COUNT)
  const hiddenCount = Math.max(0, SESERAHAN_ITEMS.length - PREVIEW_COUNT)

  function handleToggle(id: string) {
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
            <Gem size={16} strokeWidth={1.8} />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-nikah-mauve">
            Seserahan Opsional
          </span>
        </span>
        <span className="text-xs font-bold text-nikah-text">
          {totalDone}/{SESERAHAN_ITEMS.length} disiapkan
        </span>
      </div>

      <div className="flex items-center justify-between" style={{ margin: '14px 0 4px' }}>
        <h4 className="font-extrabold text-nikah-text" style={{ fontSize: 12, margin: 0 }}>Daftar Seserahan</h4>
        <span className="text-nikah-muted" style={{ fontSize: 11 }}>
          {expanded ? SESERAHAN_ITEMS.length : PREVIEW_COUNT}/{SESERAHAN_ITEMS.length} terlihat
        </span>
      </div>

      <div className="grid grid-cols-1" style={{ gap: 2 }}>
        {visibleItems.map(item => {
          const checked = localChecked.includes(item.id)
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className="flex items-center text-left transition-colors hover:bg-nikah-bg"
              style={{ gap: 12, padding: 'var(--d-row-pad) 10px', borderRadius: 10 }}
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
              <span aria-hidden="true" style={{ fontSize: 16 }}>{item.icon}</span>
              <span className={`flex-1 ${checked ? 'line-through text-nikah-muted' : 'text-nikah-text'}`} style={{ fontSize: 14 }}>
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
            marginTop: 10,
            padding: '10px 14px',
            border: '1px solid var(--nikah-border)',
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
