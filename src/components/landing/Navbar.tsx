import Link from 'next/link'
import { BrandLogo } from '@/components/ui/BrandLogo'

export function Navbar() {
  return (
    <header className="relative z-40 bg-white/90 backdrop-blur border-b border-nikah-border">
      <div className="max-w-[1080px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-3">

        {/* Logo */}
        <Link href="/">
          <BrandLogo size="md" />
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-nikah-muted font-medium" aria-label="Navigasi">
          <a href="#fitur" className="hover:text-nikah-text transition-colors">Fitur</a>
          <a href="#cara-kerja" className="hover:text-nikah-text transition-colors">Cara Kerja</a>
          <a href="#harga" className="hover:text-nikah-text transition-colors">Harga</a>
        </nav>

        {/* CTA */}
        <div className="flex items-center">
          <a
            href="#harga"
            className="bg-nikah-deep text-white text-xs md:text-sm font-bold px-3 py-2 md:px-5 md:py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-sm whitespace-nowrap"
          >
            <span className="md:hidden">Akses</span>
            <span className="hidden md:inline">Dapatkan Akses</span>
          </a>
        </div>

      </div>
    </header>
  )
}
