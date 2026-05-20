import Link from 'next/link'
import Image from 'next/image'

const CLAUDE_SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

function DashboardPreview() {
  return (
    <div className="hidden lg:block w-full max-w-[519px]">
      <div
        className="overflow-hidden border border-nikah-border"
        style={{
          borderRadius: 20,
          boxShadow: 'var(--landing-shadow-lg, 0 12px 40px rgba(90,30,42,0.12))',
        }}
      >
        <Image
          src="/images/dashboard-preview.png"
          alt="Contoh tampilan dashboard BudgetNikah"
          width={1280}
          height={700}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          priority
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
      className="relative overflow-hidden pt-10 pb-32 md:pt-[62px] md:pb-[72px]"
      style={{
        paddingLeft: 'var(--d-pad-page)',
        paddingRight: 'var(--d-pad-page)',
        background: 'var(--landing-bg, #FAF5F5)',
      }}
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

          {/* Mobile layout */}
          <div className="md:hidden" style={{ marginBottom: 28 }}>

            {/* Eyebrow */}
            <p
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#B98C54',
                margin: '0 0 12px',
              }}
            >
              Wedding financial planner
            </p>

            {/* Headline */}
            <h1
              style={{
                fontFamily: CLAUDE_SERIF,
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 'clamp(38px, 10vw, 54px)',
                lineHeight: 1.04,
                letterSpacing: '-0.03em',
                color: 'var(--landing-deep-dark, #3D1419)',
                margin: '0 0 16px',
              }}
            >
              Jangan tebak-tebak soal budget nikahmu.
            </h1>

            {/* Subtitle */}
            <p
              className="text-nikah-muted"
              style={{ fontSize: 15, lineHeight: 1.55, fontWeight: 400, marginBottom: 28 }}
            >
              Cek apakah rencana kalian realistis — selesai dalam 2 menit, tanpa login.
            </p>

            {/* Label konteks */}
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--landing-muted, #A38B89)',
                marginBottom: 10,
              }}
            >
              Begini hasilnya
            </p>

            {/* Screenshots — 2 kolom */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                marginBottom: 0,
              }}
            >
              <div
                className="overflow-hidden border border-nikah-border"
                style={{ borderRadius: 10, boxShadow: '0 4px 16px rgba(90,30,42,0.10)' }}
              >
                <Image
                  src="/images/result-preview.png"
                  alt="Halaman hasil analisa BudgetNikah"
                  width={1280}
                  height={800}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  priority
                />
              </div>
              <div
                className="overflow-hidden border border-nikah-border"
                style={{ borderRadius: 10, boxShadow: '0 4px 16px rgba(90,30,42,0.10)' }}
              >
                <Image
                  src="/images/dashboard-preview.png"
                  alt="Tampilan dashboard BudgetNikah"
                  width={1280}
                  height={700}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  priority
                />
              </div>
            </div>

          </div>

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
            {/* Desktop: inline button row */}
            <div className="hidden md:flex flex-wrap items-center" style={{ gap: 12 }}>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center bg-nikah-deep text-white font-bold rounded-full hover:opacity-90 active:scale-95 transition-all"
                style={{ gap: 6, padding: '17px 28px', fontSize: 14, boxShadow: '0 8px 18px rgba(107,53,69,0.18)' }}
              >
                Cek Sekarang — Gratis →
              </Link>
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

      {/* Sticky CTA — mobile only */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          padding: '10px 16px',
          paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
          background: 'rgba(251,246,241,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--landing-border, #E8DACF)',
        }}
      >
        <Link
          href="/onboarding"
          className="block w-full text-white font-bold text-center rounded-[12px] active:opacity-80 active:scale-[0.98] transition-all"
          style={{
            padding: '13px 16px',
            fontSize: 14,
            background: 'linear-gradient(160deg, #5A1E2A 0%, #3D1419 100%)',
            boxShadow: '0 4px 14px rgba(90,30,42,0.22)',
          }}
        >
          Cek Sekarang — Gratis →
        </Link>
      </div>
    </section>
  )
}
