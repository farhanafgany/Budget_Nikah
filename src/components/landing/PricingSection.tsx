import Link from 'next/link'

const WHAT_YOU_GET = [
  { label: 'Tahu prioritas yang harus dibereskan dulu', note: 'tugas dan deadline paling dekat' },
  { label: 'Tidak lupa DP dan pelunasan vendor',        note: 'sisa bayar dan jatuh tempo lebih jelas' },
  { label: 'Target nabung bulanan lebih kebaca',        note: 'progress tabungan sampai hari H' },
  { label: 'Checklist 50+ item agar tidak ada yang kelewat', note: '12 bulan hingga H-1 minggu' },
  { label: 'Keputusan penting tidak tercecer',          note: 'catatan, reminder, dan ide dalam dashboard' },
  { label: 'Budget per kategori lebih terkendali',      note: 'benchmark agar tidak kebablasan' },
]

export function PricingSection() {
  return (
    <section className="px-6 md:px-8 py-20 md:py-28 bg-white" id="harga">
      <div className="max-w-[1080px] mx-auto">

        <p className="text-xs font-extrabold uppercase tracking-widest text-nikah-mauve text-center mb-3">
          Sekali bayar, akses seumur hidup
        </p>
        <h2
          className="text-[34px] md:text-[46px] text-nikah-text text-center mb-10 leading-tight"
          style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 500, letterSpacing: '-0.025em', textWrap: 'balance' } as React.CSSProperties}
        >
          Pegangan kecil untuk keputusan nikah yang <em>besar</em>
        </h2>

        <div className="max-w-[760px] mx-auto">
        <div
          className="bg-white rounded-[24px] relative overflow-hidden"
          style={{ padding: '36px 36px 30px', border: '1px solid color-mix(in srgb, var(--landing-deep, #6B3545) 42%, var(--landing-border, #EDE4E6))', boxShadow: '0 12px 34px rgba(90,30,42,0.06)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[0.78fr_1fr] md:items-center" style={{ gap: 28 }}>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-nikah-mauve mb-3">Akses Seumur Hidup</p>
              <div className="text-nikah-deep mb-1" style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontSize: 46, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>
                Rp 149rb
              </div>
              <p className="text-nikah-muted text-sm font-light">Bayar sekali · Pakai sampai hari H · bukan langganan</p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/onboarding"
                className="inline-flex w-full md:w-auto items-center justify-center bg-nikah-deep text-white font-extrabold rounded-full text-sm text-center transition-colors active:scale-95 hover:opacity-90"
                style={{ padding: '16px 28px' }}
              >
                Mulai Sekarang — Gratis →
              </Link>
              <Link
                href="/premium"
                className="inline-flex w-full md:w-auto items-center justify-center text-nikah-deep font-semibold text-sm text-center hover:underline"
                style={{ padding: '8px 0' }}
              >
                Langsung Beli Akses Premium
              </Link>
            </div>
          </div>

          <div className="border-t border-nikah-border" style={{ margin: '30px 0 24px' }} />

          <ul className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '12px 24px' }}>
              {WHAT_YOU_GET.map(item => (
                <li key={item.label} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#F5E8EC] flex-shrink-0 flex items-center justify-center mt-0.5" aria-hidden="true">
                    <svg className="w-2.5 h-2.5 text-nikah-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-nikah-text">{item.label}</span>
                    {item.note && <p className="text-xs text-nikah-muted font-light mt-0.5">{item.note}</p>}
                  </div>
                </li>
              ))}
          </ul>

          <p className="text-center text-sm text-nikah-muted mt-6 font-light" style={{ lineHeight: 1.55 }}>
            3 hari tanpa pertanyaan — tidak cocok? Uang kembali penuh.
          </p>
        </div>
        </div>

      </div>
    </section>
  )
}
