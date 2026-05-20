/**
 * Hero mobile demo — 3 varian untuk perbandingan.
 * Hapus setelah selesai memilih.
 */
import Image from 'next/image'
import Link from 'next/link'

const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'
const C = 2 * Math.PI * 48

function ScoreRing({
  size = 130,
  score = 78,
  progress = 0.78,
}: {
  size?: number
  score?: number
  progress?: number
}) {
  const r = size * 0.436
  const circ = 2 * Math.PI * r
  const cx = size / 2
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#EFDADA" strokeWidth={size * 0.064} />
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke="#5A1E2A"
          strokeWidth={size * 0.064}
          strokeLinecap="round"
          strokeDasharray={`${circ * progress} ${circ}`}
          transform={`rotate(-90 ${cx} ${cx})`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: size * 0.28, lineHeight: 1, color: '#3D1419' }}>
            {score}
          </div>
          <div style={{ fontSize: size * 0.085, fontWeight: 700, letterSpacing: '0.1em', color: '#A38B89', textTransform: 'uppercase', marginTop: 3 }}>
            Score
          </div>
        </div>
      </div>
    </div>
  )
}

function Label({ letter, title }: { letter: string; title: string }) {
  return (
    <div
      className="sticky top-0 z-10 flex items-center"
      style={{
        background: '#3D1419',
        padding: '10px 20px',
        gap: 12,
      }}
    >
      <span
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, borderRadius: 999,
          background: '#C9A961', color: '#3D1419',
          fontWeight: 800, fontSize: 13, flexShrink: 0,
        }}
      >
        {letter}
      </span>
      <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 600 }}>
        {title}
      </span>
    </div>
  )
}

/* ─── VARIAN A: Emotional Relief ─── */
function VarianA() {
  return (
    <section
      className="landing-theme"
      style={{
        padding: '40px 24px 56px',
        background: 'var(--landing-bg, #F5EDE8)',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Eyebrow */}
      <p style={{
        fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: '#B98C54', margin: '0 0 14px',
      }}>
        Untuk pasangan yang mau rencana matang
      </p>

      {/* Headline */}
      <h1 style={{
        fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500,
        fontSize: 'clamp(36px, 10vw, 52px)', lineHeight: 1.06,
        letterSpacing: '-0.03em', color: '#3D1419',
        margin: '0 0 16px',
      }}>
        Berapa yang harus kita tabung setiap bulan?
      </h1>

      {/* Subtitle */}
      <p style={{ fontSize: 15, lineHeight: 1.6, color: '#A38B89', fontWeight: 400, margin: '0 0 32px', maxWidth: 340 }}>
        Masukkan budget kalian — langsung tahu apakah rencana ini realistis.
      </p>

      {/* CTA */}
      <Link
        href="/onboarding"
        style={{
          display: 'block', textAlign: 'center', color: '#fff',
          fontWeight: 700, fontSize: 15, padding: '16px',
          borderRadius: 14, marginBottom: 16,
          background: 'linear-gradient(160deg, #5A1E2A 0%, #3D1419 100%)',
          boxShadow: '0 6px 20px rgba(90,30,42,0.22)',
        }}
      >
        Hitung rencana kalian →
      </Link>

      {/* Trust */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 36 }}>
        {['✓ Gratis', '✓ 2 menit', '✓ Tanpa login'].map(t => (
          <span key={t} style={{ fontSize: 11, color: '#A38B89' }}>{t}</span>
        ))}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #E8DACF', marginBottom: 20 }} />

      {/* Screenshots 2-col */}
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A38B89', marginBottom: 10 }}>
        Begini hasilnya
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #E8DACF', boxShadow: '0 4px 16px rgba(90,30,42,0.10)' }}>
          <Image src="/images/result-preview.png" alt="Hasil analisa" width={1280} height={800} style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
        <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #E8DACF', boxShadow: '0 4px 16px rgba(90,30,42,0.10)' }}>
          <Image src="/images/dashboard-preview.png" alt="Dashboard" width={1280} height={700} style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      </div>
    </section>
  )
}

/* ─── VARIAN B: The Bold Question ─── */
function VarianB() {
  return (
    <section
      className="landing-theme"
      style={{
        padding: '44px 24px 56px',
        background: 'var(--landing-bg, #F5EDE8)',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Big question headline */}
      <h1 style={{
        fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500,
        fontSize: 'clamp(40px, 10.5vw, 56px)', lineHeight: 1.04,
        letterSpacing: '-0.03em', color: '#3D1419',
        margin: '0 0 14px',
      }}>
        Budget kalian cukup, atau kurang Rp 20jt?
      </h1>

      {/* Punchline */}
      <p style={{ fontSize: 16, lineHeight: 1.5, color: '#A38B89', fontWeight: 400, margin: '0 0 36px' }}>
        Baru tahu setelah 2 menit.
      </p>

      {/* CTA */}
      <Link
        href="/onboarding"
        style={{
          display: 'block', textAlign: 'center', color: '#fff',
          fontWeight: 700, fontSize: 16, padding: '17px',
          borderRadius: 14, marginBottom: 18,
          background: 'linear-gradient(160deg, #5A1E2A 0%, #3D1419 100%)',
          boxShadow: '0 6px 20px rgba(90,30,42,0.22)',
        }}
      >
        Cek Sekarang — Gratis →
      </Link>

      {/* Social proof */}
      <p style={{ textAlign: 'center', fontSize: 12, color: '#A38B89', margin: '0 0 36px' }}>
        ★★★★★ · Dipakai ribuan pasangan Indonesia
      </p>

      {/* Result screenshot — full width, cropped to score area */}
      <div style={{
        borderRadius: 14, overflow: 'hidden',
        border: '1px solid #E8DACF',
        boxShadow: '0 8px 28px rgba(90,30,42,0.12)',
      }}>
        <Image
          src="/images/result-preview.png"
          alt="Contoh hasil"
          width={1280}
          height={800}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'cover',
            objectPosition: 'top',
            maxHeight: 220,
          }}
        />
      </div>
      <p style={{ textAlign: 'center', fontSize: 10, color: '#A38B89', marginTop: 8 }}>
        Contoh hasil — personal kalian akan berbeda
      </p>
    </section>
  )
}

/* ─── VARIAN C: Show the Score ─── */
function VarianC() {
  return (
    <section
      className="landing-theme"
      style={{
        padding: '44px 24px 56px',
        background: 'var(--landing-bg, #F5EDE8)',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Score ring + badge row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 22 }}>
        <ScoreRing size={120} score={78} progress={0.78} />
        <div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 999,
            background: '#DCEAD9', color: '#4A7C5A',
            fontSize: 12, fontWeight: 700, marginBottom: 10,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: '#4A7C5A' }} />
            Healthy
          </span>
          <p style={{
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500,
            fontSize: 17, lineHeight: 1.35, color: '#3D1419', margin: 0,
          }}>
            Rencana aman — tapi perlu tambah Rp 1.2jt/bulan.
          </p>
        </div>
      </div>

      {/* Sim caption */}
      <p style={{
        fontSize: 11, color: '#A38B89', marginBottom: 6,
        padding: '8px 12px', borderRadius: 8,
        background: 'rgba(232,218,207,0.4)',
        display: 'inline-block',
      }}>
        Simulasi: Rp 87jt · 200 tamu · 9 bulan lagi
      </p>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #E8DACF', margin: '24px 0' }} />

      {/* The hook */}
      <h1 style={{
        fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500,
        fontSize: 'clamp(34px, 9vw, 48px)', lineHeight: 1.08,
        letterSpacing: '-0.025em', color: '#3D1419',
        margin: '0 0 12px',
      }}>
        Ini bisa jadi hasil kalian, dalam 2 menit.
      </h1>

      <p style={{ fontSize: 15, lineHeight: 1.55, color: '#A38B89', margin: '0 0 32px' }}>
        Masukkan budget dan rencana — dapat analisa, score, dan prioritas pertama.
      </p>

      {/* CTA */}
      <Link
        href="/onboarding"
        style={{
          display: 'block', textAlign: 'center', color: '#fff',
          fontWeight: 700, fontSize: 15, padding: '16px',
          borderRadius: 14, marginBottom: 14,
          background: 'linear-gradient(160deg, #5A1E2A 0%, #3D1419 100%)',
          boxShadow: '0 6px 20px rgba(90,30,42,0.22)',
        }}
      >
        Hitung rencana kalian →
      </Link>

      {/* Trust */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
        {['✓ Gratis', '✓ 2 menit', '✓ Tanpa login'].map(t => (
          <span key={t} style={{ fontSize: 11, color: '#A38B89' }}>{t}</span>
        ))}
      </div>
    </section>
  )
}

/* ─── MAIN ─── */
export default function HeroDemoPage() {
  return (
    <div style={{ maxWidth: 430, margin: '0 auto', fontFamily: 'var(--font-plus-jakarta-sans), sans-serif' }}>

      {/* Header sticky */}
      <div style={{
        background: '#1A0A0D', padding: '14px 20px',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, margin: 0, fontWeight: 600 }}>
          Hero mobile demo · scroll untuk bandingkan · <span style={{ color: '#C9A961' }}>hapus setelah pilih</span>
        </p>
      </div>

      {/* Varian A */}
      <div style={{ borderBottom: '3px solid #C9A961' }}>
        <Label letter="A" title="Emotional Relief — mulai dari pertanyaan yang ada di kepala pasangan" />
        <VarianA />
      </div>

      {/* Varian B */}
      <div style={{ borderBottom: '3px solid #C9A961' }}>
        <Label letter="B" title="The Bold Question — hook langsung, punchline singkat" />
        <VarianB />
      </div>

      {/* Varian C */}
      <div>
        <Label letter="C" title="Show the Score — produk sebagai hero, score ring di depan" />
        <VarianC />
      </div>

    </div>
  )
}
