import type { Metadata } from 'next'
import { LegalPageLayout, LegalSection, SimpleList } from '@/components/legal/LegalPageLayout'

const UPDATED_AT = '24 Mei 2026'

export const metadata: Metadata = {
  title: 'Privacy Policy — BudgetNikah',
  description: 'Kebijakan privasi BudgetNikah tentang data pengguna, pembayaran, analytics, dan layanan pihak ketiga.',
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Privacy Policy"
      title="Kebijakan Privasi BudgetNikah"
      description="Halaman ini menjelaskan data apa yang dapat kami kumpulkan, bagaimana data digunakan, dan bagaimana kamu bisa menghubungi BudgetNikah terkait pertanyaan privasi."
      updatedAt={UPDATED_AT}
    >
      <LegalSection title="Data yang kami kumpulkan">
        <p>
          BudgetNikah mengumpulkan data yang kamu berikan saat menggunakan aplikasi, termasuk saat membuat simulasi,
          menyimpan progress, membuat akun, atau menggunakan fitur premium.
        </p>
        <SimpleList
          items={[
            'Email, nama, atau informasi akun lain jika kamu login.',
            'Data simulasi budget, termasuk lokasi, jumlah tamu, gaya acara, prioritas, dan perkiraan dana.',
            'Preferensi pernikahan, progress checklist, data dashboard, catatan, dan tracking pembayaran vendor.',
            'Data interaksi aplikasi seperti halaman yang dibuka, event penggunaan fitur, error, dan informasi teknis perangkat secara terbatas.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Cara kami menggunakan data">
        <SimpleList
          items={[
            'Menjalankan fitur BudgetNikah, menyimpan progress, dan menampilkan dashboard perencanaan.',
            'Memberi estimasi, insight, skor kesiapan, simulasi, dan rekomendasi berbasis aturan aplikasi.',
            'Memproses akses premium dan membantu pengecekan pembayaran.',
            'Meningkatkan produk, memahami penggunaan fitur, melakukan analytics, dan memantau error.',
            'Menjawab pertanyaan support terkait akun, pembayaran, fitur premium, bug, atau data pengguna.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Layanan pihak ketiga">
        <p>
          Untuk menjalankan aplikasi, BudgetNikah dapat menggunakan layanan pihak ketiga berikut sesuai kebutuhan
          produk dan operasional:
        </p>
        <SimpleList
          items={[
            'Supabase untuk autentikasi, database, dan penyimpanan data aplikasi.',
            'Midtrans untuk pemrosesan pembayaran premium.',
            'PostHog dan Google Analytics untuk analytics penggunaan produk.',
            'Sentry untuk error monitoring dan stabilitas aplikasi.',
            'Vercel untuk hosting, deployment, dan infrastruktur aplikasi.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Pembayaran dan data pribadi">
        <p>
          Data pembayaran diproses oleh payment provider. BudgetNikah tidak menyimpan detail kartu, PIN, atau
          informasi sensitif pembayaran secara langsung. Kami hanya menyimpan informasi transaksi yang dibutuhkan
          untuk status pembayaran, aktivasi premium, dan bantuan support.
        </p>
        <p>
          BudgetNikah tidak menjual data pribadi pengguna kepada pihak lain.
        </p>
      </LegalSection>

      <LegalSection title="Pertanyaan tentang data">
        <p>
          Jika kamu punya pertanyaan tentang data, privasi, atau ingin meminta bantuan terkait akun, hubungi support
          BudgetNikah melalui halaman contact.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
