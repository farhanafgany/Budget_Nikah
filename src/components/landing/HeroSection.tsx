'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo } from 'react'

const CLAUDE_SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

const GAYA_OPTIONS = ['Simple', 'Elegant', 'Mewah'] as const
type Gaya = typeof GAYA_OPTIONS[number]

const BASE_COST = 22_000_000
const GAYA_RATE: Record<Gaya, number> = {
  Simple:  150_000,
  Elegant: 185_000,
  Mewah:   280_000,
}

function calcEstimate(guests: number, gaya: Gaya): number {
  return BASE_COST + guests * GAYA_RATE[gaya]
}

function formatRpJt(amount: number): string {
  return `Rp ${Math.round(amount / 1_000_000)}jt`
}

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

function MobileHero() {
  const [guests, setGuests] = useState(350)
  const [gaya, setGaya] = useState<Gaya>('Elegant')

  const estimate = useMemo(() => calcEstimate(guests, gaya), [guests, gaya])
  const simpleEstimate = useMemo(() => calcEstimate(guests, 'Simple'), [guests])
  const delta = estimate - simpleEstimate

  return (
    <div className="md:hidden">

      {/* Badge */}
      <div style={{ marginBottom: 16 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'white',
            border: '1px solid var(--landing-border, #E8DACF)',
            borderRadius: 999,
            padding: '6px 14px',
            fontSize: 13,
            color: 'var(--landing-muted, #A38B89)',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#6B3545',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          Tanpa daftar · 2 menit
        </span>
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: CLAUDE_SERIF,
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: 'clamp(38px, 10vw, 54px)',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: 'var(--landing-deep-dark, #3D1419)',
          margin: '0 0 12px',
        }}
      >
        Berapa biaya nikah yang realistis untuk kalian?
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 15,
          color: 'var(--landing-muted, #A38B89)',
          lineHeight: 1.5,
          margin: '0 0 18px',
        }}
      >
        Coba sekarang — geser dua parameter, lihat estimasinya berubah.
      </p>

      {/* Interactive card */}
      <div
        style={{
          background: 'linear-gradient(160deg, #FFF7F2 0%, #F2E2D4 100%)',
          borderRadius: 24,
          padding: '16px 14px',
          marginBottom: 14,
          border: '1px solid var(--landing-border, #E8DACF)',
        }}
      >
        {/* Jumlah tamu */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: 'var(--landing-muted, #A38B89)' }}>Jumlah tamu</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--landing-deep-dark, #3D1419)' }}>
              {guests} orang
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={1000}
            step={10}
            value={guests}
            onChange={e => setGuests(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3D1419', cursor: 'pointer' }}
          />
        </div>

        {/* Gaya */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: 'var(--landing-muted, #A38B89)' }}>Gaya</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--landing-deep-dark, #3D1419)' }}>{gaya}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {GAYA_OPTIONS.map(g => (
              <button
                key={g}
                onClick={() => setGaya(g)}
                style={{
                  padding: '12px 0',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  border: gaya === g ? 'none' : '1px solid var(--landing-border, #E8DACF)',
                  background: gaya === g ? 'var(--landing-deep-dark, #3D1419)' : 'transparent',
                  color: gaya === g ? 'white' : 'var(--landing-muted, #A38B89)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--landing-border, #E8DACF)', marginBottom: 12 }} />

        {/* Estimasi */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--landing-muted, #A38B89)',
                margin: '0 0 4px',
              }}
            >
              Estimasi Awal
            </p>
            <p
              style={{
                fontFamily: CLAUDE_SERIF,
                fontStyle: 'italic',
                fontSize: 34,
                fontWeight: 400,
                color: 'var(--landing-deep-dark, #3D1419)',
                margin: 0,
                lineHeight: 1,
              }}
            >
              {formatRpJt(estimate)}
            </p>
          </div>
          {gaya !== 'Simple' && delta > 0 && (
            <p
              style={{
                fontSize: 12,
                color: '#C0392B',
                fontStyle: 'italic',
                fontFamily: CLAUDE_SERIF,
                margin: 0,
              }}
            >
              ↑ {Math.round(delta / 1_000_000)}jt dari Simple
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/onboarding"
        className="block w-full text-white font-bold text-center active:opacity-80 active:scale-[0.98] transition-all"
        style={{
          padding: '16px 20px',
          fontSize: 15,
          borderRadius: 999,
          background: 'var(--landing-deep-dark, #3D1419)',
          boxShadow: '0 6px 18px rgba(90,30,42,0.22)',
          marginBottom: 10,
        }}
      >
        Hitung lengkap — Gratis &rsaquo;
      </Link>

      {/* Disclaimer */}
      <p
        style={{
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--landing-muted, #A38B89)',
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        Estimasi di atas indikatif · hasil personal akan lebih akurat
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
        className="block fixed bottom-0 left-0 right-0 z-50 md:hidden"
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
          Hitung lengkap — Gratis →
        </Link>
      </div>
    </section>
  )
}
