import type { Metadata } from 'next'
import { LegalPageLayout, LegalSection, SimpleList } from '@/components/legal/LegalPageLayout'

const UPDATED_AT = '24 Mei 2026'

export const metadata: Metadata = {
  title: 'Terms & Conditions — BudgetNikah',
  description: 'Syarat dan ketentuan penggunaan BudgetNikah untuk simulasi budget pernikahan dan fitur premium.',
}

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Terms & Conditions"
      title="Syarat dan Ketentuan BudgetNikah"
      description="Dengan menggunakan BudgetNikah, kamu menyetujui syarat penggunaan berikut. Bacalah dengan tenang sebelum memakai fitur gratis maupun premium."
      updatedAt={UPDATED_AT}
    >
      <LegalSection title="Penggunaan BudgetNikah">
        <p>
          BudgetNikah adalah alat bantu perencanaan pernikahan. Aplikasi ini membantu kamu memahami gambaran budget,
          prioritas, kesiapan, checklist, dan progress persiapan pernikahan.
        </p>
        <p>
          BudgetNikah bukan penasihat keuangan resmi, konsultan hukum, vendor pernikahan, atau pengganti keputusan
          finansial pribadi. Keputusan akhir tetap berada pada pengguna.
        </p>
      </LegalSection>

      <LegalSection title="Estimasi dan hasil simulasi">
        <p>
          Semua estimasi biaya, skor, insight, dan simulasi bersifat informatif. Hasil tersebut tidak menjamin biaya
          aktual yang akan kamu keluarkan.
        </p>
        <SimpleList
          items={[
            'Biaya aktual dapat berbeda karena lokasi, vendor, musim, gaya acara, jumlah tamu, dan keputusan pengguna.',
            'Data harga dan kategori dapat berubah dari waktu ke waktu.',
            'Gunakan hasil simulasi sebagai bahan pertimbangan, bukan sebagai satu-satunya dasar keputusan.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Akun dan akses">
        <p>
          Kamu bertanggung jawab menjaga akses email, akun, dan perangkat yang digunakan untuk masuk ke BudgetNikah.
          Jangan menggunakan akun untuk aktivitas yang melanggar hukum, mengganggu layanan, atau mencoba mengakses
          data pengguna lain.
        </p>
      </LegalSection>

      <LegalSection title="Fitur gratis dan premium">
        <p>
          BudgetNikah dapat menyediakan fitur gratis seperti onboarding, simulasi, dan hasil awal. Fitur premium dapat
          mencakup dashboard planning, checklist, tracking pembayaran, catatan, dan fitur lain yang dijelaskan di
          halaman produk.
        </p>
        <p>
          Pembayaran premium diproses melalui payment provider. Akses premium akan aktif setelah status pembayaran
          terkonfirmasi oleh sistem.
        </p>
      </LegalSection>

      <LegalSection title="Refund">
        <p>
          Jika kamu merasa BudgetNikah Premium tidak cocok, kamu dapat mengajukan refund dalam 3 hari sejak pembayaran
          berhasil. Permintaan refund akan diproses tanpa pertanyaan yang menyulitkan. Silakan hubungi support dengan
          email akun dan bukti pembayaran agar kami bisa membantu prosesnya.
        </p>
      </LegalSection>

      <LegalSection title="Batasan tanggung jawab">
        <p>
          BudgetNikah berusaha menjaga aplikasi tetap berguna, aman, dan stabil. Namun, kami tidak bertanggung jawab
          atas keputusan finansial, pilihan vendor, perubahan harga, atau kerugian lain yang terjadi karena penggunaan
          informasi dari aplikasi ini.
        </p>
      </LegalSection>

      <LegalSection title="Perubahan terms">
        <p>
          Syarat dan ketentuan ini dapat diperbarui dari waktu ke waktu agar sesuai dengan perkembangan produk,
          operasional, atau kebutuhan hukum. Versi terbaru akan ditampilkan di halaman ini.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
