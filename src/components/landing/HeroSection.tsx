'use client'
import Link from 'next/link'

const RESULT_STATS = [
  { val: 'Rp 87jt', lbl: 'Budget' },
  { val: 'Rp 4.2jt', lbl: 'Nabung/bln' },
  { val: '9 bln', lbl: 'Sisa waktu' },
]

const CLAUDE_SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

function ResultPreview() {
  const circumference = 2 * Math.PI * 48
  const scoreProgress = circumference * 0.78

  return (
    <div className="hidden lg:block w-full max-w-[519px]">
      <div className="relative" style={{ minHeight: 314 }}>
        <div
          className="border border-nikah-border"
          style={{
            width: '100%',
            minHeight: 288,
            borderRadius: 24,
            padding: '30px 30px 28px',
            background: 'linear-gradient(160deg, #FBF6F1 0%, #F4E9DE 48%, #EFE3D9 100%)',
            borderColor: 'var(--landing-border-soft, #F0E4DA)',
            boxShadow: 'var(--landing-shadow-lg, 0 12px 40px rgba(90,30,42,0.10))',
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-nikah-muted">Contoh Hasil</p>
            <span className="inline-flex items-center rounded-full bg-[#DCEAD9] text-[#4A7C5A] text-[11px] font-semibold" style={{ gap: 6, padding: '5px 10px' }}>
              <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: 999, background: '#4A7C5A' }} />
              Healthy
            </span>
          </div>

          <div className="flex items-center" style={{ gap: 22, marginBottom: 22, minHeight: 110 }}>
            <div className="relative shrink-0" style={{ width: 110, height: 110 }}>
              <svg width="110" height="110" viewBox="0 0 110 110" aria-hidden="true">
                <circle cx="55" cy="55" r="48" fill="none" stroke="#EFDADA" strokeWidth="7" />
                <circle
                  cx="55"
                  cy="55"
                  r="48"
                  fill="none"
                  stroke="#5A1E2A"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={`${scoreProgress} ${circumference}`}
                  transform="rotate(-90 55 55)"
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <span
                  className="text-nikah-deep"
                  style={{
                    fontFamily: CLAUDE_SERIF,
                    fontStyle: 'italic',
                    fontWeight: 500,
                    fontSize: 34,
                    lineHeight: 1,
                  }}
                >
                  78
                </span>
              </div>
            </div>
            <p
              className="text-nikah-text leading-snug"
              style={{
                maxWidth: 329,
                fontFamily: CLAUDE_SERIF,
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 19,
                lineHeight: '25.65px',
                margin: 0,
              }}
            >
              Rencana aman, tapi target tabungan perlu naik Rp 1.2jt/bulan.
            </p>
          </div>

          <div
            className="grid grid-cols-3"
            style={{
              gap: 10,
              paddingTop: 16,
              borderTop: '1px solid rgba(232,218,207,0.7)',
            }}
          >
            {RESULT_STATS.map((stat) => (
              <div
                key={stat.lbl}
                className="text-center"
                style={{ minHeight: 39.5 }}
              >
                <div className="text-[10px] text-nikah-muted" style={{ marginBottom: 4 }}>
                  {stat.lbl}
                </div>
                <div
                  className="text-nikah-text"
                  style={{
                    fontFamily: CLAUDE_SERIF,
                    fontStyle: 'italic',
                    fontWeight: 500,
                    fontSize: 17,
                    lineHeight: 1.18,
                    color: '#3D1419',
                  }}
                >
                  {stat.val}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="absolute flex items-center bg-white"
          style={{
            right: -16,
            top: 256.5,
            width: 181,
            height: 54,
            gap: 10,
            borderRadius: 14,
            padding: '12px 16px',
            boxShadow: 'var(--landing-shadow-lg, 0 12px 40px rgba(90,30,42,0.10))',
          }}
        >
          <span
            className="inline-flex shrink-0 items-center justify-center rounded-full text-white"
            style={{ width: 30, height: 30, background: '#5A1E2A', fontSize: 14, lineHeight: 1 }}
            aria-hidden="true"
          >
            →
          </span>
          <div style={{ width: 109 }}>
            <div className="font-semibold text-nikah-text" style={{ fontSize: 11, lineHeight: '14px' }}>
              4 prioritas minggu ini
            </div>
            <div className="text-nikah-muted" style={{ fontSize: 10, lineHeight: '12.5px' }}>
              Dari checklist + vendor
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden"
      style={{
        padding: '62px var(--d-pad-page) 72px',
        background: 'var(--landing-bg, #FAF5F5)',
      }}
    >

      <div
        className="relative z-10 max-w-[1128px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,545px)_minmax(0,519px)] items-center min-w-0"
        style={{ gap: 64 }}
      >

        <div className="min-w-0">
          <div className="inline-flex flex-wrap items-center bg-white border border-nikah-border rounded-full text-[11px] font-bold text-nikah-muted" style={{ gap: 8, padding: '7px 12px', marginBottom: 22 }}>
            <span className="text-[#B98C54]" aria-hidden="true">★</span>
            <span>Wedding planner Indonesia</span>
            <span className="w-1 h-1 rounded-full bg-nikah-border" aria-hidden="true" />
            <span>Selesai 2 menit · tanpa daftar</span>
          </div>

          <h1
            className="text-nikah-text leading-[0.98] max-w-[620px]"
          style={{
            fontFamily: CLAUDE_SERIF,
            fontStyle: 'italic',
            fontWeight: 500,
              fontSize: 'clamp(50px, 5.3vw, 70px)',
              lineHeight: '0.98',
              letterSpacing: '-1.2px',
              color: 'var(--landing-deep-dark, #3D1419)',
              margin: '0 0 18px',
              overflowWrap: 'break-word',
            }}
          >
            Jangan tebak-tebak soal budget nikahmu.
          </h1>

          <p
            className="text-nikah-muted font-light max-w-[520px]"
            style={{ fontSize: 17, lineHeight: 1.6, margin: '0 0 28px' }}
          >
            Tahu persis berapa yang kamu butuhkan — dan apakah rencanamu sudah cukup siap. Selesai dalam 2 menit, tanpa login.
          </p>

          <div className="flex flex-col items-start" style={{ gap: 14 }}>
            <div className="flex flex-wrap items-center" style={{ gap: 12 }}>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center bg-nikah-deep text-white font-bold rounded-full hover:opacity-90 active:scale-95 transition-all"
                style={{
                  gap: 6,
                  padding: '17px 28px',
                  fontSize: 14,
                  boxShadow: '0 8px 18px rgba(107,53,69,0.18)',
                }}
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
            <div className="inline-flex flex-wrap items-center gap-[12px] text-xs text-nikah-muted">
              <span>✓ Tanpa daftar</span>
              <span>✓ Selesai 2 menit</span>
              <span>✓ 100% gratis</span>
            </div>
          </div>
        </div>

        <ResultPreview />

      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-4 bg-white/90 backdrop-blur border-t border-nikah-border">
        <Link
          href="/onboarding"
          className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center"
        >
          Cek Sekarang — Gratis →
        </Link>
      </div>
    </section>
  )
}
