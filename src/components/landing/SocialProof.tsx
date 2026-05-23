const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

const FACTS = [
  {
    value: '50+',
    label: 'checklist item',
    body: 'Tersusun dari H-12 bulan sampai H-1 minggu, berdasarkan urutan prioritas nyata.',
  },
  {
    value: '3',
    label: 'tier kota',
    body: 'Estimasi menyesuaikan Jakarta, kota besar, dan kota kecil — bukan pakai satu rumus untuk semua.',
  },
  {
    value: '0–100',
    label: 'readiness score',
    body: 'Deterministik dan bisa dijelaskan — bukan angka acak, bukan AI. Kamu tahu kenapa skornya segitu.',
  },
  {
    value: '3 hari',
    label: 'garansi tanpa pertanyaan',
    body: 'Tidak cocok? Uang kembali penuh tanpa pertanyaan. Cukup hubungi kami dalam 3 hari pertama.',
  },
]

export function SocialProof() {
  return (
    <section className="px-6 md:px-8" style={{ paddingTop: 72, paddingBottom: 80, background: '#FDFAF7' }}>
      <div className="max-w-[900px] mx-auto">

        <div className="text-center" style={{ marginBottom: 48 }}>
          <p
            className="text-nikah-mauve font-extrabold uppercase"
            style={{ fontSize: 11, letterSpacing: '0.18em', margin: '0 0 14px' }}
          >
            Dibangun jujur untuk pasangan Indonesia
          </p>
          <h2
            className="text-nikah-deep"
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(28px, 4.8vw, 44px)',
              lineHeight: 1.1,
              margin: '0 auto',
              maxWidth: 620,
            }}
          >
            Bukan spreadsheet kering. Bukan angka tebak-tebakan.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
          {FACTS.map(f => (
            <div
              key={f.label}
              className="bg-white border border-nikah-border"
              style={{
                borderRadius: 20,
                padding: '24px 22px',
                boxShadow: '0 2px 12px rgba(90,30,42,0.05)',
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <span
                  className="text-nikah-deep"
                  style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 36, lineHeight: 1 }}
                >
                  {f.value}
                </span>
                <span
                  className="text-nikah-mauve font-extrabold uppercase"
                  style={{ fontSize: 11, letterSpacing: '0.12em', marginLeft: 8 }}
                >
                  {f.label}
                </span>
              </div>
              <p className="text-nikah-muted" style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-nikah-muted" style={{ fontSize: 12.5, marginTop: 28, lineHeight: 1.5 }}>
          ✓ Tanpa langganan &nbsp;·&nbsp; ✓ Garansi 3 hari tanpa pertanyaan &nbsp;·&nbsp; ✓ Sekali bayar, akses seumur hidup
        </p>

      </div>
    </section>
  )
}
