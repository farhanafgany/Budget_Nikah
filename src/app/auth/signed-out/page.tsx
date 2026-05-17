import Link from 'next/link'
import { BrandLogo } from '@/components/ui/BrandLogo'

export default function SignedOutPage() {
  return (
    <main className="premium-theme min-h-screen bg-nikah-bg flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[420px] text-center">
        <div className="flex justify-center" style={{ marginBottom: 28 }}>
          <BrandLogo size="md" />
        </div>

        <div className="bg-white border border-nikah-border" style={{ borderRadius: 'var(--d-radius)', padding: '36px 30px', boxShadow: '0 24px 70px rgba(110,38,56,0.08)' }}>
          <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve" style={{ marginBottom: 8 }}>
            Sesi selesai
          </p>
          <h1
            className="text-nikah-text"
            style={{
              fontFamily: 'var(--font-fraunces, Georgia, serif)',
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 32,
              lineHeight: 1.1,
              margin: '0 0 10px',
            }}
          >
            Kamu sudah keluar.
          </h1>
          <p className="text-nikah-muted font-light" style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>
            Data rencana pernikahanmu tetap tersimpan dan bisa dibuka lagi saat kamu masuk kembali.
          </p>

          <div className="grid" style={{ gap: 10 }}>
            <Link
              href="/auth/login"
              className="block w-full bg-nikah-deep text-white font-bold rounded-full text-sm text-center hover:opacity-90 transition"
              style={{ padding: '14px 22px' }}
            >
              Masuk Lagi
            </Link>
            <Link
              href="/"
              className="block w-full border border-nikah-deep text-nikah-deep font-bold rounded-full text-sm text-center hover:bg-nikah-bg transition"
              style={{ padding: '14px 22px' }}
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
