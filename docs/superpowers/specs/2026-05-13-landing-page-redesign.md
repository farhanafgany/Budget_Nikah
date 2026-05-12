# Landing Page Redesign — Design Spec

## Goal

Redesign the BudgetNikah landing page dengan pendekatan "Hangat & Produk-Sentris": hero menampilkan phone mockup besar di tengah, fitur ditampilkan via tab interaktif dengan screenshot riil, tetap mendorong konversi.

## Constraints

- Navbar wajib ada (sticky, existing `Navbar` component dipertahankan)
- Tombol WhatsApp wajib ada (floating, existing `FloatingWhatsApp` dipertahankan)
- Screenshot produk riil wajib ada (slot image per fitur)
- Warna palette tidak berubah: `nikah-bg`, `nikah-deep`, `nikah-mauve`, `nikah-text`, `nikah-muted`, `nikah-border`
- Font: Plus Jakarta Sans (tidak berubah)

---

## Section Structure

Urutan section dari atas ke bawah:

1. Navbar (existing, tidak berubah)
2. Hero
3. Pain
4. Feature Tabs
5. How It Works
6. Pricing (existing, tidak berubah)
7. FAQ (existing, tidak berubah)
8. Footer (existing, tidak berubah)
9. FloatingWhatsApp (existing, tidak berubah)

---

## Section 1: Hero (`HeroSection.tsx`)

**Layout:** Single-column, center-aligned, gradient background.

**Background:** `linear-gradient(160deg, #F5E8EC 0%, #EDD6DE 40%, #FAF5F5 100%)` + 2 decorative blur blobs (kiri atas, kanan bawah).

**Content dari atas ke bawah:**
1. Eyebrow: `"Wedding Financial Planner · Indonesia"` — `text-xs uppercase tracking-widest text-nikah-mauve`
2. H1: `"Cek Apakah Rencana Weddingmu Sudah Realistis."` — `text-3xl md:text-4xl font-extrabold`
3. Subheadline: `"Dapat Wedding Readiness Score, estimasi budget riil, dan rencana nabung — dalam 2 menit."` — `text-sm md:text-base font-light text-nikah-muted`
4. **Phone mockup** (lihat sub-section di bawah)
5. CTA button: `"Cek Sekarang — Gratis →"` — full-width, `bg-nikah-deep`, rounded-full
6. Note: `"Tanpa login · Selesai 2 menit"` — `text-xs text-nikah-muted`

**Phone mockup:**
- Outer shell: `bg-nikah-text` (dark), `rounded-[32px]`, shadow besar
- Inner screen: `bg-nikah-bg`, `rounded-[26px]`, overflow hidden
- Status bar: `bg-nikah-deep` dengan nama app + jam
- Screen area: gradient `from-[#F5E8EC] to-[#EDD6DE]`, menampilkan score besar (48px), label, badge Healthy
- Stat row di bawah score: 3 kolom (nabung/bulan · checklist · tekanan budget) dengan background putih
- Slot image: `/public/images/preview-result.png` — jika ada, tampil di atas placeholder. Jika tidak ada, tampil placeholder score.
- Width: `w-[200px]` fixed

**Sticky mobile CTA:** `fixed bottom-0 md:hidden` — tetap ada seperti sekarang.

**Padding:** `pt-28 pb-16` (clearance untuk navbar).

---

## Section 2: Pain (`PainCards.tsx`)

**Background:** `bg-white`

**Content:**
- Eyebrow: `"Kamu tidak sendirian"`
- H2: `"Banyak pasangan merasakan hal yang sama"`
- Subtext: `"Perencanaan wedding memang overwhelming — sampai kamu punya angka yang jelas."`

**Grid:** 2 kolom, 4 kartu (tetap 4, bukan 6).

**Pain items (dengan tanda tanya):**
1. 😰 "Takut overbudget sebelum hari H?"
2. 😵 "Bingung harus mulai dari mana?"
3. 💸 "Biaya terus membengkak tanpa kontrol?"
4. 😟 "Takut persiapan berantakan di hari H?"

**Card style:** `bg-nikah-bg border border-nikah-border rounded-2xl`, icon + teks, center-aligned.

---

## Section 3: Feature Tabs (`FeatureShowcase.tsx`)

**Background:** `bg-nikah-bg`
**id:** `"fitur"` (untuk navbar anchor)

**Header:**
- Eyebrow: `"Semua dalam satu tempat"`
- H2: `"Yang kamu dapat"`

**Tab strip:** 4 tab horizontal, pill-style.
- Tab items: `📊 Score` · `💰 Tabungan` · `✅ Checklist` · `💍 Seserahan`
- Active tab: `bg-nikah-deep text-white`
- Inactive tab: `text-nikah-muted`
- Container: `bg-white border border-nikah-border rounded-full p-1`

**Tab panel (satu aktif sekaligus):**
- Layout: stacked (teks dulu, screenshot di bawah)
- Teks: eyebrow fitur + judul + deskripsi + 3 bullet point dengan checkmark dot
- Screenshot card: `bg-white border border-nikah-border rounded-2xl shadow-md`
  - Header bar: `bg-nikah-deep` dengan judul halaman
  - Body: slot gambar dengan `<Image>` + fallback placeholder jika gambar belum ada

**4 tab content:**

| Tab | Judul | Deskripsi | Bullets | Image slot |
|-----|-------|-----------|---------|-----------|
| Score | Wedding Readiness Score | Dapat angka 0–100 yang jelas kenapa segitu. | Deterministik & explainable · Breakdown per faktor · Update real-time | `/images/feature-score.png` |
| Tabungan | Tabungan Nikah | Pantau progress tabungan dan tahu harus nabung berapa per bulan. | Target otomatis dari budget · Progress bar visual · Kalkulasi sisa bulan | `/images/feature-tabungan.png` |
| Checklist | Checklist 50+ Item | Timeline dari 12 bulan sampai H-1 minggu. Tidak ada yang terlewat. | Diurutkan per fase · Centang satu per satu · Filter per timeline | `/images/feature-checklist.png` |
| Seserahan | Daftar Seserahan | Semua item seserahan dalam satu daftar, lengkap dengan status. | 20+ item default · Tandai sudah/belum · Ringkasan progress | `/images/feature-seserahan.png` |

**State management:** `useState<number>` untuk active tab index. Client Component (`'use client'`).

---

## Section 4: How It Works (`HowItWorks.tsx`)

Tidak berubah dari implementasi saat ini. Tetap 3 langkah dengan lingkaran bernomor dan garis penghubung.

**id:** `"cara-kerja"` (untuk navbar anchor)

---

## Files To Change

| File | Tindakan |
|------|----------|
| `src/components/landing/HeroSection.tsx` | Rewrite — single-column, phone mockup centered |
| `src/components/landing/PainCards.tsx` | Edit — 4 kartu, tambah `?` di tiap kalimat |
| `src/components/landing/FeatureShowcase.tsx` | Rewrite — tab-based layout |
| `src/components/landing/Navbar.tsx` | Tidak berubah |
| `src/components/landing/HowItWorks.tsx` | Tidak berubah |
| `src/components/landing/PricingSection.tsx` | Tidak berubah |
| `src/components/landing/FAQSection.tsx` | Tidak berubah |
| `src/components/landing/Footer.tsx` | Tidak berubah |
| `src/components/landing/FloatingWhatsApp.tsx` | Tidak berubah |

---

## Image Slots Summary

| Path | Dipakai di |
|------|-----------|
| `/public/images/preview-result.png` | Hero phone mockup |
| `/public/images/feature-score.png` | Feature tab: Score |
| `/public/images/feature-tabungan.png` | Feature tab: Tabungan |
| `/public/images/feature-checklist.png` | Feature tab: Checklist |
| `/public/images/feature-seserahan.png` | Feature tab: Seserahan |

Semua image slot menggunakan Next.js `<Image>` dengan fallback placeholder jika file belum ada.
