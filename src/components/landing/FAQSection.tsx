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
    a: 'Hubungi kami via WhatsApp dengan bukti pembayaran. Akses akan diaktifkan dalam 1×24 jam.',
  },
  {
    q: 'Apakah ada biaya langganan?',
    a: 'Tidak. BudgetNikah adalah pembelian sekali bayar. Bayar sekali, akses seumur hidup — termasuk semua update fitur ke depannya.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="px-6 py-16 bg-white">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-extrabold text-nikah-text text-center mb-8">
          Pertanyaan Umum
        </h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-nikah-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="text-sm font-bold text-nikah-text pr-4">{faq.q}</span>
                <span
                  className={`text-nikah-mauve flex-shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>
              {openIndex === i && (
                <div id={`faq-answer-${i}`} className="px-5 pb-4 text-sm text-nikah-muted font-light leading-relaxed">
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
