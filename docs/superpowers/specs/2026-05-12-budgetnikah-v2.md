# BudgetNikah v2 — Design Spec

## Overview

V2 extends BudgetNikah with three new planning features (Tabungan Nikah, Checklist Pernikahan, Seserahan List), a revamped landing page that sells more effectively, and a result page that shows actionable numbers instead of abstract percentages. Monetization is one-time purchase via external payment link with manual WhatsApp confirmation.

---

## 1. Landing Page Revamp

### Goal
Transform the landing page from an "information page" to a sales page that clearly shows everything the buyer gets before purchasing.

### Section Structure

| Order | Section | Purpose |
|-------|---------|---------|
| 1 | Sticky Header | Logo + "Beli Sekarang" button always visible |
| 2 | Hero | Pain-driven question + concrete output numbers + free CTA |
| 3 | Pain Cards | 3 relatable problems |
| 4 | Phone Mockup + Spill List | Big phone mockup showing all features + explicit feature checklist |
| 5 | How It Works | 3 simple steps |
| 6 | Pricing | Rp 99.000 one-time + WhatsApp CTA |
| 7 | FAQ | ~4 questions |
| 8 | Footer | — |

### Hero Section (Section 2)
- H1: *"Berapa yang harus aku tabung bulan ini?"*
- Subtitle: *"Pertanyaan yang akhirnya bisa kamu jawab."*
- Three stat pills showing concrete outputs: `Readiness Score` · `Rp X/bulan nabung` · `X checklist selesai`
- Primary CTA: **"Cek Sekarang →"** → `/onboarding` (free, no login required)

### Pain Cards (Section 3)
Three cards targeting real emotions:
1. "Bingung mulai dari mana" — overwhelmed by all the tasks
2. "Takut budget meleset" — fear of going over budget
3. "Lupa apa saja yang harus disiapkan" — forgetting important preparations

### Phone Mockup + Spill List (Section 4)
Layout: two-column on desktop (mockup kiri, spill list kanan), stacked on mobile.

**Phone mockup (kiri):**
- CSS phone frame (border-radius, shadow) — bukan image
- Di dalam frame: 4 feature screenshot slots, stacked vertikal
- Setiap slot adalah `<Image>` dari Next.js dengan path yang sudah ditentukan:

```
/public/images/
  feature-score.png        ← screenshot ScoreHero dari /result
  feature-tabungan.png     ← screenshot Tabungan Nikah dari /dashboard
  feature-checklist.png    ← screenshot Checklist dari /dashboard
  feature-seserahan.png    ← screenshot Seserahan dari /dashboard
```

- Fallback jika file belum ada: placeholder div dengan warna `#EDD6DE` dan label nama fitur
- Screenshot ditambahkan manual oleh owner setelah fitur selesai dibangun

**Spill list (kanan):**
- Heading: "Yang kamu dapat:"
- ✓ Wedding Readiness Score (0–100)
- ✓ Estimasi biaya riil per kategori (dalam Rupiah)
- ✓ Kalkulasi nabung/bulan otomatis
- ✓ Checklist 50+ item berbasis timeline
- ✓ Tabungan Nikah tracker
- ✓ Daftar Seserahan lengkap

### Pricing Section (Section 6)
- Price: **Rp 99.000** · sekali bayar · akses seumur hidup
- Repeat what's included (same list as Section 4)
- CTA: **"Chat WhatsApp →"** opens `wa.me/{WHATSAPP_NUMBER}` with pre-filled message template
- Secondary: **"Beli via Trakteer →"** opens `NEXT_PUBLIC_PAYMENT_URL` in new tab

### Environment Variables
```
NEXT_PUBLIC_PAYMENT_URL=https://trakteer.id/...
NEXT_PUBLIC_WHATSAPP_NUMBER=628XXXXXXXXX
NEXT_PUBLIC_WHATSAPP_MESSAGE=Halo, saya ingin membeli akses BudgetNikah. Nama: ...
```

---

## 2. Result Page Improvements

### Goal
Replace abstract percentages with actionable IDR numbers and a clear monthly savings figure.

### Changes

**ScoreHero additions:**
- Monthly savings needed: `totalBudget ÷ monthsUntilWedding` (if wedding date provided, use actual months; default to 12 months if not set)
- Display format: *"Nabung Rp 4.600.000/bulan"* next to or below the score

**AllocationChart:**
- Each pie slice label shows IDR amount alongside percentage
- Tooltip shows: `Katering · Rp 35.000.000 · 35%`

**InsightCards — more specific numbers:**
- Budget per tamu insight includes the actual number and benchmark: *"Budget per tamu kamu Rp 95.000 — idealnya minimal Rp 120.000 untuk katering layak"*
- Savings insight includes the monthly number: *"Dengan target nikah 12 bulan lagi, kamu perlu menyisihkan Rp 4.600.000 tiap bulan"*

**No structural changes** — layout, simulation slider, and premium tease sections remain.

---

## 3. New Features Architecture

All three features live in `/dashboard` (auth-gated). The feature UIs are **visible to all logged-in users** but inputs are **disabled for non-premium users** — they see the layout and empty state so they know what they're buying. The WhatsApp/buy CTA block is shown only to non-premium users. Premium users (`is_premium = true`) get fully interactive inputs.

### 3.1 Tabungan Nikah

**UI:** Card with:
- Input: "Sudah terkumpul" (IDR, free input)
- Auto-filled target: `totalBudget` from `wedding_profiles`
- Progress bar: `collected / target`
- Calculated output: *"Nabung Rp X/bulan"* based on months until wedding date

**Logic (pure function, client-side):**
```ts
function calculateMonthlySavings(target: number, collected: number, monthsLeft: number): number {
  const remaining = Math.max(0, target - collected)
  return monthsLeft > 0 ? Math.ceil(remaining / monthsLeft) : remaining
}
// monthsLeft = months between today and wedding_date, defaulting to 12 if wedding_date is null
```

**State:** `savings_collected` and `savings_target` columns in `wedding_profiles`.

### 3.2 Checklist Pernikahan

**Data:** 50+ items hardcoded in `src/lib/checklistItems.ts`. Each item:
```ts
type ChecklistItem = {
  id: string        // e.g. "venue-booking"
  label: string     // e.g. "Book venue"
  category: string  // e.g. "Venue & Dekorasi"
  monthsBefore: 12 | 6 | 3 | 1 | 0  // 0 = 1 week before
}
```

**UI:** Grouped by timeline (12 bulan, 6 bulan, 3 bulan, 1 bulan, 1 minggu). Each item is a checkbox row. Progress counter per group + overall.

**State:** `checklist_checked: jsonb` in `wedding_profiles` — array of checked item IDs (e.g. `["venue-booking", "tentukan-tanggal"]`).

**No custom items** — user can only check/uncheck predefined items.

### 3.3 Seserahan List

**Data:** ~15 items hardcoded in `src/lib/seserahanItems.ts`. Each item:
```ts
type SeserahanItem = {
  id: string    // e.g. "alat-sholat"
  label: string // e.g. "Seperangkat alat sholat"
  icon: string  // emoji, e.g. "🕌"
}
```

**UI:** Grid of items, each with a checkbox. Progress: "X/15 disiapkan".

**State:** `seserahan_checked: jsonb` in `wedding_profiles` — array of checked item IDs.

---

## 4. Payment & Unlock Flow

### Purchase Flow
```
User klik "Chat WhatsApp" / "Beli via Trakteer"
  → External tab opens (wa.me/... or trakteer.id/...)
  → User completes payment externally
  → User confirms via WhatsApp
  → Admin opens Supabase Table Editor
  → Admin sets is_premium = true for that user's row
  → User refreshes /dashboard → CTA block disappears, all features fully interactive
```

### Dashboard Layout (non-premium)
All features are visible and functional as empty/demo state. At the bottom of the dashboard, a single CTA block:

```
┌─────────────────────────────────────────┐
│  ✨ Dapatkan semua fitur BudgetNikah    │
│  Rp 99.000 · sekali bayar · seumur hidup│
│  [Chat WhatsApp →]  [Beli via Trakteer] │
└─────────────────────────────────────────┘
```

Features are NOT locked with overlays — they're shown fully with empty state messaging ("Belum ada data tabungan", etc.) so users see exactly what they're buying.

### Dashboard Layout (premium / is_premium = true)
- CTA block disappears
- All features fully interactive
- Tabungan Nikah: user can input savings amount
- Checklist: user can check/uncheck items
- Seserahan: user can check/uncheck items

### Database Migration
```sql
ALTER TABLE wedding_profiles
  ADD COLUMN IF NOT EXISTS savings_collected bigint DEFAULT 0,
  ADD COLUMN IF NOT EXISTS savings_target    bigint DEFAULT 0,
  ADD COLUMN IF NOT EXISTS checklist_checked jsonb  DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS seserahan_checked jsonb  DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS is_premium        boolean DEFAULT false;
```

---

## 5. File Structure

### New files
```
src/lib/
  checklistItems.ts        # 50+ hardcoded checklist items with timeline
  seserahanItems.ts        # ~15 hardcoded seserahan items

src/components/dashboard/
  TabunganNikah.tsx        # Savings tracker card
  ChecklistPernikahan.tsx  # Checklist grouped by timeline
  SeserahanList.tsx        # Seserahan grid
  PremiumCTA.tsx           # CTA block (shown when !is_premium)

src/components/landing/
  HeroSection.tsx          # Pain-driven hero with stat pills
  PainCards.tsx            # 3 pain cards
  FeatureShowcase.tsx      # CSS phone frame + 4 image slots + spill list
  HowItWorks.tsx           # 3-step explanation
  PricingSection.tsx       # Price + WhatsApp CTA
  FAQSection.tsx           # FAQ accordion

public/images/
  feature-score.png        # [manual] screenshot ScoreHero — tambahkan setelah build
  feature-tabungan.png     # [manual] screenshot Tabungan Nikah — tambahkan setelah build
  feature-checklist.png    # [manual] screenshot Checklist — tambahkan setelah build
  feature-seserahan.png    # [manual] screenshot Seserahan — tambahkan setelah build
```

### Modified files
```
src/app/page.tsx                          # Replace current landing with new sections
src/app/dashboard/page.tsx               # Add new feature cards + PremiumCTA
src/components/result/ScoreHero.tsx      # Add monthly savings display
src/components/result/AllocationChart.tsx # Add IDR labels
src/lib/insights.ts                      # Make insights more specific with IDR numbers
```

---

## 6. Out of Scope (v2)

- Automated payment webhook (Trakteer/Midtrans integration) — manual confirmation only
- Custom checklist items — predefined list only
- Vendor comparison — excluded intentionally
- Push notifications or reminders
- Social sharing

---

## Design Constraints (unchanged from v1)

- Font: Plus Jakarta Sans
- Colors: `#FAF5F5` bg · `#E8C0CC` pink · `#C07888` mauve · `#6B3545` deep · `#C8A860` gold
- Scoring: pure functions, deterministic, no API calls
- Mobile-first
