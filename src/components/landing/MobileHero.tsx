'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { track } from '@/lib/analytics'

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

export function MobileHero() {
  const [guests, setGuests] = useState(350)
  const [gaya, setGaya] = useState<Gaya>('Elegant')

  const estimate = useMemo(() => calcEstimate(guests, gaya), [guests, gaya])
  const simpleEstimate = useMemo(() => calcEstimate(guests, 'Simple'), [guests])
  const delta = estimate - simpleEstimate

  return (
    <div className="md:hidden">

      {/* Badge */}
      <div style={{ marginBottom: 14 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'white',
            border: '1px solid var(--landing-border, #E8DACF)',
            borderRadius: 999,
            padding: '6px 12px',
            fontSize: 12.5,
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
          fontSize: 38,
          lineHeight: 1.06,
          letterSpacing: '-0.02em',
          color: 'var(--landing-deep-dark, #3D1419)',
          margin: '0 0 14px',
        }}
      >
        Berapa biaya nikah yang realistis untuk kalian?
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 14.5,
          color: 'var(--landing-muted, #A38B89)',
          lineHeight: 1.55,
          margin: '0 0 16px',
        }}
      >
        Coba sekarang — geser dua parameter, lihat estimasinya berubah.
      </p>

      {/* Interactive card */}
      <div
        style={{
          background: 'linear-gradient(160deg, #FFF7F2 0%, #F2E2D4 100%)',
          borderRadius: 20,
          padding: '15px 14px',
          marginBottom: 12,
          border: '1px solid var(--landing-border, #E8DACF)',
          boxShadow: '0 10px 28px rgba(90,30,42,0.055)',
        }}
      >
        {/* Jumlah tamu */}
        <div style={{ marginBottom: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13.5, color: 'var(--landing-muted, #A38B89)' }}>Jumlah tamu</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--landing-deep-dark, #3D1419)' }}>
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
        <div style={{ marginBottom: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13.5, color: 'var(--landing-muted, #A38B89)' }}>Gaya</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--landing-deep-dark, #3D1419)' }}>{gaya}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
            {GAYA_OPTIONS.map(g => (
              <button
                key={g}
                onClick={() => setGaya(g)}
                style={{
                  padding: '11px 0',
                  borderRadius: 999,
                  fontSize: 12.5,
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
        <div style={{ borderTop: '1px solid var(--landing-border, #E8DACF)', marginBottom: 11 }} />

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
                fontSize: 32,
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
                margin: '0 0 3px',
                whiteSpace: 'nowrap',
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
        onClick={() => track('landing_cta_clicked', {
          cta_location: 'mobile_hero',
          target: 'onboarding',
          guest_bucket: guests < 100 ? '<100' : guests < 300 ? '100-300' : guests < 600 ? '300-600' : '>600',
          style_preview: gaya.toLowerCase(),
        })}
        className="block w-full text-white font-bold text-center active:opacity-80 active:scale-[0.98] transition-all"
        style={{
          padding: '15px 20px',
          fontSize: 15,
          borderRadius: 999,
          background: 'var(--landing-deep-dark, #3D1419)',
          boxShadow: '0 6px 18px rgba(90,30,42,0.22)',
          marginBottom: 9,
        }}
      >
        Hitung lengkap — Gratis &rsaquo;
      </Link>

      {/* Disclaimer */}
      <p
        style={{
          textAlign: 'center',
          fontSize: 12.5,
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
