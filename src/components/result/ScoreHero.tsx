'use client'

import Link from 'next/link'
import type { ReadinessLabel } from '@/lib/scoring'
import { monthsUntilDate } from '@/lib/savings'
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber'
import { TrackedLink } from '@/components/analytics/TrackedLink'
import { Lock } from 'lucide-react'

const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

const STATUS_STYLE: Record<ReadinessLabel, { background: string; color: string; dot: string }> = {
  Healthy:     { background: '#DCEAD9', color: '#4A7C5A', dot: '#4A7C5A' },
  Moderate:    { background: '#F5E8C8', color: '#9A6A1E', dot: '#C9A961' },
  'High Risk': { background: '#F5D6D8', color: '#A9414C', dot: '#C16E73' },
}

const DISPLAY_LABEL: Record<ReadinessLabel, string> = {
  Healthy:     'Healthy',
  Moderate:    'Moderate',
  'High Risk': 'Perlu Perhatian',
}

const HEADLINE: Record<ReadinessLabel, string> = {
  Healthy:     'Rencana kalian aman — asal disusun dari sekarang.',
  Moderate:    'Rencana kalian masih bisa dibuat lebih aman.',
  'High Risk': 'Rencana kalian perlu beberapa penyesuaian.',
}

const MAIN_COPY: Record<ReadinessLabel, string> = {
  Healthy:     'Tetap pantau detail kecil agar tidak ada yang tercecer sebelum hari H.',
  Moderate:    'Ada beberapa keputusan yang bisa dibuat lebih ringan.',
  'High Risk': 'Mulai dari bagian yang paling berdampak agar rencana terasa lebih terkendali.',
}

const SUPPORT_COPY: Record<ReadinessLabel, string> = {
  Healthy:     'Fokuskan energi ke pembayaran penting dan checklist terdekat agar persiapan tetap terkendali.',
  Moderate:    'Coba rapikan jumlah tamu, alokasi budget, dan target tabungan agar persiapan terasa lebih jelas.',
  'High Risk': 'Gunakan hasil ini sebagai titik awal untuk mengurangi beban budget dan menyusun ulang prioritas.',
}

const PRIORITY_PREVIEW_BY_HORIZON = {
  far: [
    { title: 'Tentukan dan booking venue utama', meta: 'Venue · 12–9 Bulan Sebelum' },
    { title: 'Susun daftar tamu kasar', meta: 'Perencanaan · 12–9 Bulan Sebelum' },
    { title: 'Tentukan konsep dan tema acara', meta: 'Dekor · 12–9 Bulan Sebelum' },
    { title: 'Riset dan hubungi catering pilihan', meta: 'Katering · 12–9 Bulan Sebelum' },
  ],
  mid: [
    { title: 'Booking fotografer dan videografer', meta: 'Dokumentasi · 6–3 Bulan Sebelum' },
    { title: 'Fitting baju pertama dengan perancang', meta: 'Busana · 6–3 Bulan Sebelum' },
    { title: 'Finalisasi katering dan menu', meta: 'Katering · 6–3 Bulan Sebelum' },
    { title: 'Kirim undangan digital ke tamu utama', meta: 'Undangan · 3 Bulan Sebelum' },
  ],
  near: [
    { title: 'Konfirmasi jumlah tamu final ke katering', meta: 'Katering · 1 Bulan Sebelum' },
    { title: 'Trial makeup dan hairdo', meta: 'MUA · 1 Bulan Sebelum' },
    { title: 'Final fitting baju pengantin', meta: 'Busana · 1 Bulan Sebelum' },
    { title: 'Gladi resik / rehearsal acara', meta: 'Perencanaan · 1 Bulan Sebelum' },
  ],
}

function getPriorityPreviewItems(months: number) {
  if (months > 6) return PRIORITY_PREVIEW_BY_HORIZON.far
  if (months > 2) return PRIORITY_PREVIEW_BY_HORIZON.mid
  return PRIORITY_PREVIEW_BY_HORIZON.near
}

interface Props {
  score: number
  label: ReadinessLabel
  totalBudget: number
  guestCount: number
  weddingDate: string
  checklistCount: number
  partnerOneName?: string
  weddingCity?: string
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

export function ScoreHero({ score, label, totalBudget, guestCount, weddingDate, checklistCount, partnerOneName, weddingCity }: Props) {
  const months = Math.max(0, monthsUntilDate(weddingDate || null))
  const animatedRingScore = useAnimatedNumber(score, { duration: 700 })
  const scorePct = Math.min(100, Math.max(0, animatedRingScore))
  const status = STATUS_STYLE[label]
  const priorityPreviewItems = getPriorityPreviewItems(months)

  const metrics = [
    { label: 'Estimasi',  value: shortRupiah(totalBudget) },
    { label: 'Undangan',  value: guestCount.toLocaleString('id-ID') },
    { label: 'Sisa',      value: `${months} bln` },
  ]

  /* Shared score card — vertical layout, works in right column (desktop) and inline (mobile) */
  const ScoreCard = (
    <div
      className="border border-nikah-border"
      style={{
        borderRadius: 24,
        padding: '28px 26px 24px',
        boxShadow: '0 4px 16px rgba(90,30,42,0.06)',
        background: 'linear-gradient(160deg, #FFFCF8 0%, #F8F1EA 52%, #EFE3D9 100%)',
      }}
    >
      {/* Ring + label */}
      <div className="flex items-center" style={{ gap: 14, marginBottom: 20 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `conic-gradient(#5A1E2A ${scorePct}%, #EEDDE2 ${scorePct}% 100%)`,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
          aria-label={`Readiness score ${score}`}
        >
          <div className="bg-white" style={{ width: 60, height: 60, borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
            <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 24, lineHeight: 1, color: '#3D1419' }}>
              {score}
            </div>
          </div>
        </div>
        <span
          className="inline-flex items-center rounded-full font-bold"
          style={{ gap: 7, padding: '6px 11px', fontSize: 12, background: status.background, color: status.color }}
        >
          <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: status.dot }} />
          {DISPLAY_LABEL[label]}
        </span>
      </div>

      {/* Insight */}
      <h2
        className="text-nikah-text"
        style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 20, lineHeight: 1.25, margin: '0 0 9px' }}
      >
        {MAIN_COPY[label]}
      </h2>
      <p className="text-nikah-muted" style={{ fontSize: 14, lineHeight: 1.55, margin: 0 }}>
        {SUPPORT_COPY[label]}
      </p>

      {/* Metrics */}
      <div
        className="grid grid-cols-3 text-center border-t border-nikah-border"
        style={{ marginTop: 20, paddingTop: 16, gap: 8 }}
      >
        {metrics.map(m => (
          <div key={m.label}>
            <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 20, lineHeight: 1, color: '#3D1419' }}>
              {m.value}
            </div>
            <div className="text-nikah-muted font-bold uppercase" style={{ fontSize: 9, letterSpacing: '0.14em', marginTop: 5 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <section>

      {/* ── Top section: 2-col on desktop, stack on mobile ── */}
      <div
        className="lg:grid lg:items-start"
        style={{ gridTemplateColumns: 'minmax(0,1fr) 400px', gap: '0 52px' } as React.CSSProperties}
      >
        {/* Left: headline + copy + desktop CTAs */}
        <div>
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
              fontSize: 'clamp(42px, 5.2vw, 62px)',
              lineHeight: 1.04,
              letterSpacing: '-0.024em',
              margin: '0 0 18px',
              textWrap: 'balance',
            } as React.CSSProperties}
          >
            {HEADLINE[label]}
          </h1>

          <p
            className="text-nikah-muted"
            style={{ fontSize: 'clamp(16px, 1.7vw, 19px)', lineHeight: 1.6, margin: '0 0 28px' }}
          >
            {partnerOneName ? `${partnerOneName}, ` : ''}rencana nikah{weddingCity ? ` di ${weddingCity}` : ''} dengan sisa {monthCopy(months)} — detail kecil mudah tercecer dan jadwal cepat menumpuk kalau tidak disusun dari sekarang. Kami sudah siapkan panduan khusus berdasarkan jawaban kalian.
          </p>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center" style={{ gap: 16, marginBottom: 14 }}>
            <Link
              href="/premium"
              className="inline-flex items-center justify-center rounded-full font-extrabold transition hover:brightness-105 active:scale-[0.99]"
              style={{
                padding: '17px 28px',
                color: '#4A1822',
                background: 'linear-gradient(180deg, #E8D7A8 0%, #C9A961 100%)',
                boxShadow: '0 14px 30px rgba(90,30,42,0.12), inset 0 1px 0 rgba(255,255,255,0.34)',
              }}
            >
              Buka rencana — Rp 149rb
            </Link>
            <a
              href="#premium-details"
              className="inline-flex items-center justify-center rounded-full border border-nikah-border bg-white/60 font-bold text-nikah-deep transition hover:bg-white"
              style={{ padding: '16px 24px' }}
            >
              Lihat yang akan dibuka
            </a>
          </div>
          <p className="hidden lg:block text-nikah-muted" style={{ fontSize: 13, lineHeight: 1.45, margin: 0 }}>
            Sekali bayar · dipakai sampai hari H · garansi 3 hari tanpa pertanyaan.
          </p>

        </div>

        {/* Right: score card (desktop only, sticky) */}
        <div className="hidden lg:block" style={{ position: 'sticky', top: 88 }}>
          {ScoreCard}
        </div>
      </div>

      {/* ── Mobile: score + "kami sudah siapkan" dalam satu card ── */}
      <div
        className="lg:hidden border border-nikah-border"
        style={{ borderRadius: 20, padding: '22px 24px', marginTop: 18, boxShadow: '0 4px 16px rgba(90,30,42,0.06)', background: 'linear-gradient(160deg, #FFFCF8 0%, #F8F1EA 52%, #EFE3D9 100%)' }}
      >
        {/* Score section */}
        <div className="flex items-center" style={{ gap: 16, marginBottom: 12 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: `conic-gradient(#5A1E2A ${scorePct}%, #EEDDE2 ${scorePct}% 100%)`,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <div className="bg-white" style={{ width: 54, height: 54, borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
              <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 22, lineHeight: 1, color: '#3D1419' }}>{score}</div>
            </div>
          </div>
          <div>
            <span
              className="inline-flex items-center rounded-full font-bold"
              style={{ gap: 6, padding: '5px 10px', fontSize: 12, background: status.background, color: status.color }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.dot }} />
              {DISPLAY_LABEL[label]}
            </span>
            <span className="block text-nikah-muted font-bold uppercase" style={{ fontSize: 10, letterSpacing: '0.1em', marginTop: 5 }}>
              Readiness
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 text-center" style={{ gap: 8, marginBottom: 18, paddingTop: 4 }}>
          {metrics.map(m => (
            <div key={m.label}>
              <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 18, lineHeight: 1, color: '#3D1419' }}>{m.value}</div>
              <div className="text-nikah-muted font-bold uppercase" style={{ fontSize: 9, letterSpacing: '0.12em', marginTop: 5 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--nikah-border)', marginBottom: 18 }} />

        {/* "Kami sudah siapkan" summary */}
        <p className="text-nikah-text font-bold" style={{ fontSize: 14, lineHeight: 1.4, margin: '0 0 14px' }}>
          {partnerOneName ? `Buat ${partnerOneName} & pasangan, kami sudah siapkan:` : 'Berdasarkan jawaban kalian, kami sudah siapkan:'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: '✓', value: checklistCount.toString(), desc: `checklist disesuaikan untuk H-${Math.max(1, months)} bulan` },
            { icon: '💰', value: shortRupiah(totalBudget),  desc: 'alokasi budget per kategori' },
            { icon: '🔔', value: '4',                       desc: 'prioritas paling dekat minggu ini' },
          ].map(item => (
            <div key={item.desc} className="flex items-center" style={{ gap: 13 }}>
              <span style={{ fontSize: 17, width: 24, flexShrink: 0, textAlign: 'center' }}>{item.icon}</span>
              <span className="text-nikah-text" style={{ fontSize: 14, lineHeight: 1.45 }}>
                <strong>{item.value}</strong> {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop: 3 stat cards ── */}
      <div className="hidden lg:grid grid-cols-3" style={{ gap: 18, marginTop: 32 }}>
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
            style={{ borderRadius: 24, padding: '28px 24px 24px', boxShadow: '0 1px 2px rgba(90,30,42,0.035)' }}
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

      {/* ── Prioritas Sekarang — locked teaser ── */}
      <div
        className="border border-nikah-border"
        style={{
          position: 'relative',
          marginTop: 28,
          borderRadius: 24,
          padding: '24px 22px 22px',
          boxShadow: '0 4px 20px rgba(90,30,42,0.07)',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF5F2 100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between" style={{ gap: 16, marginBottom: 8 }}>
          <p className="text-nikah-muted font-bold uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', margin: 0 }}>
            Prioritas Sekarang
          </p>
          <span
            className="inline-flex items-center rounded-full font-extrabold flex-shrink-0"
            style={{ gap: 5, background: '#F7E5E7', color: '#C16E73', fontSize: 11, padding: '5px 11px', whiteSpace: 'nowrap' }}
          >
            <Lock size={11} strokeWidth={2} aria-hidden="true" />
            Terkunci
          </span>
        </div>

        <p className="text-nikah-text" style={{ fontSize: 14, lineHeight: 1.5, margin: '0 0 16px' }}>
          <strong>{priorityPreviewItems.length} langkah</strong> paling dekat sudah kami susun dari jawaban kalian — tinggal dibuka saat kalian mulai.
        </p>

        {/* Locked rows — kategori terbaca, judul aksi disembunyikan */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 10, marginBottom: 18 }}>
          {priorityPreviewItems.map((item, i) => {
            const category = item.meta.split('·')[0].trim()
            const barWidth = ['68%', '54%', '62%', '48%'][i % 4]
            return (
              <div
                key={item.title}
                className="flex items-center"
                style={{ gap: 11, borderRadius: 12, background: '#F8F0EA', padding: '13px 14px' }}
                aria-label={`${category} — langkah terkunci`}
              >
                <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--nikah-mauve)', flexShrink: 0 }} />
                <span className="text-nikah-text font-extrabold" style={{ fontSize: 13, flexShrink: 0 }}>
                  {category}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    flex: 1,
                    maxWidth: barWidth,
                    height: 9,
                    borderRadius: 999,
                    background: 'linear-gradient(90deg, #E7D6DC 0%, #EFE3E6 100%)',
                  }}
                />
                <Lock size={13} strokeWidth={1.8} aria-hidden="true" style={{ color: 'var(--nikah-mauve)', flexShrink: 0, marginLeft: 'auto' }} />
              </div>
            )
          })}
        </div>

        {/* CTA — link asli + tracking, bukan div statis */}
        <TrackedLink
          href="/premium"
          event="result_premium_cta_clicked"
          eventProps={{ cta_location: 'result_priority_lock' }}
          className="inline-flex items-center justify-center w-full md:w-auto font-extrabold transition hover:brightness-105 active:scale-[0.99]"
          style={{
            gap: 8,
            borderRadius: 999,
            padding: '14px 24px',
            fontSize: 14,
            color: '#4A1822',
            background: 'linear-gradient(180deg, #E8D7A8 0%, #C9A961 100%)',
            boxShadow: '0 8px 22px rgba(90,30,42,0.12), inset 0 1px 0 rgba(255,255,255,0.34)',
          }}
        >
          <Lock size={14} strokeWidth={2} aria-hidden="true" />
          Buka akses lengkap — Rp 149rb
        </TrackedLink>
      </div>

    </section>
  )
}
