const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

// Section kredibilitas tunggal — hasil merge TrustMetrics + SocialProof.
// Setiap fakta UNIK (tidak diulang), dengan penjelasan singkat supaya terasa
// kredibel, bukan sekadar angka besar tanpa konteks.
const FACTS = [
  {
    value: '50+',
    label: 'checklist nikah',
    body: 'Tersusun dari H-12 bulan sampai H-1 minggu, berdasarkan urutan prioritas nyata.',
  },
  {
    value: '6',
    label: 'kategori biaya',
    body: 'Catering, venue, dekor, dokumentasi, MUA, dan pos penting lain — bukan satu angka gelondongan.',
  },
  {
    value: '3',
    label: 'tier kota',
    body: 'Estimasi menyesuaikan Jakarta, kota besar, dan kota kecil — bukan satu rumus untuk semua.',
  },
  {
    value: '0–100',
    label: 'readiness score',
    body: 'Deterministik dan bisa dijelaskan — bukan angka acak, bukan AI. Kamu tahu kenapa skornya segitu.',
  },
]

export function TrustMetrics() {
  return (
    <section className="px-6 md:px-8 py-14 md:py-24 bg-white">
      <div className="max-w-[900px] mx-auto">
        <p className="text-center text-xs font-extrabold uppercase tracking-widest text-nikah-mauve mb-3">
          Cara kerja yang transparan
        </p>
        <h2
          className="text-[28px] md:text-[44px] text-nikah-text text-center leading-tight mx-auto"
          style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, textWrap: 'balance', maxWidth: 640, margin: '0 auto 32px' } as React.CSSProperties}
        >
          Bukan tebak-tebakan — semua angka punya dasar.
        </h2>

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
          ✓ Tanpa langganan &nbsp;·&nbsp; ✓ Sekali bayar, dipakai sampai hari H &nbsp;·&nbsp; ✓ Skor bisa dijelaskan
        </p>
      </div>
    </section>
  )
}
