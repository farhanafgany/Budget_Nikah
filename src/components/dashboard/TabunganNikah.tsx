'use client'
import { useState, useTransition } from 'react'
import { updateTabungan } from '@/app/dashboard/actions'
import { calculateMonthlySavings, monthsUntilDate } from '@/lib/savings'
import { formatRupiah } from '@/lib/utils'

interface Props {
  isPremium: boolean
  collected: number
  target: number
  weddingDate: string | null
}

export function TabunganNikah({ isPremium, collected, target, weddingDate }: Props) {
  const [inputRaw, setInputRaw] = useState(String(collected))
  const [localCollected, setLocalCollected] = useState(collected)
  const [isPending, startTransition] = useTransition()

  const months   = monthsUntilDate(weddingDate)
  const monthly  = calculateMonthlySavings(target, localCollected, months)
  const progress = target > 0 ? Math.min(100, Math.round((localCollected / target) * 100)) : 0

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '')
    setInputRaw(raw)
  }

  function handleSave() {
    const n = parseInt(inputRaw, 10) || 0
    setLocalCollected(n)
    startTransition(async () => { await updateTabungan(n) })
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-3">
        <span aria-hidden="true">💰</span> Tabungan Nikah
      </p>

      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-2xl font-extrabold text-nikah-deep">{formatRupiah(localCollected)}</div>
          <div className="text-xs text-nikah-muted">dari {formatRupiah(target)}</div>
        </div>
        <div className="text-right">
          <div className="text-base font-bold text-nikah-mauve">{formatRupiah(monthly)}/bln</div>
          <div className="text-xs text-nikah-muted">selama {months} bln lagi</div>
        </div>
      </div>

      <div className="w-full bg-nikah-border rounded-full h-2 mb-4">
        <div
          className="bg-nikah-deep h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {isPremium ? (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-nikah-muted text-sm">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={inputRaw}
              onChange={handleInputChange}
              placeholder="0"
              className="w-full pl-9 pr-3 py-2.5 border border-nikah-border rounded-xl text-sm text-nikah-text focus:outline-none focus:ring-2 focus:ring-nikah-mauve"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="bg-nikah-deep text-white font-bold px-4 py-2.5 rounded-xl text-sm disabled:opacity-60"
          >
            {isPending ? '...' : 'Simpan'}
          </button>
        </div>
      ) : (
        <p className="text-xs text-nikah-muted text-center py-1">
          Beli akses untuk mulai tracking tabungan kamu
        </p>
      )}
    </div>
  )
}
