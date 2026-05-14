'use client'
import { useState, useTransition } from 'react'
import { updateTabungan } from '@/app/dashboard/actions'
import { calculateMonthlySavings, monthsUntilDate } from '@/lib/savings'
import { formatRupiah } from '@/lib/utils'
import { Coins } from 'lucide-react'

interface Props {
  collected: number
  target: number
  weddingDate: string | null
}

export function TabunganNikah({ collected, target, weddingDate }: Props) {
  const [localCollected, setLocalCollected] = useState(collected)
  const [mode, setMode] = useState<'add' | 'subtract'>('add')
  const [inputRaw, setInputRaw] = useState('')
  const [isPending, startTransition] = useTransition()

  const months   = monthsUntilDate(weddingDate)
  const monthly  = calculateMonthlySavings(target, localCollected, months)
  const progress = target > 0 ? Math.min(100, Math.round((localCollected / target) * 100)) : 0

  function formatInputRp(value: string | number) {
    const n = parseInt(String(value).replace(/\D/g, ''), 10) || 0
    return n ? new Intl.NumberFormat('id-ID').format(n) : ''
  }

  function switchMode(m: 'add' | 'subtract') {
    setMode(m)
    setInputRaw('')
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputRaw(formatInputRp(e.target.value))
  }

  function handleSubmit() {
    const n = parseInt(inputRaw.replace(/\D/g, ''), 10) || 0
    const next = mode === 'add' ? localCollected + n : Math.max(0, localCollected - n)
    setLocalCollected(next)
    setInputRaw('')
    startTransition(async () => { await updateTabungan(next) })
  }

  return (
    <div
      className="bg-white border shadow-sm"
      style={{
        borderRadius: 'var(--d-radius)',
        padding: 'var(--d-pad-card)',
        borderColor: 'rgba(192,120,136,0.26)',
        boxShadow: '0 12px 30px rgba(107,53,69,0.06)',
      }}
    >
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
            <Coins size={16} strokeWidth={1.8} />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-nikah-mauve">
            Tabungan Nikah
          </span>
        </span>
        <span
          className="text-xs font-extrabold rounded-full"
          style={{ color: 'var(--nikah-deep)', background: 'var(--nikah-bg)', padding: '5px 10px' }}
        >
          {progress}% terkumpul
        </span>
      </div>

      <div className="flex items-end justify-between flex-wrap" style={{ marginBottom: 10, gap: 12 }}>
        <div>
          <div
            className="text-nikah-deep"
            style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontWeight: 500, fontSize: 26, lineHeight: 1 }}
          >
            {formatRupiah(localCollected)}
          </div>
          <div className="text-nikah-muted" style={{ fontSize: 12, marginTop: 4 }}>dari target {formatRupiah(target)}</div>
        </div>
        <div className="text-right">
          <div
            className="text-nikah-mauve font-extrabold"
            style={{ fontSize: 14 }}
          >
            {formatRupiah(monthly)}/bln
          </div>
          <div className="text-nikah-muted font-normal" style={{ fontSize: 11, marginTop: 4 }}>selama {months} bln lagi</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-nikah-border rounded-full overflow-hidden" style={{ height: 8, margin: '4px 0 14px' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--nikah-mauve), var(--nikah-deep))' }}
        />
      </div>
      <div className="flex justify-between text-nikah-muted" style={{ fontSize: 11, marginBottom: 12 }}>
        <span>Terkumpul</span>
        <span>Target hari H</span>
      </div>

      {/* Mode toggle */}
      <div className="flex bg-nikah-bg rounded-full overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ gap: 4, padding: 4, marginBottom: 14, scrollbarWidth: 'none' }}>
        {(['add', 'subtract'] as const).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`flex-1 rounded-full font-bold whitespace-nowrap transition-all ${
              mode === m
                ? 'bg-nikah-deep text-white'
                : 'text-nikah-muted hover:text-nikah-text'
            }`}
            style={{ padding: '8px 14px', fontSize: 12 }}
          >
            {m === 'add' ? '+ Tambah' : '✎ Koreksi saldo'}
          </button>
        ))}
      </div>

      <div className="flex" style={{ gap: 8 }}>
        <div className="relative flex-1">
          <span className="absolute top-1/2 -translate-y-1/2 text-nikah-muted font-semibold select-none" style={{ left: 12, fontSize: 13 }}>Rp</span>
          <input
            type="text"
            inputMode="numeric"
            value={inputRaw}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputRaw) handleSubmit()
            }}
            placeholder={mode === 'add' ? 'Jumlah tambahan' : 'Jumlah dikurangi'}
            className="w-full border border-nikah-border bg-nikah-bg text-nikah-text outline-none transition-colors focus:border-nikah-mauve focus:bg-white"
            style={{ padding: '12px 14px 12px 36px', borderRadius: 12, fontSize: 14 }}
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !inputRaw}
          className="bg-nikah-deep text-white font-bold disabled:opacity-50"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            border: 0,
            borderRadius: 999,
            padding: '14px 26px',
            fontSize: 14,
            boxShadow: '0 6px 16px rgba(107,53,69,0.22)',
            transition: 'transform 0.12s ease, opacity 0.12s ease, background 0.12s ease',
          }}
        >
          {isPending ? '...' : mode === 'add' ? 'Tambah' : 'Kurangi'}
        </button>
      </div>
      {mode === 'subtract' && (
        <p className="text-xs text-nikah-muted" style={{ marginTop: 12 }}>
          Mode koreksi akan mengurangi saldo terkumpul. Gunakan jika ada input yang salah sebelumnya.
        </p>
      )}
    </div>
  )
}
