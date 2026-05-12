import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BudgetNikah — Cek Apakah Rencana Weddingmu Sudah Realistis',
  description: 'Dapatkan Wedding Readiness Score, estimasi budget riil per kategori, checklist 50+ item, dan rencana nabung bulanan. Gratis, tanpa login.',
  keywords: ['wedding budget', 'budget nikah', 'perencana pernikahan', 'wedding planner indonesia', 'checklist pernikahan'],
  openGraph: {
    title: 'BudgetNikah — Cek Apakah Rencana Weddingmu Sudah Realistis',
    description: 'Dapatkan Wedding Readiness Score, estimasi budget riil per kategori, checklist 50+ item, dan rencana nabung bulanan. Gratis, tanpa login.',
    siteName: 'BudgetNikah',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BudgetNikah — Cek Apakah Rencana Weddingmu Sudah Realistis',
    description: 'Dapatkan Wedding Readiness Score, estimasi budget riil, dan rencana nabung bulanan. Gratis, tanpa login.',
  },
  metadataBase: new URL('https://budgetnikah.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} font-jakarta bg-nikah-bg text-nikah-text antialiased`}>
        {children}
      </body>
    </html>
  )
}
