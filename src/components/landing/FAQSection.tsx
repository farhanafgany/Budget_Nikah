'use client'
import { useState } from 'react'

const FAQS = [
  {
    q: 'Apakah data saya aman?',
    a: 'Ya. Data kamu disimpan di Supabase dengan enkripsi dan kebijakan keamanan Row Level Security — hanya kamu yang bisa mengakses datamu sendiri.',
  },
  {
    q: 'Bisa diakses dari mana saja?',
    a: 'BudgetNikah adalah web app yang bisa dibuka dari HP, laptop, atau tablet — tidak perlu install apa pun.',
  },
  {
    q: 'Bagaimana setelah saya bayar?',
    a: 'Setelah pembayaran berhasil, ikuti instruksi dari halaman pembayaran untuk membuka akses. WhatsApp tetap tersedia jika kamu butuh bantuan.',
  },
  {
    q: 'Apakah ada biaya langganan?',
    a: 'Tidak. BudgetNikah adalah pembelian sekali bayar. Bayar sekali, akses seumur hidup — termasuk semua update fitur ke depannya.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="px-6 md:px-8 pt-20 pb-16 md:pt-28 md:pb-20 bg-nikah-bg">
      <div className="max-w-[660px] mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve text-center mb-2">FAQ</p>
        <h2 className="font-extrabold tracking-tight text-[34px] md:text-[42px] text-nikah-text text-center mb-10 leading-tight" style={{ letterSpacing: '-0.02em' } as React.CSSProperties}>
          Pertanyaan yang <em>Sering Ditanyakan</em>
        </h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-nikah-border rounded-2xl overflow-hidden bg-white">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="text-base font-bold text-nikah-text pr-4">{faq.q}</span>
                <svg
                  className={`w-4 h-4 text-nikah-mauve flex-shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div id={`faq-answer-${i}`} className="px-5 pb-4 text-base text-nikah-muted font-light leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
