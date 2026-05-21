const FEATURES = [
  {
    icon: '📊',
    title: 'Skor Kesiapan Nikah',
    desc: 'Angka 0–100 yang menunjukkan seberapa siap rencana kalian secara finansial — deterministik, bisa dijelaskan.',
  },
  {
    icon: '💰',
    title: 'Estimasi Biaya Per Kategori',
    desc: 'Alokasi realistis untuk catering, venue, dekor, dokumentasi, dan pos penting lainnya.',
  },
  {
    icon: '🎛️',
    title: 'Coba-Ubah Skenario',
    desc: 'Ubah jumlah tamu atau gaya acara dan lihat langsung dampaknya ke total biaya dan skor.',
  },
  {
    icon: '💡',
    title: 'Yang Perlu Diperhatikan',
    desc: 'Catatan berbasis jawaban kalian — risiko nyata yang mudah tercecer kalau tidak disusun dari sekarang.',
  },
]

export function FeaturesSection() {
  return (
    <section className="px-6 py-16 bg-nikah-bg">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-2">
        Apa yang Kalian Dapat
      </p>
      <h2 className="text-2xl font-extrabold text-center text-nikah-text mb-8">
        Semua yang kalian butuhkan
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
