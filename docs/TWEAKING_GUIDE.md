# Panduan Tweaking Desain BudgetNikah

Panduan ini untuk melakukan perubahan tampilan secara manual tanpa perlu memahami seluruh codebase.

---

## Warna

Semua warna didefinisikan di satu tempat: `tailwind.config.ts` bagian `nikah`.

```ts
nikah: {
  bg:     '#FAF5F5',  // background halaman
  pink:   '#E8C0CC',  // aksen muda, border card
  mauve:  '#C07888',  // eyebrow, label kecil
  deep:   '#6B3545',  // tombol utama, heading aksen
  text:   '#261520',  // teks utama
  muted:  '#9A7888',  // teks sekunder, placeholder
  border: '#EDE4E6',  // garis/border kartu
}
```

Ganti nilai hex di sini → semua komponen ikut berubah secara otomatis.

---

## Komponen Landing Page

Tiap section punya file sendiri di `src/components/landing/`. Pola yang konsisten: **data statis ada di konstanta di bagian atas file** — cukup edit konstanta itu, tidak perlu menyentuh JSX.

### HeroSection — `src/components/landing/HeroSection.tsx`

Bagian hero utama: headline, subtext, phone mockup, tombol CTA.

| Yang ingin diubah | Cari di file |
|---|---|
| Headline H1 | `<h1` — baris ~91 |
| Subheadline | paragraf setelah H1 |
| Teks tombol CTA | `Cek Sekarang — Gratis →` |
| Teks eyebrow | `Wedding Financial Planner · Indonesia` |
| Angka demo di phone mockup | konstanta `PHONE_STATS` di bagian atas |

---

### PainCards — `src/components/landing/PainCards.tsx`

4 kartu pertanyaan pain point. Edit konstanta `PAINS`:

```ts
const PAINS = [
  { icon: '😰', text: 'Takut overbudget sebelum hari H?' },
  { icon: '😵', text: 'Bingung harus mulai dari mana?' },
  { icon: '💸', text: 'Biaya terus membengkak tanpa kontrol?' },
  { icon: '😟', text: 'Takut persiapan berantakan di hari H?' },
]
```

Tambah/kurangi/ubah item di sini. Jumlah kartu harus genap (layout 2 kolom).

---

### FeatureShowcase — `src/components/landing/FeatureShowcase.tsx`

4 tab interaktif: Score / Tabungan / Checklist / Seserahan. Edit konstanta `TABS`:

```ts
const TABS = [
  {
    id:              'score',
    label:           '📊 Score',       // teks di tab strip
    eyebrow:         'Fitur Utama',    // label kecil di atas judul
    title:           'Wedding Readiness Score',
    description:     'Tidak perlu tebak-tebak...',
    bullets:         ['bullet 1', 'bullet 2', 'bullet 3'],
    imageSrc:        '/images/feature-score.png',
    imageAlt:        'Screenshot Wedding Readiness Score',
    screenshotTitle: 'Hasil Analisis', // judul di header screenshot card
  },
  // ... 3 tab lainnya
]
```

Tiap tab menampilkan: eyebrow → judul → deskripsi → 3 bullet → screenshot.

---

### HowItWorks — `src/components/landing/HowItWorks.tsx`

3 langkah cara kerja. Edit konstanta `STEPS`:

```ts
const STEPS = [
  {
    number: '1',
    title: 'Isi profil wedding',
    description: 'Input nama, kota, tanggal...',
  },
  // ...
]
```

---

### PricingSection — `src/components/landing/PricingSection.tsx`

Kartu harga dan daftar fitur. Dua hal yang sering perlu diubah:

**Harga** — cari teks `Rp 99.000` langsung di JSX.

**Daftar fitur** — edit konstanta `WHAT_YOU_GET`:

```ts
const WHAT_YOU_GET = [
  { label: 'Wedding Readiness Score (0–100)', note: 'tahu seberapa siap kamu' },
  // ...
]
```

**Tombol** — nomor WA dan URL payment diambil dari `.env.local` (lihat seksi Environment Variables).

---

### FAQSection — `src/components/landing/FAQSection.tsx`

Accordion FAQ. Edit konstanta `FAQS`:

```ts
const FAQS = [
  {
    q: 'Apakah data saya aman?',
    a: 'Ya. Data kamu disimpan di Supabase...',
  },
  // ...
]
```

---

### Navbar — `src/components/landing/Navbar.tsx`

Logo + link navigasi + tombol "Beli Sekarang". Link navigasi mengarah ke anchor section (`#fitur`, `#cara-kerja`, `#harga`).

---

### Footer — `src/components/landing/Footer.tsx`

Copyright dan link navigasi. Tahun otomatis dari `new Date().getFullYear()`.

---

## Gambar Produk

Taruh file di `public/images/` dengan nama persis seperti berikut:

| Nama file | Muncul di |
|---|---|
| `preview-result.png` | Phone mockup di hero |
| `feature-score.png` | Tab Score di FeatureShowcase |
| `feature-tabungan.png` | Tab Tabungan di FeatureShowcase |
| `feature-checklist.png` | Tab Checklist di FeatureShowcase |
| `feature-seserahan.png` | Tab Seserahan di FeatureShowcase |

**Format:** PNG, JPG, atau WebP.
**Ukuran recommended:** lebar ~400px, tinggi ~600–800px.
**Jika belum ada:** slot gambar menampilkan teks placeholder otomatis — tidak ada error.

---

## Environment Variables

File: `.env.local` di root project.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# WhatsApp (format: 628xxxxxxxxxx — tanpa + atau spasi)
NEXT_PUBLIC_WHATSAPP_NUMBER=628xxxxxxxxxx
NEXT_PUBLIC_WHATSAPP_MESSAGE=Halo, saya ingin membeli akses BudgetNikah.

# Payment (URL Trakteer atau link lainnya)
NEXT_PUBLIC_PAYMENT_URL=https://trakteer.id/...
```

Setelah mengubah `.env.local`, restart dev server (`npm run dev`).

Di Vercel, variabel ini diisi di **Project Settings → Environment Variables**.

---

## Tips

- **Dev server:** jalankan `npm run dev`, buka `http://localhost:3000` untuk lihat perubahan secara langsung.
- **Warna tidak berubah?** Pastikan mengubah nilai di `tailwind.config.ts`, bukan di file komponen.
- **Gambar tidak muncul?** Pastikan nama file persis sama (case-sensitive) dan ada di folder `public/images/`.
- **Tombol WA/Payment tidak muncul?** Pastikan variabel env sudah diisi di `.env.local` dan dev server sudah di-restart.
