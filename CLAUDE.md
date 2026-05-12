# BudgetNikah — Project Context

## Overview

Mobile-first wedding planning web app untuk pasangan Indonesia. Membantu memahami apakah rencana pernikahan realistis, mensimulasikan keputusan, dan memberikan kejelasan finansial + emosional.

**Nuansa yang diinginkan:** Calming, elegant, emotionally supportive — BUKAN finance dashboard atau fintech.

## Monetization (keputusan 2026-05-12)

- Model: **one-time purchase** (satu kali bayar, akses seumur hidup)
- Pendekatan cara jual: landing page style "spill everything" — tunjukkan semua yang didapat sebelum beli
- Landing page hero: pain-driven question + preview angka konkret (score, tabungan/bulan, checklist count)
- Feature preview section: phone mockup besar yang menampilkan semua fitur sekaligus
- **TIDAK ada vendor comparison** — terlalu berat, Katsudoto sudah ada di sana, dilutes focus
- Payment flow: TBD (belum diputuskan — opsi gateway atau link eksternal)

## Tech Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (state management)
- Supabase (Auth + PostgreSQL)
- Recharts (charts, lazy-loaded)
- Jest + React Testing Library

## Design Decisions (sudah disetujui user)

| Keputusan | Pilihan |
|---|---|
| Font | Plus Jakarta Sans |
| Warna | Dusty Mauve Pink: bg `#FAF5F5`, pink `#E8C0CC`, mauve `#C07888`, deep `#6B3545`, gold `#C8A860` |
| Result page | Narasi Mengalir — score besar (64px) di hero gradient `#F5E8EC→#EDD6DE` |
| Onboarding | Satu fokus per layar (quiz-style), 7 layar |
| Arsitektur | Hybrid SSR (landing, dashboard) + CSR (onboarding, result) |
| Scoring/allocation | Pure functions di client, NO API calls — simulasi harus instant |

## Architecture

```
/ → Server Component (SSR, SEO)
/onboarding → Client Component (Zustand + localStorage)
/result → Client Component (real-time simulation)
/dashboard → Server Component (auth-gated, Supabase)
/auth/* → Client Component
```

## Key Files

```
src/lib/
  cityTiers.ts        # Tier A×1.25 / B×1.00 / C×0.85
  allocation.ts       # Budget allocation pure function
  scoring.ts          # Readiness score pure function
  insights.ts         # Rule-based insight engine

src/stores/
  onboardingStore.ts  # Zustand + localStorage persist
  authStore.ts        # Supabase session
  simulationStore.ts  # Slider/switcher state (NOT persisted)

src/components/
  landing/            # Hero, PainCards, FeaturesSection, SimulationPreview, FinalCTA
  onboarding/         # StepWrapper + 7 step components
  result/             # ScoreHero, PressureCard, AllocationChart, InsightCards, SimulationControls, PremiumTease
```

## Scoring Logic

```
allocation = calculateAllocation(input)  // FIRST
score = calculateScore({ ...input, allocation })  // SECOND (needs emergencyFund%)

budgetPerGuest < 120k → -25
luxury + budget < 100jt → -20
elegant + budgetPerGuest < 180k → -10
guestCount > 800 → -10
hemat priority → +5
emergencyFund < 10% → -10
× cityMultiplier (Tier A 1.25 / B 1.0 / C 0.85)
clamp(0, 100)

0-39: High Risk | 40-69: Moderate | 70-100: Healthy
pressureLevel: score>=70 Low | score>=40 Medium | <40 High
```

## User Flow

```
Landing → /onboarding (7 steps) → /result (score + simulation)
→ "Simpan Hasil" → /auth/login → upsert to Supabase → /dashboard
```

Pre-auth: data di localStorage (onboardingStore persist)
Post-auth: upsert ke wedding_profiles, clear localStorage

## Database

- `wedding_profiles` — satu row per user (UNIQUE user_id), RLS enabled
- `simulations` — snapshot tiap simulasi, RLS enabled

## Important Constraints

- TIDAK perlu login sebelum onboarding atau melihat result
- Scoring TIDAK random — deterministik dan explainable
- TIDAK gunakan AI-generated insights — rule-based only
- TIDAK ada exact pricing — hanya estimasi range
- Simulasi di /result harus real-time, NO loading state

## Setup Notes

- `tailwind.config.ts` maps all shadcn CSS custom properties (`--background`, `--foreground`, etc.) to Tailwind color tokens using `var(--x)` syntax — full oklch values, no alpha modifier support
- `globals.css` does NOT import `shadcn/tailwind.css` (v4-only syntax, incompatible with Tailwind v3); keyframe animations from shadcn are available via `tw-animate-css`
- `outline-ring` used without opacity modifier in `globals.css` (oklch vars don't support Tailwind `/opacity` modifier)
- `shadcn` is in `devDependencies` (it's a CLI tool, not a runtime dep)
- Geist fonts removed; font-sans removed from html element; autoprefixer added to PostCSS

## New Features (v2 — belum diimplementasi)

- **Tabungan Nikah** — tracker simpel: terkumpul vs. target + kalkulasi nabung/bulan
- **Checklist Pernikahan** — 50+ item berbasis timeline (12bln, 6bln, 3bln, 1bln, 1mgg sebelum H)
- **Seserahan List** — daftar item seserahan dengan status (sudah/belum)
- **Result page improvements** — angka lebih konkret (IDR per kategori, nabung/bulan, benchmark per tamu)
- **Landing page revamp** — hero pain-driven + phone mockup preview semua fitur

## Specs & Plans

- Design spec (EN): `docs/superpowers/specs/2026-05-12-budgetnikah-design.md`
- Design spec (ID): `docs/superpowers/specs/2026-05-12-budgetnikah-design-id.md`
- Implementation plan (MVP v1): `docs/superpowers/plans/2026-05-12-budgetnikah-mvp.md`

## Communication

Komunikasi dengan user dalam **Bahasa Indonesia**.
Kode, nama variabel, nama file tetap dalam Bahasa Inggris.
