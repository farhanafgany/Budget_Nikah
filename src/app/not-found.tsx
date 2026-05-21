import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan — BudgetNikah',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fdf8f4] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-5xl font-light text-[#d4b8b8] mb-4">404</p>
        <h1 className="text-2xl font-semibold text-[#3d2c2c] mb-2">
          Halaman tidak ditemukan
        </h1>
        <p className="text-[#7a5c5c] mb-8 text-sm leading-relaxed">
          Sepertinya halaman yang kamu cari sudah dipindahkan atau tidak ada.
          Mulai dari beranda yuk.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-full bg-[#7c3b4e] text-white text-sm font-medium hover:bg-[#6b3244] transition-colors"
        >
          Ke beranda
        </Link>
      </div>
    </div>
  )
}
