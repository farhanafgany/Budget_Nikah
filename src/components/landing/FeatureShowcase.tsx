import { AlarmClock, BriefcaseBusiness, ClipboardList, Coins, Gauge } from 'lucide-react'

const FEATURES = [
  {
    cols: 'col-span-6 md:col-span-3',
    Icon: Gauge,
    eyebrow: 'Fitur Utama',
    title: 'Wedding Readiness Score',
    desc: 'Skor deterministik 0–100 yang menjelaskan kenapa segitu — bukan angka random.',
    visual: 'score' as const,
  },
  {
    cols: 'col-span-6 md:col-span-3',
    Icon: AlarmClock,
    eyebrow: 'Dashboard Paid',
    title: 'Prioritas Sekarang',
    desc: 'Gabungan deadline vendor dan checklist terdekat, jadi kamu tahu harus mulai dari mana.',
    visual: 'priority' as const,
  },
  {
    cols: 'col-span-6 md:col-span-2',
    Icon: BriefcaseBusiness,
    eyebrow: 'Vendor',
    title: 'Pembayaran Vendor',
    desc: 'Pantau DP, sisa bayar, dan deadline pelunasan.',
  },
  {
    cols: 'col-span-6 md:col-span-2',
    Icon: Coins,
    eyebrow: 'Tabungan',
    title: 'Target Nabung Bulanan',
    desc: 'Tahu nominal yang perlu disiapkan tiap bulan.',
  },
  {
    cols: 'col-span-6 md:col-span-2',
    Icon: ClipboardList,
    eyebrow: 'Checklist',
    title: 'Checklist + Catatan',
    desc: 'Timeline 50+ item dan tempat mencatat keputusan penting.',
  },
]

function ScoreVisual() {
  return (
    <div
      className="mt-4 rounded-[18px] flex items-center justify-center py-5 px-4"
      style={{ background: 'linear-gradient(180deg, #F5E8EC, #EDD6DE)', minHeight: 140 }}
      aria-hidden="true"
    >
      <div className="text-center">
        <div
          className="leading-none text-nikah-deep"
          style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontSize: 64, fontWeight: 500, letterSpacing: '-0.03em' }}
        >
          73
        </div>
        <div className="text-[9px] font-extrabold tracking-[0.18em] text-nikah-mauve uppercase mt-2">
          Wedding Readiness
        </div>
        <span className="inline-block mt-2 text-[10px] bg-[#DFF3E2] text-[#2F7A3F] font-bold px-3 py-1 rounded-full">
          Healthy
        </span>
      </div>
    </div>
  )
}

function PriorityVisual() {
  return (
    <div
      className="mt-4 rounded-[18px] py-4 px-4"
      style={{ background: 'linear-gradient(180deg, #F5E8EC, #EDD6DE)', minHeight: 140 }}
      aria-hidden="true"
    >
      <div className="space-y-2">
        {[
          { title: 'Bayar DP venue', meta: 'Vendor · 3 hari lagi', color: '#E0A235' },
          { title: 'Finalisasi menu catering', meta: 'Checklist · 1 bulan sebelum', color: '#C07888' },
          { title: 'Konfirmasi MUA', meta: 'Checklist · prioritas', color: '#6B3545' },
        ].map(item => (
          <div key={item.title} className="flex items-start bg-white/65 rounded-xl px-3 py-2.5" style={{ gap: 10 }}>
            <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.color }} />
            <div>
              <div className="text-[12px] font-extrabold text-nikah-text leading-tight">{item.title}</div>
              <div className="text-[10px] text-nikah-muted mt-1">{item.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FeatureShowcase() {
  return (
    <section id="fitur" className="px-6 md:px-8 py-20 md:py-28 bg-nikah-bg">
      <div className="max-w-[1080px] mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve text-center mb-2">
          Semua dalam satu tempat
        </p>
        <h2 className="font-extrabold tracking-tight text-[34px] md:text-[42px] text-nikah-text text-center mb-3 leading-tight" style={{ textWrap: 'balance' } as React.CSSProperties}>
          Yang <em>kamu dapat</em>
        </h2>
        <p className="text-center text-nikah-muted text-base md:text-lg font-light mb-12 max-w-lg mx-auto leading-relaxed">
          Dari cek realistis di awal sampai menjaga budget, vendor, dan checklist menjelang hari H.
        </p>

        {/* Bento grid — 6 equal columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-6 gap-4 md:gap-[22px]">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className={`${f.cols} bg-white border border-nikah-border rounded-[26px] p-7 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(107,53,69,0.10)] transition-all duration-200`}
            >
              {'visual' in f && f.visual ? (
                /* Large cards: icon alone, then visual, then text with eyebrow */
                <>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-nikah-deep flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #F5E8EC 0%, #EDD6DE 100%)' }}
                  >
                    <f.Icon size={20} strokeWidth={1.8} />
                  </div>
                  {f.visual === 'score' && <ScoreVisual />}
                  {f.visual === 'priority' && <PriorityVisual />}
                  <div className="mt-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-nikah-mauve mb-2">{f.eyebrow}</p>
                    <h3
                      className="text-nikah-deep mb-2 leading-snug"
                      style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 22 }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-sm text-nikah-muted leading-relaxed font-light">{f.desc}</p>
                  </div>
                </>
              ) : (
                /* Small cards: icon + eyebrow inline, then title + desc */
                <>
                  <div className="flex items-center gap-2 mb-5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-nikah-deep flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #F5E8EC 0%, #EDD6DE 100%)' }}
                    >
                      <f.Icon size={20} strokeWidth={1.8} />
                    </div>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-nikah-mauve">{f.eyebrow}</p>
                  </div>
                  <h3
                    className="text-nikah-deep mb-2 leading-snug"
                    style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 22 }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm text-nikah-muted leading-relaxed font-light">{f.desc}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
