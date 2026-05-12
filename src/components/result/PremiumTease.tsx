const LOCKED = [
  { icon: '🎛️', title: 'Simulasi Tak Terbatas',    desc: 'Simpan dan bandingkan banyak skenario' },
  { icon: '📅', title: 'Timeline Planner',          desc: 'Jadwal persiapan month-by-month otomatis' },
  { icon: '🔍', title: 'Advanced Wedding Insights', desc: 'Analisis mendalam per kategori pengeluaran' },
]

export function PremiumTease() {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-widest text-nikah-mauve">Fitur Premium</h3>
      {LOCKED.map(item => (
        <div key={item.title} className="bg-white rounded-2xl p-4 border border-dashed border-nikah-border flex items-center gap-3 opacity-70">
          <span className="text-xl" aria-hidden="true">🔒</span>
          <div>
            <p className="text-xs font-bold text-nikah-text">{item.title}</p>
            <p className="text-[11px] text-nikah-muted">{item.desc}</p>
          </div>
        </div>
      ))}
      <button className="w-full bg-nikah-gold text-white font-bold py-3.5 rounded-full text-sm mt-2 hover:opacity-90 transition">
        Unlock Full Planner ✦
      </button>
    </div>
  )
}
