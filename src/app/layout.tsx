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
  title: 'BudgetNikah — Cek Kesiapan Wedding Kamu',
  description: 'Bantu pasangan Indonesia memahami kesiapan wedding sebelum biaya terasa overwhelming.',
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
