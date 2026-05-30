const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

interface Testimonial {
  quote: string
  name: string
  city: string
  published: boolean
}

// Isi dengan testimoni ASLI saat sudah dapat izin penggunanya.
// Set `published: true` HANYA untuk yang benar-benar nyata.
// Selama belum ada yang published, section ini tidak tampil sama sekali
// (slot "bukti" yang kosong/palsu justru menurunkan trust).
const TESTIMONIALS: Testimonial[] = [
  {
    quote: '(menunggu testimoni asli dari pengguna)',
    name: 'Nama pengguna',
    city: 'Kota',
    published: false,
  },
]

export function Testimonials() {
  const items = TESTIMONIALS.filter(t => t.published)
  if (items.length === 0) return null

  return (
    <section className="px-6 md:px-8 py-14 md:py-24 bg-nikah-bg">
      <div className="max-w-[760px] mx-auto">
        <p className="text-center text-xs font-extrabold uppercase tracking-widest text-nikah-mauve mb-6">
          Kata pengguna
        </p>

        <div className="grid grid-cols-1" style={{ gap: 16 }}>
          {items.map(t => (
            <figure
              key={t.name}
              className="bg-white border border-nikah-border rounded-[24px]"
              style={{ padding: '28px 26px', boxShadow: '0 4px 18px rgba(90,30,42,0.05)', margin: 0 }}
            >
              <blockquote
                className="text-nikah-text"
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontWeight: 500,
                  fontSize: 'clamp(18px, 2.4vw, 22px)',
                  lineHeight: 1.5,
                  margin: '0 0 16px',
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center" style={{ gap: 12 }}>
                <span
                  className="flex items-center justify-center rounded-full text-white flex-shrink-0"
                  style={{
                    width: 38,
                    height: 38,
                    background: 'linear-gradient(150deg, var(--nikah-mauve, #8A5A65) 0%, var(--landing-deep, #6B3545) 100%)',
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 15,
                  }}
                  aria-hidden="true"
                >
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block font-bold text-nikah-text" style={{ fontSize: 14 }}>{t.name}</span>
                  <span className="block text-nikah-muted" style={{ fontSize: 12.5 }}>{t.city}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
