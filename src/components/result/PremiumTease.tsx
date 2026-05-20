import Link from 'next/link'
import { BrandLogo } from '@/components/ui/BrandLogo'

interface Props {
  isSignedIn?: boolean
}

const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

const PREMIUM_FEATURES = [
  {
    icon: '📋',
    title: 'Checklist Pernikahan',
    body: 'Item tersusun dari 12 bulan hingga H-1 minggu. Ceklis sambil jalan.',
  },
  {
    icon: '💰',
    title: 'Tabungan Nikah',
    body: 'Pantau saldo tabungan vs target. Riwayat input tersimpan.',
  },
  {
    icon: '🧾',
    title: 'Pembayaran Vendor',
    body: 'DP, termin, sisa tagihan, dan jatuh tempo dalam satu tabel.',
  },
  {
    icon: '🔔',
    title: 'Prioritas Sekarang',
    body: 'Gabungan checklist + vendor terdekat. Tahu harus mulai dari mana.',
  },
  {
    icon: '💎',
    title: 'Seserahan Custom',
    body: 'Atur daftar seserahan sesuai kebiasaan keluarga kalian.',
  },
  {
    icon: '📝',
    title: 'Catatan Persiapan',
    body: 'Simpan keputusan, ide, dan detail vendor agar tidak tercecer.',
  },
]

export function PremiumTease({ isSignedIn = false }: Props) {
  const saveHref = '/auth/login?next=/premium'
  const continueHref = '/premium'

  return (
    <section id="premium-details" style={{ marginTop: 36 }}>
      {/* Dark CTA banner — desktop only */}
      <div
        className="hidden lg:grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] bg-nikah-deep text-white px-9 py-8"
        style={{
          borderRadius: 24,
          gap: 20,
          alignItems: 'center',
          background: 'linear-gradient(160deg, var(--landing-deep, #5A1E2A) 0%, var(--landing-deep-dark, #3D1419) 100%)',
          boxShadow: '0 18px 48px rgba(90,30,42,0.18)',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(24px, 3.7vw, 38px)',
              lineHeight: 1.12,
              margin: 0,
            }}
          >
            Lanjutkan persiapan dengan lebih tenang.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.76)', margin: '10px 0 0', fontSize: 14, lineHeight: 1.55, maxWidth: 640 }}>
            Rp 149rb · sekali bayar · akses sampai hari H · garansi 3 hari uang kembali
          </p>
        </div>
        <div className="flex justify-end" style={{ gap: 12 }}>
          <Link
            href={continueHref}
            className="inline-flex items-center justify-center font-extrabold transition hover:brightness-105 active:scale-[0.99]"
            style={{
              borderRadius: 999,
              padding: '16px 28px',
              color: '#4A1822',
              background: 'linear-gradient(180deg, #E8D7A8 0%, #C9A961 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.34)',
            }}
          >
            Buka rencana — Rp 149rb ›
          </Link>
        </div>
      </div>

      {/* Mobile inline CTA buttons */}
      <div className="lg:hidden" style={{ marginBottom: 32 }}>
        <Link
          href={continueHref}
          className="block w-full text-white font-bold py-4 rounded-full text-center text-sm"
          style={{ background: 'linear-gradient(160deg, #5A1E2A 0%, #3D1419 100%)', boxShadow: '0 6px 20px rgba(90,30,42,0.22)' }}
        >
          Buka rencana — Rp 149rb ›
        </Link>
        {!isSignedIn && (
          <Link
            href={saveHref}
            className="block w-full text-center text-nikah-muted font-bold text-sm mt-3"
          >
            Simpan hasil dulu — lihat lagi nanti
          </Link>
        )}
      </div>

      <div className="text-center mt-10 lg:mt-[72px] mb-6 lg:mb-7">
        <p className="text-xs font-extrabold uppercase text-nikah-mauve" style={{ letterSpacing: '0.18em', margin: '0 0 12px' }}>
          Setelah kalian buka
        </p>
        <h2
          className="text-nikah-deep"
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(26px, 4.4vw, 48px)',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Semua persiapan dalam satu tempat.
        </h2>
      </div>

      {/* Feature grid: 2-col on mobile, 3-col on desktop, all 6 shown */}
      <div className="grid grid-cols-2 lg:grid-cols-3" style={{ gap: 14 }}>
        {PREMIUM_FEATURES.map(item => (
          <div
            key={item.title}
            className="bg-white border border-nikah-border"
            style={{
              borderRadius: 16,
              padding: '16px 16px',
              boxShadow: '0 1px 2px rgba(90,30,42,0.035)',
            }}
          >
            <h3 className="text-nikah-text font-extrabold" style={{ fontSize: 13.5, lineHeight: 1.25, margin: '0 0 5px' }}>
              {item.title}
            </h3>
            <p className="text-nikah-muted" style={{ fontSize: 12, lineHeight: 1.5, margin: 0 }}>
              {item.body}
            </p>
          </div>
        ))}
      </div>

      {/* "Belum siap" section — visible on both mobile and desktop */}
      <div className="text-center" style={{ marginTop: 52 }}>
        <h2
          className="text-nikah-deep"
          style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(26px, 3.8vw, 38px)', lineHeight: 1.1, margin: '0 0 12px' }}
        >
          Belum siap memutuskan?
        </h2>
        <p className="text-nikah-muted" style={{ fontSize: 15, lineHeight: 1.55, margin: '0 auto 22px', maxWidth: 560 }}>
          Hasil ini akan tersimpan di email kalian. Bisa dibuka lagi kapan saja tanpa harus mulai dari awal.
        </p>
        {!isSignedIn ? (
          <Link
            href={saveHref}
            className="inline-flex items-center justify-center border border-nikah-border bg-white text-nikah-deep font-bold rounded-full transition hover:bg-nikah-bg"
            style={{ padding: '14px 28px', fontSize: 14 }}
          >
            Kirim hasil ke email
          </Link>
        ) : (
          <Link
            href={continueHref}
            className="inline-flex items-center justify-center bg-nikah-deep text-white font-extrabold rounded-full transition hover:opacity-90"
            style={{ padding: '14px 28px', fontSize: 14 }}
          >
            Lanjutkan sekarang →
          </Link>
        )}
        <p className="text-nikah-muted" style={{ fontSize: 13, lineHeight: 1.5, margin: '14px 0 0' }}>
          ✓ Tanpa subscription · ✓ Garansi 3 hari refund
        </p>
      </div>

      {/* Footer — mobile only */}
      <footer className="lg:hidden mt-14 pt-8 border-t border-nikah-border">
        <BrandLogo size="sm" />
        <p className="text-nikah-muted" style={{ fontSize: 12, marginTop: 8, lineHeight: 1.6, marginBottom: 20 }}>
          Wedding financial planner untuk pasangan Indonesia.<br />
          Sekali bayar, akses sampai hari H.
        </p>
        <div className="grid grid-cols-3" style={{ gap: 12 }}>
          {[
            { label: 'PRODUK', links: [{ text: 'Fitur', href: '/#fitur' }, { text: 'Harga', href: '/#harga' }] },
            { label: 'DUKUNGAN', links: [{ text: 'FAQ', href: '/#faq' }, { text: 'WhatsApp', href: '#' }] },
            { label: 'HUKUM', links: [{ text: 'Privasi', href: '#' }, { text: 'Refund', href: '#' }] },
          ].map(col => (
            <div key={col.label}>
              <p className="text-nikah-text font-extrabold uppercase" style={{ fontSize: 9, letterSpacing: '0.12em', marginBottom: 8 }}>
                {col.label}
              </p>
              <div className="flex flex-col" style={{ gap: 6 }}>
                {col.links.map(link => (
                  <a key={link.text} href={link.href} className="text-nikah-muted hover:text-nikah-text transition-colors" style={{ fontSize: 12 }}>
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </footer>
    </section>
  )
}
