'use client'

interface ProfileReplacementDialogProps {
  busy?: boolean
  keepLabel?: string
  onKeepExisting: () => void
  onReplace: () => void
}

export function ProfileReplacementDialog({
  busy = false,
  keepLabel = 'Lanjut dengan rencana tersimpan',
  onKeepExisting,
  onReplace,
}: ProfileReplacementDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 sm:items-center"
      aria-hidden="false"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="replace-profile-title"
        aria-describedby="replace-profile-description"
        className="w-full max-w-[420px] border border-nikah-border bg-white"
        style={{ borderRadius: 22, padding: '24px 22px', boxShadow: '0 22px 64px rgba(50, 20, 27, 0.22)' }}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve" style={{ margin: '0 0 9px' }}>
          Rencana tersimpan ditemukan
        </p>
        <h2 id="replace-profile-title" className="text-xl font-extrabold text-nikah-text" style={{ margin: '0 0 9px' }}>
          Kamu sudah punya rencana di dashboard.
        </h2>
        <p id="replace-profile-description" className="text-sm font-light text-nikah-muted" style={{ lineHeight: 1.58, margin: '0 0 20px' }}>
          Hasil baru akan mengganti budget, tanggal, tamu, dan alokasi utama. Tabungan, checklist, serta pembayaran yang sudah dicatat tetap tersimpan.
        </p>
        <div className="grid gap-2">
          <button
            type="button"
            onClick={onReplace}
            disabled={busy}
            autoFocus
            className="w-full rounded-full bg-nikah-deep py-3.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? 'Menyimpan...' : 'Gunakan hasil baru'}
          </button>
          <button
            type="button"
            onClick={onKeepExisting}
            disabled={busy}
            className="w-full rounded-full border border-nikah-border bg-white py-3.5 text-sm font-bold text-nikah-deep transition hover:bg-nikah-bg disabled:opacity-50"
          >
            {keepLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
