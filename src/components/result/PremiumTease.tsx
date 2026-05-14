import Link from 'next/link'
import { AlarmClock, BriefcaseBusiness, Coins, Sparkles } from 'lucide-react'

interface Props {
  totalBudget: number
  monthlySavings: number
  checklistCount: number
  isSignedIn?: boolean
}

const PREVIEW_ITEMS = [
  {
    Icon: Coins,
    title: 'Tracking tabungan',
    body: 'Pantau target bulanan dan progress sampai hari H.',
  },
  {
    Icon: AlarmClock,
    title: 'Prioritas sekarang',
    body: 'Lihat tugas dan deadline paling dekat tanpa mikir ulang.',
  },
  {
    Icon: BriefcaseBusiness,
    title: 'Pembayaran vendor',
    body: 'Catat DP, sisa bayar, dan jatuh tempo pelunasan.',
  },
]

export function PremiumTease({ totalBudget, monthlySavings, checklistCount, isSignedIn = false }: Props) {
  const saveHref = '/auth/login?next=/result/saved'

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #F5E8EC 0%, #EDD6DE 100%)',
        borderRadius: 'var(--d-radius, 26px)',
        padding: 'var(--d-pad-card, 28px)',
        border: '1px solid var(--nikah-border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <span style={{ position: 'absolute', top: 16, right: 16, opacity: 0.6 }} aria-hidden="true">
        <Sparkles size={20} strokeWidth={1.8} />
      </span>

      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve" style={{ marginBottom: 6 }}>
        {isSignedIn ? 'Kelola Dashboard' : 'Simpan & Kelola'}
      </p>
      <h3
        style={{
          fontFamily: 'var(--font-fraunces, Georgia, serif)',
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: 22,
          margin: '6px 0 4px',
          color: 'var(--nikah-text)',
        }}
      >
        Pakai BudgetNikah sampai hari H.
      </h3>
      <p style={{ fontSize: 13, color: 'var(--nikah-muted)', margin: '0 0 14px', lineHeight: 1.5 }}>
        {isSignedIn
          ? 'Hasil kamu sudah terhubung ke akun. Lanjutkan ke dashboard untuk mengatur tabungan, vendor, checklist, dan catatan.'
          : 'Hasil ini baru awal. Akun hanya dibutuhkan untuk menyimpan dashboard; cek awal dan simulasi tetap bisa kamu coba gratis.'}
      </p>

      <div className="grid" style={{ gap: 8, marginBottom: 14 }}>
        <div className="grid grid-cols-3" style={{ gap: 8 }}>
          {[
            { label: 'Budget', value: totalBudget >= 1_000_000 ? `Rp ${(totalBudget / 1_000_000).toFixed(0)}jt` : `Rp ${totalBudget.toLocaleString('id-ID')}` },
            { label: 'Nabung/bln', value: monthlySavings >= 1_000_000 ? `Rp ${(monthlySavings / 1_000_000).toFixed(1)}jt` : `Rp ${monthlySavings.toLocaleString('id-ID')}` },
            { label: 'Checklist', value: `${checklistCount}+` },
          ].map(item => (
            <div key={item.label} className="bg-white/55" style={{ borderRadius: 12, padding: '10px 8px' }}>
              <div className="font-extrabold text-nikah-deep" style={{ fontSize: 13, lineHeight: 1.1 }}>{item.value}</div>
              <div className="text-nikah-muted" style={{ fontSize: 10, marginTop: 3 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {PREVIEW_ITEMS.map(item => (
          <div key={item.title} className="flex items-start bg-white/55" style={{ gap: 10, padding: 10, borderRadius: 12 }}>
            <span className="inline-flex items-center justify-center text-nikah-deep bg-white" style={{ width: 24, height: 24, borderRadius: 8, flexShrink: 0 }}>
              <item.Icon size={14} strokeWidth={1.9} />
            </span>
            <div>
              <div className="font-bold text-nikah-text" style={{ fontSize: 13, lineHeight: 1.25 }}>{item.title}</div>
              <div className="text-nikah-muted font-light" style={{ fontSize: 12, lineHeight: 1.35, marginTop: 2 }}>{item.body}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link
          href={isSignedIn ? '/dashboard' : saveHref}
          className="font-bold text-sm text-center hover:opacity-90 transition"
          style={{ flex: 1, minWidth: 130, background: 'var(--nikah-deep)', color: '#fff', padding: '14px 26px', borderRadius: 999 }}
        >
          {isSignedIn ? 'Buka Dashboard →' : 'Simpan & Kelola →'}
        </Link>
        <Link
          href="/?scroll=harga"
          className="font-bold text-sm text-center transition hover:bg-white/50"
          style={{ flex: 1, minWidth: 130, border: '1.5px solid var(--nikah-deep)', color: 'var(--nikah-deep)', padding: '14px 26px', borderRadius: 999 }}
        >
          Lihat Harga
        </Link>
      </div>
      <p className="text-xs text-nikah-muted" style={{ margin: '12px 0 0', lineHeight: 1.45 }}>
        {isSignedIn
          ? 'Akses premium tetap sekali bayar, tidak ada subscription.'
          : 'Data baru tersimpan setelah kamu membuat akun. Sekali bayar, tidak ada subscription.'}
      </p>
    </div>
  )
}
