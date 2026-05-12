# BudgetNikah — Spesifikasi Desain
**Tanggal:** 2026-05-12
**Status:** Disetujui

---

## Gambaran Umum

BudgetNikah adalah aplikasi web perencanaan pernikahan yang mengutamakan tampilan mobile, ditujukan untuk pasangan Indonesia yang sedang bertunangan. Aplikasi ini membantu pengguna memahami apakah rencana pernikahan mereka realistis, mengurangi rasa kewalahan, mensimulasikan keputusan, serta mendapatkan kejelasan finansial dan emosional sebelum menikah.

**Nuansa:** Tenang, elegan, suportif secara emosional, ringan, mobile-first.
**Bukan:** Dashboard keuangan, SaaS enterprise, spreadsheet, tampilan fintech.

---

## Keputusan Desain

| Keputusan | Pilihan |
|---|---|
| Font | Plus Jakarta Sans (semua weight) |
| Palet warna | Dusty Mauve Pink — `#FAF5F5` bg, `#E8C0CC` pink, `#C07888` mauve, `#6B3545` deep, `#C8A860` gold |
| Layout halaman Result | Narasi Mengalir — score besar di hero gradient, konten mengalir ke bawah |
| Gaya onboarding | Satu fokus per layar — satu pertanyaan/grup per screen, gaya kuis |
| Arsitektur | Hybrid SSR + CSR |
| Supabase | Project baru, setup dari awal |

---

## Tech Stack

- **Framework:** Next.js 14+ App Router
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand
- **Database/Auth:** Supabase (PostgreSQL + Supabase Auth)
- **Chart:** Recharts (lazy-loaded)
- **Deployment:** Vercel

---

## Arsitektur

### Strategi Rendering

| Route | Strategi | Alasan |
|---|---|---|
| `/` | Server Component (SSR) | SEO + first paint cepat untuk traffic Meta Ads |
| `/onboarding` | Client Component | State form, navigasi step, localStorage |
| `/result` | Client Component | Simulasi real-time, Recharts |
| `/dashboard` | Server Component | Wajib login, fetch dari Supabase sisi server |
| `/auth/*` | Client Component | Supabase Auth UI |

### Struktur Folder

```
src/
├── app/
│   ├── page.tsx                        # Landing (SSR)
│   ├── onboarding/page.tsx             # Multi-step onboarding (CSR)
│   ├── result/page.tsx                 # Hasil + simulasi (CSR)
│   ├── dashboard/page.tsx              # Dashboard (SSR, wajib login)
│   └── auth/
│       ├── login/page.tsx
│       └── signup/page.tsx
├── components/
│   ├── ui/                             # Komponen shadcn/ui
│   ├── landing/                        # Hero, PainCards, Features, SimPreview, FinalCTA
│   ├── onboarding/                     # StepWrapper, komponen tiap langkah
│   ├── result/                         # ScoreHero, PressureCard, AllocationChart,
│   │                                   # InsightCards, SimulationControls, PremiumTease
│   └── dashboard/                      # ReadinessSummary, Countdown, BudgetSummary
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Supabase client untuk browser
│   │   └── server.ts                   # Supabase client untuk server (SSR)
│   ├── scoring.ts                      # Pure function kalkulasi readiness score
│   ├── allocation.ts                   # Pure function alokasi budget
│   ├── insights.ts                     # Engine insight berbasis aturan
│   └── cityTiers.ts                    # Pemetaan tier kota + multiplier
├── stores/
│   ├── onboardingStore.ts              # Zustand + persist ke localStorage
│   ├── authStore.ts                    # Zustand, sesi Supabase
│   └── simulationStore.ts             # Zustand, state slider/switcher (tidak dipersist)
└── middleware.ts                       # Proteksi /dashboard, redirect jika belum login
```

---

## Manajemen State

### Zustand Stores

**`onboardingStore`**
- Field: `partnerOneName`, `partnerTwoName`, `weddingCity`, `weddingDate`, `totalBudget`, `guestCount`, `weddingStyle`, `eventType`, `planningPriority`, `currentStep`
- Dipersist ke `localStorage` via Zustand persist middleware
- Auto-restore saat halaman di-refresh
- Dibersihkan setelah berhasil disinkronkan ke Supabase

**`authStore`**
- Field: `user`, `session`, `isLoading`
- Diisi dari listener Supabase Auth

**`simulationStore`**
- Field: `guestCount`, `weddingStyle` (cerminan data onboarding, bisa diubah)
- Tidak dipersist — di-reset saat halaman dimuat, diisi dari data onboarding
- Menggerakkan kalkulasi ulang score/alokasi secara real-time di halaman result

### Alur Data

**Sebelum login:**
```
Langkah onboarding → onboardingStore → localStorage
                                     ↓
Halaman result → baca onboardingStore → scoring.ts + allocation.ts (pure, sinkron)
              → simulationStore menggerakkan update slider real-time (tanpa API call)
```

**Setelah login:**
```
CTA "Simpan Hasil" → alur login/daftar
                   → authStore.user terisi
                   → upsert onboardingStore → Supabase wedding_profiles
                     (INSERT ON CONFLICT user_id DO UPDATE — satu profil per user)
                   → bersihkan localStorage
                   → redirect ke /dashboard
```

**User sudah login mengunjungi `/result` langsung:**
- Cek `onboardingStore` dulu (localStorage)
- Jika kosong, ambil `wedding_profiles` dari Supabase dan isi `onboardingStore`
- Jika keduanya kosong → redirect `/onboarding` + toast

---

## Logika Bisnis (Pure Functions, Sisi Client)

### Scoring — `lib/scoring.ts`

Alokasi selalu dihitung terlebih dahulu. Scoring menerima hasil alokasi sebagai input tambahan agar bisa mengecek `emergencyFundPercentage`.

Input: `{ totalBudget, guestCount, weddingStyle, planningPriority, weddingCity, allocation: AllocationResult }`
Output: `{ score: number, label: 'High Risk' | 'Moderate' | 'Healthy' }`

```ts
score = 100
budgetPerTamu = totalBudget / guestCount
emergencyFundPercentage = allocation.emergencyFund.percentage  // dari hasil alokasi

if (budgetPerTamu < 120_000) score -= 25
if (weddingStyle === 'luxury' && totalBudget < 100_000_000) score -= 20
if (weddingStyle === 'elegant' && budgetPerTamu < 180_000) score -= 10
if (guestCount > 800) score -= 10
if (planningPriority === 'hemat') score += 5
if (emergencyFundPercentage < 10) score -= 10

score *= cityMultiplier  // Tier A: 1.25, Tier B: 1.0, Tier C: 0.85
score = clamp(score, 0, 100)

label: 0–39 → 'High Risk', 40–69 → 'Moderate', 70–100 → 'Healthy'
```

Urutan pemanggilan: `allocation = calculateAllocation(input)` → `result = calculateScore({ ...input, allocation })`

### Alokasi Budget — `lib/allocation.ts`

Input: `{ totalBudget, guestCount, weddingStyle, planningPriority }`
Output: `Record<kategori, { percentage: number, estimatedAmount: number }>`

Kategori dengan rentang dinamis:
- Katering: 35–50%
- Venue: 15–25%
- Dekorasi: 10–20%
- Dokumentasi: 5–10%
- MUA: 3–8%
- Souvenir: 3–7%
- Hiburan: 2–8%
- Dana Darurat: 5–15%

Persentase menyesuaikan berdasarkan `weddingStyle` dan `planningPriority`. Mengembalikan persentase dan estimasi nominal IDR.

### Tier Kota — `lib/cityTiers.ts`

```ts
Tier A (×1.25): Jakarta, Surabaya, Bandung
Tier B (×1.00): Batam, Jogja, Solo, Medan
Tier C (×0.85): kota-kota lainnya
```

### Engine Insight — `lib/insights.ts`

Input: hasil alokasi + data onboarding
Output: `Insight[]` — 3–5 kartu, berbasis aturan, nada suportif

Contoh aturan:
- `cateringPercentage > 45` → peringatan katering mendominasi
- `emergencyFundPercentage < 10` → dana darurat rendah
- `weddingStyle === 'luxury' && totalBudget < 100_000_000` → ketidaksesuaian gaya/budget
- `guestCount > 700` → tekanan jumlah tamu tinggi

Nada: suportif, tidak menghakimi, tanpa bahasa yang menakutkan.

---

## Halaman-Halaman

### `/` — Landing Page

Bagian-bagian (SSR, tidak perlu interaktivitas):
1. **Hero** — headline, subheadline, CTA utama → `/onboarding`, CTA sekunder → simulasi preview
2. **Kartu Pain Emosional** — 4–6 kartu dengan ikon + teks singkat
3. **Fitur Unggulan** — 4 kartu fitur
4. **Preview Simulasi** — perbandingan sebelum/sesudah (statis, tanpa JS)
5. **CTA Final** — kartu emosional besar → `/onboarding`

Tombol CTA sticky mengambang di bawah layar pada tampilan mobile.

### `/onboarding` — Multi-Step (Gaya Kuis)

Progress bar di atas. Satu pertanyaan/grup per layar. Transisi slide mulus antar langkah. Tombol "Lanjut →" sticky di bawah. Tombol kembali di kiri atas.

Urutan layar:
1. Nama pasangan (2 input teks)
2. Kota pernikahan (select dengan hint tier)
3. Tanggal rencana (date picker)
4. Total budget (input mata uang + contoh helper)
5. Jumlah tamu (input angka + helper)
6. Gaya pernikahan (kartu pilihan: simple / elegant / luxury / traditional / modern)
7. Jenis acara + prioritas perencanaan (kartu pilihan)

Auto-save ke `onboardingStore` setiap "Lanjut". Setelah langkah 7 selesai → navigasi ke `/result`.

Error: Jika user membuka `/result` dengan data tidak lengkap → redirect `/onboarding` + toast.

### `/result` — Halaman Hasil (Layout B — Narasi Mengalir)

1. **Score Hero** — bg gradient (`#F5E8EC` → `#EDD6DE`), angka score besar (52px), badge label kesiapan, kutipan emosional
2. **Kartu Tekanan Budget** — badge level tekanan (Low/Medium/High), kategori terbesar, insight peringatan
3. **Chart Alokasi** — pie/donut chart Recharts, lazy-loaded, skeleton placeholder saat loading
4. **Smart Insights** — 3–5 kartu insight, berbasis aturan
5. **Bagian Simulasi** — slider jumlah tamu + switcher gaya pernikahan → update real-time score/tekanan/chart/insight via `simulationStore`
6. **Premium Tease** — 3 kartu terkunci (Simulasi Tak Terbatas, Timeline Planner, Insight Lanjutan) + CTA "Unlock Full Planner"
7. **CTA Sticky** — "Simpan Hasil Ini" → trigger alur auth

### `/dashboard` — Dashboard Minimal (SSR)

Wajib login via middleware. Server Component mengambil `wedding_profiles` dari Supabase.

Bagian-bagian:
- Kartu ringkasan kesiapan (score + label)
- Hitung mundur pernikahan (sisa hari)
- Highlight risiko finansial terbesar
- Ringkasan budget (3 kategori teratas)
- Shortcut simulasi cepat → `/result`

Empty state: kartu suportif + CTA → `/onboarding`.

### `/auth/login` & `/auth/signup`

Supabase Auth — Google OAuth + email/password. Setelah berhasil: sinkronkan data localStorage → Supabase → redirect `/dashboard`.

Error: toast "Login gagal. Silakan coba lagi." — tetap di halaman yang sama.

---

## Skema Database

### `wedding_profiles`

```sql
CREATE TABLE wedding_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_one_name TEXT,
  partner_two_name TEXT,
  wedding_city TEXT,
  city_tier TEXT CHECK (city_tier IN ('A', 'B', 'C')),
  wedding_date DATE,
  total_budget BIGINT,
  guest_count INTEGER,
  wedding_style TEXT,
  event_type TEXT,
  planning_priority TEXT,
  readiness_score INTEGER,
  pressure_level TEXT,
  allocation_result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE wedding_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pengguna hanya bisa akses data miliknya"
  ON wedding_profiles FOR ALL
  USING (user_id = auth.uid());
```

### `simulations`

```sql
CREATE TABLE simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_count INTEGER,
  wedding_style TEXT,
  generated_score INTEGER,
  pressure_level TEXT,
  allocation_snapshot JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pengguna hanya bisa akses simulasi miliknya"
  ON simulations FOR ALL
  USING (user_id = auth.uid());
```

---

## State Loading & Error

**Loading:**
- Chart Recharts → skeleton card dengan animasi pulse
- Data dashboard → skeleton cards
- Tidak ada spinner fullscreen

**Error:**
- Onboarding tidak lengkap → redirect `/onboarding` + toast
- Gagal auth → toast, tetap di halaman
- Dashboard kosong → kartu empty state yang suportif

---

## Performa

- Landing page: SSR, tanpa client JS untuk konten statis
- Chart: lazy-loaded dengan `dynamic(() => import(...), { ssr: false })`
- Simulasi: pure functions (sinkron, tanpa jaringan)
- Font: `next/font` dengan `display: swap`
- Gambar: `next/image` dengan WebP
- Tidak menggunakan library animasi berat — hanya CSS transitions

---

## Alur Auth

```
Landing → /onboarding → /result → "Simpan Hasil" → /auth/login → /dashboard
                                                  ↓
                                    (sinkron localStorage → Supabase)
```

Login tidak pernah diwajibkan sebelum onboarding atau melihat hasil.

---

## Di Luar Scope MVP

- Integrasi pembayaran
- Marketplace vendor
- Chatbot AI / integrasi WhatsApp
- Kolaborasi / multi-user
- Export (PDF/Excel)
- Pelacakan pengeluaran lanjutan
- Notifikasi push
- Panel admin
