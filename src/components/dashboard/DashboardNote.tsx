'use client'
import { useState, useTransition } from 'react'
import { updateDashboardNote } from '@/app/dashboard/actions'
import { useHandleActionError } from '@/hooks/useDashboardAction'
import { track } from '@/lib/analytics'

interface Props {
  initialNote: string
}

export function DashboardNote({ initialNote }: Props) {
  const [note, setNote] = useState(initialNote)
  const [savedNote, setSavedNote] = useState(initialNote)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const handleActionError = useHandleActionError()

  const hasChanges = note !== savedNote

  function handleSave() {
    setError('')
    track('dashboard_feature_used', {
      feature: 'note',
      action: savedNote ? 'update' : 'add',
      note_length_bucket: note.length < 50 ? '<50' : note.length < 200 ? '50-200' : '>200',
    })
    startTransition(async () => {
      const result = await updateDashboardNote(note)
      const err = handleActionError(result.error)
      if (err) {
        setError(err)
        return
      }
      setSavedNote(note)
    })
  }

  return (
    <div
      className="bg-white border border-nikah-border shadow-sm"
      style={{
        borderRadius: 'var(--d-radius)',
        padding: '22px 22px',
        boxShadow: '0 12px 30px rgba(90, 30, 42, 0.05)',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
        <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-nikah-mauve">
          Catatan Terakhir
        </span>
        <span className="text-xs font-bold text-nikah-text">
          {note.length}/500
        </span>
      </div>

      {savedNote && (
        <div
          style={{
            borderRadius: 14,
            padding: '12px 14px',
            marginBottom: 10,
            background: 'linear-gradient(180deg, #FBF6F1 0%, #EFE3D9 100%)',
          }}
        >
          <p
            className="text-nikah-text"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontStyle: 'italic', fontSize: 16, lineHeight: 1.45, margin: 0 }}
          >
            “{savedNote}”
          </p>
        </div>
      )}

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value.slice(0, 500))}
        placeholder="Tulis apapun — ide venue, reminder vendor, atau sekadar perasaan hari ini."
        className="w-full resize-none border border-nikah-border bg-nikah-bg text-nikah-text outline-none transition-colors focus:border-nikah-mauve focus:bg-white"
        style={{
          minHeight: savedNote ? 84 : 116,
          borderRadius: 14,
          padding: '12px 14px',
          fontSize: 14,
          lineHeight: 1.55,
        }}
      />

      {!savedNote && !note && (
        <div className="bg-nikah-bg" style={{ borderRadius: 12, padding: '10px 12px', marginTop: 10 }}>
          <p className="text-xs text-nikah-muted" style={{ margin: 0, lineHeight: 1.45 }}>
            Catatan kecil bisa jadi pengingat besar nanti. Tidak ada format yang salah — tulis saja apa yang terlintas.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between" style={{ gap: 12, marginTop: 10 }}>
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
            boxShadow: '0 6px 16px rgba(110,38,56,0.16)',
            whiteSpace: 'nowrap',
          }}
        >
          {isPending ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </div>
  )
}
