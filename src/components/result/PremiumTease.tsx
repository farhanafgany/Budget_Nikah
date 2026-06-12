import { TrackedLink } from '@/components/analytics/TrackedLink'
import { BrandLogo } from '@/components/ui/BrandLogo'

interface Props {
  isSignedIn?: boolean
  scoreLabel?: 'Healthy' | 'Moderate' | 'High Risk'
}

const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

const PREMIUM_FEATURES = [
  {
    icon: '📋',
    title: 'Checklist Pernikahan',
    body: 'Urutan tugas dari H-12 bulan sampai hari H.',
  },
  {
    icon: '💰',
    title: 'Tabungan Nikah',
    body: 'Pantau target bulanan dan progres tabungan.',
  },
  {
    icon: '🧾',
    title: 'Pembayaran Vendor',
    body: 'Catat DP, pelunasan, dan tempo pembayaran.',
  },
  {
    icon: '🔔',
    title: 'Prioritas Sekarang',
    body: 'Tahu vendor mana yang harus diselesaikan dulu.',
  },
  {
    icon: '💎',
    title: 'Seserahan Custom',
    body: 'Susun daftar seserahan sesuai kebiasaan keluarga.',
  },
  {
    icon: '📝',
    title: 'Catatan Persiapan',
    body: 'Simpan keputusan, ide, dan detail vendor agar tidak tercecer.',
  },
]

export function PremiumTease({ isSignedIn = false, scoreLabel }: Props) {
  const saveHref = '/auth/signup?next=/premium'
  const continueHref = '/premium'
  // Skor tinggi butuh framing eksekusi, bukan perbaikan — "aman" saja tidak memberi alasan beli.
  const isHealthy = scoreLabel === 'Healthy'
  const bannerTitle = isHealthy
    ? 'Rencana sudah sehat — saatnya dieksekusi.'
    : 'Lanjutkan persiapan dengan lebih tenang.'
  const mobileSupportCopy = isHealthy
    ? 'Skor aman bukan berarti selesai — 12 bulan ke depan penuh DP vendor, target tabungan, dan deadline. Semua terpantau di sini.'
    : 'Termasuk checklist, tabungan nikah, prioritas vendor, dan catatan persiapan.'

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
            {bannerTitle}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.76)', margin: '10px 0 0', fontSize: 14, lineHeight: 1.55, maxWidth: 640 }}>
            Rp 149rb · sekali bayar · dipakai sampai hari H · garansi 3 hari tanpa pertanyaan
          </p>
        </div>
        <div className="flex justify-end" style={{ gap: 12 }}>
          <TrackedLink
            href={continueHref}
            event="result_premium_cta_clicked"
            eventProps={{ cta_location: 'result_banner_desktop', is_signed_in: isSignedIn }}
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
          </TrackedLink>
        </div>
      </div>

      {/* Mobile inline CTA buttons */}
      <div className="lg:hidden" style={{ marginBottom: 32 }}>
        <TrackedLink
          href={continueHref}
          event="result_premium_cta_clicked"
          eventProps={{ cta_location: 'result_inline_mobile', is_signed_in: isSignedIn }}
          className="block w-full text-white font-bold py-4 rounded-full text-center text-sm active:opacity-75 active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(160deg, #5A1E2A 0%, #3D1419 100%)', boxShadow: '0 6px 20px rgba(90,30,42,0.22)' }}
        >
          Buka rencana — Rp 149rb ›
        </TrackedLink>
        <p className="text-center text-nikah-muted" style={{ fontSize: 12, lineHeight: 1.5, marginTop: 9 }}>
          {mobileSupportCopy}
        </p>
        <p className="text-center text-nikah-muted" style={{ fontSize: 12, lineHeight: 1.5, marginTop: 8 }}>
          Garansi 3 hari — tidak cocok, uang kembali penuh.
        </p>
        {!isSignedIn && (
          <TrackedLink
            href={saveHref}
            event="save_result_clicked"
            eventProps={{ cta_location: 'result_inline_mobile', target: 'auth_signup' }}
            className="block w-full text-center text-nikah-muted font-bold text-sm mt-3 active:opacity-60 transition-opacity"
          >
            Simpan hasil ke akun dulu →
          </TrackedLink>
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

      {/* Closing CTA — beli sebagai aksi utama, simpan sebagai jalan sekunder */}
      <div className="text-center" style={{ marginTop: 52 }}>
        <h2
          className="text-nikah-deep"
          style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(26px, 3.8vw, 38px)', lineHeight: 1.1, margin: '0 0 12px' }}
        >
          Mulai susun rencana kalian.
        </h2>
        <p className="text-nikah-muted" style={{ fontSize: 15, lineHeight: 1.55, margin: '0 auto 22px', maxWidth: 560 }}>
          Buka sekarang dan langsung pakai semua fitur sampai hari H. Sekali bayar Rp 149rb, tanpa langganan.
        </p>
        <TrackedLink
          href={continueHref}
          event="result_premium_cta_clicked"
          eventProps={{ cta_location: 'result_bottom', is_signed_in: isSignedIn }}
          className="inline-flex items-center justify-center text-white font-extrabold rounded-full transition hover:brightness-105 active:scale-[0.97] w-full md:w-auto"
          style={{
            padding: '16px 32px',
            fontSize: 15,
            background: 'linear-gradient(160deg, #5A1E2A 0%, #3D1419 100%)',
            boxShadow: '0 8px 22px rgba(90,30,42,0.2)',
          }}
        >
          {isSignedIn ? 'Lanjutkan sekarang →' : 'Buka rencana — Rp 149rb →'}
        </TrackedLink>
        <p className="text-nikah-muted" style={{ fontSize: 13, lineHeight: 1.5, margin: '14px 0 0' }}>
          ✓ Tanpa langganan · ✓ Garansi 3 hari tanpa pertanyaan
        </p>
        {!isSignedIn && (
          <TrackedLink
            href={saveHref}
            event="save_result_clicked"
            eventProps={{ cta_location: 'result_bottom', target: 'auth_login' }}
            className="block text-nikah-muted font-bold transition-opacity hover:opacity-70 active:opacity-60"
            style={{ fontSize: 13, marginTop: 16 }}
          >
            Belum yakin? Simpan hasil dulu, gratis →
          </TrackedLink>
        )}
      </div>

      {/* Footer — mobile only */}
      <footer className="lg:hidden mt-14 pt-8 border-t border-nikah-border text-center">
        <div className="flex justify-center mb-2">
          <BrandLogo size="sm" />
        </div>
        <p className="text-nikah-muted" style={{ fontSize: 12, marginTop: 6, lineHeight: 1.6, marginBottom: 20 }}>
          Wedding financial planner untuk pasangan Indonesia.<br />
          Sekali bayar untuk satu rencana pernikahan.
        </p>
        <div className="flex flex-wrap justify-center" style={{ gap: '14px 22px' }}>
          {[
            { text: 'Fitur', href: '/#fitur' },
            { text: 'FAQ', href: '/#faq' },
            { text: 'Privacy', href: '/privacy-policy' },
            { text: 'Terms', href: '/terms' },
            { text: 'Contact', href: '/contact' },
          ].map(link => (
            <a key={link.text} href={link.href} className="text-nikah-muted hover:text-nikah-text transition-colors" style={{ fontSize: 12 }}>
              {link.text}
            </a>
          ))}
        </div>
      </footer>
    </section>
  )
}
