# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign HeroSection, PainCards, dan FeatureShowcase menjadi layout "Hangat & Produk-Sentris" — hero single-column dengan phone mockup besar di tengah, pain cards 4 item dengan tanda tanya, dan fitur ditampilkan via tab interaktif dengan screenshot riil.

**Architecture:** Tiga komponen diubah (`HeroSection`, `PainCards`, `FeatureShowcase`). Semua komponen lain (`Navbar`, `HowItWorks`, `PricingSection`, `FAQSection`, `Footer`, `FloatingWhatsApp`) tidak diubah. HeroSection dan FeatureShowcase adalah Client Components karena menggunakan `useState`.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS (custom tokens: `nikah-bg`, `nikah-deep`, `nikah-mauve`, `nikah-text`, `nikah-muted`, `nikah-border`), Next.js `<Image>` component.

---

## File Structure

| File | Tindakan |
|------|----------|
| `src/components/landing/HeroSection.tsx` | Rewrite — single-column center, phone mockup besar |
| `src/components/landing/PainCards.tsx` | Edit — 4 item dengan `?` di tiap kalimat |
| `src/components/landing/FeatureShowcase.tsx` | Rewrite — 4-tab interaktif dengan screenshot slot |

---

## Task 1: Rewrite HeroSection

**Files:**
- Modify: `src/components/landing/HeroSection.tsx`

**Design:**
- Layout: single-column, `text-center`, `max-w-sm mx-auto`
- Background: `bg-gradient-to-b from-[#F5E8EC] via-[#EDD6DE] to-nikah-bg`
- Padding: `pt-28 pb-16` (clearance navbar 52px + ruang napas)
- 2 decorative blur blobs (kiri-atas, kanan-bawah)
- Phone mockup component `PhoneMockup` terpisah dalam file yang sama
- Sticky mobile CTA (fixed bottom, hidden md+) dipertahankan

- [ ] **Step 1: Tulis ulang `src/components/landing/HeroSection.tsx` dengan kode berikut**

```tsx
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

function PhoneMockup() {
  const [loaded, setLoaded] = useState(false)
  const [error, setError]   = useState(false)

  return (
    <div className="inline-block">
      <div className="bg-nikah-text rounded-[32px] p-1.5 shadow-[0_20px_60px_rgba(107,53,69,0.35)]">
        <div className="bg-nikah-bg rounded-[28px] overflow-hidden w-[200px]">

          {/* Status bar */}
          <div className="bg-nikah-deep px-3 py-2 flex items-center justify-between">
            <span className="text-white text-[8px] font-bold">BudgetNikah</span>
            <span className="text-white/50 text-[7px]" aria-hidden="true">9:41</span>
          </div>

          {/* Score area */}
          <div className="relative h-[220px] bg-gradient-to-b from-[#F5E8EC] to-[#EDD6DE]">
            {!error && (
              <Image
                src="/images/preview-result.png"
                alt="Screenshot hasil analisis BudgetNikah"
                fill
                className={`object-cover object-top transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
              />
            )}
            {(!loaded || error) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-[48px] font-extrabold text-nikah-deep leading-none">73</div>
                <div className="text-[7px] font-bold tracking-widest text-nikah-mauve uppercase mt-1 mb-1.5">
                  Wedding Readiness Score
                </div>
                <span className="inline-block text-[8px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                  Healthy
                </span>
              </div>
            )}
          </div>

          {/* Stat row */}
          <div className="flex border-t border-nikah-border">
            {[
              { val: '4,6jt',  lbl: 'nabung/bln' },
              { val: '18/50',  lbl: 'checklist'  },
              { val: 'Medium', lbl: 'tekanan'     },
            ].map((s, i) => (
              <div
                key={s.lbl}
                className={`flex-1 px-1 py-2 text-center ${i < 2 ? 'border-r border-nikah-border' : ''}`}
              >
                <div className="text-[10px] font-extrabold text-nikah-deep leading-none">{s.val}</div>
                <div className="text-[6px] text-nikah-muted mt-0.5">{s.lbl}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden bg-gradient-to-b from-[#F5E8EC] via-[#EDD6DE] to-nikah-bg pt-28 pb-16 px-6 text-center"
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#EDD6DE]/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#E8C0CC]/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-sm mx-auto flex flex-col items-center">

        <p className="text-[10px] font-bold uppercase tracking-widest text-nikah-mauve mb-3">
          Wedding Financial Planner · Indonesia
        </p>

        <h1 className="text-3xl md:text-4xl font-extrabold text-nikah-text leading-tight mb-4">
          Cek Apakah Rencana Weddingmu Sudah Realistis.
        </h1>

        <p className="text-sm md:text-base text-nikah-muted font-light leading-relaxed mb-8 max-w-xs">
          Dapat Wedding Readiness Score, estimasi budget riil, dan rencana nabung — dalam 2 menit.
        </p>

        <div className="mb-8">
          <PhoneMockup />
        </div>

        <Link
          href="/onboarding"
          className="w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center shadow-lg hover:opacity-90 active:scale-95 transition-all mb-3"
        >
          Cek Sekarang — Gratis →
        </Link>
        <p className="text-xs text-nikah-muted">Tanpa login · Selesai 2 menit</p>

      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-4 bg-white/90 backdrop-blur border-t border-nikah-border">
        <Link
          href="/onboarding"
          className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center"
        >
          Cek Sekarang — Gratis →
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Cek TypeScript**

```bash
npx tsc --noEmit
```

Expected: tidak ada error.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/HeroSection.tsx
git commit -m "redesign: HeroSection — single-column, phone mockup centered"
```

---

## Task 2: Update PainCards

**Files:**
- Modify: `src/components/landing/PainCards.tsx`

Hanya 2 perubahan: (1) kurangi dari 6 ke 4 item, (2) tambah `?` di tiap kalimat.

- [ ] **Step 1: Ganti isi `src/components/landing/PainCards.tsx` dengan kode berikut**

```tsx
const PAINS = [
  { icon: '😰', text: 'Takut overbudget sebelum hari H?' },
  { icon: '😵', text: 'Bingung harus mulai dari mana?' },
  { icon: '💸', text: 'Biaya terus membengkak tanpa kontrol?' },
  { icon: '😟', text: 'Takut persiapan berantakan di hari H?' },
]

export function PainCards() {
  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-2">
          Kamu tidak sendirian
        </p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-nikah-text mb-2">
          Banyak pasangan merasakan hal yang sama
        </h2>
        <p className="text-center text-nikah-muted text-sm md:text-base mb-10 font-light">
          Perencanaan wedding memang overwhelming — sampai kamu punya angka yang jelas.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {PAINS.map((p) => (
            <div
              key={p.text}
              className="bg-nikah-bg border border-nikah-border rounded-2xl p-5 flex flex-col items-center gap-3 text-center hover:shadow-md hover:border-[#E8C0CC] transition-all"
            >
              <span className="text-3xl" aria-hidden="true">{p.icon}</span>
              <p className="text-sm md:text-base font-medium text-nikah-text leading-snug">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Cek TypeScript**

```bash
npx tsc --noEmit
```

Expected: tidak ada error.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/PainCards.tsx
git commit -m "redesign: PainCards — 4 items with question marks"
```

---

## Task 3: Rewrite FeatureShowcase

**Files:**
- Modify: `src/components/landing/FeatureShowcase.tsx`

4 tab: Score / Tabungan / Checklist / Seserahan. Setiap tab: eyebrow + judul + deskripsi + 3 bullets + screenshot card dengan slot gambar. `ScreenshotSlot` component menangani image load/error state.

- [ ] **Step 1: Tulis ulang `src/components/landing/FeatureShowcase.tsx` dengan kode berikut**

```tsx
'use client'
import Image from 'next/image'
import { useState } from 'react'

const TABS = [
  {
    id:              'score',
    label:           '📊 Score',
    eyebrow:         'Fitur Utama',
    title:           'Wedding Readiness Score',
    description:     'Tidak perlu tebak-tebak lagi. Masukkan data weddingmu, dapat angka 0–100 yang jelas kenapa segitu — bukan angka random.',
    bullets:         ['Deterministik & explainable', 'Breakdown per faktor', 'Update real-time saat simulasi'],
    imageSrc:        '/images/feature-score.png',
    imageAlt:        'Screenshot Wedding Readiness Score',
    screenshotTitle: 'Hasil Analisis',
  },
  {
    id:              'tabungan',
    label:           '💰 Tabungan',
    eyebrow:         'Tracker Keuangan',
    title:           'Tabungan Nikah',
    description:     'Pantau progress tabungan dan tahu harus nabung berapa per bulan supaya target tercapai tepat waktu.',
    bullets:         ['Target otomatis dari total budget', 'Progress bar visual', 'Kalkulasi sisa bulan'],
    imageSrc:        '/images/feature-tabungan.png',
    imageAlt:        'Screenshot Tabungan Nikah',
    screenshotTitle: 'Tabungan Nikah',
  },
  {
    id:              'checklist',
    label:           '✅ Checklist',
    eyebrow:         'Timeline Persiapan',
    title:           'Checklist 50+ Item',
    description:     'Timeline dari 12 bulan sampai H-1 minggu. Tidak ada yang terlewat.',
    bullets:         ['Diurutkan per fase waktu', 'Centang satu per satu', 'Filter per timeline'],
    imageSrc:        '/images/feature-checklist.png',
    imageAlt:        'Screenshot Checklist Pernikahan',
    screenshotTitle: 'Checklist Pernikahan',
  },
  {
    id:              'seserahan',
    label:           '💍 Seserahan',
    eyebrow:         'Daftar Seserahan',
    title:           'Seserahan List',
    description:     'Semua item seserahan dalam satu daftar lengkap, dengan status sudah/belum untuk tiap item.',
    bullets:         ['20+ item default', 'Tandai sudah/belum', 'Ringkasan progress'],
    imageSrc:        '/images/feature-seserahan.png',
    imageAlt:        'Screenshot Seserahan List',
    screenshotTitle: 'Daftar Seserahan',
  },
]

function ScreenshotSlot({
  src, alt, title,
}: {
  src:   string
  alt:   string
  title: string
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError]   = useState(false)

  return (
    <div className="border border-nikah-border rounded-2xl overflow-hidden shadow-md bg-white">
      <div className="bg-nikah-deep px-4 py-2.5">
        <span className="text-white text-[10px] font-bold">{title}</span>
      </div>
      <div className="relative h-[200px] bg-gradient-to-b from-[#F5E8EC] to-[#EDD6DE]">
        {!error && (
          <Image
            src={src}
            alt={alt}
            fill
            className={`object-cover object-top transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}
        {(!loaded || error) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center px-4">
            <div className="text-xs font-bold text-nikah-deep">{title}</div>
            <div className="text-[10px] text-nikah-muted">{alt}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export function FeatureShowcase() {
  const [active, setActive] = useState(0)
  const tab = TABS[active]

  return (
    <section id="fitur" className="px-6 py-20 bg-nikah-bg">
      <div className="max-w-lg mx-auto">

        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve text-center mb-2">
          Semua dalam satu tempat
        </p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-nikah-text text-center mb-8">
          Yang kamu dapat
        </h2>

        {/* Tab strip */}
        <div className="flex bg-white border border-nikah-border rounded-full p-1 mb-8 gap-1">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={`flex-1 py-2 px-1 rounded-full text-[11px] font-semibold transition-all ${
                active === i
                  ? 'bg-nikah-deep text-white'
                  : 'text-nikah-muted hover:text-nikah-text'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab panel */}
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-nikah-mauve mb-2">
              {tab.eyebrow}
            </p>
            <h3 className="text-xl font-extrabold text-nikah-text mb-3">{tab.title}</h3>
            <p className="text-sm text-nikah-muted font-light leading-relaxed mb-5">
              {tab.description}
            </p>
            <ul className="space-y-2" aria-label={`Fitur ${tab.title}`}>
              {tab.bullets.map(b => (
                <li key={b} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full bg-nikah-deep flex-shrink-0 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-nikah-text">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <ScreenshotSlot src={tab.imageSrc} alt={tab.imageAlt} title={tab.screenshotTitle} />
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 2: Cek TypeScript**

```bash
npx tsc --noEmit
```

Expected: tidak ada error.

- [ ] **Step 3: Verifikasi visual di browser**

```bash
npm run dev
```

Buka `http://localhost:3000`. Cek:
- Hero: phone mockup besar di tengah, teks di atas dan bawah
- Pain: 4 kartu, tiap kalimat berakhiran `?`
- Fitur: tab strip, klik tiap tab → konten berganti, screenshot slot muncul
- Navbar dan WhatsApp button tetap ada

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/FeatureShowcase.tsx
git commit -m "redesign: FeatureShowcase — 4-tab interactive with screenshot slots"
```
