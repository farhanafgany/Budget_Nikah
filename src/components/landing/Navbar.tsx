import Link from 'next/link'
import { BrandLogo } from '@/components/ui/BrandLogo'

export function Navbar() {
  return (
    <header
      className="relative z-40 bg-[#EFD9CC] md:border-b md:border-nikah-border md:bg-[#EFD9CC]/90 md:backdrop-blur"
    >
      <div className="max-w-[1080px] mx-auto px-4 md:px-8 h-14 md:h-16 flex items-center justify-between gap-3">

        {/* Logo */}
        <Link href="/">
          <span className="md:hidden"><BrandLogo size="sm" /></span>
          <span className="hidden md:block"><BrandLogo size="md" /></span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-nikah-muted font-medium" aria-label="Navigasi">
          <a href="#fitur" className="hover:text-nikah-text transition-colors">Fitur</a>
          <a href="#harga" className="hover:text-nikah-text transition-colors">Harga</a>
        </nav>

        {/* CTA */}
        <div className="flex items-center">
          <Link
            href="/auth/login"
            className="border border-nikah-border text-nikah-deep font-semibold rounded-full active:scale-95 active:brightness-90 transition-all whitespace-nowrap text-[11px] px-3 py-1.5 bg-transparent md:text-sm md:px-5 md:py-2.5 md:bg-transparent md:hover:bg-white"
          >
            Masuk
          </Link>
        </div>

      </div>
    </header>
  )
}
