'use client'
import { useState, useTransition } from 'react'
import { updateDashboardNote } from '@/app/dashboard/actions'
import { NotebookPen } from 'lucide-react'

interface Props {
  initialNote: string
}

export function DashboardNote({ initialNote }: Props) {
  const [note, setNote] = useState(initialNote)
  const [savedNote, setSavedNote] = useState(initialNote)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const hasChanges = note !== savedNote

  function handleSave() {
    setError('')
    startTransition(async () => {
      const result = await updateDashboardNote(note)
      if (result.error) {
        setError(result.error)
        return
      }
      setSavedNote(note)
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
            <NotebookPen size={16} strokeWidth={1.8} />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-nikah-mauve">
            Catatan
          </span>
        </span>
        <span className="text-xs font-bold text-nikah-text">
          {note.length}/500
        </span>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value.slice(0, 500))}
        placeholder="Contoh: Venue cocok tapi parkir terbatas. Tanyakan lagi soal overtime dekorasi sebelum DP kedua."
        className="w-full resize-none border border-nikah-border bg-nikah-bg text-nikah-text outline-none transition-colors focus:border-nikah-mauve focus:bg-white"
        style={{
          minHeight: 132,
          borderRadius: 14,
          padding: '12px 14px',
          fontSize: 14,
          lineHeight: 1.55,
        }}
      />

      {!savedNote && !note && (
        <div className="bg-nikah-bg" style={{ borderRadius: 12, padding: '10px 12px', marginTop: 10 }}>
          <p className="text-xs text-nikah-muted" style={{ margin: 0, lineHeight: 1.45 }}>
            Gunakan catatan untuk menyimpan keputusan penting, pertanyaan ke vendor, atau hal kecil yang tidak boleh lupa.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between" style={{ gap: 12, marginTop: 12 }}>
        <span className="text-xs text-nikah-muted">
          {error || (hasChanges ? 'Ada perubahan belum disimpan.' : 'Catatan tersimpan.')}
        </span>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || !hasChanges}
          className="bg-nikah-deep text-white font-bold disabled:opacity-50"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 0,
            borderRadius: 999,
            padding: '10px 18px',
            fontSize: 12,
            boxShadow: '0 6px 16px rgba(107,53,69,0.18)',
            whiteSpace: 'nowrap',
          }}
        >
          {isPending ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </div>
  )
}
