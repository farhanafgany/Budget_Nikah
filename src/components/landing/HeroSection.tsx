'use client'
import Link from 'next/link'

const PHONE_STATS = [
  { val: '4,6jt',  lbl: 'nabung/bln' },
  { val: '18/50',  lbl: 'checklist'  },
  { val: 'Medium', lbl: 'tekanan'     },
]

function PhoneMockup() {
  return (
    <div className="inline-flex flex-col max-[860px]:justify-self-center" style={{ transform: 'rotate(-2deg)' }}>
      <div
        className="bg-nikah-text"
        style={{
          borderRadius: 38,
          padding: 8,
          boxShadow: '0 30px 80px rgba(107,53,69,0.32), 0 0 0 1px rgba(107,53,69,0.08)',
        }}
      >
        <div className="bg-nikah-bg overflow-hidden w-[280px]" style={{ borderRadius: 30 }}>

          {/* Status bar */}
          <div className="bg-nikah-deep flex items-center justify-between text-white" style={{ padding: '8px 14px' }}>
            <span className="text-[10px] font-extrabold">BudgetNikah</span>
            <span className="text-[9px] opacity-50" aria-hidden="true">9:41</span>
          </div>

          {/* Score area */}
          <div className="text-center bg-gradient-to-b from-[#F5E8EC] to-[#EDD6DE]" style={{ padding: '24px 16px 18px' }}>
            <div
              className="text-[96px] text-nikah-deep leading-none"
              style={{
                fontFamily: 'var(--font-fraunces, Georgia, serif)',
                fontWeight: 500,
                letterSpacing: '-0.03em',
              }}
            >
              73
            </div>
            <div
              className="font-extrabold text-nikah-mauve uppercase"
              style={{ fontSize: 8, letterSpacing: '0.2em', margin: '6px 0 8px' }}
            >
              Wedding Readiness
            </div>
            <span
              className="inline-block bg-[#DFF3E2] text-[#2F7A3F] font-extrabold rounded-full"
              style={{ fontSize: 9, padding: '3px 9px', letterSpacing: '0.04em' }}
            >
              Healthy
            </span>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-3 border-t border-nikah-border">
            {PHONE_STATS.map((s, i) => (
              <div
                key={s.lbl}
                className={`text-center ${i < 2 ? 'border-r border-nikah-border' : ''}`}
                style={{ padding: '10px 6px' }}
              >
                <div className="font-extrabold text-nikah-deep leading-none" style={{ fontSize: 12 }}>{s.val}</div>
                <div className="text-nikah-muted" style={{ fontSize: 8, marginTop: 2 }}>{s.lbl}</div>
              </div>
            ))}
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
        padding: 'calc(var(--d-gap-section) + 24px) var(--d-pad-page) var(--d-gap-section)',
        background: 'radial-gradient(ellipse at 30% 0%, #F5E8EC 0%, transparent 55%), radial-gradient(ellipse at 100% 100%, #EDD6DE 0%, transparent 60%), #FAF5F5',
      }}
    >

      <div
        className="relative z-10 max-w-[1080px] mx-auto grid grid-cols-[1.05fr_0.95fr] items-center max-[860px]:grid-cols-1 max-[860px]:text-center min-w-0"
        style={{ gap: 'clamp(34px, 8vw, 60px)' }}
      >

        {/* Kiri: copy + CTA */}
        <div className="min-w-0">
          <span className="text-xs font-bold uppercase text-nikah-mauve" style={{ letterSpacing: '0.16em' }}>
            Wedding Financial Planner · Indonesia
          </span>

          <h1
            className="font-extrabold text-nikah-text leading-[1.04] max-[860px]:text-balance"
            style={{
              fontSize: 'clamp(36px, 10.5vw, var(--d-h1))',
              letterSpacing: '-0.025em',
              margin: '16px 0 18px',
              overflowWrap: 'break-word',
            }}
          >
            Jangan Tebak-Tebak Soal{' '}
            <em className="md:whitespace-nowrap">Budget Nikahmu.</em>
          </h1>

          <p
            className="text-nikah-muted font-light max-w-[440px] max-[860px]:mx-auto"
            style={{ fontSize: 'var(--d-body)', lineHeight: 1.55, margin: '0 0 28px' }}
          >
            Tahu persis berapa yang kamu butuhkan — dan apakah kamu sudah cukup siap. Selesai dalam 2 menit, tanpa login.
          </p>

          <div className="flex flex-col items-start max-[860px]:items-center" style={{ gap: 10 }}>
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center bg-nikah-deep text-white font-bold rounded-full hover:opacity-90 active:scale-95 transition-all"
              style={{
                gap: 6,
                padding: '18px 32px',
                fontSize: 15,
                boxShadow: '0 6px 16px rgba(107,53,69,0.22)',
              }}
            >
              Cek Sekarang — Gratis →
            </Link>
            <div className="inline-flex items-center gap-[14px] text-xs text-nikah-muted" style={{ marginTop: 4 }}>
              <span>Tanpa login</span>
              <span className="w-1 h-1 rounded-full bg-nikah-mauve inline-block flex-shrink-0" aria-hidden="true" />
              <span>Selesai 2 menit</span>
              <span className="w-1 h-1 rounded-full bg-nikah-mauve inline-block flex-shrink-0" aria-hidden="true" />
              <span>Gratis</span>
            </div>
          </div>
        </div>

        {/* Kanan: phone mockup */}
        <PhoneMockup />

      </div>

      {/* Sticky mobile CTA */}
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
