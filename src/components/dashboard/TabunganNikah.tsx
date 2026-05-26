'use client'
import { useState, useTransition } from 'react'
import { updateTabunganWithHistory } from '@/app/dashboard/actions'
import type { SavingsHistoryInput } from '@/lib/dashboardActions'
import { useHandleActionError } from '@/hooks/useDashboardAction'
import { track } from '@/lib/analytics'
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
  const handleActionError = useHandleActionError()

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
    if (n <= 0) return
    const delta = mode === 'add' ? n : -n
    const next = Math.max(0, localCollected + delta)
    const entryId = crypto.randomUUID()
    const newEntry: SavingsHistoryInput = {
      id: entryId,
      type: mode,
      amount: n,
      balanceAfter: next,
      date: new Date().toISOString(),
    }
    const nextHistory = [newEntry, ...localHistory].slice(0, 20)
    track('dashboard_feature_used', {
      feature: 'savings',
      action: mode,
    })
    setLocalCollected(next)
    setLocalHistory(nextHistory)
    setInputRaw('')
    setError('')
    startTransition(async () => {
      const result = await updateTabunganWithHistory(next, nextHistory)
      const err = handleActionError(result.error)
      if (err) {
        // Undo hanya delta ini — aman meski ada submit lain yang concurrent.
        setLocalCollected(prev => Math.max(0, prev - delta))
        setLocalHistory(prev => prev.filter(item => item.id !== entryId))
        // Kembalikan nilai ke input agar user bisa coba lagi tanpa ketik ulang.
        setInputRaw(formatInputRp(n))
        setError('Belum tersimpan — coba simpan lagi.')
      }
    })
  }

  return (
    <div
      className="bg-white border"
      style={{
        borderRadius: 'var(--d-radius)',
        padding: 24,
        borderColor: 'rgba(192,120,136,0.26)',
        boxShadow: '0 4px 20px rgba(90,30,42,0.09)',
      }}
    >
      <div className="flex items-start justify-between" style={{ marginBottom: 14 }}>
        <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-nikah-mauve">
          Tabungan Nikah
        </span>
        <div className="text-right">
          <div
            className="text-nikah-mauve"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontStyle: 'italic', fontWeight: 500, fontSize: 28, lineHeight: 1 }}
          >
            {progress}%
          </div>
          <div className="text-nikah-muted font-bold uppercase" style={{ fontSize: 9, letterSpacing: '0.12em', marginTop: 4 }}>
            terkumpul
          </div>
        </div>
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
        {months > 0 ? (
          <div className="text-right">
            <div className="text-nikah-mauve font-extrabold" style={{ fontSize: 14 }}>
              {formatRupiah(monthly)}/bln
            </div>
            <div className="text-nikah-muted font-normal" style={{ fontSize: 11, marginTop: 4 }}>selama {months} bln lagi</div>
          </div>
        ) : (
          <div className="text-right">
            <div className="text-nikah-muted font-light" style={{ fontSize: 12, lineHeight: 1.4 }}>
              Atur tanggal nikah<br />untuk target bulanan
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-nikah-border rounded-full overflow-hidden" style={{ height: 10, margin: '8px 0 14px' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #C16E73, #6B3545)' }}
        />
      </div>
      <div className="flex justify-between text-nikah-muted" style={{ fontSize: 11, marginBottom: 12 }}>
        <span>Terkumpul</span>
        <span>Target hari H</span>
      </div>

      {/* Mode toggle */}
      <div className="flex" style={{ gap: 8, marginBottom: 14 }}>
        <button
          type="button"
          onClick={() => switchMode('add')}
          className={`flex-1 font-bold rounded-full transition-all active:scale-[0.96] active:brightness-90 ${mode === 'add' ? 'bg-nikah-deep text-white' : 'text-nikah-deep hover:bg-nikah-bg'}`}
          style={{ padding: '9px 14px', fontSize: 12, border: mode === 'add' ? 0 : '1px solid var(--landing-border, var(--nikah-border))', background: mode === 'add' ? undefined : 'transparent' }}
        >
          + Tambah
        </button>
        <button
          type="button"
          onClick={() => switchMode('subtract')}
          className={`flex-1 font-bold rounded-full transition-all active:scale-[0.96] active:brightness-90 ${mode === 'subtract' ? 'bg-nikah-deep text-white' : 'text-nikah-deep hover:bg-nikah-bg'}`}
          style={{ padding: '9px 14px', fontSize: 12, border: mode === 'subtract' ? 0 : '1px solid var(--landing-border, var(--nikah-border))', background: mode === 'subtract' ? undefined : 'transparent' }}
        >
          Koreksi saldo
        </button>
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
          className="bg-nikah-deep text-white font-bold disabled:opacity-50 active:scale-[0.96] active:brightness-90 transition-all"
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
      {error && (
        <div className="flex items-center bg-red-50 border border-red-100 rounded-xl px-3 py-2" style={{ marginTop: 10, gap: 8 }}>
          <p className="text-xs text-red-700 font-medium flex-1" style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={() => setHistoryOpen(value => !value)}
          className="w-full inline-flex items-center justify-between text-nikah-muted font-bold hover:bg-nikah-bg hover:text-nikah-deep transition-all active:scale-[0.98] active:brightness-90"
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
