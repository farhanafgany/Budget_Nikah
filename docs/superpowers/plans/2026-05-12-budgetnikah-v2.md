# BudgetNikah v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three new dashboard features (Tabungan Nikah, Checklist Pernikahan, Seserahan List), revamp the landing page as a sales page, and make result page numbers more actionable.

**Architecture:** New dashboard features are Client Components that receive initial data from the async Server Component and mutate via Server Actions. Landing page sections are new Server Components replacing the existing ones. Result page gets additive changes only (no structural rewrites).

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase (Server Actions + revalidatePath), React 18 (useState + useTransition), Next.js Image component.

**Spec:** `docs/superpowers/specs/2026-05-12-budgetnikah-v2.md`

---

## File Map

**Create:**
```
src/lib/savings.ts                        # calculateMonthlySavings, monthsUntilDate
src/lib/checklistItems.ts                 # 51 hardcoded checklist items
src/lib/seserahanItems.ts                 # 15 hardcoded seserahan items
src/app/dashboard/actions.ts              # Server Actions for dashboard mutations
src/components/dashboard/PremiumCTA.tsx   # WhatsApp + Trakteer CTA block
src/components/dashboard/TabunganNikah.tsx
src/components/dashboard/ChecklistPernikahan.tsx
src/components/dashboard/SeserahanList.tsx
src/components/landing/HeroSection.tsx
src/components/landing/FeatureShowcase.tsx
src/components/landing/HowItWorks.tsx
src/components/landing/PricingSection.tsx
src/components/landing/FAQSection.tsx
src/__tests__/lib/savings.test.ts
src/__tests__/lib/checklistItems.test.ts
src/__tests__/lib/seserahanItems.test.ts
.env.local.example
```

**Modify:**
```
src/lib/utils.ts                          # add formatRupiah export
src/lib/insights.ts                       # add IDR numbers to messages + weddingDate param
src/components/result/ScoreHero.tsx       # add monthly savings display
src/components/result/AllocationChart.tsx # add IDR labels in legend + tooltip
src/app/result/page.tsx                   # pass totalBudget + weddingDate to ScoreHero
src/app/dashboard/page.tsx                # fetch new columns, render new components
src/app/page.tsx                          # replace landing sections
src/__tests__/lib/insights.test.ts        # update for new InsightInput shape
```

---

## Task 1: Database Migration

**Files:**
- Manual SQL (run in Supabase SQL Editor — no file to commit)

This is a manual step run once in production. Run the following SQL in the Supabase SQL Editor for your project.

- [ ] **Step 1: Open Supabase SQL Editor**

Go to your Supabase project → SQL Editor → New query.

- [ ] **Step 2: Run the migration**

```sql
ALTER TABLE wedding_profiles
  ADD COLUMN IF NOT EXISTS savings_collected bigint  DEFAULT 0,
  ADD COLUMN IF NOT EXISTS savings_target    bigint  DEFAULT 0,
  ADD COLUMN IF NOT EXISTS checklist_checked jsonb   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS seserahan_checked jsonb   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS is_premium        boolean DEFAULT false;
```

- [ ] **Step 3: Verify columns exist**

Run:
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'wedding_profiles'
  AND column_name IN ('savings_collected','savings_target','checklist_checked','seserahan_checked','is_premium');
```

Expected: 5 rows returned with the correct types.

- [ ] **Step 4: Commit a note**

```bash
git add -A
git commit -m "docs: note manual Supabase migration for v2 columns"
```

---

## Task 2: formatRupiah Utility + Savings Pure Functions

**Files:**
- Modify: `src/lib/utils.ts`
- Create: `src/lib/savings.ts`
- Create: `src/__tests__/lib/savings.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/__tests__/lib/savings.test.ts`:

```ts
import { calculateMonthlySavings, monthsUntilDate } from '@/lib/savings'

describe('calculateMonthlySavings', () => {
  it('returns ceil of remaining divided by months', () => {
    expect(calculateMonthlySavings(12_000_000, 0, 12)).toBe(1_000_000)
  })

  it('rounds up to nearest integer', () => {
    expect(calculateMonthlySavings(10_000_000, 0, 3)).toBe(3_333_334)
  })

  it('returns 0 when already at or above target', () => {
    expect(calculateMonthlySavings(10_000_000, 10_000_000, 12)).toBe(0)
    expect(calculateMonthlySavings(10_000_000, 15_000_000, 12)).toBe(0)
  })

  it('returns remaining when monthsLeft is 0', () => {
    expect(calculateMonthlySavings(10_000_000, 3_000_000, 0)).toBe(7_000_000)
  })
})

describe('monthsUntilDate', () => {
  const NOW = new Date('2026-05-12').getTime()

  it('returns 12 for null', () => {
    expect(monthsUntilDate(null, NOW)).toBe(12)
  })

  it('returns 12 for empty string', () => {
    expect(monthsUntilDate('', NOW)).toBe(12)
  })

  it('returns 12 for past date', () => {
    expect(monthsUntilDate('2025-01-01', NOW)).toBe(12)
  })

  it('calculates months for exactly 12 months ahead', () => {
    expect(monthsUntilDate('2027-05-12', NOW)).toBe(12)
  })

  it('returns at least 1 for near future', () => {
    expect(monthsUntilDate('2026-05-20', NOW)).toBe(1)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/m/Projects/Budget_Nikah && npx jest src/__tests__/lib/savings.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/savings'`

- [ ] **Step 3: Create `src/lib/savings.ts`**

```ts
export function calculateMonthlySavings(
  target: number,
  collected: number,
  monthsLeft: number,
): number {
  const remaining = Math.max(0, target - collected)
  return monthsLeft > 0 ? Math.ceil(remaining / monthsLeft) : remaining
}

export function monthsUntilDate(dateStr: string | null | undefined, now = Date.now()): number {
  if (!dateStr) return 12
  const diff = new Date(dateStr).getTime() - now
  if (diff <= 0) return 12
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24 * 30)))
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd /Users/m/Projects/Budget_Nikah && npx jest src/__tests__/lib/savings.test.ts
```

Expected: PASS — 9 tests

- [ ] **Step 5: Add `formatRupiah` to `src/lib/utils.ts`**

Append to the existing file (keep the `cn` export, add below it):

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)}jt`
  return `Rp ${n.toLocaleString('id-ID')}`
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/savings.ts src/lib/utils.ts src/__tests__/lib/savings.test.ts
git commit -m "feat: add savings calculation utilities and formatRupiah"
```

---

## Task 3: Checklist & Seserahan Data Fixtures

**Files:**
- Create: `src/lib/checklistItems.ts`
- Create: `src/lib/seserahanItems.ts`
- Create: `src/__tests__/lib/checklistItems.test.ts`
- Create: `src/__tests__/lib/seserahanItems.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/__tests__/lib/checklistItems.test.ts`:

```ts
import { CHECKLIST_ITEMS, type ChecklistItem } from '@/lib/checklistItems'

describe('CHECKLIST_ITEMS', () => {
  it('has at least 50 items', () => {
    expect(CHECKLIST_ITEMS.length).toBeGreaterThanOrEqual(50)
  })

  it('every item has required fields', () => {
    CHECKLIST_ITEMS.forEach((item: ChecklistItem) => {
      expect(typeof item.id).toBe('string')
      expect(item.id.length).toBeGreaterThan(0)
      expect(typeof item.label).toBe('string')
      expect(item.label.length).toBeGreaterThan(0)
      expect(typeof item.category).toBe('string')
      expect([12, 6, 3, 1, 0]).toContain(item.monthsBefore)
    })
  })

  it('has no duplicate IDs', () => {
    const ids = CHECKLIST_ITEMS.map(i => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has items for each timeline group', () => {
    const timelines = new Set(CHECKLIST_ITEMS.map(i => i.monthsBefore))
    expect(timelines).toContain(12)
    expect(timelines).toContain(6)
    expect(timelines).toContain(3)
    expect(timelines).toContain(1)
    expect(timelines).toContain(0)
  })
})
```

Create `src/__tests__/lib/seserahanItems.test.ts`:

```ts
import { SESERAHAN_ITEMS, type SeserahanItem } from '@/lib/seserahanItems'

describe('SESERAHAN_ITEMS', () => {
  it('has exactly 15 items', () => {
    expect(SESERAHAN_ITEMS.length).toBe(15)
  })

  it('every item has required fields', () => {
    SESERAHAN_ITEMS.forEach((item: SeserahanItem) => {
      expect(typeof item.id).toBe('string')
      expect(item.id.length).toBeGreaterThan(0)
      expect(typeof item.label).toBe('string')
      expect(typeof item.icon).toBe('string')
    })
  })

  it('has no duplicate IDs', () => {
    const ids = SESERAHAN_ITEMS.map(i => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/m/Projects/Budget_Nikah && npx jest src/__tests__/lib/checklistItems.test.ts src/__tests__/lib/seserahanItems.test.ts
```

Expected: FAIL — `Cannot find module`

- [ ] **Step 3: Create `src/lib/checklistItems.ts`**

```ts
export type ChecklistTimeline = 12 | 6 | 3 | 1 | 0

export interface ChecklistItem {
  id: string
  label: string
  category: string
  monthsBefore: ChecklistTimeline
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // 12 bulan sebelum
  { id: 'tentukan-tanggal',    label: 'Tentukan tanggal pernikahan',              category: 'Perencanaan',  monthsBefore: 12 },
  { id: 'tentukan-budget',     label: 'Tentukan dan sepakati budget pernikahan',  category: 'Perencanaan',  monthsBefore: 12 },
  { id: 'buat-guest-list',     label: 'Buat daftar tamu awal',                    category: 'Perencanaan',  monthsBefore: 12 },
  { id: 'pilih-venue',         label: 'Cari dan kunjungi beberapa venue',         category: 'Venue',        monthsBefore: 12 },
  { id: 'book-venue',          label: 'Book venue pilihan',                       category: 'Venue',        monthsBefore: 12 },
  { id: 'pilih-konsep',        label: 'Tentukan konsep dan tema pernikahan',      category: 'Perencanaan',  monthsBefore: 12 },
  { id: 'cari-katering',       label: 'Cari dan cicipi beberapa katering',        category: 'Katering',     monthsBefore: 12 },
  { id: 'pilih-fotografer',    label: 'Cari fotografer dan videografer',          category: 'Dokumentasi',  monthsBefore: 12 },
  { id: 'konsultasi-kua',      label: 'Konsultasi dengan penghulu / KUA',         category: 'Administrasi', monthsBefore: 12 },
  { id: 'venue-kontrak',       label: 'Tandatangani kontrak venue',               category: 'Venue',        monthsBefore: 12 },

  // 6 bulan sebelum
  { id: 'book-katering',       label: 'Book katering',                            category: 'Katering',     monthsBefore: 6 },
  { id: 'book-fotografer',     label: 'Book fotografer dan videografer',          category: 'Dokumentasi',  monthsBefore: 6 },
  { id: 'cari-baju',           label: 'Cari dan coba baju pengantin',             category: 'Baju',         monthsBefore: 6 },
  { id: 'cari-dekorasi',       label: 'Konsultasi dengan dekorator',              category: 'Dekorasi',     monthsBefore: 6 },
  { id: 'book-dekorasi',       label: 'Book dekorator',                           category: 'Dekorasi',     monthsBefore: 6 },
  { id: 'undangan-desain',     label: 'Mulai desain undangan pernikahan',         category: 'Undangan',     monthsBefore: 6 },
  { id: 'cari-mc',             label: 'Cari dan tentukan MC',                     category: 'Hiburan',      monthsBefore: 6 },
  { id: 'beli-cincin',         label: 'Beli atau pesan cincin nikah',             category: 'Perlengkapan', monthsBefore: 6 },
  { id: 'cari-mua',            label: 'Cari makeup artist (MUA)',                 category: 'MUA',          monthsBefore: 6 },
  { id: 'baju-aksesoris',      label: 'Beli aksesoris baju pengantin',            category: 'Baju',         monthsBefore: 6 },
  { id: 'pilih-parfum',        label: 'Pilih parfum untuk hari H',                category: 'Perlengkapan', monthsBefore: 6 },

  // 3 bulan sebelum
  { id: 'book-mc',             label: 'Book MC',                                  category: 'Hiburan',      monthsBefore: 3 },
  { id: 'book-mua',            label: 'Book MUA',                                 category: 'MUA',          monthsBefore: 3 },
  { id: 'cetak-undangan',      label: 'Cetak dan kirim undangan',                 category: 'Undangan',     monthsBefore: 3 },
  { id: 'konfirmasi-vip',      label: 'Konfirmasi kehadiran tamu VIP',            category: 'Tamu',         monthsBefore: 3 },
  { id: 'order-souvenir',      label: 'Order souvenir',                           category: 'Souvenir',     monthsBefore: 3 },
  { id: 'siapkan-seserahan',   label: 'Siapkan seserahan',                        category: 'Seserahan',    monthsBefore: 3 },
  { id: 'dokumen-akad',        label: 'Siapkan dokumen akad nikah',               category: 'Administrasi', monthsBefore: 3 },
  { id: 'finalisasi-menu',     label: 'Finalisasi menu katering',                 category: 'Katering',     monthsBefore: 3 },
  { id: 'pilih-musik',         label: 'Tentukan pilihan musik dan hiburan',       category: 'Hiburan',      monthsBefore: 3 },
  { id: 'rencana-honeymoon',   label: 'Rencanakan bulan madu',                    category: 'Bulan Madu',   monthsBefore: 3 },
  { id: 'fitting-baju',        label: 'Fitting baju pengantin',                   category: 'Baju',         monthsBefore: 3 },

  // 1 bulan sebelum
  { id: 'konfirmasi-tamu',     label: 'Konfirmasi jumlah tamu final ke katering', category: 'Katering',     monthsBefore: 1 },
  { id: 'trial-makeup',        label: 'Trial makeup dan hairdo',                  category: 'MUA',          monthsBefore: 1 },
  { id: 'final-fitting',       label: 'Final fitting baju pengantin',             category: 'Baju',         monthsBefore: 1 },
  { id: 'rehearsal',           label: 'Gladi resik / rehearsal acara',            category: 'Perencanaan',  monthsBefore: 1 },
  { id: 'brief-pendamping',    label: 'Konfirmasi tugas bridesmaid dan groomsmen', category: 'Perencanaan', monthsBefore: 1 },
  { id: 'book-honeymoon',      label: 'Book tiket dan hotel bulan madu',          category: 'Bulan Madu',   monthsBefore: 1 },
  { id: 'atur-transport',      label: 'Atur transportasi hari H',                 category: 'Logistik',     monthsBefore: 1 },
  { id: 'brief-dekorasi',      label: 'Brief detail dekorasi dengan dekorator',   category: 'Dekorasi',     monthsBefore: 1 },
  { id: 'konfirmasi-vendor',   label: 'Konfirmasi semua vendor',                  category: 'Vendor',       monthsBefore: 1 },
  { id: 'rundown-acara',       label: 'Buat rundown acara hari H',                category: 'Perencanaan',  monthsBefore: 1 },

  // 1 minggu sebelum (monthsBefore: 0)
  { id: 'packing-honeymoon',   label: 'Packing untuk bulan madu',                 category: 'Bulan Madu',   monthsBefore: 0 },
  { id: 'siapkan-tas-hari-h',  label: 'Siapkan tas dan keperluan hari H',         category: 'Logistik',     monthsBefore: 0 },
  { id: 'cek-vendor-akhir',    label: 'Cek last-minute semua vendor',             category: 'Vendor',       monthsBefore: 0 },
  { id: 'istirahat-cukup',     label: 'Istirahat cukup dan jaga kesehatan',       category: 'Kesehatan',    monthsBefore: 0 },
  { id: 'serahkan-koordinasi', label: 'Serahkan koordinasi ke koordinator',       category: 'Logistik',     monthsBefore: 0 },
  { id: 'cek-cincin',          label: 'Pastikan cincin dan aksesoris siap',       category: 'Perlengkapan', monthsBefore: 0 },
  { id: 'cek-baju',            label: 'Pastikan baju pengantin rapih dan siap',   category: 'Baju',         monthsBefore: 0 },
  { id: 'cek-dokumen',         label: 'Cek semua dokumen penting sudah siap',     category: 'Administrasi', monthsBefore: 0 },
  { id: 'siapkan-cash',        label: 'Siapkan uang cash untuk tips vendor',      category: 'Keuangan',     monthsBefore: 0 },
  { id: 'brief-keluarga',      label: 'Brief anggota keluarga tentang tugas',     category: 'Perencanaan',  monthsBefore: 0 },
]
```

- [ ] **Step 4: Create `src/lib/seserahanItems.ts`**

```ts
export interface SeserahanItem {
  id: string
  label: string
  icon: string
}

export const SESERAHAN_ITEMS: SeserahanItem[] = [
  { id: 'alat-sholat',        label: 'Seperangkat alat sholat',           icon: '🕌' },
  { id: 'cincin',             label: 'Cincin nikah (sepasang)',            icon: '💍' },
  { id: 'mas-kawin',          label: 'Mahar / mas kawin',                 icon: '💰' },
  { id: 'sandang-wanita',     label: 'Perlengkapan sandang wanita',       icon: '👗' },
  { id: 'sandang-pria',       label: 'Perlengkapan sandang pria',         icon: '👔' },
  { id: 'perhiasan',          label: 'Perhiasan (kalung, gelang, anting)', icon: '📿' },
  { id: 'kosmetik',           label: 'Kosmetik dan perawatan',            icon: '💄' },
  { id: 'sepatu',             label: 'Sepatu (pasangan)',                  icon: '👠' },
  { id: 'tas',                label: 'Tas wanita',                        icon: '👜' },
  { id: 'buah-buahan',        label: 'Buah-buahan',                       icon: '🍎' },
  { id: 'kue',                label: 'Kue-kue seserahan',                 icon: '🎂' },
  { id: 'uang-hantaran',      label: 'Uang hantaran / belanja',           icon: '💵' },
  { id: 'perlengkapan-tidur', label: 'Perlengkapan tidur / sprei',        icon: '🛏️' },
  { id: 'parfum-set',         label: 'Parfum set',                        icon: '🌸' },
  { id: 'bahan-makanan',      label: 'Bahan makanan / bumbu dapur',       icon: '🥘' },
]
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd /Users/m/Projects/Budget_Nikah && npx jest src/__tests__/lib/checklistItems.test.ts src/__tests__/lib/seserahanItems.test.ts
```

Expected: PASS — 8 tests

- [ ] **Step 6: Commit**

```bash
git add src/lib/checklistItems.ts src/lib/seserahanItems.ts src/__tests__/lib/checklistItems.test.ts src/__tests__/lib/seserahanItems.test.ts
git commit -m "feat: add checklist and seserahan data fixtures"
```

---

## Task 4: Server Actions for Dashboard Mutations

**Files:**
- Create: `src/app/dashboard/actions.ts`

- [ ] **Step 1: Create `src/app/dashboard/actions.ts`**

```ts
'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateTabungan(collected: number): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('wedding_profiles')
    .update({ savings_collected: collected })
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return {}
}

export async function toggleChecklistItem(
  id: string,
  isNowChecked: boolean,
  currentChecked: string[],
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const newChecked = isNowChecked
    ? [...currentChecked, id]
    : currentChecked.filter(i => i !== id)

  const { error } = await supabase
    .from('wedding_profiles')
    .update({ checklist_checked: newChecked })
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return {}
}

export async function toggleSeserahanItem(
  id: string,
  isNowChecked: boolean,
  currentChecked: string[],
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const newChecked = isNowChecked
    ? [...currentChecked, id]
    : currentChecked.filter(i => i !== id)

  const { error } = await supabase
    .from('wedding_profiles')
    .update({ seserahan_checked: newChecked })
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return {}
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/m/Projects/Budget_Nikah && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/actions.ts
git commit -m "feat: add server actions for dashboard feature mutations"
```

---

## Task 5: Result Page — ScoreHero Monthly Savings

**Files:**
- Modify: `src/components/result/ScoreHero.tsx`
- Modify: `src/app/result/page.tsx`

- [ ] **Step 1: Update `src/components/result/ScoreHero.tsx`**

Replace the entire file with:

```tsx
import type { ReadinessLabel } from '@/lib/scoring'
import { calculateMonthlySavings, monthsUntilDate } from '@/lib/savings'
import { formatRupiah } from '@/lib/utils'

const QUOTES: Record<ReadinessLabel, string> = {
  'Healthy':   'Rencana kamu cukup realistis dan bisa dikelola dengan baik.',
  'Moderate':  'Ada beberapa hal yang perlu diperhatikan agar rencana ini lebih kuat.',
  'High Risk': 'Rencana ini perlu beberapa penyesuaian agar tidak terasa terlalu berat.',
}

const LABEL_COLORS: Record<ReadinessLabel, string> = {
  'Healthy':   'bg-green-100 text-green-700',
  'Moderate':  'bg-orange-100 text-orange-700',
  'High Risk': 'bg-red-100 text-red-700',
}

interface Props {
  score: number
  label: ReadinessLabel
  totalBudget: number
  weddingDate: string
}

export function ScoreHero({ score, label, totalBudget, weddingDate }: Props) {
  const months = monthsUntilDate(weddingDate || null)
  const monthlySavings = calculateMonthlySavings(totalBudget, 0, months)

  return (
    <div className="bg-gradient-to-b from-[#F5E8EC] to-[#EDD6DE] rounded-3xl p-7 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-3">Hasil Analisis</p>
      <div className="text-[64px] font-extrabold text-nikah-deep leading-none mb-2">{score}</div>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-3">Wedding Readiness Score</p>
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 ${LABEL_COLORS[label]}`}>
        <span aria-hidden="true">✓</span> {label}
      </span>
      <p className="text-nikah-text text-sm font-light leading-relaxed italic mb-4">
        &ldquo;{QUOTES[label]}&rdquo;
      </p>
      <div className="bg-white/60 rounded-2xl px-4 py-3 inline-block">
        <p className="text-xs text-nikah-muted mb-0.5">Estimasi nabung per bulan</p>
        <p className="text-xl font-extrabold text-nikah-deep">{formatRupiah(monthlySavings)}/bln</p>
        <p className="text-[10px] text-nikah-muted mt-0.5">selama {months} bulan ke depan</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update `src/app/result/page.tsx`** — pass new props to ScoreHero

Change the ScoreHero usage (line 78) from:
```tsx
<ScoreHero score={scoreResult.score} label={scoreResult.label} />
```
to:
```tsx
<ScoreHero
  score={scoreResult.score}
  label={scoreResult.label}
  totalBudget={onboarding.totalBudget}
  weddingDate={onboarding.weddingDate}
/>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/m/Projects/Budget_Nikah && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/result/ScoreHero.tsx src/app/result/page.tsx
git commit -m "feat: show monthly savings estimate in score hero"
```

---

## Task 6: Result Page — AllocationChart IDR Labels

**Files:**
- Modify: `src/components/result/AllocationChart.tsx`

- [ ] **Step 1: Replace `src/components/result/AllocationChart.tsx`**

```tsx
'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { AllocationResult } from '@/lib/allocation'
import { formatRupiah } from '@/lib/utils'

const COLORS = ['#C07888','#E8C0CC','#D4A0B0','#B06070','#C8A860','#A08870','#D0B890','#8B6080']
const LABELS: Record<keyof AllocationResult, string> = {
  catering:'Catering', venue:'Venue', decoration:'Dekorasi',
  documentation:'Dokumentasi', mua:'MUA', souvenir:'Souvenir',
  entertainment:'Hiburan', emergencyFund:'Dana Darurat',
}

export default function AllocationChart({ allocation }: { allocation: AllocationResult }) {
  const data = Object.entries(allocation).map(([key, val], i) => ({
    name: LABELS[key as keyof AllocationResult],
    value: val.percentage,
    amount: val.estimatedAmount,
    color: COLORS[i % COLORS.length],
  }))

  return (
    <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-4">Alokasi Budget</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, item) => {
              const amount = (item.payload as { amount?: number }).amount
              return [`${value}% · ${amount != null ? formatRupiah(amount) : ''}`, name as string]
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <div className="min-w-0">
              <div className="text-[11px] text-nikah-muted truncate">{d.name}</div>
              <div className="text-[11px] font-bold text-nikah-text">{formatRupiah(d.amount)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/m/Projects/Budget_Nikah && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/result/AllocationChart.tsx
git commit -m "feat: show IDR amounts in allocation chart legend and tooltip"
```

---

## Task 7: Result Page — Insights with IDR Numbers

**Files:**
- Modify: `src/lib/insights.ts`
- Modify: `src/__tests__/lib/insights.test.ts`

- [ ] **Step 1: Replace `src/lib/insights.ts`**

```ts
import type { AllocationResult } from './allocation'
import { calculateMonthlySavings, monthsUntilDate } from './savings'
import { formatRupiah } from './utils'

export interface Insight {
  type: string
  icon: string
  message: string
}

export interface InsightInput {
  totalBudget: number
  guestCount: number
  weddingStyle: string
  planningPriority: string
  weddingCity: string
  allocation: AllocationResult
  score: number
  weddingDate?: string
}

export function generateInsights(input: InsightInput): Insight[] {
  const { allocation, weddingStyle, totalBudget, guestCount, score, weddingDate } = input
  const insights: Insight[] = []

  const budgetPerGuest = guestCount > 0 ? Math.round(totalBudget / guestCount) : 0

  if (allocation.catering.percentage > 45) {
    insights.push({
      type: 'catering_dominant',
      icon: '🍽️',
      message: `Katering diperkirakan ${formatRupiah(allocation.catering.estimatedAmount)} — pengeluaran terbesar dalam plan ini.`,
    })
  }

  if (allocation.emergencyFund.percentage < 10) {
    insights.push({
      type: 'low_emergency_fund',
      icon: '⚠️',
      message: `Dana darurat wedding hanya ${formatRupiah(allocation.emergencyFund.estimatedAmount)} — idealnya minimal 10% dari total budget untuk perubahan mendadak.`,
    })
  }

  if (weddingStyle === 'luxury' && totalBudget < 100_000_000) {
    insights.push({
      type: 'luxury_budget_mismatch',
      icon: '💎',
      message: `Style luxury dengan budget ${formatRupiah(totalBudget)} kemungkinan akan memberi tekanan cukup besar.`,
    })
  }

  if (guestCount > 700) {
    insights.push({
      type: 'high_guest_count',
      icon: '👥',
      message: `${guestCount} tamu dapat meningkatkan tekanan budget secara signifikan — pertimbangkan untuk memperketat daftar tamu.`,
    })
  }

  if (budgetPerGuest > 0 && budgetPerGuest < 150_000) {
    insights.push({
      type: 'budget_per_tamu',
      icon: '🧮',
      message: `Budget per tamu ${formatRupiah(budgetPerGuest)} — idealnya minimal Rp 120.000 untuk katering yang layak.`,
    })
  }

  if (score >= 70) {
    const months = monthsUntilDate(weddingDate || null)
    const monthly = calculateMonthlySavings(totalBudget, 0, months)
    insights.push({
      type: 'positive_outlook',
      icon: '✨',
      message: `Rencana ini terlihat realistis. Sisihkan ${formatRupiah(monthly)}/bulan selama ${months} bulan untuk tetap on track.`,
    })
  }

  while (insights.length < 3) {
    insights.push({
      type: 'budget_review',
      icon: '💡',
      message: 'Lakukan review budget setiap bulan untuk menjaga rencana tetap on track.',
    })
  }

  return insights.slice(0, 5)
}
```

- [ ] **Step 2: Run existing insight tests to verify they still pass**

```bash
cd /Users/m/Projects/Budget_Nikah && npx jest src/__tests__/lib/insights.test.ts
```

Expected: PASS — 4 tests (existing tests are still valid because `weddingDate` is optional)

- [ ] **Step 3: Commit**

```bash
git add src/lib/insights.ts
git commit -m "feat: add IDR numbers and budget-per-tamu insight to result page"
```

---

## Task 8: Dashboard — PremiumCTA Component

**Files:**
- Create: `src/components/dashboard/PremiumCTA.tsx`

- [ ] **Step 1: Create `src/components/dashboard/PremiumCTA.tsx`**

```tsx
export function PremiumCTA() {
  const waNumber  = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const waMessage = encodeURIComponent(
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    'Halo, saya ingin membeli akses BudgetNikah. Mohon konfirmasi.'
  )
  const waUrl      = `https://wa.me/${waNumber}?text=${waMessage}`
  const trakteerUrl = process.env.NEXT_PUBLIC_PAYMENT_URL ?? '#'

  return (
    <div className="bg-gradient-to-b from-[#F5E8EC] to-[#EDD6DE] rounded-2xl p-6 border border-nikah-border">
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">
        <span aria-hidden="true">✨</span> Dapatkan semua fitur
      </p>
      <h2 className="text-lg font-extrabold text-nikah-text mb-1">BudgetNikah</h2>
      <p className="text-sm text-nikah-muted mb-4">
        Rp 99.000 · sekali bayar · akses seumur hidup
      </p>
      <div className="flex flex-col gap-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-nikah-deep text-white font-bold py-3.5 rounded-full text-sm text-center"
        >
          Chat WhatsApp →
        </a>
        <a
          href={trakteerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full border border-nikah-deep text-nikah-deep font-semibold py-3.5 rounded-full text-sm text-center"
        >
          Beli via Trakteer
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/m/Projects/Budget_Nikah && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/PremiumCTA.tsx
git commit -m "feat: add PremiumCTA component with WhatsApp and Trakteer links"
```

---

## Task 9: Dashboard — TabunganNikah Component

**Files:**
- Create: `src/components/dashboard/TabunganNikah.tsx`

- [ ] **Step 1: Create `src/components/dashboard/TabunganNikah.tsx`**

```tsx
'use client'
import { useState, useTransition } from 'react'
import { updateTabungan } from '@/app/dashboard/actions'
import { calculateMonthlySavings, monthsUntilDate } from '@/lib/savings'
import { formatRupiah } from '@/lib/utils'

interface Props {
  isPremium: boolean
  collected: number
  target: number
  weddingDate: string | null
}

export function TabunganNikah({ isPremium, collected, target, weddingDate }: Props) {
  const [inputRaw, setInputRaw] = useState(String(collected))
  const [localCollected, setLocalCollected] = useState(collected)
  const [isPending, startTransition] = useTransition()

  const months   = monthsUntilDate(weddingDate)
  const monthly  = calculateMonthlySavings(target, localCollected, months)
  const progress = target > 0 ? Math.min(100, Math.round((localCollected / target) * 100)) : 0

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '')
    setInputRaw(raw)
  }

  function handleSave() {
    const n = parseInt(inputRaw, 10) || 0
    setLocalCollected(n)
    startTransition(async () => { await updateTabungan(n) })
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-3">
        <span aria-hidden="true">💰</span> Tabungan Nikah
      </p>

      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-2xl font-extrabold text-nikah-deep">{formatRupiah(localCollected)}</div>
          <div className="text-xs text-nikah-muted">dari {formatRupiah(target)}</div>
        </div>
        <div className="text-right">
          <div className="text-base font-bold text-nikah-mauve">{formatRupiah(monthly)}/bln</div>
          <div className="text-xs text-nikah-muted">selama {months} bln lagi</div>
        </div>
      </div>

      <div className="w-full bg-nikah-border rounded-full h-2 mb-4">
        <div
          className="bg-nikah-deep h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {isPremium ? (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-nikah-muted text-sm">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={inputRaw}
              onChange={handleInputChange}
              placeholder="0"
              className="w-full pl-9 pr-3 py-2.5 border border-nikah-border rounded-xl text-sm text-nikah-text focus:outline-none focus:ring-2 focus:ring-nikah-mauve"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="bg-nikah-deep text-white font-bold px-4 py-2.5 rounded-xl text-sm disabled:opacity-60"
          >
            {isPending ? '...' : 'Simpan'}
          </button>
        </div>
      ) : (
        <p className="text-xs text-nikah-muted text-center py-1">
          Beli akses untuk mulai tracking tabungan kamu
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/m/Projects/Budget_Nikah && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/TabunganNikah.tsx
git commit -m "feat: add TabunganNikah dashboard component"
```

---

## Task 10: Dashboard — ChecklistPernikahan Component

**Files:**
- Create: `src/components/dashboard/ChecklistPernikahan.tsx`

- [ ] **Step 1: Create `src/components/dashboard/ChecklistPernikahan.tsx`**

```tsx
'use client'
import { useState, useTransition } from 'react'
import { CHECKLIST_ITEMS, type ChecklistTimeline } from '@/lib/checklistItems'
import { toggleChecklistItem } from '@/app/dashboard/actions'

const TIMELINE_LABELS: Record<ChecklistTimeline, string> = {
  12: '12 Bulan Sebelum',
  6:  '6 Bulan Sebelum',
  3:  '3 Bulan Sebelum',
  1:  '1 Bulan Sebelum',
  0:  '1 Minggu Sebelum',
}

const TIMELINES: ChecklistTimeline[] = [12, 6, 3, 1, 0]

interface Props {
  isPremium: boolean
  checkedIds: string[]
}

export function ChecklistPernikahan({ isPremium, checkedIds }: Props) {
  const [localChecked, setLocalChecked] = useState<string[]>(checkedIds)
  const [, startTransition] = useTransition()

  const totalDone = localChecked.length

  function handleToggle(id: string) {
    if (!isPremium) return
    const wasChecked = localChecked.includes(id)
    const newChecked = wasChecked
      ? localChecked.filter(i => i !== id)
      : [...localChecked, id]
    setLocalChecked(newChecked)
    startTransition(async () => {
      await toggleChecklistItem(id, !wasChecked, localChecked)
    })
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve">
          <span aria-hidden="true">✅</span> Checklist Pernikahan
        </p>
        <span className="text-xs font-bold text-nikah-text">
          {totalDone}/{CHECKLIST_ITEMS.length}
        </span>
      </div>

      <div className="space-y-5">
        {TIMELINES.map(timeline => {
          const items = CHECKLIST_ITEMS.filter(i => i.monthsBefore === timeline)
          const groupDone = items.filter(i => localChecked.includes(i.id)).length
          return (
            <div key={timeline}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-nikah-text">{TIMELINE_LABELS[timeline]}</p>
                <span className="text-[11px] text-nikah-muted">{groupDone}/{items.length}</span>
              </div>
              <div className="space-y-1.5">
                {items.map(item => {
                  const checked = localChecked.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleToggle(item.id)}
                      disabled={!isPremium}
                      className={`w-full flex items-center gap-3 text-left p-2.5 rounded-xl transition-colors ${
                        isPremium ? 'hover:bg-nikah-bg' : 'cursor-default'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                        checked
                          ? 'bg-nikah-deep border-nikah-deep'
                          : 'border-nikah-border bg-white'
                      }`}>
                        {checked && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm ${checked ? 'line-through text-nikah-muted' : 'text-nikah-text'}`}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {!isPremium && (
        <p className="text-xs text-nikah-muted text-center mt-4 pt-4 border-t border-nikah-border">
          Beli akses untuk mulai mencentang persiapan kamu
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/m/Projects/Budget_Nikah && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/ChecklistPernikahan.tsx
git commit -m "feat: add ChecklistPernikahan dashboard component"
```

---

## Task 11: Dashboard — SeserahanList Component

**Files:**
- Create: `src/components/dashboard/SeserahanList.tsx`

- [ ] **Step 1: Create `src/components/dashboard/SeserahanList.tsx`**

```tsx
'use client'
import { useState, useTransition } from 'react'
import { SESERAHAN_ITEMS } from '@/lib/seserahanItems'
import { toggleSeserahanItem } from '@/app/dashboard/actions'

interface Props {
  isPremium: boolean
  checkedIds: string[]
}

export function SeserahanList({ isPremium, checkedIds }: Props) {
  const [localChecked, setLocalChecked] = useState<string[]>(checkedIds)
  const [, startTransition] = useTransition()

  const totalDone = localChecked.length

  function handleToggle(id: string) {
    if (!isPremium) return
    const wasChecked = localChecked.includes(id)
    const newChecked = wasChecked
      ? localChecked.filter(i => i !== id)
      : [...localChecked, id]
    setLocalChecked(newChecked)
    startTransition(async () => {
      await toggleSeserahanItem(id, !wasChecked, localChecked)
    })
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve">
          <span aria-hidden="true">💍</span> Seserahan
        </p>
        <span className="text-xs font-bold text-nikah-text">
          {totalDone}/{SESERAHAN_ITEMS.length} disiapkan
        </span>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {SESERAHAN_ITEMS.map(item => {
          const checked = localChecked.includes(item.id)
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              disabled={!isPremium}
              className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${
                isPremium ? 'hover:bg-nikah-bg' : 'cursor-default'
              }`}
            >
              <div className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                checked
                  ? 'bg-nikah-deep border-nikah-deep'
                  : 'border-nikah-border bg-white'
              }`}>
                {checked && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span aria-hidden="true" className="text-base">{item.icon}</span>
              <span className={`text-sm flex-1 ${checked ? 'line-through text-nikah-muted' : 'text-nikah-text'}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>

      {!isPremium && (
        <p className="text-xs text-nikah-muted text-center mt-4 pt-4 border-t border-nikah-border">
          Beli akses untuk menandai seserahan yang sudah disiapkan
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/m/Projects/Budget_Nikah && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/SeserahanList.tsx
git commit -m "feat: add SeserahanList dashboard component"
```

---

## Task 12: Dashboard Page — Wire Up New Components

**Files:**
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Replace `src/app/dashboard/page.tsx`**

```tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { calculatePressureLevel } from '@/lib/scoring'
import type { PressureLevel } from '@/lib/scoring'
import { formatRupiah } from '@/lib/utils'
import { PremiumCTA } from '@/components/dashboard/PremiumCTA'
import { TabunganNikah } from '@/components/dashboard/TabunganNikah'
import { ChecklistPernikahan } from '@/components/dashboard/ChecklistPernikahan'
import { SeserahanList } from '@/components/dashboard/SeserahanList'

const LABEL_COLORS: Record<string, string> = {
  Healthy:     'text-green-700 bg-green-100',
  Moderate:    'text-orange-700 bg-orange-100',
  'High Risk': 'text-red-700 bg-red-100',
}

const PRESSURE_COLORS: Record<PressureLevel, string> = {
  Low:    'text-green-700',
  Medium: 'text-orange-700',
  High:   'text-red-700',
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('wedding_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    return (
      <div className="min-h-screen bg-nikah-bg flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center bg-white rounded-3xl p-8 shadow-sm border border-nikah-border">
          <div className="text-4xl mb-4" aria-hidden="true">💍</div>
          <h2 className="text-xl font-extrabold text-nikah-text mb-2">Belum ada data</h2>
          <p className="text-nikah-muted text-sm mb-6 font-light">
            Mulai susun wedding plan kamu agar semuanya terasa lebih terarah.
          </p>
          <Link href="/onboarding" className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center">
            Mulai Wedding Plan →
          </Link>
        </div>
      </div>
    )
  }

  const days      = daysUntil(profile.wedding_date as string | null)
  const score     = (profile.readiness_score as number | null) ?? 0
  const label     = score >= 70 ? 'Healthy' : score >= 40 ? 'Moderate' : 'High Risk'
  const pressure  = calculatePressureLevel(score)
  const alloc     = profile.allocation_result as Record<string, { percentage: number; estimatedAmount: number }> | null
  const top3      = alloc
    ? Object.entries(alloc).sort((a, b) => b[1].percentage - a[1].percentage).slice(0, 3)
    : []
  const isPremium = (profile.is_premium as boolean | null) ?? false

  const CATEGORY_LABELS: Record<string, string> = {
    catering:'Catering', venue:'Venue', decoration:'Dekorasi',
    documentation:'Dokumentasi', mua:'MUA', souvenir:'Souvenir',
    entertainment:'Hiburan', emergencyFund:'Dana Darurat',
  }

  return (
    <main className="min-h-screen bg-nikah-bg pb-10">
      <div className="max-w-md mx-auto px-4 py-8 space-y-4">

        {/* Header */}
        <div className="mb-2">
          <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Dashboard</p>
          <h1 className="text-2xl font-extrabold text-nikah-text">
            {profile.partner_one_name} & {profile.partner_two_name}
          </h1>
        </div>

        {/* Readiness score */}
        <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-3">Kesiapan Wedding</p>
          <div className="flex items-center gap-4">
            <div className="text-[48px] font-extrabold text-nikah-deep leading-none">{score}</div>
            <div>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${LABEL_COLORS[label] ?? ''}`}>
                {label}
              </span>
              <p className="text-nikah-muted text-xs mt-1">Wedding Readiness Score</p>
            </div>
          </div>
        </div>

        {/* Countdown */}
        {days !== null && days > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Hitung Mundur</p>
              <p className="text-nikah-muted text-sm">Hari menuju hari H</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-nikah-deep">{days}</div>
              <div className="text-xs text-nikah-muted">hari lagi</div>
            </div>
          </div>
        )}

        {/* Pressure */}
        <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-2">Tekanan Budget</p>
          <div className="flex items-center justify-between">
            <p className="text-sm text-nikah-text">Level tekanan saat ini</p>
            <span className={`font-extrabold text-sm ${PRESSURE_COLORS[pressure]}`}>{pressure}</span>
          </div>
        </div>

        {/* Budget summary */}
        {top3.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-3">Ringkasan Budget</p>
            <p className="text-nikah-muted text-xs mb-3">Total: <strong className="text-nikah-text">{formatRupiah((profile.total_budget as number | null) ?? 0)}</strong></p>
            <div className="space-y-2">
              {top3.map(([key, val]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-nikah-text">{CATEGORY_LABELS[key] ?? key}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-nikah-text">{val.percentage}%</span>
                    <span className="text-xs text-nikah-muted ml-2">{formatRupiah(val.estimatedAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabungan Nikah */}
        <TabunganNikah
          isPremium={isPremium}
          collected={(profile.savings_collected as number | null) ?? 0}
          target={(profile.total_budget as number | null) ?? 0}
          weddingDate={(profile.wedding_date as string | null)}
        />

        {/* Checklist Pernikahan */}
        <ChecklistPernikahan
          isPremium={isPremium}
          checkedIds={(profile.checklist_checked as string[] | null) ?? []}
        />

        {/* Seserahan List */}
        <SeserahanList
          isPremium={isPremium}
          checkedIds={(profile.seserahan_checked as string[] | null) ?? []}
        />

        {/* Premium CTA — shown only to non-premium users */}
        {!isPremium && <PremiumCTA />}

        {/* Simulation shortcut */}
        <Link
          href="/result"
          className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center hover:opacity-90 transition"
        >
          <span aria-hidden="true">🎛️</span> Buka Simulasi →
        </Link>

      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/m/Projects/Budget_Nikah && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "feat: add new feature cards to dashboard with premium gate"
```

---

## Task 13: Landing — HeroSection

**Files:**
- Create: `src/components/landing/HeroSection.tsx`

- [ ] **Step 1: Create `src/components/landing/HeroSection.tsx`**

```tsx
import Link from 'next/link'

const DEMO_STATS = [
  { value: '73',     label: 'Readiness Score', badge: 'Healthy',   badgeClass: 'bg-green-100 text-green-700' },
  { value: 'Rp 4,6jt', label: 'nabung/bulan',   badge: null,        badgeClass: '' },
  { value: '18/50',  label: 'checklist',         badge: null,        badgeClass: '' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-16 text-center bg-gradient-to-b from-nikah-bg to-[#F5EBF0]">
      <div className="mb-6 text-xs font-bold tracking-widest uppercase text-nikah-mauve">
        BudgetNikah
      </div>

      <h1 className="text-3xl md:text-5xl font-extrabold text-nikah-text leading-tight max-w-xl mb-3">
        &ldquo;Berapa yang harus aku tabung bulan ini?&rdquo;
      </h1>

      <p className="text-nikah-muted font-light text-base md:text-lg max-w-sm mb-8 leading-relaxed">
        Pertanyaan yang akhirnya bisa kamu jawab.
      </p>

      {/* Demo stat pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {DEMO_STATS.map(stat => (
          <div
            key={stat.label}
            className="bg-white border border-nikah-border rounded-2xl px-4 py-3 text-center shadow-sm min-w-[90px]"
          >
            <div className="text-lg font-extrabold text-nikah-deep leading-none mb-0.5">{stat.value}</div>
            {stat.badge && (
              <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block mb-0.5 ${stat.badgeClass}`}>
                {stat.badge}
              </div>
            )}
            <div className="text-[11px] text-nikah-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      <Link
        href="/onboarding"
        className="w-full max-w-xs bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center hover:opacity-90 transition"
      >
        Cek Sekarang →
      </Link>
      <p className="text-xs text-nikah-muted mt-3">Gratis · Tanpa login · 2 menit</p>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-4 bg-white/90 backdrop-blur border-t border-nikah-border">
        <Link
          href="/onboarding"
          className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center"
        >
          Cek Sekarang →
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/m/Projects/Budget_Nikah && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/HeroSection.tsx
git commit -m "feat: add pain-driven HeroSection with demo stat pills"
```

---

## Task 14: Landing — FeatureShowcase

**Files:**
- Create: `src/components/landing/FeatureShowcase.tsx`

- [ ] **Step 1: Create `src/components/landing/FeatureShowcase.tsx`**

```tsx
'use client'
import Image from 'next/image'
import { useState } from 'react'

const FEATURE_IMAGES = [
  { src: '/images/feature-score.png',     alt: 'Wedding Readiness Score', label: '📊 Score' },
  { src: '/images/feature-tabungan.png',  alt: 'Tabungan Nikah',          label: '💰 Tabungan' },
  { src: '/images/feature-checklist.png', alt: 'Checklist Pernikahan',    label: '✅ Checklist' },
  { src: '/images/feature-seserahan.png', alt: 'Seserahan List',          label: '💍 Seserahan' },
]

const SPILL_ITEMS = [
  'Wedding Readiness Score (0–100)',
  'Estimasi biaya riil per kategori (Rupiah)',
  'Kalkulasi nabung/bulan otomatis',
  'Checklist 50+ item berbasis timeline',
  'Tabungan Nikah tracker',
  'Daftar Seserahan lengkap',
]

function FeatureSlot({ src, alt, label }: { src: string; alt: string; label: string }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <div className="relative w-full h-14 bg-[#EDD6DE] rounded-lg overflow-hidden flex items-center justify-center">
      {!imgError && (
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}
      {!imgLoaded && (
        <span className="text-[10px] text-nikah-mauve font-medium relative z-10">{label}</span>
      )}
    </div>
  )
}

export function FeatureShowcase() {
  return (
    <section className="px-6 py-16 bg-nikah-bg">
      <div className="max-w-md mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve text-center mb-2">
          Semua dalam satu dashboard
        </p>
        <h2 className="text-2xl font-extrabold text-nikah-text text-center mb-10">
          Yang kamu dapat:
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

          {/* Phone mockup */}
          <div className="flex-shrink-0 w-[200px]">
            <div className="bg-nikah-text rounded-[30px] p-2 shadow-2xl">
              <div className="bg-nikah-bg rounded-[24px] overflow-hidden">
                {/* Status bar */}
                <div className="bg-nikah-deep px-4 py-2.5 flex items-center justify-between">
                  <span className="text-white text-[10px] font-bold">BudgetNikah</span>
                  <span className="text-white/60 text-[9px]">9:41</span>
                </div>
                {/* Feature slots */}
                <div className="p-2 space-y-1.5">
                  {FEATURE_IMAGES.map(f => (
                    <FeatureSlot key={f.src} {...f} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Spill list */}
          <div className="flex-1 flex flex-col justify-center">
            <ul className="space-y-3">
              {SPILL_ITEMS.map(item => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-nikah-deep flex-shrink-0 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-nikah-text font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/m/Projects/Budget_Nikah && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/FeatureShowcase.tsx
git commit -m "feat: add FeatureShowcase with CSS phone frame and image slots"
```

---

## Task 15: Landing — HowItWorks, PricingSection, FAQSection

**Files:**
- Create: `src/components/landing/HowItWorks.tsx`
- Create: `src/components/landing/PricingSection.tsx`
- Create: `src/components/landing/FAQSection.tsx`

- [ ] **Step 1: Create `src/components/landing/HowItWorks.tsx`**

```tsx
const STEPS = [
  {
    number: '1',
    title: 'Isi profil wedding',
    description: 'Input nama, kota, tanggal, budget, dan jumlah tamu. Selesai dalam 2 menit.',
  },
  {
    number: '2',
    title: 'Lihat hasil analisis',
    description: 'Dapatkan Wedding Readiness Score dan alokasi budget riil per kategori dalam Rupiah.',
  },
  {
    number: '3',
    title: 'Rencanakan bersama',
    description: 'Gunakan Checklist, Tabungan Nikah, dan Seserahan untuk tetap on track sampai hari H.',
  },
]

export function HowItWorks() {
  return (
    <section className="px-6 py-16 bg-white">
      <div className="max-w-md mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve text-center mb-2">
          Cara Kerja
        </p>
        <h2 className="text-2xl font-extrabold text-nikah-text text-center mb-10">
          Mulai dalam 3 langkah
        </h2>
        <div className="space-y-6">
          {STEPS.map(step => (
            <div key={step.number} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F5E8EC] to-[#EDD6DE] flex-shrink-0 flex items-center justify-center">
                <span className="text-base font-extrabold text-nikah-deep">{step.number}</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-nikah-text mb-1">{step.title}</h3>
                <p className="text-sm text-nikah-muted font-light leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `src/components/landing/PricingSection.tsx`**

```tsx
import Link from 'next/link'

const WHAT_YOU_GET = [
  'Wedding Readiness Score (0–100)',
  'Estimasi biaya riil per kategori',
  'Kalkulasi nabung/bulan otomatis',
  'Checklist 50+ item berbasis timeline',
  'Tabungan Nikah tracker',
  'Daftar Seserahan lengkap',
]

export function PricingSection() {
  const waNumber  = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const waMessage = encodeURIComponent(
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    'Halo, saya ingin membeli akses BudgetNikah. Mohon konfirmasi.'
  )
  const waUrl       = `https://wa.me/${waNumber}?text=${waMessage}`
  const trakteerUrl = process.env.NEXT_PUBLIC_PAYMENT_URL ?? '#'

  return (
    <section className="px-6 py-16 bg-nikah-bg" id="harga">
      <div className="max-w-sm mx-auto">
        <div className="bg-gradient-to-b from-[#F5E8EC] to-[#EDD6DE] rounded-3xl p-7 text-center shadow-sm border border-nikah-border">
          <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-3">Harga</p>
          <div className="text-4xl font-extrabold text-nikah-deep mb-1">Rp 99.000</div>
          <p className="text-sm text-nikah-muted mb-6">sekali bayar · akses seumur hidup</p>

          <ul className="text-left space-y-2 mb-6">
            {WHAT_YOU_GET.map(item => (
              <li key={item} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-nikah-deep flex-shrink-0 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-nikah-text">{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center"
            >
              Chat WhatsApp →
            </a>
            <a
              href={trakteerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full border border-nikah-deep text-nikah-deep font-semibold py-3.5 rounded-full text-sm text-center"
            >
              Beli via Trakteer
            </a>
          </div>

          <p className="text-xs text-nikah-muted mt-4">
            Setelah pembayaran, konfirmasi via WhatsApp untuk aktivasi akses.
          </p>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-nikah-muted mb-2">Cek score dulu — gratis, tanpa login</p>
          <Link
            href="/onboarding"
            className="text-sm font-bold text-nikah-deep underline underline-offset-2"
          >
            Mulai cek →
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `src/components/landing/FAQSection.tsx`**

```tsx
'use client'
import { useState } from 'react'

const FAQS = [
  {
    q: 'Apakah data saya aman?',
    a: 'Ya. Data kamu disimpan di Supabase dengan enkripsi dan kebijakan keamanan Row Level Security — hanya kamu yang bisa mengakses datamu sendiri.',
  },
  {
    q: 'Bisa diakses dari mana saja?',
    a: 'BudgetNikah adalah web app yang bisa dibuka dari HP, laptop, atau tablet — tidak perlu install apa pun.',
  },
  {
    q: 'Bagaimana setelah saya bayar?',
    a: 'Hubungi kami via WhatsApp dengan bukti pembayaran. Akses akan diaktifkan dalam 1×24 jam.',
  },
  {
    q: 'Apakah ada biaya langganan?',
    a: 'Tidak. BudgetNikah adalah pembelian sekali bayar. Bayar sekali, akses seumur hidup — termasuk semua update fitur ke depannya.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="px-6 py-16 bg-white">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-extrabold text-nikah-text text-center mb-8">
          Pertanyaan Umum
        </h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-nikah-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-bold text-nikah-text pr-4">{faq.q}</span>
                <span
                  className={`text-nikah-mauve flex-shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4 text-sm text-nikah-muted font-light leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/m/Projects/Budget_Nikah && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/HowItWorks.tsx src/components/landing/PricingSection.tsx src/components/landing/FAQSection.tsx
git commit -m "feat: add HowItWorks, PricingSection, and FAQSection landing components"
```

---

## Task 16: Wire Up Landing Page

**Files:**
- Modify: `src/app/page.tsx`
- Create: `.env.local.example`

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
import { HeroSection }     from '@/components/landing/HeroSection'
import { PainCards }       from '@/components/landing/PainCards'
import { FeatureShowcase } from '@/components/landing/FeatureShowcase'
import { HowItWorks }      from '@/components/landing/HowItWorks'
import { PricingSection }  from '@/components/landing/PricingSection'
import { FAQSection }      from '@/components/landing/FAQSection'

export default function LandingPage() {
  return (
    <main className="pb-20 md:pb-0">
      <HeroSection />
      <PainCards />
      <FeatureShowcase />
      <HowItWorks />
      <PricingSection />
      <FAQSection />
    </main>
  )
}
```

Note: `PainCards` from the existing `src/components/landing/PainCards.tsx` is kept as-is. The old `FeaturesSection`, `SimulationPreview`, and `FinalCTA` are no longer imported but their files can remain.

- [ ] **Step 2: Create `.env.local.example`**

Create the file at the project root `/Users/m/Projects/Budget_Nikah/.env.local.example`:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Payment & Contact
NEXT_PUBLIC_WHATSAPP_NUMBER=628XXXXXXXXX
NEXT_PUBLIC_PAYMENT_URL=https://trakteer.id/your-username/tip
NEXT_PUBLIC_WHATSAPP_MESSAGE=Halo, saya ingin membeli akses BudgetNikah. Mohon konfirmasi.
```

Add the actual values to your `.env.local` (not committed to git).

- [ ] **Step 3: Run all tests to confirm nothing is broken**

```bash
cd /Users/m/Projects/Budget_Nikah && npx jest
```

Expected: All tests PASS.

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/m/Projects/Budget_Nikah && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx .env.local.example
git commit -m "feat: wire up revamped landing page sections"
```

---

## Post-Implementation: Manual Testing Checklist

After all tasks are complete, test the following flows manually in the browser (`npm run dev`):

**Landing page:**
- [ ] Hero renders with stat pills and "Cek Sekarang →" link
- [ ] PainCards section renders correctly
- [ ] FeatureShowcase shows phone mockup and spill list (image slots show placeholder label since screenshot files don't exist yet)
- [ ] HowItWorks shows 3 steps
- [ ] PricingSection shows price + WhatsApp + Trakteer buttons
- [ ] FAQ accordion opens and closes correctly

**Result page (after completing onboarding):**
- [ ] ScoreHero shows score + monthly savings amount + months
- [ ] AllocationChart legend shows IDR amounts per category
- [ ] Insights show IDR numbers in messages

**Dashboard (after login):**
- [ ] TabunganNikah renders with progress bar (0 / total_budget)
- [ ] ChecklistPernikahan renders all 51 items grouped by timeline
- [ ] SeserahanList renders 15 items
- [ ] PremiumCTA renders at the bottom with WhatsApp + Trakteer links
- [ ] Inputs are disabled (non-premium state)
- [ ] After setting `is_premium = true` in Supabase, CTA disappears and inputs become active
- [ ] Checking a checklist item toggles it and persists after page refresh
- [ ] Saving tabungan amount persists after page refresh
