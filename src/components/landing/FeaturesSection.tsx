const FEATURES = [
  {
    icon: '📊',
    title: 'Wedding Readiness Score',
    desc: 'Skor deterministik yang menunjukkan seberapa siap rencana wedding kamu secara finansial.',
  },
  {
    icon: '💰',
    title: 'Smart Budget Allocation',
    desc: 'Estimasi alokasi realistis untuk setiap kategori pengeluaran pernikahan.',
  },
  {
    icon: '🎛️',
    title: 'Scenario Simulation',
    desc: 'Ubah jumlah tamu atau gaya wedding dan lihat dampaknya secara real-time.',
  },
  {
    icon: '💡',
    title: 'Smart Recommendations',
    desc: 'Insight berbasis aturan yang membantu kamu melihat risiko tersembunyi dalam rencana.',
  },
]

export function FeaturesSection() {
  return (
    <section className="px-6 py-16 bg-nikah-bg">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-2">
        Fitur Utama
      </p>
      <h2 className="text-2xl font-extrabold text-center text-nikah-text mb-8">
        Semua yang kamu butuhkan
      </h2>
      <div className="flex flex-col gap-4 max-w-md mx-auto">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-2xl p-5 shadow-sm border border-nikah-border flex gap-4 items-start"
          >
            <span className="text-2xl flex-shrink-0">{f.icon}</span>
            <div>
              <h3 className="font-bold text-nikah-text text-sm mb-1">{f.title}</h3>
              <p className="text-nikah-muted text-xs leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
