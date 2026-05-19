import Link from 'next/link'

interface ScenarioCardProps {
  label: string
  guests: string
  score: string
  status: 'Moderate' | 'Healthy'
}

function ScenarioCard({ label, guests, score, status }: ScenarioCardProps) {
  const isHealthy = status === 'Healthy'

  return (
    <div
      className="border border-nikah-border"
      style={{
        borderRadius: 28,
        padding: '32px 34px 30px',
        minHeight: 270,
        background: isHealthy
          ? 'linear-gradient(180deg, #FFFCF8 0%, #F8F2EC 52%, #EFE2D8 100%)'
          : 'linear-gradient(180deg, #FFFCF8 0%, #F8F1EA 52%, #EFE3D9 100%)',
        borderColor: 'var(--landing-border, #E7D9D4)',
        boxShadow: '0 4px 16px rgba(90,30,42,0.045), inset 0 1px 0 rgba(255,255,255,0.55)',
      }}
    >
      <p
        className="uppercase font-extrabold text-nikah-muted"
        style={{ fontSize: 12, letterSpacing: '0.17em', margin: '0 0 22px' }}
      >
        {label}
      </p>

      <div className="grid" style={{ gap: 0 }}>
        {[
          ['Lokasi', 'Jakarta'],
          ['Tamu', guests],
          ['Gaya', 'Elegant'],
        ].map(([name, value]) => (
          <div
            key={name}
            className="grid grid-cols-[1fr_auto] items-center border-b border-nikah-border"
            style={{ padding: '10px 0', gap: 20 }}
          >
            <span className="text-nikah-muted" style={{ fontSize: 16 }}>{name}</span>
            <span className="font-extrabold text-nikah-text" style={{ fontSize: 15.5 }}>{value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between" style={{ marginTop: 38, gap: 18 }}>
        <div
          className="text-nikah-deep"
          style={{
            fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(48px, 5vw, 64px)',
            lineHeight: 0.82,
            letterSpacing: '-0.04em',
          }}
        >
          {score}
        </div>
        <span
          className="inline-flex items-center rounded-full font-extrabold"
          style={{
            gap: 8,
            padding: '8px 14px',
            fontSize: 13,
            color: isHealthy ? '#4E8A62' : '#C29A43',
            background: isHealthy ? '#DFF3E2' : '#FFF2C8',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: isHealthy ? '#4E8A62' : '#D2AE4D',
            }}
          />
          {status}
        </span>
      </div>
    </div>
  )
}

export function SimulationPreview() {
  return (
    <section id="contoh-hasil" className="px-6 md:px-8 pt-14 pb-14 md:pt-24 md:pb-28 bg-nikah-bg">
      <div className="max-w-[1080px] mx-auto">
        <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-nikah-mauve" style={{ margin: '0 0 12px' }}>
          Lihat Bedanya
        </p>
        <h2
          className="text-nikah-text text-center leading-none"
          style={{
            fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(38px, 4.8vw, 56px)',
            letterSpacing: '-0.035em',
            margin: '0 0 16px',
          }}
        >
          Simulasi mengubah segalanya
        </h2>
        <p className="text-center text-nikah-muted font-light" style={{ fontSize: 17, lineHeight: 1.5, margin: '0 auto 32px', maxWidth: 640 }}>
          Dari 600 ke 350 tamu: skornya langsung berbeda.
        </p>
        <div className="text-center" style={{ marginBottom: 56 }}>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center bg-nikah-deep text-white font-extrabold rounded-full text-sm transition-colors hover:opacity-90 active:scale-95"
            style={{ padding: '15px 30px' }}
          >
            Coba dengan angkamu sendiri →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center" style={{ gap: 'clamp(24px, 3.2vw, 46px)' }}>
          <ScenarioCard label="Sebelum" guests="600 orang" score="52" status="Moderate" />

          <div
            className="flex items-center justify-center text-white mx-auto rotate-90 lg:rotate-0"
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              background: 'var(--landing-deep, var(--nikah-deep))',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 11H18M18 11L12 5M18 11L12 17" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <ScenarioCard label="Sesudah" guests="350 orang" score="78" status="Healthy" />
        </div>
      </div>
    </section>
  )
}
