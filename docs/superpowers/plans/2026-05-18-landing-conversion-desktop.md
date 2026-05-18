# Landing Page Desktop Conversion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Perbaiki 8 titik friction konversi di landing page desktop tanpa menyentuh mobile, flow payment, atau logic scoring.

**Architecture:** Semua perubahan di `src/components/landing/` + 1 entri di `src/app/page.tsx`. Satu file baru: `SocialProof.tsx`. Tidak ada perubahan store, API, atau test yang sudah ada.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Jest, React Testing Library

**Spec:** `docs/superpowers/specs/2026-05-18-landing-conversion-desktop-design.md`

---

## File Map

| File | Action |
|---|---|
| `src/components/landing/SimulationPreview.tsx` | Modify — fix copy baris ~109 |
| `src/components/landing/FAQSection.tsx` | Modify — fix 1 jawaban di FAQS[2] |
| `src/components/landing/Navbar.tsx` | Modify — CTA href + teks |
| `src/components/landing/TrustMetrics.tsx` | Modify — METRICS array + heading |
| `src/components/landing/HowItWorks.tsx` | Modify — STEPS array + badge rendering |
| `src/components/landing/FeatureShowcase.tsx` | Modify — FEATURES array + badge rendering + micro-CTA |
| `src/components/landing/PricingSection.tsx` | Modify — dual CTA + guarantee strip, hapus footer note |
| `src/components/landing/SocialProof.tsx` | **Create** — komponen baru |
| `src/app/page.tsx` | Modify — tambah SocialProof antara SimulationPreview dan PricingSection |
| `src/components/landing/__tests__/landing-conversion.test.tsx` | **Create** — semua test baru |

---

## Task 1: SimulationPreview — fix copy yang mengimplikasikan slider

**Files:**
- Modify: `src/components/landing/SimulationPreview.tsx`
- Test: `src/components/landing/__tests__/landing-conversion.test.tsx`

- [ ] **Step 1: Buat test file, tulis failing test**

```tsx
// src/components/landing/__tests__/landing-conversion.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { SimulationPreview } from '../SimulationPreview'

describe('SimulationPreview', () => {
  it('tidak menggunakan kata "Geser" yang mengimplikasikan slider', () => {
    render(<SimulationPreview />)
    expect(screen.queryByText(/Geser/)).toBeNull()
  })

  it('menampilkan copy yang benar tanpa klaim interaktivitas', () => {
    render(<SimulationPreview />)
    expect(screen.getByText(/Dari 600 ke 350 tamu/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Jalankan test — pastikan GAGAL**

```bash
npm test -- --testPathPattern="landing-conversion" --runInBand
```

Expected output: 2 failures — `queryByText(/Geser/)` return non-null, `getByText(/Dari 600/)` throw.

- [ ] **Step 3: Update copy di SimulationPreview.tsx**

Tambah import di baris pertama jika belum ada:
```tsx
import Link from 'next/link'
```

Ganti `<p>` subtitle (sekitar baris 109):
```tsx
// Sebelum:
<p className="text-center text-nikah-muted font-light" style={{ fontSize: 17, lineHeight: 1.5, margin: '0 auto 56px', maxWidth: 640 }}>
  Geser jumlah tamu dari 600 ke 350. Skornya langsung berubah.
</p>

// Sesudah:
<p className="text-center text-nikah-muted font-light" style={{ fontSize: 17, lineHeight: 1.5, margin: '0 auto 56px', maxWidth: 640 }}>
  Dari 600 ke 350 tamu: skornya langsung berbeda.{' '}
  <Link href="/onboarding" className="font-semibold text-nikah-deep hover:underline">
    Coba dengan angkamu sendiri →
  </Link>
</p>
```

- [ ] **Step 4: Jalankan test — pastikan PASS**

```bash
npm test -- --testPathPattern="landing-conversion" --runInBand
```

Expected: 2 PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/SimulationPreview.tsx src/components/landing/__tests__/landing-conversion.test.tsx
git commit -m "fix: SimulationPreview copy — hapus 'Geser', tambah micro-CTA ke onboarding"
```

---

## Task 2: FAQ — perjelas jawaban post-payment

**Files:**
- Modify: `src/components/landing/FAQSection.tsx`
- Test: `src/components/landing/__tests__/landing-conversion.test.tsx`

- [ ] **Step 1: Tambah failing test (append ke file yang sudah ada)**

```tsx
import { FAQSection } from '../FAQSection'

describe('FAQSection', () => {
  it('jawaban "Bagaimana setelah bayar" dimulai dengan Langsung aktif', () => {
    render(<FAQSection />)
    // FAQ index 2 (ketiga) tidak terbuka secara default — perlu diklik
    const paymentQuestion = screen.getByText('Bagaimana setelah saya bayar?')
    fireEvent.click(paymentQuestion)
    expect(screen.getByText(/Langsung aktif\./)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Jalankan test — pastikan GAGAL**

```bash
npm test -- --testPathPattern="landing-conversion" --runInBand
```

Expected: 1 failure — "Langsung aktif" tidak ditemukan.

- [ ] **Step 3: Update jawaban FAQ di FAQSection.tsx**

Di array `FAQS`, ubah item ketiga (index 2):

```tsx
// Sebelum:
{
  q: 'Bagaimana setelah saya bayar?',
  a: 'Setelah pembayaran berhasil, ikuti instruksi dari halaman pembayaran untuk membuka akses. WhatsApp tetap tersedia jika kamu butuh bantuan.',
},

// Sesudah:
{
  q: 'Bagaimana setelah saya bayar?',
  a: 'Langsung aktif. Setelah pembayaran berhasil, kamu otomatis diarahkan ke dashboard — tidak ada langkah tambahan. Login dengan akun yang sama dan semua fitur langsung terbuka. WhatsApp kami tetap tersedia kalau ada pertanyaan.',
},
```

- [ ] **Step 4: Jalankan test — pastikan PASS**

```bash
npm test -- --testPathPattern="landing-conversion" --runInBand
```

Expected: semua test PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/FAQSection.tsx src/components/landing/__tests__/landing-conversion.test.tsx
git commit -m "fix: FAQ jawaban post-payment — 'Langsung aktif, otomatis ke dashboard'"
```

---

## Task 3: Navbar — CTA langsung ke /onboarding

**Files:**
- Modify: `src/components/landing/Navbar.tsx`
- Test: `src/components/landing/__tests__/landing-conversion.test.tsx`

- [ ] **Step 1: Tambah failing test**

```tsx
import { Navbar } from '../Navbar'

describe('Navbar', () => {
  it('CTA mengarah langsung ke /onboarding bukan ke #harga', () => {
    render(<Navbar />)
    const cta = screen.getByRole('link', { name: /Mulai Gratis/i })
    expect(cta).toHaveAttribute('href', '/onboarding')
  })
})
```

- [ ] **Step 2: Jalankan test — pastikan GAGAL**

```bash
npm test -- --testPathPattern="landing-conversion" --runInBand
```

Expected: FAIL — link "Mulai Gratis" tidak ditemukan.

- [ ] **Step 3: Update Navbar CTA**

Di `src/components/landing/Navbar.tsx`:

```tsx
// Pastikan import Link ada di baris pertama:
import Link from 'next/link'
import { BrandLogo } from '@/components/ui/BrandLogo'

// Ganti seluruh blok <div className="flex items-center"> di bagian CTA:

// Sebelum:
<div className="flex items-center">
  <a
    href="#harga"
    className="bg-nikah-deep text-white text-xs md:text-sm font-bold px-3 py-2 md:px-5 md:py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-sm whitespace-nowrap"
  >
    <span className="md:hidden">Akses</span>
    <span className="hidden md:inline">Dapatkan Akses</span>
  </a>
</div>

// Sesudah:
<div className="flex items-center">
  <Link
    href="/onboarding"
    className="bg-nikah-deep text-white text-xs md:text-sm font-bold px-3 py-2 md:px-5 md:py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-sm whitespace-nowrap"
  >
    Mulai Gratis →
  </Link>
</div>
```

- [ ] **Step 4: Jalankan test — pastikan PASS**

```bash
npm test -- --testPathPattern="landing-conversion" --runInBand
```

Expected: semua test PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/Navbar.tsx src/components/landing/__tests__/landing-conversion.test.tsx
git commit -m "fix: navbar CTA 'Mulai Gratis' langsung ke /onboarding"
```

---

## Task 4: TrustMetrics — ganti purchase signals dengan metric produk

**Files:**
- Modify: `src/components/landing/TrustMetrics.tsx`
- Test: `src/components/landing/__tests__/landing-conversion.test.tsx`

- [ ] **Step 1: Tambah failing test**

```tsx
import { TrustMetrics } from '../TrustMetrics'

describe('TrustMetrics', () => {
  it('tidak menampilkan teks garansi refund (sudah dipindah ke PricingSection)', () => {
    render(<TrustMetrics />)
    expect(screen.queryByText(/garansi refund/i)).toBeNull()
  })

  it('menampilkan metric 12 bulan coverage', () => {
    render(<TrustMetrics />)
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText(/bulan coverage/i)).toBeInTheDocument()
  })

  it('menampilkan heading yang baru', () => {
    render(<TrustMetrics />)
    expect(screen.getByText(/Kenapa BudgetNikah berbeda/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Jalankan test — pastikan GAGAL**

```bash
npm test -- --testPathPattern="landing-conversion" --runInBand
```

Expected: 3 FAIL.

- [ ] **Step 3: Update METRICS array dan heading**

Di `src/components/landing/TrustMetrics.tsx`, ganti seluruh `METRICS` array dan heading `<p>`:

```tsx
// Ganti METRICS:
const METRICS = [
  {
    value: '50+',
    label: 'checklist item',
    desc: 'Disusun mengikuti fase 12 bulan hingga H-1 minggu.',
  },
  {
    value: '6',
    label: 'kategori budget',
    desc: 'Catering, venue, dekor, dokumentasi, MUA, dan lainnya.',
  },
  {
    value: '12',
    label: 'bulan coverage',
    desc: 'Checklist dari H-12 bulan hingga H-1 minggu sebelum hari H.',
  },
  {
    value: '3',
    label: 'tier kota',
    desc: 'Jakarta, kota besar, kota kecil — scoring menyesuaikan lokasi.',
  },
]

// Ganti heading <p> di dalam komponen:
// Sebelum:
<p className="text-center text-xs font-extrabold uppercase tracking-widest text-nikah-mauve mb-3">
  Cara kerja yang transparan
</p>

// Sesudah:
<p className="text-center text-xs font-extrabold uppercase tracking-widest text-nikah-mauve mb-3">
  Kenapa BudgetNikah berbeda
</p>
```

- [ ] **Step 4: Jalankan test — pastikan PASS**

```bash
npm test -- --testPathPattern="landing-conversion" --runInBand
```

Expected: semua test PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/TrustMetrics.tsx src/components/landing/__tests__/landing-conversion.test.tsx
git commit -m "fix: TrustMetrics — ganti purchase signals dengan metric produk"
```

---

## Task 5: HowItWorks — badge free/paid tiap langkah

**Files:**
- Modify: `src/components/landing/HowItWorks.tsx`
- Test: `src/components/landing/__tests__/landing-conversion.test.tsx`

- [ ] **Step 1: Tambah failing test**

```tsx
import { HowItWorks } from '../HowItWorks'

describe('HowItWorks', () => {
  it('menampilkan badge Gratis di langkah 1 dan 2', () => {
    render(<HowItWorks />)
    const gratisBadges = screen.getAllByText('✓ Gratis')
    expect(gratisBadges).toHaveLength(2)
  })

  it('menampilkan badge Premium di langkah 3', () => {
    render(<HowItWorks />)
    expect(screen.getByText(/Fitur Premium · Rp 149rb/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Jalankan test — pastikan GAGAL**

```bash
npm test -- --testPathPattern="landing-conversion" --runInBand
```

Expected: 2 FAIL.

- [ ] **Step 3: Update HowItWorks — STEPS array + badge rendering**

Ganti seluruh isi `src/components/landing/HowItWorks.tsx`:

```tsx
const STEPS = [
  {
    number: '1',
    title: 'Isi profil wedding',
    description: 'Input nama, kota, tanggal, budget, dan jumlah tamu. Selesai dalam 2 menit.',
    badge: 'free' as const,
  },
  {
    number: '2',
    title: 'Lihat hasil analisis',
    description: 'Dapatkan Wedding Readiness Score dan alokasi budget riil per kategori dalam Rupiah.',
    badge: 'free' as const,
  },
  {
    number: '3',
    title: 'Rencanakan sampai hari H',
    description: 'Buka dashboard lengkap: Checklist 50+ item, Tabungan Nikah, dan Vendor Tracker untuk tetap on track sampai hari H.',
    badge: 'premium' as const,
  },
]

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="px-6 md:px-8 py-20 md:py-28 bg-nikah-bg">
      <div className="max-w-[1080px] mx-auto">
        <p className="text-xs font-extrabold uppercase tracking-widest text-nikah-mauve text-center mb-3" style={{ letterSpacing: '0.16em' }}>
          Cara Kerja
        </p>
        <h2
          className="text-[34px] md:text-[44px] text-nikah-text text-center mb-11 leading-tight"
          style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 500, letterSpacing: '-0.02em' } as React.CSSProperties}
        >
          Mulai dalam <em>3 langkah</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-[860px] mx-auto">
          {STEPS.map(step => (
            <div
              key={step.number}
              className="bg-white border border-nikah-border rounded-[20px]"
              style={{ padding: '32px 30px', boxShadow: '0 4px 16px rgba(90,30,42,0.035)' }}
            >
              <div
                className="text-nikah-mauve mb-5"
                style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 600, fontSize: 32, lineHeight: 1 }}
              >
                {step.number}.
              </div>
              <h3 className="text-base font-extrabold text-nikah-text mb-2">{step.title}</h3>
              <p className="text-sm text-nikah-muted font-light leading-relaxed">{step.description}</p>
              {step.badge === 'free' && (
                <span
                  className="inline-flex items-center gap-1 mt-3 text-[10px] font-extrabold uppercase tracking-wide rounded-full px-2.5 py-1"
                  style={{ background: '#EEF7EE', border: '1px solid #C8E6C9', color: '#2F7A3F' }}
                >
                  ✓ Gratis
                </span>
              )}
              {step.badge === 'premium' && (
                <span
                  className="inline-flex items-center gap-1 mt-3 text-[10px] font-extrabold uppercase tracking-wide rounded-full px-2.5 py-1"
                  style={{ background: '#FBF2EC', border: '1px solid #E8D0C0', color: '#8B4513' }}
                >
                  🔓 Fitur Premium · Rp 149rb
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Jalankan test — pastikan PASS**

```bash
npm test -- --testPathPattern="landing-conversion" --runInBand
```

Expected: semua test PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/HowItWorks.tsx src/components/landing/__tests__/landing-conversion.test.tsx
git commit -m "feat: HowItWorks badge free/paid — langkah 3 eksplisit premium"
```

---

## Task 6: FeatureShowcase — badge free/paid + micro-CTA

**Files:**
- Modify: `src/components/landing/FeatureShowcase.tsx`
- Test: `src/components/landing/__tests__/landing-conversion.test.tsx`

- [ ] **Step 1: Tambah failing test**

```tsx
import { FeatureShowcase } from '../FeatureShowcase'

describe('FeatureShowcase', () => {
  it('Wedding Readiness Score adalah satu-satunya fitur gratis', () => {
    render(<FeatureShowcase />)
    const gratisBadges = screen.getAllByText('✓ Gratis')
    expect(gratisBadges).toHaveLength(1)
  })

  it('fitur premium minimal 5 badge', () => {
    render(<FeatureShowcase />)
    const premiumBadges = screen.getAllByText('🔓 Premium')
    expect(premiumBadges.length).toBeGreaterThanOrEqual(5)
  })

  it('menampilkan micro-CTA untuk coba gratis', () => {
    render(<FeatureShowcase />)
    expect(screen.getByText(/dicoba sekarang/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Jalankan test — pastikan GAGAL**

```bash
npm test -- --testPathPattern="landing-conversion" --runInBand
```

Expected: 3 FAIL.

- [ ] **Step 3: Update FeatureShowcase.tsx**

Ganti seluruh isi file:

```tsx
import React from 'react'
import Link from 'next/link'

const FEATURES = [
  {
    tier: 'free' as const,
    title: 'Wedding Readiness Score',
    desc: 'Skor deterministik 0–100 yang menjelaskan kenapa segitu — bukan angka random.',
  },
  {
    tier: 'paid' as const,
    title: 'Prioritas Sekarang',
    desc: 'Gabungan deadline vendor dan checklist terdekat, jadi kamu tahu harus mulai dari mana.',
  },
  {
    tier: 'paid' as const,
    title: 'Pembayaran Vendor',
    desc: 'Pantau DP, sisa bayar, dan deadline pelunasan dalam satu tempat.',
  },
  {
    tier: 'paid' as const,
    title: 'Target Nabung Bulanan',
    desc: 'Tahu nominal yang perlu disiapkan tiap bulan agar siap di hari H.',
  },
  {
    tier: 'paid' as const,
    title: 'Checklist + Catatan',
    desc: 'Timeline 50+ item dan tempat mencatat keputusan penting.',
  },
  {
    tier: 'paid' as const,
    title: 'Seserahan Custom',
    desc: 'Atur daftar seserahan sesuai kebutuhan dan kebiasaan keluarga kalian.',
  },
]

export function FeatureShowcase() {
  return (
    <section id="fitur" className="px-6 md:px-8 py-20 md:py-28 bg-white">
      <div className="max-w-[1080px] mx-auto">
        <p className="text-xs font-extrabold uppercase tracking-widest text-nikah-mauve text-center mb-3">
          Semua dalam satu tempat
        </p>
        <h2
          className="text-[34px] md:text-[44px] text-nikah-text text-center mb-11 leading-tight"
          style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 500, textWrap: 'balance' } as React.CSSProperties}
        >
          Yang <em>kamu dapat</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="bg-white border border-nikah-border rounded-[18px] hover:-translate-y-0.5 transition-all duration-200"
              style={{ padding: '26px 24px', boxShadow: '0 1px 2px rgba(90,30,42,0.035)' }}
            >
              <p
                className={`inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider mb-5 ${
                  f.tier === 'free' ? 'text-[#2F7A3F]' : 'text-nikah-mauve'
                }`}
                style={{ background: f.tier === 'free' ? '#EEF7EE' : 'var(--landing-pink, #FBECEF)' }}
              >
                {f.tier === 'free' ? '✓ Gratis' : '🔓 Premium'}
              </p>
              <h3 className="text-base font-extrabold text-nikah-text mb-2">{f.title}</h3>
              <p className="text-sm text-nikah-muted leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-nikah-muted mt-8">
          Wedding Readiness Score bisa{' '}
          <Link href="/onboarding" className="text-nikah-deep font-semibold hover:underline">
            dicoba sekarang — gratis, tanpa daftar.
          </Link>
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Jalankan test — pastikan PASS**

```bash
npm test -- --testPathPattern="landing-conversion" --runInBand
```

Expected: semua test PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/FeatureShowcase.tsx src/components/landing/__tests__/landing-conversion.test.tsx
git commit -m "feat: FeatureShowcase badge free/paid + micro-CTA coba gratis"
```

---

## Task 7: PricingSection — dual CTA + guarantee strip

**Files:**
- Modify: `src/components/landing/PricingSection.tsx`
- Test: `src/components/landing/__tests__/landing-conversion.test.tsx`

- [ ] **Step 1: Tambah failing test**

```tsx
import { PricingSection } from '../PricingSection'

describe('PricingSection', () => {
  it('primary CTA mengarah ke /onboarding (untuk user yang mau coba dulu)', () => {
    render(<PricingSection />)
    const primaryCta = screen.getByRole('link', { name: /Mulai Sekarang — Gratis/i })
    expect(primaryCta).toHaveAttribute('href', '/onboarding')
  })

  it('secondary CTA mengarah ke /premium (untuk user yang langsung beli)', () => {
    render(<PricingSection />)
    const secondaryCta = screen.getByRole('link', { name: /Langsung Beli/i })
    expect(secondaryCta).toHaveAttribute('href', '/premium')
  })

  it('menampilkan guarantee strip 3 hari tanpa pertanyaan', () => {
    render(<PricingSection />)
    expect(screen.getByText(/3 hari tanpa pertanyaan/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Jalankan test — pastikan GAGAL**

```bash
npm test -- --testPathPattern="landing-conversion" --runInBand
```

Expected: 3 FAIL.

- [ ] **Step 3: Update PricingSection.tsx**

Ganti seluruh isi file:

```tsx
import Link from 'next/link'

const WHAT_YOU_GET = [
  { label: 'Tahu prioritas yang harus dibereskan dulu', note: 'tugas dan deadline paling dekat' },
  { label: 'Tidak lupa DP dan pelunasan vendor',        note: 'sisa bayar dan jatuh tempo lebih jelas' },
  { label: 'Target nabung bulanan lebih kebaca',        note: 'progress tabungan sampai hari H' },
  { label: 'Checklist 50+ item agar tidak ada yang kelewat', note: '12 bulan hingga H-1 minggu' },
  { label: 'Keputusan penting tidak tercecer',          note: 'catatan, reminder, dan ide dalam dashboard' },
  { label: 'Budget per kategori lebih terkendali',      note: 'benchmark agar tidak kebablasan' },
]

export function PricingSection() {
  return (
    <section className="px-6 md:px-8 py-20 md:py-28 bg-white" id="harga">
      <div className="max-w-[1080px] mx-auto">

        <p className="text-xs font-extrabold uppercase tracking-widest text-nikah-mauve text-center mb-3">
          Sekali bayar, akses seumur hidup
        </p>
        <h2
          className="text-[34px] md:text-[46px] text-nikah-text text-center mb-10 leading-tight"
          style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 500, letterSpacing: '-0.025em', textWrap: 'balance' } as React.CSSProperties}
        >
          Pegangan kecil untuk keputusan nikah yang <em>besar</em>
        </h2>

        <div className="max-w-[760px] mx-auto">
          <div
            className="bg-white rounded-[24px] relative overflow-hidden"
            style={{ padding: '36px 36px 30px', border: '1px solid color-mix(in srgb, var(--landing-deep, #6B3545) 42%, var(--landing-border, #EDE4E6))', boxShadow: '0 12px 34px rgba(90,30,42,0.06)' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[0.78fr_1fr] md:items-center" style={{ gap: 28 }}>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-nikah-mauve mb-3">Akses Seumur Hidup</p>
                <div className="text-nikah-deep mb-1" style={{ fontFamily: 'var(--font-playfair), "Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontSize: 46, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  Rp 149rb
                </div>
                <p className="text-nikah-muted text-sm font-light">Bayar sekali · Pakai sampai hari H</p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/onboarding"
                  className="inline-flex w-full items-center justify-center bg-nikah-deep text-white font-extrabold rounded-full text-sm text-center transition-colors active:scale-95 hover:opacity-90"
                  style={{ padding: '16px 28px', boxShadow: '0 6px 16px rgba(107,53,69,0.14)' }}
                >
                  Mulai Sekarang — Gratis →
                </Link>
                <a
                  href="/premium"
                  className="inline-flex w-full items-center justify-center bg-white border border-nikah-border text-nikah-deep font-semibold rounded-full text-sm text-center transition-colors active:scale-95 hover:bg-nikah-bg"
                  style={{ padding: '12px 28px' }}
                >
                  Langsung Beli Akses Premium
                </a>
              </div>
            </div>

            <div className="border-t border-nikah-border" style={{ margin: '30px 0 24px' }} />

            <ul className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '12px 24px' }}>
              {WHAT_YOU_GET.map(item => (
                <li key={item.label} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#E8F4E8] flex-shrink-0 flex items-center justify-center mt-0.5" aria-hidden="true">
                    <svg className="w-2.5 h-2.5 text-[#2F7A3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-nikah-text">{item.label}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div
              className="flex items-center justify-center gap-2 rounded-[10px] mt-5"
              style={{ background: '#F0FAF0', border: '1px solid #C8E6C9', color: '#2F6B3A', padding: '10px 16px', fontSize: 13, fontWeight: 600 }}
            >
              🛡️ 3 hari tanpa pertanyaan — tidak cocok? Uang kembali penuh.
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 4: Jalankan test — pastikan PASS**

```bash
npm test -- --testPathPattern="landing-conversion" --runInBand
```

Expected: semua test PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/PricingSection.tsx src/components/landing/__tests__/landing-conversion.test.tsx
git commit -m "feat: PricingSection dual CTA + guarantee strip 3 hari tanpa pertanyaan"
```

---

## Task 8: SocialProof — buat komponen baru + register di page.tsx

**Files:**
- Create: `src/components/landing/SocialProof.tsx`
- Modify: `src/app/page.tsx`
- Test: `src/components/landing/__tests__/landing-conversion.test.tsx`

- [ ] **Step 1: Tambah failing test**

```tsx
import { SocialProof } from '../SocialProof'

describe('SocialProof', () => {
  it('menampilkan heading launching', () => {
    render(<SocialProof />)
    expect(screen.getByText(/Jadilah pasangan pertama yang tahu/i)).toBeInTheDocument()
  })

  it('menampilkan copy Option A (tidak ada klaim kompetitif)', () => {
    render(<SocialProof />)
    expect(screen.getByText(/spreadsheet terasa terlalu kering/i)).toBeInTheDocument()
  })

  it('trust strip menampilkan garansi 3 hari', () => {
    render(<SocialProof />)
    expect(screen.getByText(/3 hari tanpa pertanyaan/i)).toBeInTheDocument()
  })

  it('CTA mengarah ke /onboarding', () => {
    render(<SocialProof />)
    const cta = screen.getByRole('link', { name: /Coba Gratis Dulu/i })
    expect(cta).toHaveAttribute('href', '/onboarding')
  })
})
```

- [ ] **Step 2: Jalankan test — pastikan GAGAL**

```bash
npm test -- --testPathPattern="landing-conversion" --runInBand
```

Expected: 4 FAIL — modul `SocialProof` tidak ditemukan.

- [ ] **Step 3: Buat SocialProof.tsx**

Buat file baru `src/components/landing/SocialProof.tsx`:

```tsx
import Link from 'next/link'

const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

export function SocialProof() {
  return (
    <section className="px-6 md:px-8 py-20 md:py-24 bg-nikah-bg">
      <div className="max-w-[600px] mx-auto text-center">
        <p className="text-xs font-extrabold uppercase tracking-widest text-nikah-mauve mb-3">
          Baru Launching
        </p>
        <h2
          className="text-[32px] md:text-[42px] text-nikah-text leading-tight mb-4"
          style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, letterSpacing: '-0.02em' }}
        >
          Jadilah pasangan pertama yang tahu.
        </h2>
        <p className="text-nikah-muted font-light leading-relaxed mb-8" style={{ fontSize: 16, lineHeight: 1.7 }}>
          BudgetNikah baru saja hadir. Kami membangunnya karena spreadsheet terasa terlalu kering, tapi aplikasi lain tidak bicara dalam konteks Indonesia. Kalau kamu sudah sampai di sini — selamat datang, kita mulai dari tempat yang sama.
        </p>
        <div className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-nikah-muted mb-8">
          <span>🛡️ <strong className="text-nikah-text font-semibold">3 hari tanpa pertanyaan</strong></span>
          <span aria-hidden="true" className="text-nikah-border hidden sm:inline">·</span>
          <span>✓ <strong className="text-nikah-text font-semibold">Bayar sekali, selamanya</strong></span>
          <span aria-hidden="true" className="text-nikah-border hidden sm:inline">·</span>
          <span>✓ <strong className="text-nikah-text font-semibold">Tanpa subscription</strong></span>
        </div>
        <Link
          href="/onboarding"
          className="inline-flex items-center justify-center bg-nikah-deep text-white font-bold rounded-full hover:opacity-90 active:scale-95 transition-all"
          style={{ gap: 6, padding: '16px 28px', fontSize: 14, boxShadow: '0 8px 18px rgba(107,53,69,0.18)' }}
        >
          Coba Gratis Dulu →
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Daftarkan di page.tsx**

Di `src/app/page.tsx`, tambah import dan sisipkan komponen:

```tsx
// Tambah import (sejajarkan dengan yang lain):
import { SocialProof }        from '@/components/landing/SocialProof'

// Sisipkan di antara SimulationPreview dan PricingSection:
<SimulationPreview />
<SocialProof />
<PricingSection />
```

- [ ] **Step 5: Jalankan test — pastikan PASS**

```bash
npm test -- --testPathPattern="landing-conversion" --runInBand
```

Expected: semua test PASS.

- [ ] **Step 6: Jalankan full test suite — pastikan tidak ada regresi**

```bash
npm test -- --runInBand
```

Expected: 47 test lama tetap PASS + seluruh test baru PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/landing/SocialProof.tsx src/app/page.tsx src/components/landing/__tests__/landing-conversion.test.tsx
git commit -m "feat: tambah SocialProof 'launching framing' — daftarkan di landing page"
```
