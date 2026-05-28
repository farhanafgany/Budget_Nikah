'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import { CHECKLIST_ITEMS, type ChecklistTimeline } from '@/lib/checklistItems'
import { updateChecklistItems, updateCustomChecklistItems, updateHiddenChecklistItems } from '@/app/dashboard/actions'
import { useHandleActionError } from '@/hooks/useDashboardAction'
import { track } from '@/lib/analytics'
import type { CustomChecklistInput } from '@/lib/dashboardActions'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'

const TIMELINE_LABELS: Record<ChecklistTimeline, string> = {
  12: '12 Bulan Sebelum',
  6:  '6 Bulan Sebelum',
  3:  '3 Bulan Sebelum',
  1:  '1 Bulan Sebelum',
  0:  '1 Minggu Sebelum',
}

const TIMELINES: ChecklistTimeline[] = [12, 6, 3, 1, 0]
const PREVIEW_COUNT = 5

function getDefaultTimeline(days: number | null | undefined): ChecklistTimeline {
  if (days === null || days === undefined || days <= 7) return 0
  if (days <= 45) return 1
  if (days <= 120) return 3
  if (days <= 240) return 6
  return 12
}

interface Props {
  checkedIds: string[]
  days?: number | null
  customItems?: CustomChecklistInput[]
  hiddenDefaultIds?: string[]
  onSaved?: (checkedIds: string[]) => void
  onCustomItemsSaved?: (customItems: CustomChecklistInput[]) => void
  onHiddenItemsSaved?: (hiddenDefaultIds: string[]) => void
  focusRequest?: {
    checklistId: string
    requestId: number
  } | null
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

export function ChecklistPernikahan({
  checkedIds,
  days,
  customItems = [],
  hiddenDefaultIds = [],
  onSaved,
  onCustomItemsSaved,
  onHiddenItemsSaved,
  focusRequest,
}: Props) {
  const [localChecked, setLocalChecked] = useState<string[]>(checkedIds)
  const [localCustomItems, setLocalCustomItems] = useState<CustomChecklistInput[]>(customItems)
  const [localHiddenIds, setLocalHiddenIds] = useState<string[]>(hiddenDefaultIds)
  const [draftLabel, setDraftLabel] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const currentTimeline = getDefaultTimeline(days)
  const [active, setActive] = useState<ChecklistTimeline>(() => getDefaultTimeline(days))
  const [expanded, setExpanded] = useState(false)
  const [hiddenItemsOpen, setHiddenItemsOpen] = useState(false)
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [retryFn, setRetryFn] = useState<(() => void) | null>(null)
  const [, startTransition] = useTransition()
  const handleActionError = useHandleActionError()
  const handledFocusRequest = useRef<number | null>(null)
  // Ref untuk rollback delta per-item, aman terhadap concurrent toggles.
  const localCheckedRef = useRef<string[]>(checkedIds)
  localCheckedRef.current = localChecked

  const visibleDefaultItems = CHECKLIST_ITEMS.filter(i => !localHiddenIds.includes(i.id))
  const hiddenDefaultItems = CHECKLIST_ITEMS.filter(i => localHiddenIds.includes(i.id))
  const totalDone = localChecked.filter(id => {
    const isDefault = CHECKLIST_ITEMS.some(i => i.id === id)
    return !isDefault || !localHiddenIds.includes(id)
  }).length
  const totalCount = visibleDefaultItems.length + localCustomItems.length
  const totalProgress = totalCount > 0 ? Math.round((totalDone / totalCount) * 100) : 0
  const activeDefaultItems = visibleDefaultItems.filter(i => i.monthsBefore === active)
  const activeCustomItems = localCustomItems.filter(i => i.monthsBefore === active)
  const activeDone = [...activeDefaultItems, ...activeCustomItems].filter(i => localChecked.includes(i.id)).length
  const visibleItems = expanded ? activeDefaultItems : activeDefaultItems.slice(0, PREVIEW_COUNT)
  const hiddenCount = Math.max(0, activeDefaultItems.length - PREVIEW_COUNT)
  const phaseCompleted =
    (activeDefaultItems.length + activeCustomItems.length) > 0 &&
    activeDone === (activeDefaultItems.length + activeCustomItems.length)

  useEffect(() => {
    if (!focusRequest || handledFocusRequest.current === focusRequest.requestId) return

    handledFocusRequest.current = focusRequest.requestId
    const selectedItem = [...visibleDefaultItems, ...localCustomItems].find(item =>
      item.id === focusRequest.checklistId)
    if (!selectedItem) return

    const phaseItems = visibleDefaultItems.filter(item =>
      item.monthsBefore === selectedItem.monthsBefore)
    const selectedIndex = phaseItems.findIndex(item => item.id === selectedItem.id)

    setActive(selectedItem.monthsBefore)
    if (selectedIndex >= PREVIEW_COUNT) setExpanded(true)
    setHighlightedItemId(selectedItem.id)

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`checklist-item-${selectedItem.id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    })
    const timeout = window.setTimeout(() => {
      setHighlightedItemId(current => current === selectedItem.id ? null : current)
    }, 3600)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
    }
  }, [focusRequest, localHiddenIds, localCustomItems, visibleDefaultItems])

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
        onSaved?.(target)
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
    track('dashboard_feature_used', {
      feature: 'checklist',
      action: wasChecked ? 'uncomplete' : 'complete',
      timeline_months_before: active,
    })
    saveChecked(newChecked, () => {
      // Undo hanya perubahan item ini — aman meski ada toggle lain yang concurrent.
      setLocalChecked(prev =>
        wasChecked ? [...prev, id] : prev.filter(i => i !== id)
      )
    })
  }

  function handleRemoveDefault(id: string) {
    const nextHidden = [...localHiddenIds, id]
    const nextChecked = localCheckedRef.current.filter(checkedId => checkedId !== id)
    track('dashboard_feature_used', { feature: 'checklist', action: 'hide_default' })
    setLocalHiddenIds(nextHidden)
    setLocalChecked(nextChecked)
    setError('')
    startTransition(async () => {
      const [hiddenResult, checkedResult] = await Promise.all([
        updateHiddenChecklistItems(nextHidden),
        updateChecklistItems(nextChecked),
      ])
      const err = handleActionError(hiddenResult.error) || handleActionError(checkedResult.error)
      if (err) {
        setLocalHiddenIds(localHiddenIds)
        setLocalChecked(localCheckedRef.current)
        setError('Item belum tersembunyi. Coba lagi.')
      } else {
        onSaved?.(nextChecked)
        onHiddenItemsSaved?.(nextHidden)
      }
    })
  }

  function handleRestoreDefault(id: string) {
    const nextHidden = localHiddenIds.filter(hiddenId => hiddenId !== id)
    track('dashboard_feature_used', { feature: 'checklist', action: 'restore_default' })
    setLocalHiddenIds(nextHidden)
    setError('')
    startTransition(async () => {
      const result = await updateHiddenChecklistItems(nextHidden)
      const err = handleActionError(result.error)
      if (err) {
        setLocalHiddenIds(localHiddenIds)
        setError('Item belum dipulihkan. Coba lagi.')
      } else {
        onHiddenItemsSaved?.(nextHidden)
      }
    })
  }

  function handleAddCustom() {
    const label = draftLabel.trim()
    if (!label) return
    const newItem: CustomChecklistInput = {
      id: `custom-${crypto.randomUUID()}`,
      label,
      monthsBefore: active,
    }
    const nextItems = [...localCustomItems, newItem]
    track('dashboard_feature_used', { feature: 'checklist', action: 'add_custom', timeline_months_before: active })
    setLocalCustomItems(nextItems)
    setDraftLabel('')
    setFormOpen(false)
    setError('')
    startTransition(async () => {
      const result = await updateCustomChecklistItems(nextItems)
      const err = handleActionError(result.error)
      if (err) {
        setLocalCustomItems(localCustomItems)
        setError('Item custom belum tersimpan. Coba lagi.')
      } else {
        onCustomItemsSaved?.(nextItems)
      }
    })
  }

  function handleRemoveCustom(id: string) {
    const nextItems = localCustomItems.filter(item => item.id !== id)
    const nextChecked = localCheckedRef.current.filter(checkedId => checkedId !== id)
    track('dashboard_feature_used', { feature: 'checklist', action: 'delete_custom' })
    setLocalCustomItems(nextItems)
    setLocalChecked(nextChecked)
    setError('')
    startTransition(async () => {
      const [customResult, checkedResult] = await Promise.all([
        updateCustomChecklistItems(nextItems),
        updateChecklistItems(nextChecked),
      ])
      const err = handleActionError(customResult.error) || handleActionError(checkedResult.error)
      if (err) {
        setLocalCustomItems(localCustomItems)
        setLocalChecked(localCheckedRef.current)
        setError('Item belum terhapus. Coba lagi.')
      } else {
        onSaved?.(nextChecked)
        onCustomItemsSaved?.(nextItems)
      }
    })
  }

  return (
    <div
      className="bg-white border"
      style={{ borderRadius: 'var(--d-radius)', padding: '22px 22px', borderColor: 'rgba(192,120,136,0.26)', boxShadow: '0 4px 20px rgba(90,30,42,0.09)' }}
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

      {/* Keep every phase discoverable on mobile; desktop retains the compact row. */}
      <div
        role="tablist"
        className="grid grid-cols-6 sm:flex sm:flex-nowrap sm:overflow-x-auto bg-nikah-bg rounded-[18px]"
        style={{
          gap: 4,
          padding: 4,
          marginBottom: 14,
          scrollbarWidth: 'none',
        }}
      >
        {TIMELINES.map(timeline => {
          const phaseItems = [
            ...visibleDefaultItems.filter(i => i.monthsBefore === timeline),
            ...localCustomItems.filter(i => i.monthsBefore === timeline),
          ]
          const doneCnt = phaseItems.filter(i => localChecked.includes(i.id)).length
          const totalCnt = phaseItems.length
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
              className={`${timeline <= 1 ? 'col-span-3' : 'col-span-2'} active:scale-[0.95] active:brightness-90 ${isActive ? 'bg-nikah-deep text-white' : 'text-nikah-muted hover:bg-white hover:text-nikah-deep'}`}
              style={{
                flexShrink: 0,
                padding: '10px 14px',
                border: 0,
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
                ...(isActive && { boxShadow: '0 3px 10px rgba(90,30,42,0.22)' }),
              }}
            >
              {timeline === 0 ? 'H-1 mgg' : `${timeline} bln`}
              {doneCnt === totalCnt && totalCnt > 0
                ? <span style={{ marginLeft: 4, opacity: 0.85 }}>✓</span>
                : timeline === currentTimeline && (
                  <span
                    style={{
                      marginLeft: 5,
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(110,38,56,0.12)',
                      color: isActive ? 'white' : 'var(--nikah-deep)',
                      borderRadius: 4,
                      padding: '1px 5px',
                    }}
                  >
                    Sekarang
                  </span>
                )
              }
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between" style={{ margin: '0 0 8px' }}>
        <h4 className="font-extrabold text-nikah-text" style={{ fontSize: 12, margin: 0 }}>{TIMELINE_LABELS[active]}</h4>
        <span className="text-nikah-muted" style={{ fontSize: 11 }}>{activeDone} dari {activeDefaultItems.length + activeCustomItems.length} selesai</span>
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
            <div
              key={item.id}
              id={`checklist-item-${item.id}`}
              className="group flex items-center"
              style={{
                borderBottom: idx < visibleItems.length - 1 ? '1px solid var(--nikah-border)' : 'none',
                borderRadius: 10,
                background: highlightedItemId === item.id ? 'rgba(248,225,231,0.62)' : 'transparent',
                boxShadow: highlightedItemId === item.id ? '0 0 0 2px rgba(192,120,136,0.45)' : 'none',
                transition: 'background 160ms ease, box-shadow 160ms ease',
              }}
            >
              <button
                onClick={() => handleToggle(item.id)}
                data-checked={checked}
                className="flex-1 flex items-center text-left border-0 bg-transparent transition-all hover:bg-nikah-bg active:scale-[0.985] active:brightness-90"
                style={{ gap: 12, padding: '13px 8px', minWidth: 0 }}
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
                  className={`flex-1 min-w-0 ${checked ? 'text-nikah-muted' : 'text-nikah-text'}`}
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
              <button
                type="button"
                onClick={() => handleRemoveDefault(item.id)}
                className="flex-shrink-0 text-nikah-muted opacity-40 transition-opacity hover:text-red-500 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                style={{ padding: '13px 8px' }}
                aria-label={`Hapus ${item.label}`}
                title="Sembunyikan item ini"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Form tambah item kustom */}
      {formOpen && (
        <div className="grid grid-cols-[1fr_auto]" style={{ gap: 8, marginTop: 10 }}>
          <input
            value={draftLabel}
            onChange={e => setDraftLabel(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustom() } }}
            placeholder={`Tambah item untuk ${TIMELINE_LABELS[active].toLowerCase()}`}
            className="w-full border border-nikah-border bg-nikah-bg text-nikah-text outline-none focus:border-nikah-mauve focus:bg-white"
            style={{ minWidth: 0, borderRadius: 999, padding: '9px 13px', fontSize: 12 }}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={!draftLabel.trim()}
            className="inline-flex items-center justify-center bg-nikah-deep text-white disabled:opacity-40"
            style={{ width: 36, height: 36, border: 0, borderRadius: 999, flexShrink: 0 }}
            aria-label="Tambah item"
          >
            <Plus size={16} />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => { setFormOpen(v => !v); setDraftLabel('') }}
        className="w-full inline-flex items-center justify-center text-nikah-deep font-bold transition-all hover:bg-nikah-bg active:scale-[0.97] active:brightness-90"
        style={{
          gap: 6,
          marginTop: 10,
          padding: '9px 14px',
          border: '1px solid var(--landing-border, var(--nikah-border))',
          borderRadius: 999,
          fontSize: 12,
          background: 'transparent',
        }}
      >
        {formOpen ? 'Tutup' : '+ Tambah item sendiri'}
      </button>

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

      {/* Custom items untuk tab aktif — selalu tampil */}
      {activeCustomItems.length > 0 && (
        <div style={{ borderTop: '1px solid var(--nikah-border)', marginTop: hiddenCount > 0 ? 8 : 0 }}>
          {activeCustomItems.map((item, idx) => {
            const checked = localChecked.includes(item.id)
            return (
              <div
                key={item.id}
                id={`checklist-item-${item.id}`}
                className="group flex items-center"
                style={{
                  gap: 12,
                  padding: '11px 8px',
                  borderBottom: idx < activeCustomItems.length - 1 ? '1px solid var(--nikah-border)' : 'none',
                  borderRadius: 10,
                  background: highlightedItemId === item.id ? 'rgba(248,225,231,0.62)' : 'transparent',
                  boxShadow: highlightedItemId === item.id ? '0 0 0 2px rgba(192,120,136,0.45)' : 'none',
                  transition: 'background 160ms ease, box-shadow 160ms ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(item.id)}
                  className="flex items-center text-left flex-1 min-w-0 border-0 bg-transparent hover:bg-nikah-bg active:scale-[0.985] active:brightness-90 transition-all"
                  style={{ gap: 12, borderRadius: 8, padding: '2px 4px', margin: '-2px -4px' }}
                >
                  <span
                    className={`flex-shrink-0 inline-flex items-center justify-center border-2 transition-all ${
                      checked ? 'bg-nikah-deep border-nikah-deep' : 'border-nikah-border bg-white'
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
                    className={`flex-1 min-w-0 ${checked ? 'text-nikah-muted' : 'text-nikah-text'}`}
                    style={{
                      fontSize: 13,
                      lineHeight: 1.5,
                      fontStyle: 'italic',
                      textDecoration: checked ? 'line-through' : 'none',
                      textDecorationColor: 'var(--nikah-muted)',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveCustom(item.id)}
                  className="flex-shrink-0 text-nikah-muted opacity-40 transition-opacity hover:text-red-500 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  aria-label={`Hapus ${item.label}`}
                  title="Hapus item ini"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {hiddenDefaultItems.length > 0 && (
        <>
          <button
            type="button"
            aria-expanded={hiddenItemsOpen}
            onClick={() => setHiddenItemsOpen(value => !value)}
            className="w-full inline-flex items-center justify-center text-nikah-muted font-bold transition-all hover:bg-nikah-bg hover:text-nikah-deep"
            style={{
              gap: 6,
              marginTop: 8,
              padding: '9px 14px',
              border: '1px dashed var(--landing-border, var(--nikah-border))',
              borderRadius: 999,
              fontSize: 12,
              background: 'transparent',
            }}
          >
            {hiddenItemsOpen ? 'Tutup item tersembunyi' : `Lihat item tersembunyi (${hiddenDefaultItems.length})`}
          </button>
          {hiddenItemsOpen && (
            <div className="bg-nikah-bg rounded-xl" style={{ marginTop: 8, padding: '8px 10px' }}>
              {hiddenDefaultItems.map(item => (
                <div key={item.id} className="flex items-center justify-between" style={{ gap: 10, padding: '7px 4px' }}>
                  <div className="min-w-0">
                    <p className="text-nikah-text" style={{ fontSize: 12, margin: 0 }}>{item.label}</p>
                    <p className="text-nikah-muted" style={{ fontSize: 10, margin: '2px 0 0' }}>{TIMELINE_LABELS[item.monthsBefore]}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRestoreDefault(item.id)}
                    className="flex-shrink-0 text-xs font-bold text-nikah-deep hover:underline underline-offset-2"
                    aria-label={`Pulihkan ${item.label}`}
                  >
                    Pulihkan
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
