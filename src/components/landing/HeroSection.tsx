'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useOnboardingStore } from '@/stores/onboardingStore'

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
      <div className="relative" style={{ minHeight: 340 }}>
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
            top: 286,
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

function formatRupiah(raw: string) {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  return new Intl.NumberFormat('id-ID').format(Number(digits))
}

export function HeroSection() {
  const [budget, setBudget] = useState('')
  const router = useRouter()
  const setField = useOnboardingStore(s => s.setField)

  function handleCek() {
    const digits = budget.replace(/\D/g, '')
    if (digits) setField('totalBudget', Number(digits))
    router.push('/onboarding')
  }

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

          {/* Mobile hero — varian 4: input interaktif */}
          <div className="md:hidden" style={{ marginBottom: 22 }}>
            <h1
              style={{
                fontFamily: CLAUDE_SERIF,
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 'clamp(36px, 9vw, 48px)',
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                color: 'var(--landing-deep-dark, #3D1419)',
                margin: '0 0 10px',
              }}
            >
              Budget nikah kalian berapa?
            </h1>
            <p className="text-nikah-muted font-light" style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 24 }}>
              Masukkan angkanya — langsung tahu apakah rencana kalian realistis.
            </p>

            {/* Input */}
            <div
              className="flex items-center bg-white border border-nikah-border"
              style={{ borderRadius: 14, padding: '14px 18px', marginBottom: 12, gap: 10, boxShadow: '0 2px 8px rgba(90,30,42,0.06)' }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--nikah-muted)', flexShrink: 0 }}>Rp</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="80.000.000"
                value={budget}
                onChange={e => setBudget(formatRupiah(e.target.value))}
                className="flex-1 bg-transparent text-nikah-text font-bold focus:outline-none"
                style={{ fontSize: 17, minWidth: 0 }}
              />
            </div>

            <button
              onClick={handleCek}
              className="block w-full text-white font-bold rounded-[14px] text-center active:opacity-80 active:scale-[0.98] transition-all"
              style={{ padding: '16px', fontSize: 15, background: 'linear-gradient(160deg, #5A1E2A 0%, #3D1419 100%)', boxShadow: '0 6px 18px rgba(90,30,42,0.22)' }}
            >
              {budget ? 'Lihat apakah itu cukup →' : 'Cek rencana kalian →'}
            </button>

            <p className="text-center text-nikah-muted" style={{ fontSize: 11, marginTop: 10 }}>
              Gratis · tanpa daftar · selesai dalam 2 menit
            </p>
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

        <ResultPreview />

      </div>

      {/* Sticky CTA — disembunyikan di varian 4 (CTA ada di dalam hero) */}
    </section>
  )
}
