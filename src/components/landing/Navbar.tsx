import Link from 'next/link'

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur border-b border-nikah-border">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F5E8EC] to-[#C07888] flex items-center justify-center">
            <span className="text-white text-xs font-extrabold">B</span>
          </div>
          <span className="text-sm font-extrabold text-nikah-text tracking-tight">BudgetNikah</span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-nikah-muted font-medium" aria-label="Navigasi">
          <a href="#fitur" className="hover:text-nikah-text transition-colors">Fitur</a>
          <a href="#cara-kerja" className="hover:text-nikah-text transition-colors">Cara Kerja</a>
          <a href="#harga" className="hover:text-nikah-text transition-colors">Harga</a>
        </nav>

        {/* CTA */}
        <a
          href="#harga"
          className="bg-nikah-deep text-white text-xs md:text-sm font-bold px-4 py-2 md:px-5 md:py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          Beli Sekarang
        </a>

      </div>
    </header>
  )
}
