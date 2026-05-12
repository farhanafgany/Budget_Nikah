export function SimulationPreview() {
  return (
    <section id="simulasi" className="px-6 py-16 bg-white">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-2">
        Lihat Bedanya
      </p>
      <h2 className="text-2xl font-extrabold text-center text-nikah-text mb-8">
        Simulasi mengubah segalanya
      </h2>
      <div className="flex gap-4 max-w-md mx-auto">
        <div className="flex-1 bg-nikah-bg border border-nikah-border rounded-2xl p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-nikah-muted mb-3">Sebelum</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-nikah-muted">Tamu</span>
              <span className="font-semibold">600 orang</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-nikah-muted">Gaya</span>
              <span className="font-semibold">Elegant</span>
            </div>
            <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
              <div className="text-2xl font-extrabold text-orange-600">52</div>
              <div className="text-[10px] text-orange-500 font-semibold uppercase tracking-wide">Moderate</div>
            </div>
          </div>
        </div>

        <div className="flex items-center text-nikah-mauve font-bold text-lg flex-shrink-0">→</div>

        <div className="flex-1 bg-[#F0F9F0] border border-green-200 rounded-2xl p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-3">Sesudah</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-nikah-muted">Tamu</span>
              <span className="font-semibold">350 orang</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-nikah-muted">Gaya</span>
              <span className="font-semibold">Elegant</span>
            </div>
            <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 text-center">
              <div className="text-2xl font-extrabold text-green-700">78</div>
              <div className="text-[10px] text-green-600 font-semibold uppercase tracking-wide">Healthy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
