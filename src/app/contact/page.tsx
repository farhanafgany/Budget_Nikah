import type { Metadata } from 'next'
import { Mail, MessageCircle, Clock, ShieldQuestion } from 'lucide-react'
import { LegalPageLayout, LegalSection, SimpleList } from '@/components/legal/LegalPageLayout'

const UPDATED_AT = '24 Mei 2026'
const SUPPORT_EMAIL = 'budgetnikahads@gmail.com'
const MAILTO = `mailto:${SUPPORT_EMAIL}`

export const metadata: Metadata = {
  title: 'Contact / Support — BudgetNikah',
  description: 'Hubungi BudgetNikah untuk bantuan akun, pembayaran, fitur premium, bug, pertanyaan data, dan masukan produk.',
}

export default function ContactPage() {
  return (
    <LegalPageLayout
      eyebrow="Contact / Support"
      title="Hubungi BudgetNikah"
      description="Kalau ada kendala saat menggunakan BudgetNikah, ceritakan masalahnya sejelas mungkin agar kami bisa membantu lebih cepat."
      updatedAt={UPDATED_AT}
    >
      <section className="rounded-2xl border border-nikah-border bg-white p-5 shadow-[var(--shadow-md)] md:p-7">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-nikah-border bg-nikah-bg p-4">
            <Mail className="mb-3 h-5 w-5 text-nikah-deep" aria-hidden="true" />
            <h2 className="text-base font-extrabold text-nikah-text">Email support</h2>
            <a
              href={MAILTO}
              className="mt-2 block break-words text-sm font-bold text-nikah-deep underline-offset-4 hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>

          <div className="rounded-xl border border-nikah-border bg-nikah-bg p-4">
            <MessageCircle className="mb-3 h-5 w-5 text-nikah-deep" aria-hidden="true" />
            <h2 className="text-base font-extrabold text-nikah-text">Topik bantuan</h2>
            <p className="mt-2 text-sm leading-6 text-nikah-muted">
              Akun, pembayaran, premium, bug, data, dan masukan produk.
            </p>
          </div>

          <div className="rounded-xl border border-nikah-border bg-nikah-bg p-4">
            <Clock className="mb-3 h-5 w-5 text-nikah-deep" aria-hidden="true" />
            <h2 className="text-base font-extrabold text-nikah-text">Waktu balasan</h2>
            <p className="mt-2 text-sm leading-6 text-nikah-muted">
              Kami biasanya membalas dalam 1–3 hari kerja.
            </p>
          </div>
        </div>

        <a
          href={MAILTO}
          className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-nikah-deep px-5 py-3 text-center text-sm font-extrabold text-white transition-transform active:scale-[0.98] md:inline-flex md:w-auto"
        >
          Email BudgetNikah
        </a>
      </section>

      <LegalSection title="Kami bisa membantu untuk">
        <SimpleList
          items={[
            'Bantuan akun atau kendala login.',
            'Pertanyaan pembayaran dan status akses premium.',
            'Bantuan fitur premium seperti dashboard, checklist, tracking pembayaran, atau catatan.',
            'Bug, error, atau tampilan yang tidak berjalan seperti seharusnya.',
            'Pertanyaan terkait data pribadi dan privacy.',
            'Masukan produk agar BudgetNikah lebih membantu pasangan Indonesia.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Agar lebih cepat dibantu">
        <div className="flex gap-3">
          <ShieldQuestion className="mt-1 h-5 w-5 shrink-0 text-nikah-deep" aria-hidden="true" />
          <p>
            Saat mengirim email, sertakan email akun yang digunakan, halaman yang bermasalah, screenshot jika ada,
            dan langkah singkat yang kamu lakukan sebelum kendala muncul.
          </p>
        </div>
      </LegalSection>
    </LegalPageLayout>
  )
}
