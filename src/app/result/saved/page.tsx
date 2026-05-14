import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, CheckCircle2, HeartHandshake, LockKeyhole } from 'lucide-react'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { createClient } from '@/lib/supabase/server'

export default async function ResultSavedPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    redirect('/auth/login?next=/result/saved')
  }

  return (
    <main
      className="min-h-screen bg-nikah-bg px-4 py-8 flex items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at 20% 0%, #F5E8EC 0%, transparent 52%), radial-gradient(ellipse at 100% 100%, #EDD6DE 0%, transparent 58%), var(--nikah-bg)',
      }}
    >
      <section
        className="w-full max-w-[520px] bg-white border border-nikah-border shadow-sm text-center"
        style={{ borderRadius: 'var(--d-radius)', padding: '38px 28px' }}
      >
        <div className="flex justify-center" style={{ marginBottom: 28 }}>
          <BrandLogo size="md" />
        </div>

        <span
          className="inline-flex items-center justify-center bg-nikah-bg text-nikah-deep"
          style={{ width: 58, height: 58, borderRadius: 20, marginBottom: 18 }}
        >
          <CheckCircle2 size={28} strokeWidth={1.8} />
        </span>

        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve" style={{ marginBottom: 8 }}>
          Hasil tersimpan
        </p>
        <h1
          className="text-nikah-text"
          style={{
            fontFamily: 'var(--font-fraunces, Georgia, serif)',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(31px, 8vw, 42px)',
            lineHeight: 1.08,
            margin: '0 0 12px',
          }}
        >
          Rencana nikahmu sudah aman.
        </h1>
        <p className="text-nikah-muted font-light" style={{ fontSize: 15, lineHeight: 1.65, margin: '0 auto 24px', maxWidth: 390 }}>
          Sekarang kamu bisa lanjut mengelola tabungan, checklist, vendor, dan catatan dari dashboard BudgetNikah.
        </p>

        <div className="grid text-left" style={{ gap: 10, marginBottom: 24 }}>
          {[
            { Icon: HeartHandshake, title: 'Lanjut dari data yang sama', body: 'Tidak perlu mengisi ulang rencana dari awal.' },
            { Icon: LockKeyhole, title: 'Akses premium tetap terpisah', body: 'Kalau belum aktif, dashboard akan menunjukkan langkah pembayaran.' },
          ].map(item => (
            <div key={item.title} className="flex items-start bg-nikah-bg" style={{ gap: 12, padding: 13, borderRadius: 14 }}>
              <span className="inline-flex items-center justify-center bg-white text-nikah-deep" style={{ width: 30, height: 30, borderRadius: 10, flexShrink: 0 }}>
                <item.Icon size={16} strokeWidth={1.9} />
              </span>
              <div>
                <div className="font-extrabold text-nikah-text" style={{ fontSize: 13 }}>{item.title}</div>
                <div className="text-nikah-muted font-light" style={{ fontSize: 12, lineHeight: 1.45, marginTop: 2 }}>{item.body}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid" style={{ gap: 10 }}>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-nikah-deep text-white font-bold rounded-full text-sm hover:opacity-90 transition"
            style={{ padding: '15px 22px' }}
          >
            Buka Dashboard <ArrowRight size={16} strokeWidth={2} />
          </Link>
          <Link
            href="/?scroll=harga"
            className="inline-flex items-center justify-center border border-nikah-deep text-nikah-deep font-bold rounded-full text-sm hover:bg-nikah-bg transition"
            style={{ padding: '14px 22px' }}
          >
            Lihat Harga
          </Link>
        </div>
      </section>
    </main>
  )
}
