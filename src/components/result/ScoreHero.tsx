'use client'

import type { ReadinessLabel } from '@/lib/scoring'
import { monthsUntilDate } from '@/lib/savings'
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber'
import { Lock } from 'lucide-react'

const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

const STATUS_STYLE: Record<ReadinessLabel, { background: string; color: string; dot: string }> = {
  Healthy:   { background: '#DCEAD9', color: '#4A7C5A', dot: '#4A7C5A' },
  Moderate:  { background: '#F5E8C8', color: '#9A6A1E', dot: '#C9A961' },
  'High Risk': { background: '#F5D6D8', color: '#A9414C', dot: '#C16E73' },
}

const HEADLINE: Record<ReadinessLabel, string> = {
  Healthy: 'Rencana kalian sudah berada di jalur yang aman.',
  Moderate: 'Rencana kalian masih bisa dibuat lebih aman.',
  'High Risk': 'Rencana kalian perlu beberapa penyesuaian.',
}

const MAIN_COPY: Record<ReadinessLabel, string> = {
  Healthy: 'Tetap pantau detail kecil agar tidak ada yang tercecer sebelum hari H.',
  Moderate: 'Ada beberapa keputusan yang bisa dibuat lebih ringan.',
  'High Risk': 'Mulai dari bagian yang paling berdampak agar rencana terasa lebih terkendali.',
}

const SUPPORT_COPY: Record<ReadinessLabel, string> = {
  Healthy: 'Fokuskan energi ke pembayaran penting dan checklist terdekat agar persiapan tetap terkendali.',
  Moderate: 'Coba rapikan jumlah tamu, alokasi budget, dan target tabungan agar persiapan terasa lebih jelas.',
  'High Risk': 'Gunakan hasil ini sebagai titik awal untuk mengurangi beban budget dan menyusun ulang prioritas.',
}

interface Props {
  score: number
  label: ReadinessLabel
  totalBudget: number
  guestCount: number
  weddingDate: string
  checklistCount: number
}

function monthCopy(months: number) {
  if (months <= 1) return 'kurang dari 1 bulan'
  return `${months} bulan lagi`
}

function shortRupiah(value: number) {
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1).replace('.0', '')}M`
  if (value >= 1_000_000) return `Rp ${Math.round(value / 1_000_000)}jt`
  if (value >= 1_000) return `Rp ${Math.round(value / 1_000)}rb`
  return `Rp ${value.toLocaleString('id-ID')}`
}

const PRIORITY_PREVIEW_ITEMS = [
  {
    title: 'Konfirmasi jumlah tamu final ke katering',
    meta: 'Katering · 1 Bulan Sebelum',
  },
  {
    title: 'Trial makeup dan hairdo',
    meta: 'MUA · 1 Bulan Sebelum',
  },
  {
    title: 'Final fitting baju pengantin',
    meta: 'Baju · 1 Bulan Sebelum',
  },
  {
    title: 'Gladi resik / rehearsal acara',
    meta: 'Perencanaan · 1 Bulan Sebelum',
  },
]

export function ScoreHero({ score, label, totalBudget, guestCount, weddingDate, checklistCount }: Props) {
  const months = Math.max(0, monthsUntilDate(weddingDate || null))
  const animatedRingScore = useAnimatedNumber(score, { duration: 1100 })
  const scorePct = Math.min(100, Math.max(0, animatedRingScore))
  const status = STATUS_STYLE[label]

  return (
    <section>
      <p
        className="text-xs font-extrabold uppercase text-nikah-mauve"
        style={{ fontSize: 12, letterSpacing: '0.18em', margin: '0 0 18px' }}
      >
        Hasil Cek Kalian
      </p>

      <h1
        className="text-nikah-deep"
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: 'clamp(44px, 5.6vw, 64px)',
          lineHeight: 1.04,
          letterSpacing: '-0.024em',
          maxWidth: 860,
          margin: '0 0 18px',
          textWrap: 'balance',
        }}
      >
        {HEADLINE[label]}
      </h1>

      <p
        className="text-nikah-muted"
        style={{ fontSize: 'clamp(17px, 1.8vw, 20px)', lineHeight: 1.55, maxWidth: 800, margin: '0 0 44px' }}
      >
        Dengan sisa {monthCopy(months)}, beberapa detail kecil mudah tercecer. Kami sudah siapkan rencana yang disesuaikan dari jawaban kalian — tinggal dibuka.
      </p>

      <div
        className="bg-white border border-nikah-border"
        style={{
          borderRadius: 24,
          padding: '34px clamp(24px, 4vw, 42px)',
          boxShadow: '0 4px 16px rgba(90, 30, 42, 0.05)',
          background: 'linear-gradient(160deg, #FFFCF8 0%, #F8F1EA 52%, #EFE3D9 100%)',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[118px_minmax(0,1fr)_280px] items-center" style={{ gap: 28 }}>
          <div
            className="relative shrink-0"
            style={{
              width: 118,
              height: 118,
              borderRadius: 999,
              background: `conic-gradient(#5A1E2A ${scorePct}%, #EEDDE2 ${scorePct}% 100%)`,
              display: 'grid',
              placeItems: 'center',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.48)',
            }}
            aria-label={`Readiness score ${score}`}
          >
            <div
              className="bg-white"
              style={{ width: 90, height: 90, borderRadius: 999, display: 'grid', placeItems: 'center' }}
            >
              <div className="text-center">
                <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 36, lineHeight: 1, color: '#3D1419' }}>
                  {score}
                </div>
                <div className="text-nikah-muted font-bold uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', marginTop: 5 }}>
                  Score
                </div>
              </div>
            </div>
          </div>

          <div>
            <span
              className="inline-flex items-center rounded-full font-bold"
              style={{ gap: 7, padding: '7px 12px', fontSize: 12, background: status.background, color: status.color }}
            >
              <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 999, background: status.dot }} />
              {label}
              <span className="sr-only">Skor readiness {score}</span>
            </span>
            <h2
              className="text-nikah-text"
              style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(25px, 3vw, 31px)', lineHeight: 1.14, margin: '18px 0 11px', maxWidth: 500 }}
            >
              {MAIN_COPY[label]}
            </h2>
            <p className="text-nikah-muted" style={{ fontSize: 15.5, lineHeight: 1.58, margin: 0, maxWidth: 545 }}>
              {SUPPORT_COPY[label]}
            </p>
          </div>

          <div
            className="grid grid-cols-3 lg:border-l lg:border-nikah-border lg:pl-[28px]"
            style={{
              gap: 24,
              minWidth: 'min(300px, 100%)',
            }}
          >
            {[
              { label: 'Estimasi total', value: shortRupiah(totalBudget) },
              { label: 'Undangan', value: guestCount.toLocaleString('id-ID') },
              { label: 'Sisa waktu', value: `${months} bln` },
            ].map(item => (
              <div key={item.label} className="text-left">
                <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 25, lineHeight: 1, color: '#3D1419' }}>
                  {item.value}
                </div>
                <div className="text-nikah-muted font-bold uppercase" style={{ fontSize: 10, letterSpacing: '0.14em', marginTop: 7 }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 18, marginTop: 24 }}>
        {[
          {
            value: checklistCount.toString(),
            title: 'checklist disesuaikan',
            body: `Tersusun untuk H-${Math.max(1, months)} bulan kalian`,
          },
          {
            value: shortRupiah(totalBudget),
            title: 'budget dialokasikan',
            body: 'Terbagi ke catering, venue, dekor, & lainnya',
          },
          {
            value: '4',
            title: 'prioritas minggu ini',
            body: 'Gabungan checklist + jatuh tempo vendor',
          },
        ].map(item => (
          <div
            key={item.title}
            className="bg-white border border-nikah-border"
            style={{
              borderRadius: 24,
              padding: '28px 24px 24px',
              minHeight: 120,
              boxShadow: '0 1px 2px rgba(90, 30, 42, 0.035)',
              background: '#FFFFFF',
            }}
          >
            <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 38, lineHeight: 1, color: '#3D1419', marginBottom: 12 }}>
              {item.value}
            </div>
            <h3 className="text-nikah-text font-extrabold" style={{ fontSize: 17, lineHeight: 1.25, margin: '0 0 7px' }}>
              {item.title}
            </h3>
            <p className="text-nikah-muted" style={{ fontSize: 14.5, lineHeight: 1.45, margin: 0 }}>
              {item.body}
            </p>
          </div>
        ))}
      </div>

      <div
        className="relative overflow-hidden bg-white"
        style={{
          borderRadius: 24,
          marginTop: 28,
          minHeight: 244,
          padding: '28px 30px 38px',
          border: 0,
          boxShadow: '0 4px 16px rgba(90, 30, 42, 0.028)',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FBF6F1 100%)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 138,
            borderTop: '1px solid var(--landing-border, #E8DACF)',
            borderLeft: '1px solid var(--landing-border, #E8DACF)',
            borderRight: '1px solid var(--landing-border, #E8DACF)',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <div className="flex items-start justify-between" style={{ gap: 16 }}>
          <div>
            <p
              className="text-nikah-muted font-bold uppercase"
            style={{ fontSize: 11, letterSpacing: '0.18em', margin: '0 0 8px' }}
            >
              Preview · Prioritas Sekarang
            </p>
            <h3 className="text-nikah-text font-extrabold" style={{ fontSize: 18, lineHeight: 1.35, margin: 0 }}>
              5 hal terdekat untuk minggu ini
            </h3>
          </div>
          <span
            className="rounded-full font-extrabold"
            style={{
              background: '#F7E5E7',
              color: '#D18790',
              fontSize: 12,
              padding: '7px 13px',
              whiteSpace: 'nowrap',
            }}
          >
            5 item utama
          </span>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            gap: 12,
            marginTop: 18,
            opacity: 0.5,
          }}
          aria-hidden="true"
        >
          {PRIORITY_PREVIEW_ITEMS.map(item => (
            <div
              key={item.title}
              className="flex items-start"
              style={{
                gap: 14,
                borderRadius: 12,
                background: '#F8F0EA',
                padding: '14px 16px',
                minHeight: 58,
              }}
            >
              <Lock size={13} strokeWidth={1.8} className="text-nikah-rose shrink-0" style={{ marginTop: 2 }} />
              <div>
                <p className="text-nikah-text font-extrabold" style={{ fontSize: 14, lineHeight: 1.3, margin: '0 0 3px' }}>
                  {item.title}
                </p>
                <p className="text-nikah-muted" style={{ fontSize: 12, lineHeight: 1.35, margin: 0 }}>
                  {item.meta}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="absolute inset-x-0 bottom-0 flex items-center justify-center"
          style={{
            left: -4,
            right: -4,
            bottom: -6,
            height: 178,
            background: 'linear-gradient(180deg, rgba(251,246,241,0) 0%, rgba(251,246,241,0.45) 20%, rgba(245,237,232,0.94) 48%, #F5EDE8 72%, #F5EDE8 100%)',
            zIndex: 2,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 72,
              background: '#F5EDE8',
            }}
          />
          <div
            className="inline-flex items-center justify-center bg-white text-nikah-text"
            style={{
              gap: 10,
              borderRadius: 999,
              padding: '14px 22px',
              fontSize: 14,
              boxShadow: '0 12px 30px rgba(90, 30, 42, 0.12)',
              position: 'relative',
              zIndex: 3,
            }}
          >
            <Lock size={14} strokeWidth={1.8} aria-hidden="true" style={{ color: '#5A1E2A' }} />
            Buka untuk lanjut tracking sampai hari H
          </div>
        </div>
      </div>

    </section>
  )
}
