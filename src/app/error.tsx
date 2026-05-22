'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="id">
      <body className="min-h-screen bg-[#fdf8f4] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-4xl mb-4">💔</p>
          <h1 className="text-2xl font-semibold text-[#3d2c2c] mb-2">
            Aduh, ada yang tidak beres
          </h1>
          <p className="text-[#7a5c5c] mb-8 text-sm leading-relaxed">
            Terjadi kesalahan yang tidak terduga. Tim kami sudah diberitahu.
            Coba lagi, atau kembali ke beranda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="px-6 py-2.5 rounded-full bg-[#7c3b4e] text-white text-sm font-medium hover:bg-[#6b3244] transition-colors"
            >
              Coba lagi
            </button>
            <a
              href="/"
              className="px-6 py-2.5 rounded-full border border-[#d4b8b8] text-[#7a5c5c] text-sm font-medium hover:bg-[#f5eded] transition-colors"
            >
              Ke beranda
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
