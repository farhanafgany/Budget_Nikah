const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

const TESTIMONIALS = [
  {
    quote: 'Akhirnya ada angka yang masuk akal. Kami pakai ini untuk meyakinkan orang tua soal jumlah tamu — dan berhasil.',
    name: 'Rania & Fadhil',
    location: 'Jakarta',
    initials: 'RF',
  },
  {
    quote: 'Checklistnya bantu banget. Kami baru sadar ada 12 hal yang belum dikerjakan padahal 3 bulan lagi nikah.',
    name: 'Dewi & Arya',
    location: 'Bandung',
    initials: 'DA',
  },
  {
    quote: 'Tadinya merasa budget kami terlalu kecil. Setelah simulasi, ternyata cukup — asal prioritasnya bener.',
    name: 'Nisa & Rizky',
    location: 'Surabaya',
    initials: 'NR',
  },
]

export function SocialProof() {
  return (
    <section className="px-6 md:px-8" style={{ paddingTop: 72, paddingBottom: 80, background: '#FDFAF7' }}>
      <div className="max-w-[900px] mx-auto">

        {/* Counter */}
        <div className="text-center" style={{ marginBottom: 48 }}>
          <p
            className="text-nikah-mauve font-extrabold uppercase"
            style={{ fontSize: 11, letterSpacing: '0.18em', margin: '0 0 14px' }}
          >
            Dari pasangan yang sudah pakai
          </p>
          <h2
            className="text-nikah-deep"
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(30px, 5vw, 46px)',
              lineHeight: 1.08,
              margin: 0,
            }}
          >
            Persiapan yang lebih tenang dimulai dari angka yang jelas.
          </h2>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 16 }}>
          {TESTIMONIALS.map(t => (
            <div
              key={t.name}
              className="bg-white border border-nikah-border"
              style={{
                borderRadius: 20,
                padding: '24px 22px',
                boxShadow: '0 2px 12px rgba(90,30,42,0.05)',
              }}
            >
              {/* Quote mark */}
              <div
                className="text-nikah-mauve"
                style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 48, lineHeight: 1, marginBottom: 8, opacity: 0.35 }}
                aria-hidden="true"
              >
                "
              </div>
              <p
                className="text-nikah-text"
                style={{ fontSize: 14.5, lineHeight: 1.6, margin: '0 0 20px', fontStyle: 'italic' }}
              >
                {t.quote}
              </p>
              <div className="flex items-center" style={{ gap: 10 }}>
                {/* Avatar initials */}
                <div
                  className="flex-shrink-0 flex items-center justify-center text-white font-extrabold"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--nikah-mauve) 0%, var(--nikah-deep) 100%)',
                    fontSize: 12,
                  }}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-nikah-text font-extrabold" style={{ fontSize: 13, margin: 0 }}>{t.name}</p>
                  <p className="text-nikah-muted" style={{ fontSize: 11, margin: 0 }}>{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Microcopy bawah */}
        <p className="text-center text-nikah-muted" style={{ fontSize: 12.5, marginTop: 28, lineHeight: 1.5 }}>
          ✓ Tanpa subscription &nbsp;·&nbsp; ✓ Garansi 3 hari tanpa pertanyaan &nbsp;·&nbsp; ✓ Sekali bayar, akses seumur hidup
        </p>

      </div>
    </section>
  )
}
