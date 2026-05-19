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
    a: 'Langsung aktif. Setelah pembayaran berhasil, kamu otomatis diarahkan ke dashboard — tidak ada langkah tambahan. Login dengan akun yang sama dan semua fitur langsung terbuka. WhatsApp kami tetap tersedia kalau ada pertanyaan.',
  },
  {
    q: 'Apakah ada biaya langganan?',
    a: 'Tidak. BudgetNikah adalah pembelian sekali bayar. Bayar sekali, akses seumur hidup — termasuk semua update fitur ke depannya.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="px-6 md:px-8 py-14 md:py-28 bg-nikah-bg">
      <div className="max-w-[660px] mx-auto">
        <p className="text-xs font-extrabold uppercase tracking-widest text-nikah-mauve text-center mb-3">FAQ</p>
        <h2
          className="text-[28px] md:text-[44px] text-nikah-text text-center mb-8 md:mb-11 leading-tight"
          style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 600, letterSpacing: '-0.02em' } as React.CSSProperties}
        >
          Pertanyaan yang <em>Sering Ditanyakan</em>
        </h2>
        <div>
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-nikah-border overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left"
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
                <div id={`faq-answer-${i}`} className="pb-5 text-[15px] text-nikah-muted font-light leading-relaxed">
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
