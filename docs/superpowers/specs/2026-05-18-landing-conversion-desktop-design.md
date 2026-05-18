# Landing Page — Desktop Conversion Improvements

**Tanggal:** 2026-05-18  
**Scope:** Desktop only (`lg:` breakpoint ke atas). Mobile tidak disentuh.  
**Tujuan:** Meningkatkan konversi landing page dengan memperjelas alur free→paid, mengurangi friction CTA, dan menata ulang trust signals.

---

## Ringkasan Perubahan

| Section | Status | Perubahan |
|---|---|---|
| Navbar | Diubah | CTA target diubah |
| TrustMetrics | Diubah | Hapus purchase signals, pindah ke Pricing |
| HowItWorks | Diubah | Tambah label free/paid tiap langkah |
| FeatureShowcase | Diubah | Tambah badge free/paid tiap card |
| SimulationPreview | Diubah | Fix copy yang mengimplikasikan slider |
| Social Proof | **Baru** | Section baru "launching" framing (Option B) |
| PricingSection | Diubah | Dua CTA, guarantee strip, hapus duplikasi |
| FAQSection | Diubah | Fix satu jawaban |

---

## Detail Per Section

### 1. Navbar

**File:** `src/components/landing/Navbar.tsx`

**Sebelum:** CTA "Dapatkan Akses" → `href="#harga"` (scroll ke pricing section)  
**Sesudah:** CTA "Mulai Gratis →" → `href="/onboarding"` (langsung masuk funnel)

**Alasan:** Navbar CTA sebelumnya memerlukan 3 klik untuk sampai checkout (navbar → #harga → /premium → payment). Langsung ke `/onboarding` mempersingkat jalur konversi dan konsisten dengan pesan utama "gratis, 2 menit, tanpa daftar".

---

### 2. TrustMetrics

**File:** `src/components/landing/TrustMetrics.tsx`

**Sebelum:** 4 metrics = `50+ checklist` · `6 kategori` · `0 biaya tersembunyi` · `7 hari garansi refund`

**Sesudah:** Hapus 2 metric terakhir (`0 biaya tersembunyi` dan garansi). Ganti dengan 2 metric tentang produk:
- `50+` checklist item — tetap
- `6` kategori budget — tetap
- `12` bulan — "Coverage checklist dari H-12 bulan hingga H-1 minggu"
- `3` tier kota — "Jakarta, kota besar, kota kecil — scoring menyesuaikan lokasi"

Ubah juga label section dari "Cara kerja yang transparan" → "Kenapa BudgetNikah berbeda".

**Alasan:** Purchase signals (refund, no subscription) muncul terlalu awal sebelum user memahami produknya. Akan terasa lebih natural jika muncul di dekat pricing. Metric tentang produk lebih relevan di posisi ini.

---

### 3. HowItWorks

**File:** `src/components/landing/HowItWorks.tsx`

**Perubahan:**
- Langkah 1 "Isi profil wedding" → tambah badge `✓ Gratis`
- Langkah 2 "Lihat hasil analisis" → tambah badge `✓ Gratis`
- Langkah 3 "Rencanakan bersama" → ubah deskripsi + tambah badge `🔓 Fitur Premium · Rp 149rb`

Deskripsi langkah 3 sebelumnya: "Gunakan Checklist, Tabungan Nikah, dan Seserahan untuk tetap on track sampai hari H."  
Sesudah: "Buka dashboard lengkap: Checklist 50+ item, Tabungan Nikah, dan Vendor Tracker untuk tetap on track sampai hari H."

**Badge markup** (baru, konsisten untuk langkah 1 & 2):
```tsx
<span className="inline-flex items-center gap-1 mt-2.5 text-[10px] font-extrabold uppercase tracking-wide rounded-full px-2.5 py-1"
  style={{ background: '#EEF7EE', border: '1px solid #C8E6C9', color: '#2F7A3F' }}>
  ✓ Gratis
</span>
```

**Badge markup** (langkah 3):
```tsx
<span className="inline-flex items-center gap-1 mt-2.5 text-[10px] font-extrabold uppercase tracking-wide rounded-full px-2.5 py-1"
  style={{ background: '#FBF2EC', border: '1px solid #E8D0C0', color: '#8B4513' }}>
  🔓 Fitur Premium · Rp 149rb
</span>
```

**Alasan:** Langkah 3 menyebut fitur berbayar seolah bagian dari flow gratis. User yang tidak sadar bisa merasa dijebak saat menemukan paywall. Label eksplisit menghilangkan ambiguitas.

---

### 4. FeatureShowcase

**File:** `src/components/landing/FeatureShowcase.tsx`

**Perubahan:** Setiap card mendapat badge free/paid menggantikan `eyebrow` yang sekarang.

Mapping:
| Fitur | Badge |
|---|---|
| Wedding Readiness Score | `✓ Gratis` (hijau) |
| Prioritas Sekarang | `🔓 Premium` (mauve/pink) |
| Pembayaran Vendor | `🔓 Premium` |
| Target Nabung Bulanan | `🔓 Premium` |
| Checklist + Catatan | `🔓 Premium` |
| Seserahan Custom | `🔓 Premium` |

Tambah satu baris teks di bawah grid:
```
"Wedding Readiness Score bisa dicoba sekarang — gratis, tanpa daftar."
```
Dengan link CTA kecil ke `/onboarding`.

**Alasan:** Tanpa label ini user tidak tahu mana fitur yang bisa langsung dicoba. Ini juga memperkuat value proposition free trial sebelum purchase.

---

### 5. SimulationPreview

**File:** `src/components/landing/SimulationPreview.tsx`

**Sebelum:** `"Geser jumlah tamu dari 600 ke 350. Skornya langsung berubah."`  
**Sesudah:** `"Dari 600 ke 350 tamu: skornya langsung berbeda. Coba dengan angkamu sendiri →"` — link ke `/onboarding`

**Alasan:** Kata "geser" mengimplikasikan slider interaktif yang tidak ada di halaman ini. Copy baru juga sekaligus berfungsi sebagai micro-CTA menuju onboarding.

---

### 6. Social Proof Section (BARU)

**File:** `src/components/landing/SocialProof.tsx` (file baru)  
**Posisi:** Setelah `SimulationPreview`, sebelum `PricingSection`  
**Registrasi:** Tambahkan di `src/app/page.tsx`

**Pendekatan:** Option B — "Baru Launching, Jadilah yang Pertama"

Konten section:
```
[Eyebrow] Baru Launching

[H2 serif italic] Jadilah pasangan pertama yang tahu.

[Body] BudgetNikah baru saja hadir. Kami membangunnya karena spreadsheet 
terasa terlalu kering, tapi aplikasi lain tidak bicara dalam konteks Indonesia. 
Kalau kamu sudah sampai di sini — selamat datang, kita mulai dari tempat yang sama.

[Trust strip] 🛡️ 3 hari tanpa pertanyaan  ·  ✓ Bayar sekali, selamanya  ·  ✓ Tanpa subscription

[CTA] Coba Gratis Dulu →  (href="/onboarding")
```

Background: `var(--landing-bg, #FAF5F5)` — satu warna dengan section lain, tidak perlu warna berbeda.  
Layout desktop: centered, max-width 600px.

---

### 7. PricingSection

**File:** `src/components/landing/PricingSection.tsx`

**Perubahan CTA:** Dari satu tombol "Lihat Detail Premium →" menjadi dua tombol:
1. **Primary (besar):** "Mulai Sekarang — Gratis →" → `href="/onboarding"` — untuk user yang ingin coba dulu
2. **Secondary (lebih kecil):** "Langsung Beli Akses Premium" → `href="/premium"` — untuk user yang sudah siap bayar

**Tambah guarantee strip** di dalam card, di bawah benefit list:
```tsx
<div className="flex items-center justify-center gap-2 rounded-[10px] mt-4 py-2.5 px-4 text-sm font-semibold"
  style={{ background: '#F0FAF0', border: '1px solid #C8E6C9', color: '#2F6B3A' }}>
  🛡️ 3 hari tanpa pertanyaan — tidak cocok? Uang kembali penuh.
</div>
```

**Hapus** baris footer section yang berisi teks "Pembayaran otomatis · Tanpa subscription · Akses seumur hidup" — sudah tercakup di guarantee strip dan badge.

**Alasan:** User yang scroll sampai pricing punya dua intent: yang masih ragu (→ coba gratis dulu) dan yang sudah siap bayar (→ langsung beli). Satu CTA saja menutup salah satu segmen. Garansi di dekat harga langsung menjawab kekhawatiran finansial.

---

### 8. FAQSection

**File:** `src/components/landing/FAQSection.tsx`

**FAQ yang diubah:** "Bagaimana setelah saya bayar?"

**Sebelum:** `"Setelah pembayaran berhasil, ikuti instruksi dari halaman pembayaran untuk membuka akses. WhatsApp tetap tersedia jika kamu butuh bantuan."`

**Sesudah:** `"Langsung aktif. Setelah pembayaran berhasil, kamu otomatis diarahkan ke dashboard — tidak ada langkah tambahan. Login dengan akun yang sama dan semua fitur langsung terbuka. WhatsApp kami tetap tersedia kalau ada pertanyaan."`

**Alasan:** Jawaban sebelumnya terdengar vague dan seperti ada proses manual yang tidak jelas. "Langsung aktif" menghilangkan kekhawatiran sebelum beli.

---

## Apa yang TIDAK Berubah

- Layout desktop secara keseluruhan
- Mobile (tidak disentuh sama sekali)
- Hero section
- FAQSection kecuali 1 jawaban
- FinalCTA
- Footer
- Navbar logo dan nav links
- Semua logic/flow `/onboarding` → `/result` → `/premium` → payment

---

## Urutan Implementasi yang Disarankan

1. Fix copy SimulationPreview (paling kecil, risiko nol)
2. Fix FAQ answer
3. Update TrustMetrics
4. Update Navbar CTA
5. Update HowItWorks (tambah badges)
6. Update FeatureShowcase (tambah badges)
7. Update PricingSection (dua CTA + guarantee strip)
8. Buat SocialProof.tsx + daftarkan di page.tsx
