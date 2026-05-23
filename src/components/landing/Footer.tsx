import Link from 'next/link'
import { BrandLogo } from '@/components/ui/BrandLogo'

export function Footer() {
  return (
    <footer className="bg-nikah-text px-6 py-8 text-white/70 md:py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-5 text-sm md:flex-row">

        <BrandLogo size="md" color="#ffffff" />

        <p className="max-w-[260px] text-center text-xs leading-5 md:max-w-none">
          Wedding financial planner untuk pasangan Indonesia.
        </p>

        <nav
          aria-label="Footer legal navigation"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs"
        >
          <Link href="/#fitur" className="rounded-sm py-1 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70">Fitur</Link>
          <Link href="/#harga" className="rounded-sm py-1 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70">Harga</Link>
          <Link href="/privacy-policy" className="rounded-sm py-1 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70">Privacy Policy</Link>
          <Link href="/terms" className="rounded-sm py-1 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70">Terms</Link>
          <Link href="/contact" className="rounded-sm py-1 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70">Contact</Link>
          <Link href="/auth/login" className="rounded-sm py-1 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70">Masuk</Link>
        </nav>

      </div>

      <div className="mx-auto mt-6 max-w-4xl border-t border-white/10 pt-6 text-center text-xs leading-5">
        © 2026 BudgetNikah. Semua hak dilindungi.
      </div>
    </footer>
  )
}
