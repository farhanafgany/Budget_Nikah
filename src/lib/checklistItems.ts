export type ChecklistTimeline = 12 | 6 | 3 | 1 | 0

export interface ChecklistItem {
  id: string
  label: string
  category: string
  monthsBefore: ChecklistTimeline
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // 12 bulan sebelum
  { id: 'tentukan-tanggal', label: 'Tentukan tanggal pernikahan', category: 'Perencanaan', monthsBefore: 12 },
  { id: 'tentukan-budget', label: 'Tentukan dan sepakati budget pernikahan', category: 'Perencanaan', monthsBefore: 12 },
  { id: 'buat-guest-list', label: 'Buat daftar tamu awal', category: 'Perencanaan', monthsBefore: 12 },
  { id: 'pilih-venue', label: 'Cari dan kunjungi beberapa venue', category: 'Venue', monthsBefore: 12 },
  { id: 'book-venue', label: 'Book venue pilihan', category: 'Venue', monthsBefore: 12 },
  { id: 'pilih-konsep', label: 'Tentukan konsep dan tema pernikahan', category: 'Perencanaan', monthsBefore: 12 },
  { id: 'cari-katering', label: 'Cari dan cicipi beberapa katering', category: 'Katering', monthsBefore: 12 },
  { id: 'pilih-fotografer', label: 'Cari fotografer dan videografer', category: 'Dokumentasi', monthsBefore: 12 },
  { id: 'konsultasi-kua', label: 'Konsultasi dengan penghulu / KUA', category: 'Administrasi', monthsBefore: 12 },
  { id: 'venue-kontrak', label: 'Tandatangani kontrak venue', category: 'Venue', monthsBefore: 12 },

  // 6 bulan sebelum
  { id: 'book-katering', label: 'Book katering', category: 'Katering', monthsBefore: 6 },
  { id: 'book-fotografer', label: 'Book fotografer dan videografer', category: 'Dokumentasi', monthsBefore: 6 },
  { id: 'cari-baju', label: 'Cari dan coba baju pengantin', category: 'Baju', monthsBefore: 6 },
  { id: 'cari-dekorasi', label: 'Konsultasi dengan dekorator', category: 'Dekorasi', monthsBefore: 6 },
  { id: 'book-dekorasi', label: 'Book dekorator', category: 'Dekorasi', monthsBefore: 6 },
  { id: 'undangan-desain', label: 'Mulai desain undangan pernikahan', category: 'Undangan', monthsBefore: 6 },
  { id: 'cari-mc', label: 'Cari dan tentukan MC', category: 'Hiburan', monthsBefore: 6 },
  { id: 'beli-cincin', label: 'Beli atau pesan cincin nikah', category: 'Perlengkapan', monthsBefore: 6 },
  { id: 'cari-mua', label: 'Cari makeup artist (MUA)', category: 'MUA', monthsBefore: 6 },
  { id: 'baju-aksesoris', label: 'Beli aksesoris baju pengantin', category: 'Baju', monthsBefore: 6 },
  { id: 'pilih-parfum', label: 'Pilih parfum untuk hari H', category: 'Perlengkapan', monthsBefore: 6 },

  // 3 bulan sebelum
  { id: 'book-mc', label: 'Book MC', category: 'Hiburan', monthsBefore: 3 },
  { id: 'book-mua', label: 'Book MUA', category: 'MUA', monthsBefore: 3 },
  { id: 'cetak-undangan', label: 'Cetak dan kirim undangan', category: 'Undangan', monthsBefore: 3 },
  { id: 'konfirmasi-vip', label: 'Konfirmasi kehadiran tamu VIP', category: 'Tamu', monthsBefore: 3 },
  { id: 'order-souvenir', label: 'Order souvenir', category: 'Souvenir', monthsBefore: 3 },
  { id: 'siapkan-seserahan', label: 'Siapkan seserahan', category: 'Seserahan', monthsBefore: 3 },
  { id: 'dokumen-akad', label: 'Siapkan dokumen akad nikah', category: 'Administrasi', monthsBefore: 3 },
  { id: 'finalisasi-menu', label: 'Finalisasi menu katering', category: 'Katering', monthsBefore: 3 },
  { id: 'pilih-musik', label: 'Tentukan pilihan musik dan hiburan', category: 'Hiburan', monthsBefore: 3 },
  { id: 'rencana-honeymoon', label: 'Rencanakan bulan madu', category: 'Bulan Madu', monthsBefore: 3 },
  { id: 'fitting-baju', label: 'Fitting baju pengantin', category: 'Baju', monthsBefore: 3 },

  // 1 bulan sebelum
  { id: 'konfirmasi-tamu', label: 'Konfirmasi jumlah tamu final ke katering', category: 'Katering', monthsBefore: 1 },
  { id: 'trial-makeup', label: 'Trial makeup dan hairdo', category: 'MUA', monthsBefore: 1 },
  { id: 'final-fitting', label: 'Final fitting baju pengantin', category: 'Baju', monthsBefore: 1 },
  { id: 'rehearsal', label: 'Gladi resik / rehearsal acara', category: 'Perencanaan', monthsBefore: 1 },
  { id: 'brief-pendamping', label: 'Konfirmasi tugas bridesmaid dan groomsmen', category: 'Perencanaan', monthsBefore: 1 },
  { id: 'book-honeymoon', label: 'Book tiket dan hotel bulan madu', category: 'Bulan Madu', monthsBefore: 1 },
  { id: 'atur-transport', label: 'Atur transportasi hari H', category: 'Logistik', monthsBefore: 1 },
  { id: 'brief-dekorasi', label: 'Brief detail dekorasi dengan dekorator', category: 'Dekorasi', monthsBefore: 1 },
  { id: 'konfirmasi-vendor', label: 'Konfirmasi semua vendor', category: 'Vendor', monthsBefore: 1 },
  { id: 'rundown-acara', label: 'Buat rundown acara hari H', category: 'Perencanaan', monthsBefore: 1 },

  // 1 minggu sebelum (monthsBefore: 0)
  { id: 'packing-honeymoon', label: 'Packing untuk bulan madu', category: 'Bulan Madu', monthsBefore: 0 },
  { id: 'siapkan-tas-hari-h', label: 'Siapkan tas dan keperluan hari H', category: 'Logistik', monthsBefore: 0 },
  { id: 'cek-vendor-akhir', label: 'Cek last-minute semua vendor', category: 'Vendor', monthsBefore: 0 },
  { id: 'istirahat-cukup', label: 'Istirahat cukup dan jaga kesehatan', category: 'Kesehatan', monthsBefore: 0 },
  { id: 'serahkan-koordinasi', label: 'Serahkan koordinasi ke koordinator', category: 'Logistik', monthsBefore: 0 },
  { id: 'cek-cincin', label: 'Pastikan cincin dan aksesoris siap', category: 'Perlengkapan', monthsBefore: 0 },
  { id: 'cek-baju', label: 'Pastikan baju pengantin rapih dan siap', category: 'Baju', monthsBefore: 0 },
  { id: 'cek-dokumen', label: 'Cek semua dokumen penting sudah siap', category: 'Administrasi', monthsBefore: 0 },
  { id: 'siapkan-cash', label: 'Siapkan uang cash untuk tips vendor', category: 'Keuangan', monthsBefore: 0 },
  { id: 'brief-keluarga', label: 'Brief anggota keluarga tentang tugas', category: 'Perencanaan', monthsBefore: 0 },
]
