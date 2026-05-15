'use client'
import { useState, useTransition } from 'react'
import { SESERAHAN_ITEMS } from '@/lib/seserahanItems'
import { updateCustomSeserahanItems, updateHiddenSeserahanItems, updateSeserahanItems, type CustomSeserahanInput } from '@/app/dashboard/actions'
import { ChevronDown, Gem, Plus, Trash2 } from 'lucide-react'

interface Props {
  checkedIds: string[]
  customItems: CustomSeserahanInput[]
  hiddenDefaultIds: string[]
}

const PREVIEW_COUNT = 3

export function SeserahanList({ checkedIds, customItems, hiddenDefaultIds }: Props) {
  const [localChecked, setLocalChecked] = useState<string[]>(checkedIds)
  const [localCustomItems, setLocalCustomItems] = useState<CustomSeserahanInput[]>(customItems)
  const [localHiddenDefaultIds, setLocalHiddenDefaultIds] = useState<string[]>(hiddenDefaultIds)
  const [draftLabel, setDraftLabel] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const allItems = [
    ...localCustomItems.map(item => ({ ...item, icon: '🎁', isCustom: true })),
    ...SESERAHAN_ITEMS
      .filter(item => !localHiddenDefaultIds.includes(item.id))
      .map(item => ({ ...item, isCustom: false })),
  ]
  const totalDone = localChecked.length
  const visibleItems = expanded ? allItems : allItems.slice(0, PREVIEW_COUNT)
  const hiddenCount = Math.max(0, allItems.length - PREVIEW_COUNT)

  function handleToggle(id: string) {
    const wasChecked = localChecked.includes(id)
    const newChecked = wasChecked
      ? localChecked.filter(i => i !== id)
      : [...localChecked, id]
    setLocalChecked(newChecked)
    setError('')
    startTransition(async () => {
      const result = await updateSeserahanItems(newChecked)
      if (result.error) {
        setLocalChecked(localChecked)
        setError('Daftar seserahan belum tersimpan. Coba centang ulang.')
      }
    })
  }

  function handleAddCustom() {
    const label = draftLabel.trim()
    if (!label) return
    const nextItems = [{ id: `custom-${crypto.randomUUID()}`, label }, ...localCustomItems]
    setLocalCustomItems(nextItems)
    setDraftLabel('')
    setExpanded(true)
    setError('')
    startTransition(async () => {
      const result = await updateCustomSeserahanItems(nextItems)
      if (result.error) {
        setLocalCustomItems(localCustomItems)
        setError('Item custom belum tersimpan.')
      }
    })
  }

  function handleRemoveCustom(id: string) {
    const nextItems = localCustomItems.filter(item => item.id !== id)
    const nextChecked = localChecked.filter(checkedId => checkedId !== id)
    setLocalCustomItems(nextItems)
    setLocalChecked(nextChecked)
    setError('')
    startTransition(async () => {
      const [customResult, checkedResult] = await Promise.all([
        updateCustomSeserahanItems(nextItems),
        updateSeserahanItems(nextChecked),
      ])
      if (customResult.error || checkedResult.error) {
        setLocalCustomItems(localCustomItems)
        setLocalChecked(localChecked)
        setError('Item custom belum terhapus. Coba lagi.')
      }
    })
  }

  function handleRemoveDefault(id: string) {
    const nextHidden = [...localHiddenDefaultIds, id]
    const nextChecked = localChecked.filter(checkedId => checkedId !== id)
    setLocalHiddenDefaultIds(nextHidden)
    setLocalChecked(nextChecked)
    setError('')
    startTransition(async () => {
      const [hiddenResult, checkedResult] = await Promise.all([
        updateHiddenSeserahanItems(nextHidden),
        updateSeserahanItems(nextChecked),
      ])
      if (hiddenResult.error || checkedResult.error) {
        setLocalHiddenDefaultIds(localHiddenDefaultIds)
        setLocalChecked(localChecked)
        setError('Item belum terhapus. Coba lagi.')
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
            <Gem size={16} strokeWidth={1.8} />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-nikah-mauve">
            Seserahan Opsional
          </span>
        </span>
        <span className="text-xs font-bold text-nikah-text">
          {isPending ? 'Menyimpan...' : `${totalDone}/${allItems.length} disiapkan`}
        </span>
      </div>

      {error && <p className="text-xs text-red-600" style={{ margin: '0 0 10px' }}>{error}</p>}

      <div className="grid grid-cols-[1fr_auto]" style={{ gap: 8, marginBottom: 12 }}>
        <input
          value={draftLabel}
          onChange={(e) => setDraftLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAddCustom()
            }
          }}
          placeholder="Tambah item seserahan"
          className="w-full border border-nikah-border bg-nikah-bg text-nikah-text outline-none focus:border-nikah-mauve focus:bg-white"
          style={{ minWidth: 0, borderRadius: 999, padding: '10px 13px', fontSize: 12 }}
        />
        <button
          type="button"
          onClick={handleAddCustom}
          disabled={!draftLabel.trim() || isPending}
          className="inline-flex items-center justify-center bg-nikah-deep text-white disabled:opacity-50"
          style={{ width: 38, height: 38, border: 0, borderRadius: 999 }}
          aria-label="Tambah item seserahan"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between" style={{ margin: '14px 0 4px' }}>
        <h4 className="font-extrabold text-nikah-text" style={{ fontSize: 12, margin: 0 }}>Daftar Seserahan</h4>
        <span className="text-nikah-muted" style={{ fontSize: 11 }}>
          {expanded ? allItems.length : Math.min(PREVIEW_COUNT, allItems.length)}/{allItems.length} terlihat
        </span>
      </div>

      <div className="grid grid-cols-1" style={{ gap: 2 }}>
        {visibleItems.map(item => {
          const checked = localChecked.includes(item.id)
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => handleToggle(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleToggle(item.id)
                }
              }}
              className="group flex items-center text-left transition-colors hover:bg-nikah-bg focus-within:bg-nikah-bg"
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
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  if (item.isCustom) {
                    handleRemoveCustom(item.id)
                  } else {
                    handleRemoveDefault(item.id)
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    if (item.isCustom) {
                      handleRemoveCustom(item.id)
                    } else {
                      handleRemoveDefault(item.id)
                    }
                  }
                }}
                className="inline-flex text-nikah-muted opacity-45 transition-opacity hover:text-nikah-deep hover:opacity-100 focus:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                aria-label={`Hapus ${item.label}`}
                title={`Hapus ${item.label}`}
              >
                <Trash2 size={14} />
              </span>
            </div>
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
