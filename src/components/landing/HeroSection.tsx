import Image from 'next/image'
import { TrackedLink } from '@/components/analytics/TrackedLink'
import { MobileHero } from '@/components/landing/MobileHero'

const CLAUDE_SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

// Server Component — hanya MobileHero (slider interaktif) yang butuh JS.
// DashboardPreview dan desktop layout murni static HTML.
function DashboardPreview() {
  return (
    <div className="hidden lg:block w-full max-w-[519px]">
      <div
        className="overflow-hidden border border-nikah-border"
        style={{
          borderRadius: 18,
          boxShadow: 'var(--landing-shadow-lg, 0 12px 40px rgba(90,30,42,0.12))',
        }}
      >
        <Image
          src="/images/dashboard-hero-desktop.png"
          alt="Contoh tampilan dashboard BudgetNikah"
          width={3330}
          height={1926}
          sizes="(min-width: 1024px) 519px, 1px"
          priority
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
      <p className="text-center text-nikah-muted" style={{ fontSize: 11, marginTop: 10 }}>
        Tampilan dashboard setelah kalian mulai
      </p>
    </div>
  )
}

export function HeroSection() {
  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden pt-8 pb-10 md:pt-[62px] md:pb-[72px] px-6 md:px-8"
      style={{ background: 'var(--landing-bg, #FAF5F5)' }}
    >
      <div
        className="relative z-10 max-w-[1128px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,545px)_minmax(0,519px)] items-center min-w-0"
        style={{ gap: 64 }}
      >
        <div className="min-w-0">

          {/* Badge — desktop only */}
          <div className="hidden md:inline-flex flex-wrap items-center bg-white border border-nikah-border rounded-full text-[11px] font-bold text-nikah-muted" style={{ gap: 8, padding: '7px 12px', marginBottom: 22 }}>
            <span className="text-[#B98C54]" aria-hidden="true">★</span>
            <span>Cek realistis budget nikah</span>
            <span className="w-1 h-1 rounded-full bg-nikah-border" aria-hidden="true" />
            <span>2 menit · tanpa daftar</span>
          </div>

          {/* Mobile: interactive slider — client component */}
          <MobileHero />

          {/* Desktop headline */}
          <h1
            className="hidden md:block text-nikah-text max-w-[620px]"
            style={{
              fontFamily: CLAUDE_SERIF,
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(50px, 5.3vw, 70px)',
              lineHeight: 1.05,
              letterSpacing: '-1.2px',
              color: 'var(--landing-deep-dark, #3D1419)',
              margin: '0 0 18px',
              overflowWrap: 'break-word',
            }}
          >
            Jangan tebak-tebak soal budget nikahmu.
          </h1>

          <p
            className="hidden md:block text-nikah-muted font-light max-w-[520px]"
            style={{ fontSize: 17, lineHeight: 1.6, margin: '0 0 28px' }}
          >
            Dapatkan gambaran biaya, kesiapan, dan prioritas pertama tanpa harus buka spreadsheet panjang. Selesai dalam 2 menit, tanpa login.
          </p>

          <div className="flex flex-col items-start w-full" style={{ gap: 14 }}>
            <div className="hidden md:flex flex-wrap items-center" style={{ gap: 12 }}>
              <TrackedLink
                href="/onboarding"
                event="landing_cta_clicked"
                eventProps={{ cta_location: 'hero', target: 'onboarding' }}
                className="inline-flex items-center justify-center bg-nikah-deep text-white font-bold rounded-full hover:opacity-90 active:scale-95 transition-all"
                style={{ gap: 6, padding: '17px 28px', fontSize: 14, boxShadow: '0 8px 18px rgba(107,53,69,0.18)' }}
              >
                Cek Sekarang — Gratis →
              </TrackedLink>
              <a
                href="#contoh-hasil"
                className="inline-flex items-center justify-center bg-white border border-nikah-border text-nikah-deep font-bold rounded-full hover:bg-nikah-bg active:scale-95 transition-all"
                style={{ padding: '16px 24px', fontSize: 14 }}
              >
                Lihat contoh hasil
              </a>
            </div>
            <div className="hidden md:inline-flex flex-wrap items-center gap-[12px] text-xs text-nikah-muted">
              <span>✓ Tanpa daftar</span>
              <span>✓ Selesai 2 menit</span>
              <span>✓ Tanpa kartu kredit</span>
            </div>
          </div>

        </div>

        <DashboardPreview />

      </div>

    </section>
  )
}
