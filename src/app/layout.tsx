import type { Metadata } from 'next'
import * as Sentry from '@sentry/nextjs'
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const metadataConfig: Metadata = {
  title: 'BudgetNikah — Cek Apakah Rencana Weddingmu Sudah Realistis',
  description: 'Dapatkan Wedding Readiness Score, estimasi budget riil per kategori, checklist 50+ item, dan rencana nabung bulanan. Gratis, tanpa login.',
  keywords: ['wedding budget', 'budget nikah', 'perencana pernikahan', 'wedding planner indonesia', 'checklist pernikahan'],
  openGraph: {
    title: 'BudgetNikah — Cek Apakah Rencana Weddingmu Sudah Realistis',
    description: 'Dapatkan Wedding Readiness Score, estimasi budget riil per kategori, checklist 50+ item, dan rencana nabung bulanan. Gratis, tanpa login.',
    siteName: 'BudgetNikah',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BudgetNikah — Cek Apakah Rencana Weddingmu Sudah Realistis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BudgetNikah — Cek Apakah Rencana Weddingmu Sudah Realistis',
    description: 'Dapatkan Wedding Readiness Score, estimasi budget riil, dan rencana nabung bulanan. Gratis, tanpa login.',
    images: ['/images/og-image.png'],
  },
  metadataBase: new URL('https://budgetnikah.com'),
}

export function generateMetadata(): Metadata {
  return {
    ...metadataConfig,
    other: {
      ...Sentry.getTraceData(),
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} ${playfair.variable} font-jakarta bg-nikah-bg text-nikah-text antialiased`}>
        {children}
      </body>
    </html>
  )
}
