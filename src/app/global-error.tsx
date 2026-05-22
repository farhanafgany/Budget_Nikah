'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="id">
      <body className="min-h-screen bg-[#fdf8f4] flex items-center justify-center px-4">
        <main className="text-center max-w-md">
          <p className="text-4xl mb-4" aria-hidden="true">!</p>
          <h1 className="text-2xl font-semibold text-[#3d2c2c] mb-2">
            Ada yang tidak beres
          </h1>
          <p className="text-[#7a5c5c] mb-8 text-sm leading-relaxed">
            Terjadi kesalahan yang tidak terduga. Tim kami sudah diberitahu.
          </p>
          <a
            href="/"
            className="inline-flex px-6 py-2.5 rounded-full bg-[#7c3b4e] text-white text-sm font-medium hover:bg-[#6b3244] transition-colors"
          >
            Ke beranda
          </a>
        </main>
      </body>
    </html>
  )
}
