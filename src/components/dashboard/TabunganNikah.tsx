'use client'
import { useState, useTransition } from 'react'
import { updateTabunganWithHistory, type SavingsHistoryInput } from '@/app/dashboard/actions'
import { calculateMonthlySavings, monthsUntilDate } from '@/lib/savings'
import { formatRupiah } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface Props {
  collected: number
  target: number
  weddingDate: string | null
  history: SavingsHistoryInput[]
}

export function TabunganNikah({ collected, target, weddingDate, history }: Props) {
  const [localCollected, setLocalCollected] = useState(collected)
  const [localHistory, setLocalHistory] = useState<SavingsHistoryInput[]>(history)
  const [mode, setMode] = useState<'add' | 'subtract'>('add')
  const [inputRaw, setInputRaw] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [error, setError] = useState('')
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
    const nextHistory = [
      {
        id: crypto.randomUUID(),
        type: mode,
        amount: n,
        balanceAfter: next,
        date: new Date().toISOString(),
      },
      ...localHistory,
    ].slice(0, 20)
    setLocalCollected(next)
    setLocalHistory(nextHistory)
    setInputRaw('')
    setError('')
    startTransition(async () => {
      const result = await updateTabunganWithHistory(next, nextHistory)
      if (result.error) {
        setLocalCollected(localCollected)
        setLocalHistory(localHistory)
        setError('Riwayat tabungan belum tersimpan. Coba input ulang.')
      }
    })
  }

  return (
    <div
      className="bg-white border shadow-sm"
      style={{
        borderRadius: 'var(--d-radius)',
        padding: 24,
        borderColor: 'rgba(192,120,136,0.26)',
        boxShadow: '0 10px 26px rgba(107,53,69,0.05)',
      }}
    >
      <div className="flex items-start justify-between" style={{ marginBottom: 14 }}>
        <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-nikah-mauve">
          Tabungan Nikah
        </span>
        <span
          className="text-nikah-mauve"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontStyle: 'italic', fontSize: 24, lineHeight: 1 }}
        >
          {progress}%
        </span>
      </div>

      <div className="flex items-end justify-between flex-wrap" style={{ marginBottom: 10, gap: 12 }}>
        <div>
          <div
            className="text-nikah-deep"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontStyle: 'italic', fontWeight: 500, fontSize: 32, lineHeight: 1 }}
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
      <div className="w-full bg-nikah-border rounded-full overflow-hidden" style={{ height: 6, margin: '6px 0 14px' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--landing-mauve, var(--nikah-mauve)), var(--landing-deep, var(--nikah-deep)))' }}
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
            boxShadow: '0 6px 16px rgba(110,38,56,0.18)',
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
      {error && <p className="text-xs text-red-600" style={{ marginTop: 10 }}>{error}</p>}

      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={() => setHistoryOpen(value => !value)}
          className="w-full inline-flex items-center justify-between text-nikah-muted font-bold hover:bg-nikah-bg hover:text-nikah-deep transition-colors"
          style={{ border: '1px solid var(--landing-border, var(--nikah-border))', background: 'transparent', borderRadius: 999, padding: '9px 12px', fontSize: 12 }}
        >
          <span>Riwayat tabungan</span>
          <span className="inline-flex items-center text-nikah-muted" style={{ gap: 6 }}>
            {localHistory.length} input
            <ChevronDown
              size={15}
              style={{
                transform: historyOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.15s',
              }}
            />
          </span>
        </button>

        {historyOpen && (
          <div className="grid" style={{ gap: 2, marginTop: 6 }}>
            {localHistory.length === 0 && (
              <p className="text-xs text-nikah-muted" style={{ margin: '6px 10px 0' }}>
                Belum ada riwayat input.
              </p>
            )}
            {localHistory.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center justify-between" style={{ gap: 10, padding: '9px 10px', borderRadius: 10 }}>
                <div>
                  <div className="font-bold text-nikah-text" style={{ fontSize: 12 }}>
                    {item.type === 'add' ? 'Tambah tabungan' : 'Koreksi saldo'}
                  </div>
                  <div className="text-nikah-muted" style={{ fontSize: 10, marginTop: 2 }}>
                    {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="text-right">
                  <div className={item.type === 'add' ? 'text-green-700' : 'text-red-600'} style={{ fontSize: 12, fontWeight: 800 }}>
                    {item.type === 'add' ? '+' : '-'}{formatRupiah(item.amount)}
                  </div>
                  <div className="text-nikah-muted" style={{ fontSize: 10, marginTop: 2 }}>
                    saldo {formatRupiah(item.balanceAfter)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
