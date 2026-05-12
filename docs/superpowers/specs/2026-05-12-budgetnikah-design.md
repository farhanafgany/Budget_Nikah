# BudgetNikah — Design Spec
**Date:** 2026-05-12
**Status:** Approved

---

## Overview

BudgetNikah is a mobile-first wedding planning web app for Indonesian engaged couples. It helps users understand whether their wedding plan is realistic, reduce overwhelm, simulate decisions, and receive emotional and financial clarity before marriage.

**Feel:** Calming, elegant, emotionally supportive, lightweight, mobile-first.
**Not:** Finance dashboard, enterprise SaaS, spreadsheet, fintech UI.

---

## Design Decisions

| Decision | Choice |
|---|---|
| Font | Plus Jakarta Sans (all weights) |
| Color palette | Dusty Mauve Pink — `#FAF5F5` bg, `#E8C0CC` pink, `#C07888` mauve, `#6B3545` deep, `#C8A860` gold |
| Result page layout | Narasi Mengalir — large score in gradient hero, flowing narrative below |
| Onboarding style | Satu fokus per layar — one question/group per screen, quiz-style |
| Architecture | Hybrid SSR + CSR |
| Supabase | New project, setup from scratch |

---

## Tech Stack

- **Framework:** Next.js 14+ App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand
- **Database/Auth:** Supabase (PostgreSQL + Supabase Auth)
- **Charts:** Recharts (lazy-loaded)
- **Deployment:** Vercel

---

## Architecture

### Rendering Strategy

| Route | Strategy | Reason |
|---|---|---|
| `/` | Server Component (SSR) | SEO + fast first paint for Meta Ads traffic |
| `/onboarding` | Client Component | Form state, step navigation, localStorage |
| `/result` | Client Component | Real-time simulation, Recharts |
| `/dashboard` | Server Component | Auth-gated, fetch from Supabase server-side |
| `/auth/*` | Client Component | Supabase Auth UI |

### Folder Structure

```
src/
├── app/
│   ├── page.tsx                        # Landing (SSR)
│   ├── onboarding/page.tsx             # Multi-step onboarding (CSR)
│   ├── result/page.tsx                 # Result + simulation (CSR)
│   ├── dashboard/page.tsx              # Dashboard (SSR, auth-gated)
│   └── auth/
│       ├── login/page.tsx
│       └── signup/page.tsx
├── components/
│   ├── ui/                             # shadcn/ui primitives
│   ├── landing/                        # Hero, PainCards, Features, SimPreview, FinalCTA
│   ├── onboarding/                     # StepWrapper, individual step screens
│   ├── result/                         # ScoreHero, PressureCard, AllocationChart,
│   │                                   # InsightCards, SimulationControls, PremiumTease
│   └── dashboard/                      # ReadinessSummary, Countdown, BudgetSummary
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Browser Supabase client
│   │   └── server.ts                   # Server Supabase client (SSR)
│   ├── scoring.ts                      # Readiness score pure function
│   ├── allocation.ts                   # Budget allocation pure function
│   ├── insights.ts                     # Rule-based insight engine
│   └── cityTiers.ts                    # City tier mapping + multipliers
├── stores/
│   ├── onboardingStore.ts              # Zustand + localStorage persist
│   ├── authStore.ts                    # Zustand, Supabase session
│   └── simulationStore.ts             # Zustand, slider/switcher state (no persist)
└── middleware.ts                       # Protect /dashboard, redirect if no session
```

---

## State Management

### Zustand Stores

**`onboardingStore`**
- Fields: `partnerOneName`, `partnerTwoName`, `weddingCity`, `weddingDate`, `totalBudget`, `guestCount`, `weddingStyle`, `eventType`, `planningPriority`, `currentStep`
- Persisted to `localStorage` via Zustand persist middleware
- Auto-restored on page refresh
- Cleared after successful sync to Supabase

**`authStore`**
- Fields: `user`, `session`, `isLoading`
- Populated from Supabase Auth listener

**`simulationStore`**
- Fields: `guestCount`, `weddingStyle` (mirrors onboarding but editable)
- Not persisted — reset on page load from onboarding data
- Drives real-time score/allocation recalculation on result page

### Data Flow

**Pre-auth:**
```
Onboarding steps → onboardingStore → localStorage
                                   ↓
Result page → reads onboardingStore → scoring.ts + allocation.ts (pure, sync)
           → simulationStore drives real-time slider updates (no API calls)
```

**Post-auth:**
```
"Simpan Hasil" CTA → login/register flow
                   → authStore.user populated
                   → upsert onboardingStore → Supabase wedding_profiles
                     (INSERT ON CONFLICT user_id DO UPDATE — one profile per user)
                   → clear localStorage
                   → redirect /dashboard
```

**Logged-in user visits `/result` directly:**
- Check `onboardingStore` first (localStorage)
- If empty, fetch `wedding_profiles` from Supabase and populate `onboardingStore`
- If both empty → redirect `/onboarding` + toast

---

## Business Logic (Pure Functions, Client-Side)

### Scoring — `lib/scoring.ts`

Allocation is always calculated first. Scoring receives the allocation result as an additional input so it can check `emergencyFundPercentage`.

Input: `{ totalBudget, guestCount, weddingStyle, planningPriority, weddingCity, allocation: AllocationResult }`
Output: `{ score: number, label: 'High Risk' | 'Moderate' | 'Healthy' }`

```ts
score = 100
budgetPerGuest = totalBudget / guestCount
emergencyFundPercentage = allocation.emergencyFund.percentage  // derived from allocation

if (budgetPerGuest < 120_000) score -= 25
if (weddingStyle === 'luxury' && totalBudget < 100_000_000) score -= 20
if (weddingStyle === 'elegant' && budgetPerGuest < 180_000) score -= 10
if (guestCount > 800) score -= 10
if (planningPriority === 'hemat') score += 5
if (emergencyFundPercentage < 10) score -= 10

score *= cityMultiplier  // Tier A: 1.25, Tier B: 1.0, Tier C: 0.85
score = clamp(score, 0, 100)

label: 0–39 → 'High Risk', 40–69 → 'Moderate', 70–100 → 'Healthy'
```

Call order: `allocation = calculateAllocation(input)` → `result = calculateScore({ ...input, allocation })`

### Budget Allocation — `lib/allocation.ts`

Input: `{ totalBudget, guestCount, weddingStyle, planningPriority }`
Output: `Record<category, { percentage: number, estimatedAmount: number }>`

Categories with dynamic ranges:
- Catering: 35–50%
- Venue: 15–25%
- Decoration: 10–20%
- Documentation: 5–10%
- MUA: 3–8%
- Souvenir: 3–7%
- Entertainment: 2–8%
- Emergency Fund: 5–15%

Percentages adjust based on `weddingStyle` and `planningPriority`. Returns both percentage and estimated IDR amount.

### City Tiers — `lib/cityTiers.ts`

```ts
Tier A (×1.25): Jakarta, Surabaya, Bandung
Tier B (×1.00): Batam, Jogja, Solo, Medan
Tier C (×0.85): all other cities
```

### Insight Engine — `lib/insights.ts`

Input: allocation result + onboarding data
Output: `Insight[]` — 3–5 cards, rule-based, supportive tone

Rules (examples):
- `cateringPercentage > 45` → catering dominance warning
- `emergencyFundPercentage < 10` → emergency fund low
- `weddingStyle === 'luxury' && totalBudget < 100_000_000` → style/budget mismatch
- `guestCount > 700` → high guest pressure

Tone: supportive, non-judgmental, no fear-based language.

---

## Pages

### `/` — Landing Page

Sections (SSR, no interactivity needed):
1. **Hero** — headline, subheadline, primary CTA → `/onboarding`, secondary CTA → simulation preview
2. **Emotional Pain** — 4–6 cards with icon + short text
3. **Smart Features** — 4 feature cards
4. **Simulation Preview** — before/after comparison (static, no JS)
5. **Final CTA** — large emotional card → `/onboarding`

Sticky mobile CTA button floats at bottom on mobile.

### `/onboarding` — Multi-Step (Quiz Style)

Progress bar at top. One question/group per screen. Smooth slide transition between steps. Sticky "Lanjut →" button at bottom. Back button top-left.

Screen sequence:
1. Nama pasangan (2 text inputs)
2. Kota pernikahan (select with tier hint)
3. Tanggal rencana (date picker)
4. Total budget (currency input + helper examples)
5. Jumlah tamu (number input + helper)
6. Wedding style (selectable cards: simple / elegant / luxury / traditional / modern)
7. Event type + planning priority (selectable cards)

Auto-save to `onboardingStore` on every "Lanjut". On step 7 completion → navigate to `/result`.

Error: If user lands on `/result` with incomplete data → redirect `/onboarding` + toast.

### `/result` — Result Page (Layout B)

1. **Score Hero** — gradient bg (`#F5E8EC` → `#EDD6DE`), large score number (52px), readiness label badge, emotional quote
2. **Budget Pressure Card** — pressure level badge (Low/Medium/High), biggest category, warning insight
3. **Allocation Chart** — Recharts pie/donut chart, lazy-loaded, skeleton placeholder while loading
4. **Smart Insights** — 3–5 insight cards, rule-based
5. **Simulation Section** — guest count slider + wedding style switcher → real-time score/pressure/chart/insights update via `simulationStore`
6. **Premium Tease** — 3 locked cards (Unlimited Simulation, Timeline Planner, Advanced Insights) + "Unlock Full Planner" CTA
7. **Sticky CTA** — "Simpan Hasil Ini" → trigger auth flow

### `/dashboard` — Minimal Dashboard (SSR)

Auth-gated via middleware. Server Component fetches `wedding_profiles` from Supabase.

Sections:
- Readiness summary card (score + label)
- Wedding countdown (days remaining)
- Biggest financial risk highlight
- Budget summary (top 3 categories)
- Quick simulation shortcut → `/result`

Empty state: supportive card + CTA → `/onboarding`.

### `/auth/login` & `/auth/signup`

Supabase Auth — Google OAuth + email/password. After success: sync localStorage data → Supabase → redirect `/dashboard`.

Error state: toast "Login gagal. Silakan coba lagi." — stay on current page.

---

## Database Schema

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
CREATE POLICY "Users own their profiles"
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
CREATE POLICY "Users own their simulations"
  ON simulations FOR ALL
  USING (user_id = auth.uid());
```

---

## Loading & Error States

**Loading:**
- Recharts chart → skeleton card with pulse animation
- Dashboard data → skeleton cards
- No full-screen spinners

**Errors:**
- Incomplete onboarding → redirect `/onboarding` + toast
- Auth failure → toast, stay on page
- Empty dashboard → supportive empty state card

---

## Performance

- Landing page: SSR, no client JS for static content
- Charts: lazy-loaded with `dynamic(() => import(...), { ssr: false })`
- Simulation: pure functions (sync, no network)
- Fonts: `next/font` with `display: swap`
- Images: `next/image` with WebP
- No heavy animation libraries — CSS transitions only

---

## Auth Flow

```
Landing → /onboarding → /result → "Simpan Hasil" → /auth/login → /dashboard
                                                  ↓
                                         (sync localStorage → Supabase)
```

Login is never required before onboarding or viewing results.

---

## Out of Scope (MVP)

- Payment integration
- Vendor marketplace
- AI chatbot / WhatsApp integration
- Collaboration / multi-user
- Export (PDF/Excel)
- Advanced expense tracking
- Push notifications
- Admin panel
