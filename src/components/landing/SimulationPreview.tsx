export function SimulationPreview() {
  return (
    <section id="simulasi" className="px-6 md:px-8 py-20 md:py-28 bg-white">
      <div className="max-w-[1080px] mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-2">
          Lihat Bedanya
        </p>
        <h2 className="font-extrabold tracking-tight text-[34px] md:text-[42px] text-nikah-text text-center mb-3 leading-tight" style={{ letterSpacing: '-0.02em' } as React.CSSProperties}>
          Simulasi mengubah <em>segalanya</em>
        </h2>
        <p className="text-center text-nikah-muted text-base md:text-lg font-light mb-10 max-w-lg mx-auto leading-relaxed">
          Geser jumlah tamu dari 600 ke 350. Skornya langsung berubah.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 max-w-[720px] mx-auto items-stretch">
          {/* Sebelum */}
          <div className="bg-nikah-bg border border-nikah-border rounded-[26px] p-7">
            <p className="text-[10px] font-bold uppercase tracking-widest text-nikah-muted mb-4">Sebelum</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-nikah-muted">Lokasi</span>
                <span className="font-semibold">Jakarta</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-nikah-muted">Tamu</span>
                <span className="font-semibold">600 orang</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-nikah-muted">Gaya</span>
                <span className="font-semibold">Elegant</span>
              </div>
              <div className="mt-4 rounded-xl p-3 text-center" style={{ background: '#FFF7EE', border: '1px solid #F2D9B3' }}>
                <div className="leading-none" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontWeight: 500, fontSize: 28, color: '#C77A1A' }}>52</div>
                <div className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: '#C77A1A' }}>Moderate</div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center text-nikah-mauve font-bold text-xl flex-shrink-0 rotate-90 md:rotate-0" aria-hidden="true">→</div>

          {/* Sesudah */}
          <div className="rounded-[26px] p-7" style={{ background: '#F0F9F0', border: '1px solid #BDE0C2' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#2F7A3F' }}>Sesudah</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-nikah-muted">Lokasi</span>
                <span className="font-semibold">Jakarta</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-nikah-muted">Tamu</span>
                <span className="font-semibold">350 orang</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-nikah-muted">Gaya</span>
                <span className="font-semibold">Elegant</span>
              </div>
              <div className="mt-4 rounded-xl p-3 text-center" style={{ background: '#E9F6EC', border: '1px solid #BDE0C2' }}>
                <div className="leading-none" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontWeight: 500, fontSize: 28, color: '#2F7A3F' }}>78</div>
                <div className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: '#2F7A3F' }}>Healthy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
