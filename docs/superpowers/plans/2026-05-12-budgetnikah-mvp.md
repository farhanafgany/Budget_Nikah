# BudgetNikah MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build BudgetNikah MVP — mobile-first wedding planning web app for Indonesian couples with onboarding, readiness scoring, simulation, and dashboard.

**Architecture:** Hybrid SSR+CSR Next.js 14 App Router. Landing and Dashboard are Server Components. Onboarding and Result are Client Components driven by Zustand stores persisted to localStorage. All scoring/allocation/insight logic lives in pure functions in `lib/` with no API calls.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Zustand, Supabase (Auth + PostgreSQL via `@supabase/ssr`), Recharts, Jest + React Testing Library, Vercel

---

## File Map

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                          # Landing (SSR)
│   ├── onboarding/page.tsx               # Onboarding wizard (CSR)
│   ├── result/page.tsx                   # Result + simulation (CSR)
│   ├── dashboard/page.tsx                # Dashboard (SSR, auth-gated)
│   └── auth/
│       ├── login/page.tsx
│       ├── signup/page.tsx
│       └── callback/route.ts             # OAuth callback + sync
├── components/
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── PainCards.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── SimulationPreview.tsx
│   │   └── FinalCTA.tsx
│   ├── onboarding/
│   │   ├── StepWrapper.tsx
│   │   ├── StepNames.tsx
│   │   ├── StepCity.tsx
│   │   ├── StepDate.tsx
│   │   ├── StepBudget.tsx
│   │   ├── StepGuests.tsx
│   │   ├── StepStyle.tsx
│   │   └── StepEventPriority.tsx
│   └── result/
│       ├── ScoreHero.tsx
│       ├── PressureCard.tsx
│       ├── AllocationChart.tsx           # lazy-loaded
│       ├── InsightCards.tsx
│       ├── SimulationControls.tsx
│       └── PremiumTease.tsx
├── lib/
│   ├── cityTiers.ts
│   ├── allocation.ts
│   ├── scoring.ts
│   └── insights.ts
├── stores/
│   ├── onboardingStore.ts
│   ├── authStore.ts
│   └── simulationStore.ts
└── __tests__/
    ├── lib/cityTiers.test.ts
    ├── lib/allocation.test.ts
    ├── lib/scoring.test.ts
    └── lib/insights.test.ts
```

---

## Phase 1: Project Setup

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`

- [ ] **Step 1: Scaffold project**

```bash
cd /Users/m/Projects/Budget_Nikah
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

Expected: project files created in current directory.

- [ ] **Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr zustand recharts date-fns
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom ts-jest @types/jest
```

- [ ] **Step 3: Configure Jest — create `jest.config.ts`**

```ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
}

export default createJestConfig(config)
```

- [ ] **Step 4: Create `jest.setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Add test script to `package.json`**

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch"
}
```

- [ ] **Step 6: Configure Tailwind with custom colors — `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nikah: {
          bg:     '#FAF5F5',
          pink:   '#E8C0CC',
          mauve:  '#C07888',
          deep:   '#6B3545',
          gold:   '#C8A860',
          text:   '#261520',
          muted:  '#9A7888',
          border: '#EDE4E6',
          card:   '#FFFFFF',
        },
      },
      fontFamily: {
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 7: Update `src/app/layout.tsx` with font + base styles**

```tsx
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BudgetNikah — Cek Kesiapan Wedding Kamu',
  description: 'Bantu pasangan Indonesia memahami kesiapan wedding sebelum biaya terasa overwhelming.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} font-jakarta bg-nikah-bg text-nikah-text antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 8: Update `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { box-sizing: border-box; }
}
```

- [ ] **Step 9: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted: style=Default, base color=Neutral, CSS variables=yes.

- [ ] **Step 10: Add shadcn components**

```bash
npx shadcn@latest add button card input select toast slider badge progress
```

- [ ] **Step 11: Commit**

```bash
git init && git add -A
git commit -m "feat: initialize Next.js project with Tailwind, shadcn/ui, and test setup"
```

---

### Task 2: Supabase setup

**Files:**
- Create: `.env.local`, `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/middleware.ts`

- [ ] **Step 1: Create Supabase project (manual)**

Go to https://supabase.com → New project. Save:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- Anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Enable Google OAuth: Authentication → Providers → Google → enable.

- [ ] **Step 2: Create `.env.local`**

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

- [ ] **Step 3: Create `src/lib/supabase/client.ts`**

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 4: Create `src/lib/supabase/server.ts`**

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

- [ ] **Step 5: Create `src/middleware.ts`**

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

- [ ] **Step 6: Run database migrations in Supabase SQL editor**

```sql
-- wedding_profiles
CREATE TABLE wedding_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
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
  ON wedding_profiles FOR ALL USING (user_id = auth.uid());

-- simulations
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
  ON simulations FOR ALL USING (user_id = auth.uid());
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Supabase client, server, middleware, and DB schema"
```

---

## Phase 2: Business Logic (TDD)

### Task 3: City tiers

**Files:**
- Create: `src/lib/cityTiers.ts`, `src/__tests__/lib/cityTiers.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/__tests__/lib/cityTiers.test.ts
import { getCityTier, getCityMultiplier } from '@/lib/cityTiers'

describe('getCityTier', () => {
  it('returns A for Jakarta', () => expect(getCityTier('Jakarta')).toBe('A'))
  it('returns A for Surabaya', () => expect(getCityTier('Surabaya')).toBe('A'))
  it('returns A for Bandung', () => expect(getCityTier('Bandung')).toBe('A'))
  it('returns B for Jogja', () => expect(getCityTier('Jogja')).toBe('B'))
  it('returns B for Solo', () => expect(getCityTier('Solo')).toBe('B'))
  it('returns B for Medan', () => expect(getCityTier('Medan')).toBe('B'))
  it('returns B for Batam', () => expect(getCityTier('Batam')).toBe('B'))
  it('returns C for unknown city', () => expect(getCityTier('Purwokerto')).toBe('C'))
})

describe('getCityMultiplier', () => {
  it('returns 1.25 for Tier A', () => expect(getCityMultiplier('A')).toBe(1.25))
  it('returns 1.00 for Tier B', () => expect(getCityMultiplier('B')).toBe(1.00))
  it('returns 0.85 for Tier C', () => expect(getCityMultiplier('C')).toBe(0.85))
})
```

- [ ] **Step 2: Run to verify fail**

```bash
npm test -- cityTiers --no-coverage
```

Expected: FAIL — `getCityTier` is not defined.

- [ ] **Step 3: Implement `src/lib/cityTiers.ts`**

```ts
export type CityTier = 'A' | 'B' | 'C'

const TIER_A = new Set(['Jakarta', 'Surabaya', 'Bandung'])
const TIER_B = new Set(['Batam', 'Jogja', 'Solo', 'Medan'])

export function getCityTier(city: string): CityTier {
  if (TIER_A.has(city)) return 'A'
  if (TIER_B.has(city)) return 'B'
  return 'C'
}

export function getCityMultiplier(tier: CityTier): number {
  const map: Record<CityTier, number> = { A: 1.25, B: 1.0, C: 0.85 }
  return map[tier]
}

export const TIER_A_CITIES = [...TIER_A]
export const TIER_B_CITIES = [...TIER_B]
export const ALL_CITIES = [...TIER_A, ...TIER_B]
```

- [ ] **Step 4: Run tests to verify pass**

```bash
npm test -- cityTiers --no-coverage
```

Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/cityTiers.ts src/__tests__/lib/cityTiers.test.ts
git commit -m "feat: add city tier mapping with multipliers"
```

---

### Task 4: Budget allocation

**Files:**
- Create: `src/lib/allocation.ts`, `src/__tests__/lib/allocation.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/__tests__/lib/allocation.test.ts
import { calculateAllocation, type AllocationInput } from '@/lib/allocation'

const base: AllocationInput = {
  totalBudget: 100_000_000,
  guestCount: 300,
  weddingStyle: 'elegant',
  planningPriority: 'balanced',
}

describe('calculateAllocation', () => {
  it('returns 8 categories', () => {
    const result = calculateAllocation(base)
    expect(Object.keys(result)).toHaveLength(8)
  })

  it('percentages sum to 100', () => {
    const result = calculateAllocation(base)
    const total = Object.values(result).reduce((s, c) => s + c.percentage, 0)
    expect(total).toBe(100)
  })

  it('estimated amounts sum to totalBudget', () => {
    const result = calculateAllocation(base)
    const total = Object.values(result).reduce((s, c) => s + c.estimatedAmount, 0)
    expect(total).toBe(base.totalBudget)
  })

  it('luxury style has higher venue percentage than simple', () => {
    const luxury = calculateAllocation({ ...base, weddingStyle: 'luxury' })
    const simple = calculateAllocation({ ...base, weddingStyle: 'simple' })
    expect(luxury.venue.percentage).toBeGreaterThan(simple.venue.percentage)
  })

  it('hemat priority has higher emergency fund than experience', () => {
    const hemat = calculateAllocation({ ...base, planningPriority: 'hemat' })
    const exp = calculateAllocation({ ...base, planningPriority: 'experience' })
    expect(hemat.emergencyFund.percentage).toBeGreaterThan(exp.emergencyFund.percentage)
  })
})
```

- [ ] **Step 2: Run to verify fail**

```bash
npm test -- allocation --no-coverage
```

Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/allocation.ts`**

```ts
export type WeddingStyle = 'simple' | 'elegant' | 'luxury' | 'traditional' | 'modern'
export type PlanningPriority = 'hemat' | 'balanced' | 'experience'

export interface AllocationInput {
  totalBudget: number
  guestCount: number
  weddingStyle: WeddingStyle | string
  planningPriority: PlanningPriority | string
}

export interface AllocationCategory {
  percentage: number
  estimatedAmount: number
}

export interface AllocationResult {
  catering: AllocationCategory
  venue: AllocationCategory
  decoration: AllocationCategory
  documentation: AllocationCategory
  mua: AllocationCategory
  souvenir: AllocationCategory
  entertainment: AllocationCategory
  emergencyFund: AllocationCategory
}

type AllocationMap = Record<keyof AllocationResult, number>

const STYLE_BASE: Record<string, AllocationMap> = {
  simple:      { catering:48, venue:16, decoration:11, documentation:6, mua:4, souvenir:6, entertainment:3, emergencyFund:6 },
  elegant:     { catering:42, venue:20, decoration:14, documentation:7, mua:5, souvenir:5, entertainment:4, emergencyFund:3 },
  luxury:      { catering:36, venue:24, decoration:18, documentation:8, mua:6, souvenir:3, entertainment:5, emergencyFund:0 },
  traditional: { catering:50, venue:15, decoration:12, documentation:5, mua:4, souvenir:7, entertainment:2, emergencyFund:5 },
  modern:      { catering:40, venue:18, decoration:15, documentation:9, mua:5, souvenir:4, entertainment:7, emergencyFund:2 },
}

const PRIORITY_DELTA: Record<string, Partial<AllocationMap>> = {
  hemat:      { emergencyFund:+5, decoration:-2, entertainment:-2, mua:-1 },
  balanced:   {},
  experience: { emergencyFund:-3, entertainment:+2, decoration:+2, souvenir:-1 },
}

function applyDelta(base: AllocationMap, delta: Partial<AllocationMap>): AllocationMap {
  const result = { ...base }
  for (const [k, v] of Object.entries(delta)) {
    result[k as keyof AllocationMap] = (result[k as keyof AllocationMap] ?? 0) + (v ?? 0)
  }
  // Normalize to exactly 100
  const total = Object.values(result).reduce((s, n) => s + n, 0)
  if (total !== 100) {
    const diff = 100 - total
    result.catering += diff
  }
  return result
}

export function calculateAllocation(input: AllocationInput): AllocationResult {
  const styleKey = input.weddingStyle in STYLE_BASE ? input.weddingStyle : 'elegant'
  const priorityKey = input.planningPriority in PRIORITY_DELTA ? input.planningPriority : 'balanced'

  const base = STYLE_BASE[styleKey]
  const delta = PRIORITY_DELTA[priorityKey]
  const pct = applyDelta(base, delta)

  const result = {} as AllocationResult
  for (const [k, p] of Object.entries(pct)) {
    result[k as keyof AllocationResult] = {
      percentage: p,
      estimatedAmount: Math.round((p / 100) * input.totalBudget),
    }
  }
  return result
}
```

- [ ] **Step 4: Run tests**

```bash
npm test -- allocation --no-coverage
```

Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/allocation.ts src/__tests__/lib/allocation.test.ts
git commit -m "feat: add budget allocation pure function with style/priority adjustments"
```

---

### Task 5: Readiness scoring

**Files:**
- Create: `src/lib/scoring.ts`, `src/__tests__/lib/scoring.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/__tests__/lib/scoring.test.ts
import { calculateScore, calculatePressureLevel, type ScoreInput } from '@/lib/scoring'
import { calculateAllocation } from '@/lib/allocation'

function makeInput(overrides: Partial<ScoreInput> = {}): ScoreInput {
  const base = {
    totalBudget: 150_000_000,
    guestCount: 300,
    weddingStyle: 'elegant' as const,
    planningPriority: 'balanced' as const,
    weddingCity: 'Jakarta',
  }
  const merged = { ...base, ...overrides }
  return { ...merged, allocation: calculateAllocation(merged) }
}

describe('calculateScore', () => {
  it('returns a number between 0 and 100', () => {
    const { score } = calculateScore(makeInput())
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('reduces score when budget per guest is very low', () => {
    const low = calculateScore(makeInput({ totalBudget: 10_000_000, guestCount: 500 }))
    const ok  = calculateScore(makeInput({ totalBudget: 150_000_000, guestCount: 300 }))
    expect(low.score).toBeLessThan(ok.score)
  })

  it('reduces score for luxury style with insufficient budget', () => {
    const luxury = calculateScore(makeInput({ weddingStyle: 'luxury', totalBudget: 50_000_000 }))
    const simple = calculateScore(makeInput({ weddingStyle: 'simple', totalBudget: 50_000_000 }))
    expect(luxury.score).toBeLessThan(simple.score)
  })

  it('returns Healthy label for high score', () => {
    const { label } = calculateScore(makeInput({ totalBudget: 300_000_000, guestCount: 200 }))
    expect(label).toBe('Healthy')
  })

  it('returns High Risk label for very low score', () => {
    const { label } = calculateScore(makeInput({ totalBudget: 5_000_000, guestCount: 800 }))
    expect(label).toBe('High Risk')
  })

  it('applies city multiplier — Tier A score higher than Tier C', () => {
    const tierA = calculateScore(makeInput({ weddingCity: 'Jakarta' }))
    const tierC = calculateScore(makeInput({ weddingCity: 'Purwokerto' }))
    expect(tierA.score).toBeGreaterThan(tierC.score)
  })
})

describe('calculatePressureLevel', () => {
  it('returns Low for score >= 70', () => expect(calculatePressureLevel(75)).toBe('Low'))
  it('returns Medium for score 40-69', () => expect(calculatePressureLevel(55)).toBe('Medium'))
  it('returns High for score < 40', () => expect(calculatePressureLevel(30)).toBe('High'))
})
```

- [ ] **Step 2: Run to verify fail**

```bash
npm test -- scoring --no-coverage
```

Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/scoring.ts`**

```ts
import { getCityTier, getCityMultiplier } from './cityTiers'
import type { AllocationResult } from './allocation'

export type ReadinessLabel = 'High Risk' | 'Moderate' | 'Healthy'
export type PressureLevel  = 'Low' | 'Medium' | 'High'

export interface ScoreInput {
  totalBudget: number
  guestCount: number
  weddingStyle: string
  planningPriority: string
  weddingCity: string
  allocation: AllocationResult
}

export interface ScoreResult {
  score: number
  label: ReadinessLabel
}

export function calculateScore(input: ScoreInput): ScoreResult {
  const { totalBudget, guestCount, weddingStyle, planningPriority, weddingCity, allocation } = input

  let score = 100
  const budgetPerGuest = guestCount > 0 ? totalBudget / guestCount : 0
  const emergencyPct   = allocation.emergencyFund.percentage

  if (budgetPerGuest < 120_000) score -= 25
  if (weddingStyle === 'luxury' && totalBudget < 100_000_000) score -= 20
  if (weddingStyle === 'elegant' && budgetPerGuest < 180_000)  score -= 10
  if (guestCount > 800)         score -= 10
  if (planningPriority === 'hemat') score += 5
  if (emergencyPct < 10)        score -= 10

  const tier       = getCityTier(weddingCity)
  const multiplier = getCityMultiplier(tier)
  score = score * multiplier

  score = Math.max(0, Math.min(100, Math.round(score)))

  return { score, label: getLabel(score) }
}

function getLabel(score: number): ReadinessLabel {
  if (score >= 70) return 'Healthy'
  if (score >= 40) return 'Moderate'
  return 'High Risk'
}

export function calculatePressureLevel(score: number): PressureLevel {
  if (score >= 70) return 'Low'
  if (score >= 40) return 'Medium'
  return 'High'
}
```

- [ ] **Step 4: Run tests**

```bash
npm test -- scoring --no-coverage
```

Expected: PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/scoring.ts src/__tests__/lib/scoring.test.ts
git commit -m "feat: add readiness scoring pure function with city multiplier"
```

---

### Task 6: Insight engine

**Files:**
- Create: `src/lib/insights.ts`, `src/__tests__/lib/insights.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/__tests__/lib/insights.test.ts
import { generateInsights } from '@/lib/insights'
import { calculateAllocation } from '@/lib/allocation'

const base = {
  totalBudget: 100_000_000,
  guestCount: 300,
  weddingStyle: 'elegant',
  planningPriority: 'balanced',
  weddingCity: 'Jakarta',
}

describe('generateInsights', () => {
  it('returns between 3 and 5 insights', () => {
    const allocation = calculateAllocation(base)
    const insights = generateInsights({ ...base, allocation, score: 65 })
    expect(insights.length).toBeGreaterThanOrEqual(3)
    expect(insights.length).toBeLessThanOrEqual(5)
  })

  it('shows catering insight when catering > 45%', () => {
    const highCatering = { ...base, weddingStyle: 'traditional' }
    const allocation = calculateAllocation(highCatering)
    const insights = generateInsights({ ...highCatering, allocation, score: 60 })
    const hasCatering = insights.some(i => i.type === 'catering_dominant')
    expect(hasCatering).toBe(true)
  })

  it('shows luxury mismatch insight when luxury + low budget', () => {
    const input = { ...base, weddingStyle: 'luxury', totalBudget: 50_000_000 }
    const allocation = calculateAllocation(input)
    const insights = generateInsights({ ...input, allocation, score: 30 })
    const hasLuxury = insights.some(i => i.type === 'luxury_budget_mismatch')
    expect(hasLuxury).toBe(true)
  })

  it('each insight has message, type, and icon', () => {
    const allocation = calculateAllocation(base)
    const insights = generateInsights({ ...base, allocation, score: 65 })
    insights.forEach(i => {
      expect(i).toHaveProperty('message')
      expect(i).toHaveProperty('type')
      expect(i).toHaveProperty('icon')
    })
  })
})
```

- [ ] **Step 2: Run to verify fail**

```bash
npm test -- insights --no-coverage
```

Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/insights.ts`**

```ts
import type { AllocationResult } from './allocation'

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
}

export function generateInsights(input: InsightInput): Insight[] {
  const { allocation, weddingStyle, totalBudget, guestCount, score } = input
  const insights: Insight[] = []

  if (allocation.catering.percentage > 45) {
    insights.push({
      type: 'catering_dominant',
      icon: '🍽️',
      message: 'Catering kemungkinan menjadi pengeluaran terbesar dalam wedding plan ini.',
    })
  }

  if (allocation.emergencyFund.percentage < 10) {
    insights.push({
      type: 'low_emergency_fund',
      icon: '⚠️',
      message: 'Dana darurat wedding masih cukup kecil untuk perubahan mendadak.',
    })
  }

  if (weddingStyle === 'luxury' && totalBudget < 100_000_000) {
    insights.push({
      type: 'luxury_budget_mismatch',
      icon: '💎',
      message: 'Style luxury saat ini mungkin akan memberi tekanan cukup besar pada budget.',
    })
  }

  if (guestCount > 700) {
    insights.push({
      type: 'high_guest_count',
      icon: '👥',
      message: 'Jumlah tamu yang besar dapat meningkatkan tekanan budget secara signifikan.',
    })
  }

  if (score >= 70) {
    insights.push({
      type: 'positive_outlook',
      icon: '✨',
      message: 'Rencana ini terlihat realistis. Pertahankan dana darurat agar lebih tenang.',
    })
  }

  if (insights.length < 3) {
    insights.push({
      type: 'budget_review',
      icon: '💡',
      message: 'Lakukan review budget setiap bulan untuk menjaga rencana tetap on track.',
    })
  }

  return insights.slice(0, 5)
}
```

- [ ] **Step 4: Run tests**

```bash
npm test -- insights --no-coverage
```

Expected: PASS (4 tests).

- [ ] **Step 5: Run all lib tests**

```bash
npm test -- --testPathPattern="__tests__/lib" --no-coverage
```

Expected: All PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/insights.ts src/__tests__/lib/insights.test.ts
git commit -m "feat: add rule-based insight engine"
```

---

## Phase 3: Zustand Stores

### Task 7: onboardingStore

**Files:**
- Create: `src/stores/onboardingStore.ts`

- [ ] **Step 1: Create `src/stores/onboardingStore.ts`**

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface OnboardingData {
  partnerOneName: string
  partnerTwoName: string
  weddingCity: string
  weddingDate: string
  totalBudget: number
  guestCount: number
  weddingStyle: string
  eventType: string
  planningPriority: string
}

interface OnboardingStore extends OnboardingData {
  currentStep: number
  isComplete: () => boolean
  setField: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

const INITIAL: OnboardingData = {
  partnerOneName: '',
  partnerTwoName: '',
  weddingCity: '',
  weddingDate: '',
  totalBudget: 0,
  guestCount: 0,
  weddingStyle: '',
  eventType: '',
  planningPriority: '',
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      ...INITIAL,
      currentStep: 0,
      isComplete: () => {
        const s = get()
        return !!(s.partnerOneName && s.weddingCity && s.totalBudget && s.guestCount && s.weddingStyle && s.planningPriority)
      },
      setField: (key, value) => set({ [key]: value }),
      nextStep: () => set(s => ({ currentStep: s.currentStep + 1 })),
      prevStep: () => set(s => ({ currentStep: Math.max(0, s.currentStep - 1) })),
      reset: () => set({ ...INITIAL, currentStep: 0 }),
    }),
    { name: 'budgetnikah-onboarding' }
  )
)
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/onboardingStore.ts
git commit -m "feat: add onboardingStore with localStorage persistence"
```

---

### Task 8: authStore and simulationStore

**Files:**
- Create: `src/stores/authStore.ts`, `src/stores/simulationStore.ts`

- [ ] **Step 1: Create `src/stores/authStore.ts`**

```ts
import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'

interface AuthStore {
  user: User | null
  session: Session | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  clear: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ user: null, session: null, isLoading: false }),
}))
```

- [ ] **Step 2: Create `src/stores/simulationStore.ts`**

```ts
import { create } from 'zustand'

interface SimulationStore {
  guestCount: number
  weddingStyle: string
  setGuestCount: (n: number) => void
  setWeddingStyle: (s: string) => void
  init: (guestCount: number, weddingStyle: string) => void
}

export const useSimulationStore = create<SimulationStore>((set) => ({
  guestCount: 0,
  weddingStyle: '',
  setGuestCount: (guestCount) => set({ guestCount }),
  setWeddingStyle: (weddingStyle) => set({ weddingStyle }),
  init: (guestCount, weddingStyle) => set({ guestCount, weddingStyle }),
}))
```

- [ ] **Step 3: Commit**

```bash
git add src/stores/authStore.ts src/stores/simulationStore.ts
git commit -m "feat: add authStore and simulationStore"
```

---

## Phase 4: Landing Page

### Task 9: Hero section

**Files:**
- Create: `src/components/landing/Hero.tsx`

- [ ] **Step 1: Create `src/components/landing/Hero.tsx`**

```tsx
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-16 text-center bg-gradient-to-b from-nikah-bg to-[#F5EBF0]">
      {/* Logo */}
      <div className="mb-8 text-sm font-semibold tracking-widest uppercase text-nikah-mauve">
        BudgetNikah
      </div>

      {/* Headline */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-nikah-text leading-tight max-w-xl mb-4">
        Cek Apakah Rencana Weddingmu Sudah Realistis.
      </h1>

      {/* Subheadline */}
      <p className="text-nikah-muted font-light text-base md:text-lg max-w-md mb-10 leading-relaxed">
        BudgetNikah membantu pasangan memahami kesiapan wedding mereka sebelum biaya dan persiapan terasa overwhelming.
      </p>

      {/* CTAs */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/onboarding"
          className="w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center hover:opacity-90 transition"
        >
          Cek Wedding Plan Kamu →
        </Link>
        <a
          href="#simulasi"
          className="w-full border border-nikah-deep text-nikah-deep font-semibold py-4 rounded-full text-sm text-center hover:bg-nikah-pink/30 transition"
        >
          Lihat Contoh Simulasi
        </a>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-4 bg-white/90 backdrop-blur border-t border-nikah-border">
        <Link
          href="/onboarding"
          className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center"
        >
          Mulai Cek Sekarang →
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/Hero.tsx
git commit -m "feat: add Hero section for landing page"
```

---

### Task 10: Pain cards, features, simulation preview, final CTA

**Files:**
- Create: `src/components/landing/PainCards.tsx`, `src/components/landing/FeaturesSection.tsx`, `src/components/landing/SimulationPreview.tsx`, `src/components/landing/FinalCTA.tsx`

- [ ] **Step 1: Create `src/components/landing/PainCards.tsx`**

```tsx
const PAINS = [
  { icon: '😰', text: 'Takut overbudget sebelum hari H' },
  { icon: '😵', text: 'Bingung harus mulai dari mana' },
  { icon: '🤯', text: 'Terlalu banyak keputusan sekaligus' },
  { icon: '💸', text: 'Biaya terus membengkak tanpa kontrol' },
  { icon: '😟', text: 'Takut persiapan berantakan di hari H' },
  { icon: '😓', text: 'Keluarga punya ekspektasi berbeda-beda' },
]

export function PainCards() {
  return (
    <section className="px-6 py-16 bg-white">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-2">
        Kamu tidak sendirian
      </p>
      <h2 className="text-2xl font-extrabold text-center text-nikah-text mb-8">
        Banyak pasangan merasakan hal yang sama
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
        {PAINS.map((p) => (
          <div
            key={p.text}
            className="bg-nikah-bg border border-nikah-border rounded-2xl p-4 flex flex-col items-center gap-2 text-center"
          >
            <span className="text-2xl">{p.icon}</span>
            <p className="text-xs font-medium text-nikah-text leading-snug">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `src/components/landing/FeaturesSection.tsx`**

```tsx
const FEATURES = [
  {
    icon: '📊',
    title: 'Wedding Readiness Score',
    desc: 'Skor deterministik yang menunjukkan seberapa siap rencana wedding kamu secara finansial.',
  },
  {
    icon: '💰',
    title: 'Smart Budget Allocation',
    desc: 'Estimasi alokasi realistis untuk setiap kategori pengeluaran pernikahan.',
  },
  {
    icon: '🎛️',
    title: 'Scenario Simulation',
    desc: 'Ubah jumlah tamu atau gaya wedding dan lihat dampaknya secara real-time.',
  },
  {
    icon: '💡',
    title: 'Smart Recommendations',
    desc: 'Insight berbasis aturan yang membantu kamu melihat risiko tersembunyi dalam rencana.',
  },
]

export function FeaturesSection() {
  return (
    <section className="px-6 py-16 bg-nikah-bg">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-2">
        Fitur Utama
      </p>
      <h2 className="text-2xl font-extrabold text-center text-nikah-text mb-8">
        Semua yang kamu butuhkan
      </h2>
      <div className="flex flex-col gap-4 max-w-md mx-auto">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-2xl p-5 shadow-sm border border-nikah-border flex gap-4 items-start"
          >
            <span className="text-2xl flex-shrink-0">{f.icon}</span>
            <div>
              <h3 className="font-bold text-nikah-text text-sm mb-1">{f.title}</h3>
              <p className="text-nikah-muted text-xs leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `src/components/landing/SimulationPreview.tsx`**

```tsx
export function SimulationPreview() {
  return (
    <section id="simulasi" className="px-6 py-16 bg-white">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-2">
        Lihat Bedanya
      </p>
      <h2 className="text-2xl font-extrabold text-center text-nikah-text mb-8">
        Simulasi mengubah segalanya
      </h2>
      <div className="flex gap-4 max-w-md mx-auto">
        {/* Before */}
        <div className="flex-1 bg-nikah-bg border border-nikah-border rounded-2xl p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-nikah-muted mb-3">Sebelum</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs"><span className="text-nikah-muted">Tamu</span><span className="font-semibold">600 orang</span></div>
            <div className="flex justify-between text-xs"><span className="text-nikah-muted">Gaya</span><span className="font-semibold">Elegant</span></div>
            <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
              <div className="text-2xl font-extrabold text-orange-600">52</div>
              <div className="text-[10px] text-orange-500 font-semibold uppercase tracking-wide">Moderate</div>
            </div>
          </div>
        </div>
        {/* Arrow */}
        <div className="flex items-center text-nikah-mauve font-bold text-lg">→</div>
        {/* After */}
        <div className="flex-1 bg-[#F0F9F0] border border-green-200 rounded-2xl p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-3">Sesudah</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs"><span className="text-nikah-muted">Tamu</span><span className="font-semibold">350 orang</span></div>
            <div className="flex justify-between text-xs"><span className="text-nikah-muted">Gaya</span><span className="font-semibold">Elegant</span></div>
            <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 text-center">
              <div className="text-2xl font-extrabold text-green-700">78</div>
              <div className="text-[10px] text-green-600 font-semibold uppercase tracking-wide">Healthy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `src/components/landing/FinalCTA.tsx`**

```tsx
import Link from 'next/link'

export function FinalCTA() {
  return (
    <section className="px-6 py-20 bg-gradient-to-b from-[#F5EBF0] to-nikah-bg">
      <div className="max-w-md mx-auto bg-nikah-deep rounded-3xl p-8 text-center shadow-xl">
        <p className="text-nikah-pink text-xs font-bold uppercase tracking-widest mb-3">
          Gratis · Tanpa Daftar
        </p>
        <h2 className="text-white text-2xl font-extrabold mb-3 leading-snug">
          Mulai Cek Wedding Plan Kamu
        </h2>
        <p className="text-nikah-pink/80 text-sm font-light mb-6 leading-relaxed">
          Jawab 3 langkah singkat dan dapatkan Wedding Readiness Score kamu sekarang.
        </p>
        <Link
          href="/onboarding"
          className="block w-full bg-white text-nikah-deep font-bold py-4 rounded-full text-sm hover:bg-nikah-pink transition"
        >
          Mulai Sekarang →
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/
git commit -m "feat: add landing page sections (pain, features, simulation preview, CTA)"
```

---

### Task 11: Landing page assembly

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update `src/app/page.tsx`**

```tsx
import { Hero } from '@/components/landing/Hero'
import { PainCards } from '@/components/landing/PainCards'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { SimulationPreview } from '@/components/landing/SimulationPreview'
import { FinalCTA } from '@/components/landing/FinalCTA'

export default function LandingPage() {
  return (
    <main className="pb-20 md:pb-0">
      <Hero />
      <PainCards />
      <FeaturesSection />
      <SimulationPreview />
      <FinalCTA />
    </main>
  )
}
```

- [ ] **Step 2: Run dev server and verify landing page**

```bash
npm run dev
```

Open http://localhost:3000. Verify: hero loads, all sections visible, sticky CTA appears on mobile viewport, CTA links to /onboarding.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble landing page with all sections"
```

---

## Phase 5: Onboarding Flow

### Task 12: StepWrapper component

**Files:**
- Create: `src/components/onboarding/StepWrapper.tsx`

- [ ] **Step 1: Create `src/components/onboarding/StepWrapper.tsx`**

```tsx
'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'

const TOTAL_STEPS = 7

interface StepWrapperProps {
  children: React.ReactNode
  onNext: () => void
  onBack?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  stepIndex: number
}

export function StepWrapper({ children, onNext, onBack, nextLabel = 'Lanjut →', nextDisabled, stepIndex }: StepWrapperProps) {
  const progress = ((stepIndex + 1) / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-nikah-bg flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-nikah-border w-full">
        <div
          className="h-full bg-gradient-to-r from-nikah-mauve to-nikah-deep transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Nav row */}
      <div className="flex items-center justify-between px-5 py-3">
        {onBack ? (
          <button onClick={onBack} className="text-nikah-muted text-sm font-medium">
            ← Kembali
          </button>
        ) : <div />}
        <span className="text-nikah-muted text-xs">
          {stepIndex + 1} / {TOTAL_STEPS}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        {children}
      </div>

      {/* Sticky CTA */}
      <div className="px-6 py-5 bg-nikah-bg border-t border-nikah-border">
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm disabled:opacity-40 transition"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/onboarding/StepWrapper.tsx
git commit -m "feat: add StepWrapper with progress bar and sticky CTA"
```

---

### Task 13: Onboarding steps 1–5

**Files:**
- Create: `src/components/onboarding/StepNames.tsx`, `StepCity.tsx`, `StepDate.tsx`, `StepBudget.tsx`, `StepGuests.tsx`

- [ ] **Step 1: Create `src/components/onboarding/StepNames.tsx`**

```tsx
'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'

export function StepNames() {
  const { partnerOneName, partnerTwoName, setField, nextStep } = useOnboardingStore()
  const canNext = partnerOneName.trim().length > 0

  return (
    <StepWrapper stepIndex={0} onNext={nextStep} nextDisabled={!canNext}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Pasangan</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Siapa nama kalian?</h2>
      <p className="text-nikah-muted text-sm mb-8 font-light">Untuk personalisasi rencana wedding kalian.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-nikah-text mb-1.5">Nama kamu</label>
          <input
            type="text"
            value={partnerOneName}
            onChange={e => setField('partnerOneName', e.target.value)}
            placeholder="Contoh: Siti Nurhaliza"
            className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm text-nikah-text placeholder:text-nikah-muted focus:outline-none focus:border-nikah-mauve transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-nikah-text mb-1.5">Nama pasangan</label>
          <input
            type="text"
            value={partnerTwoName}
            onChange={e => setField('partnerTwoName', e.target.value)}
            placeholder="Contoh: Ahmad Dhani"
            className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm text-nikah-text placeholder:text-nikah-muted focus:outline-none focus:border-nikah-mauve transition"
          />
        </div>
      </div>
    </StepWrapper>
  )
}
```

- [ ] **Step 2: Create `src/components/onboarding/StepCity.tsx`**

```tsx
'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'
import { ALL_CITIES, TIER_A_CITIES, TIER_B_CITIES } from '@/lib/cityTiers'

const OTHER_CITIES = ['Makassar', 'Semarang', 'Palembang', 'Balikpapan', 'Pontianak', 'Manado', 'Denpasar', 'Pekanbaru', 'Lainnya']

export function StepCity() {
  const { weddingCity, setField, nextStep, prevStep } = useOnboardingStore()

  return (
    <StepWrapper stepIndex={1} onNext={nextStep} onBack={prevStep} nextDisabled={!weddingCity}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Lokasi</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Di kota mana?</h2>
      <p className="text-nikah-muted text-sm mb-6 font-light">Harga layanan berbeda di tiap kota.</p>

      <div>
        <label className="block text-xs font-bold text-nikah-text mb-1.5">Kota pernikahan</label>
        <select
          value={weddingCity}
          onChange={e => setField('weddingCity', e.target.value)}
          className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm text-nikah-text focus:outline-none focus:border-nikah-mauve transition"
        >
          <option value="">Pilih kota...</option>
          <optgroup label="Kota Besar (Tier A)">
            {TIER_A_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </optgroup>
          <optgroup label="Kota Menengah (Tier B)">
            {TIER_B_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </optgroup>
          <optgroup label="Kota Lainnya">
            {OTHER_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </optgroup>
        </select>
      </div>
    </StepWrapper>
  )
}
```

- [ ] **Step 3: Create `src/components/onboarding/StepDate.tsx`**

```tsx
'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'

export function StepDate() {
  const { weddingDate, setField, nextStep, prevStep } = useOnboardingStore()

  return (
    <StepWrapper stepIndex={2} onNext={nextStep} onBack={prevStep} nextDisabled={!weddingDate}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Tanggal</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Kapan rencananya?</h2>
      <p className="text-nikah-muted text-sm mb-8 font-light">Estimasi hari H kamu.</p>

      <div>
        <label className="block text-xs font-bold text-nikah-text mb-1.5">Tanggal rencana</label>
        <input
          type="date"
          value={weddingDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={e => setField('weddingDate', e.target.value)}
          className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm text-nikah-text focus:outline-none focus:border-nikah-mauve transition"
        />
      </div>
    </StepWrapper>
  )
}
```

- [ ] **Step 4: Create `src/components/onboarding/StepBudget.tsx`**

```tsx
'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID').format(n)
}

function parseRupiah(s: string) {
  return parseInt(s.replace(/\D/g, ''), 10) || 0
}

export function StepBudget() {
  const { totalBudget, setField, nextStep, prevStep } = useOnboardingStore()

  return (
    <StepWrapper stepIndex={3} onNext={nextStep} onBack={prevStep} nextDisabled={totalBudget <= 0}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Budget</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Berapa total budget?</h2>
      <p className="text-nikah-muted text-sm mb-8 font-light">Total biaya yang kalian siapkan.</p>

      <div>
        <label className="block text-xs font-bold text-nikah-text mb-1.5">Total budget</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-nikah-mauve">Rp</span>
          <input
            type="text"
            inputMode="numeric"
            value={totalBudget > 0 ? formatRupiah(totalBudget) : ''}
            onChange={e => setField('totalBudget', parseRupiah(e.target.value))}
            placeholder="150.000.000"
            className="w-full bg-white border border-nikah-border rounded-xl pl-10 pr-4 py-3 text-sm text-nikah-text placeholder:text-nikah-muted focus:outline-none focus:border-nikah-mauve transition"
          />
        </div>
        <p className="text-nikah-muted text-xs mt-2">
          Contoh: 80jt untuk intimate, 150–200jt untuk 300 tamu, 300jt+ untuk luxury
        </p>
      </div>
    </StepWrapper>
  )
}
```

- [ ] **Step 5: Create `src/components/onboarding/StepGuests.tsx`**

```tsx
'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'

export function StepGuests() {
  const { guestCount, setField, nextStep, prevStep } = useOnboardingStore()

  return (
    <StepWrapper stepIndex={4} onNext={nextStep} onBack={prevStep} nextDisabled={guestCount <= 0}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Tamu</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Berapa jumlah tamu?</h2>
      <p className="text-nikah-muted text-sm mb-8 font-light">Perkiraan total undangan dua keluarga.</p>

      <div>
        <label className="block text-xs font-bold text-nikah-text mb-1.5">Jumlah tamu</label>
        <input
          type="number"
          inputMode="numeric"
          value={guestCount || ''}
          onChange={e => setField('guestCount', parseInt(e.target.value, 10) || 0)}
          placeholder="300"
          min={1}
          max={3000}
          className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm text-nikah-text placeholder:text-nikah-muted focus:outline-none focus:border-nikah-mauve transition"
        />
        <p className="text-nikah-muted text-xs mt-2">
          Contoh: 100–200 intimate · 300–500 standar · 500+ besar
        </p>
      </div>
    </StepWrapper>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/onboarding/Step*.tsx
git commit -m "feat: add onboarding steps 1-5 (names, city, date, budget, guests)"
```

---

### Task 14: Onboarding steps 6–7

**Files:**
- Create: `src/components/onboarding/StepStyle.tsx`, `src/components/onboarding/StepEventPriority.tsx`

- [ ] **Step 1: Create `src/components/onboarding/StepStyle.tsx`**

```tsx
'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'

const STYLES = [
  { value: 'simple',      label: 'Simple',      icon: '🌿', desc: 'Bersih, minimalis, tanpa berlebihan' },
  { value: 'elegant',     label: 'Elegant',     icon: '🌸', desc: 'Rapi, berkelas, detail yang indah' },
  { value: 'luxury',      label: 'Luxury',      icon: '💎', desc: 'Mewah, grand, kesan yang tak terlupakan' },
  { value: 'traditional', label: 'Traditional', icon: '🏮', desc: 'Adat dan budaya sebagai jiwa acara' },
  { value: 'modern',      label: 'Modern',      icon: '✨', desc: 'Kontemporer, stylish, penuh karakter' },
]

export function StepStyle() {
  const { weddingStyle, setField, nextStep, prevStep } = useOnboardingStore()

  return (
    <StepWrapper stepIndex={5} onNext={nextStep} onBack={prevStep} nextDisabled={!weddingStyle}>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Gaya</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Gaya wedding impian?</h2>
      <p className="text-nikah-muted text-sm mb-6 font-light">Pilih yang paling menggambarkan visi kalian.</p>

      <div className="space-y-3">
        {STYLES.map(s => (
          <button
            key={s.value}
            onClick={() => setField('weddingStyle', s.value)}
            className={`w-full flex items-center gap-4 bg-white border-2 rounded-2xl px-4 py-3.5 text-left transition ${
              weddingStyle === s.value
                ? 'border-nikah-deep bg-[#F5E8EC]'
                : 'border-nikah-border hover:border-nikah-mauve'
            }`}
          >
            <span className="text-2xl flex-shrink-0">{s.icon}</span>
            <div>
              <p className="font-bold text-nikah-text text-sm">{s.label}</p>
              <p className="text-nikah-muted text-xs">{s.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </StepWrapper>
  )
}
```

- [ ] **Step 2: Create `src/components/onboarding/StepEventPriority.tsx`**

```tsx
'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepWrapper } from './StepWrapper'
import { useRouter } from 'next/navigation'

const EVENT_TYPES = [
  { value: 'akad_resepsi', label: 'Akad + Resepsi', icon: '💍' },
  { value: 'resepsi',      label: 'Resepsi Saja',   icon: '🎊' },
  { value: 'akad',         label: 'Akad Saja',      icon: '📿' },
  { value: 'intimate',     label: 'Intimate',        icon: '🕯️' },
]

const PRIORITIES = [
  { value: 'hemat',      label: 'Hemat Cerdas',     desc: 'Maksimalkan nilai di setiap rupiah' },
  { value: 'balanced',   label: 'Seimbang',          desc: 'Balance antara kualitas dan budget' },
  { value: 'experience', label: 'Kesan Tak Terlupakan', desc: 'Pengalaman adalah prioritas utama' },
]

export function StepEventPriority() {
  const { eventType, planningPriority, setField, prevStep } = useOnboardingStore()
  const router = useRouter()
  const canNext = !!eventType && !!planningPriority

  function handleNext() {
    router.push('/result')
  }

  return (
    <StepWrapper
      stepIndex={6}
      onNext={handleNext}
      onBack={prevStep}
      nextLabel="Lihat Hasil →"
      nextDisabled={!canNext}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Terakhir</p>
      <h2 className="text-2xl font-extrabold text-nikah-text mb-1">Jenis acara & prioritas</h2>
      <p className="text-nikah-muted text-sm mb-6 font-light">Dua pertanyaan terakhir!</p>

      <div className="mb-6">
        <p className="text-xs font-bold text-nikah-text mb-3">Jenis acara</p>
        <div className="grid grid-cols-2 gap-2">
          {EVENT_TYPES.map(e => (
            <button
              key={e.value}
              onClick={() => setField('eventType', e.value)}
              className={`flex flex-col items-center gap-1.5 bg-white border-2 rounded-2xl p-3 transition ${
                eventType === e.value ? 'border-nikah-deep bg-[#F5E8EC]' : 'border-nikah-border hover:border-nikah-mauve'
              }`}
            >
              <span className="text-xl">{e.icon}</span>
              <span className="text-xs font-semibold text-nikah-text text-center leading-snug">{e.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-nikah-text mb-3">Prioritas perencanaan</p>
        <div className="space-y-2">
          {PRIORITIES.map(p => (
            <button
              key={p.value}
              onClick={() => setField('planningPriority', p.value)}
              className={`w-full flex flex-col bg-white border-2 rounded-2xl px-4 py-3 text-left transition ${
                planningPriority === p.value ? 'border-nikah-deep bg-[#F5E8EC]' : 'border-nikah-border hover:border-nikah-mauve'
              }`}
            >
              <span className="font-bold text-nikah-text text-sm">{p.label}</span>
              <span className="text-nikah-muted text-xs">{p.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </StepWrapper>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/onboarding/StepStyle.tsx src/components/onboarding/StepEventPriority.tsx
git commit -m "feat: add onboarding steps 6-7 (style, event type, planning priority)"
```

---

### Task 15: Onboarding page assembly

**Files:**
- Create: `src/app/onboarding/page.tsx`

- [ ] **Step 1: Create `src/app/onboarding/page.tsx`**

```tsx
'use client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StepNames }         from '@/components/onboarding/StepNames'
import { StepCity }          from '@/components/onboarding/StepCity'
import { StepDate }          from '@/components/onboarding/StepDate'
import { StepBudget }        from '@/components/onboarding/StepBudget'
import { StepGuests }        from '@/components/onboarding/StepGuests'
import { StepStyle }         from '@/components/onboarding/StepStyle'
import { StepEventPriority } from '@/components/onboarding/StepEventPriority'

const STEPS = [
  StepNames,
  StepCity,
  StepDate,
  StepBudget,
  StepGuests,
  StepStyle,
  StepEventPriority,
]

export default function OnboardingPage() {
  const currentStep = useOnboardingStore(s => s.currentStep)
  const Step = STEPS[Math.min(currentStep, STEPS.length - 1)]
  return <Step />
}
```

- [ ] **Step 2: Run dev server and test onboarding flow**

```bash
npm run dev
```

Navigate to http://localhost:3000/onboarding. Verify:
- Progress bar advances each step
- Back button works
- Data persists on page refresh (localStorage)
- Step 7 "Lihat Hasil →" navigates to /result

- [ ] **Step 3: Commit**

```bash
git add src/app/onboarding/page.tsx
git commit -m "feat: assemble onboarding page with 7-step quiz flow"
```

---

## Phase 6: Result Page

### Task 16: Result page components

**Files:**
- Create: `src/components/result/ScoreHero.tsx`, `src/components/result/PressureCard.tsx`, `src/components/result/InsightCards.tsx`

- [ ] **Step 1: Create `src/components/result/ScoreHero.tsx`**

```tsx
import type { ReadinessLabel } from '@/lib/scoring'

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
}

export function ScoreHero({ score, label }: Props) {
  return (
    <div className="bg-gradient-to-b from-[#F5E8EC] to-[#EDD6DE] rounded-3xl p-7 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-3">Hasil Analisis</p>
      <div className="text-[64px] font-extrabold text-nikah-deep leading-none mb-2">{score}</div>
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-3">Wedding Readiness Score</p>
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 ${LABEL_COLORS[label]}`}>
        ✓ {label}
      </span>
      <p className="text-nikah-text text-sm font-light leading-relaxed italic">
        "{QUOTES[label]}"
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/result/PressureCard.tsx`**

```tsx
import type { PressureLevel } from '@/lib/scoring'
import type { AllocationResult } from '@/lib/allocation'

const LEVEL_STYLE: Record<PressureLevel, { badge: string; label: string }> = {
  Low:    { badge: 'bg-green-100 text-green-700',  label: 'Rendah' },
  Medium: { badge: 'bg-orange-100 text-orange-700', label: 'Sedang' },
  High:   { badge: 'bg-red-100 text-red-700',      label: 'Tinggi' },
}

interface Props {
  pressureLevel: PressureLevel
  allocation: AllocationResult
}

function getBiggestCategory(allocation: AllocationResult): string {
  const labels: Record<keyof AllocationResult, string> = {
    catering: 'Catering', venue: 'Venue', decoration: 'Dekorasi',
    documentation: 'Dokumentasi', mua: 'MUA', souvenir: 'Souvenir',
    entertainment: 'Hiburan', emergencyFund: 'Dana Darurat',
  }
  const biggest = Object.entries(allocation).sort((a, b) => b[1].percentage - a[1].percentage)[0]
  return labels[biggest[0] as keyof AllocationResult] ?? biggest[0]
}

export function PressureCard({ pressureLevel, allocation }: Props) {
  const { badge, label } = LEVEL_STYLE[pressureLevel]
  const biggest = getBiggestCategory(allocation)

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-nikah-border">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve">Tekanan Budget</p>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badge}`}>{label}</span>
      </div>
      <p className="text-sm text-nikah-muted leading-relaxed">
        <span className="font-semibold text-nikah-text">{biggest}</span> mendominasi pengeluaran.{' '}
        {pressureLevel === 'High' && 'Pertimbangkan penyesuaian signifikan pada rencana ini.'}
        {pressureLevel === 'Medium' && 'Pertimbangkan menyesuaikan jumlah tamu atau gaya wedding.'}
        {pressureLevel === 'Low' && 'Rencana ini tampak seimbang dan manageable.'}
      </p>
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/result/InsightCards.tsx`**

```tsx
import type { Insight } from '@/lib/insights'

export function InsightCards({ insights }: { insights: Insight[] }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve">Smart Insights</p>
      {insights.map((insight) => (
        <div
          key={insight.type}
          className="bg-white rounded-2xl p-4 border border-nikah-border flex gap-3 items-start shadow-sm"
        >
          <span className="text-xl flex-shrink-0">{insight.icon}</span>
          <p className="text-sm text-nikah-text leading-relaxed">{insight.message}</p>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/result/ScoreHero.tsx src/components/result/PressureCard.tsx src/components/result/InsightCards.tsx
git commit -m "feat: add result page components (ScoreHero, PressureCard, InsightCards)"
```

---

### Task 17: AllocationChart, SimulationControls, PremiumTease

**Files:**
- Create: `src/components/result/AllocationChart.tsx`, `src/components/result/SimulationControls.tsx`, `src/components/result/PremiumTease.tsx`

- [ ] **Step 1: Create `src/components/result/AllocationChart.tsx`**

```tsx
'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { AllocationResult } from '@/lib/allocation'

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
    color: COLORS[i % COLORS.length],
  }))

  return (
    <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-4">Alokasi Budget</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => `${v}%`} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-1.5 mt-2">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-[11px] text-nikah-muted">{d.name} {d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/result/SimulationControls.tsx`**

```tsx
'use client'
import { useSimulationStore } from '@/stores/simulationStore'

const STYLES = ['simple', 'elegant', 'luxury', 'traditional', 'modern']
const STYLE_LABELS: Record<string, string> = {
  simple:'Simple', elegant:'Elegant', luxury:'Luxury', traditional:'Traditional', modern:'Modern',
}

export function SimulationControls() {
  const { guestCount, weddingStyle, setGuestCount, setWeddingStyle } = useSimulationStore()

  return (
    <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-4">Simulasi Skenario</p>

      {/* Guest count slider */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-nikah-text">Jumlah Tamu</span>
          <span className="text-sm font-extrabold text-nikah-deep">{guestCount} orang</span>
        </div>
        <input
          type="range"
          min={50}
          max={1000}
          step={25}
          value={guestCount}
          onChange={e => setGuestCount(Number(e.target.value))}
          className="w-full accent-nikah-deep"
        />
        <div className="flex justify-between text-[10px] text-nikah-muted mt-1">
          <span>50</span><span>1000</span>
        </div>
      </div>

      {/* Style switcher */}
      <div>
        <span className="text-xs font-bold text-nikah-text block mb-2">Gaya Wedding</span>
        <div className="flex flex-wrap gap-2">
          {STYLES.map(s => (
            <button
              key={s}
              onClick={() => setWeddingStyle(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                weddingStyle === s
                  ? 'bg-nikah-deep text-white border-nikah-deep'
                  : 'bg-nikah-bg text-nikah-muted border-nikah-border hover:border-nikah-mauve'
              }`}
            >
              {STYLE_LABELS[s]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/result/PremiumTease.tsx`**

```tsx
const LOCKED = [
  { icon: '🎛️', title: 'Simulasi Tak Terbatas',    desc: 'Simpan dan bandingkan banyak skenario' },
  { icon: '📅', title: 'Timeline Planner',          desc: 'Jadwal persiapan month-by-month otomatis' },
  { icon: '🔍', title: 'Advanced Wedding Insights', desc: 'Analisis mendalam per kategori pengeluaran' },
]

export function PremiumTease() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve">Fitur Premium</p>
      {LOCKED.map(item => (
        <div key={item.title} className="bg-white rounded-2xl p-4 border border-dashed border-nikah-border flex items-center gap-3 opacity-70">
          <span className="text-xl">🔒</span>
          <div>
            <p className="text-xs font-bold text-nikah-text">{item.title}</p>
            <p className="text-[11px] text-nikah-muted">{item.desc}</p>
          </div>
        </div>
      ))}
      <button className="w-full bg-nikah-gold text-white font-bold py-3.5 rounded-full text-sm mt-2 hover:opacity-90 transition">
        Unlock Full Planner ✦
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/result/
git commit -m "feat: add AllocationChart, SimulationControls, and PremiumTease components"
```

---

### Task 18: Result page assembly

**Files:**
- Create: `src/app/result/page.tsx`

- [ ] **Step 1: Create `src/app/result/page.tsx`**

```tsx
'use client'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useSimulationStore } from '@/stores/simulationStore'
import { calculateAllocation } from '@/lib/allocation'
import { calculateScore, calculatePressureLevel } from '@/lib/scoring'
import { generateInsights } from '@/lib/insights'
import { ScoreHero }         from '@/components/result/ScoreHero'
import { PressureCard }      from '@/components/result/PressureCard'
import { InsightCards }      from '@/components/result/InsightCards'
import { SimulationControls } from '@/components/result/SimulationControls'
import { PremiumTease }      from '@/components/result/PremiumTease'

const AllocationChart = dynamic(() => import('@/components/result/AllocationChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl p-5 border border-nikah-border animate-pulse">
      <div className="h-3 w-24 bg-nikah-border rounded mb-4" />
      <div className="h-48 bg-nikah-bg rounded-xl" />
    </div>
  ),
})

export default function ResultPage() {
  const router = useRouter()
  const onboarding = useOnboardingStore()
  const sim = useSimulationStore()

  useEffect(() => {
    if (!onboarding.isComplete()) {
      router.replace('/onboarding')
    } else {
      sim.init(onboarding.guestCount, onboarding.weddingStyle)
    }
  }, [])

  const { allocation, scoreResult, pressureLevel, insights } = useMemo(() => {
    const alloc = calculateAllocation({
      totalBudget: onboarding.totalBudget,
      guestCount: sim.guestCount || onboarding.guestCount,
      weddingStyle: sim.weddingStyle || onboarding.weddingStyle,
      planningPriority: onboarding.planningPriority,
    })
    const sr = calculateScore({
      totalBudget: onboarding.totalBudget,
      guestCount: sim.guestCount || onboarding.guestCount,
      weddingStyle: sim.weddingStyle || onboarding.weddingStyle,
      planningPriority: onboarding.planningPriority,
      weddingCity: onboarding.weddingCity,
      allocation: alloc,
    })
    return {
      allocation: alloc,
      scoreResult: sr,
      pressureLevel: calculatePressureLevel(sr.score),
      insights: generateInsights({
        totalBudget: onboarding.totalBudget,
        guestCount: sim.guestCount || onboarding.guestCount,
        weddingStyle: sim.weddingStyle || onboarding.weddingStyle,
        planningPriority: onboarding.planningPriority,
        weddingCity: onboarding.weddingCity,
        allocation: alloc,
        score: sr.score,
      }),
    }
  }, [onboarding.totalBudget, onboarding.planningPriority, onboarding.weddingCity,
      sim.guestCount, sim.weddingStyle])

  if (!onboarding.isComplete()) return null

  return (
    <main className="min-h-screen bg-nikah-bg pb-32">
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <ScoreHero score={scoreResult.score} label={scoreResult.label} />
        <PressureCard pressureLevel={pressureLevel} allocation={allocation} />
        <AllocationChart allocation={allocation} />
        <InsightCards insights={insights} />
        <SimulationControls />
        <PremiumTease />
      </div>

      {/* Sticky save CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/90 backdrop-blur border-t border-nikah-border">
        <Link
          href="/auth/login"
          className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center"
        >
          Simpan Hasil Ini →
        </Link>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Run dev server and test result page end-to-end**

```bash
npm run dev
```

Complete onboarding at /onboarding, verify /result shows:
- Score hero with gradient and correct number
- Pressure card
- Allocation chart (lazy-loaded, skeleton then chart)
- 3–5 insight cards
- Simulation slider updates score in real-time
- Style switcher buttons update score

- [ ] **Step 3: Commit**

```bash
git add src/app/result/page.tsx
git commit -m "feat: assemble result page with real-time simulation"
```

---

## Phase 7: Auth Flow

### Task 19: Login and signup pages

**Files:**
- Create: `src/app/auth/login/page.tsx`, `src/app/auth/signup/page.tsx`, `src/app/auth/callback/route.ts`

- [ ] **Step 1: Create `src/app/auth/login/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useOnboardingStore } from '@/stores/onboardingStore'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()
  const onboarding = useOnboardingStore()

  async function syncAndRedirect(userId: string) {
    if (onboarding.isComplete()) {
      const supabase = createClient()
      const { getCityTier } = await import('@/lib/cityTiers')
      const { calculateAllocation } = await import('@/lib/allocation')
      const { calculateScore, calculatePressureLevel } = await import('@/lib/scoring')

      const alloc = calculateAllocation({
        totalBudget: onboarding.totalBudget,
        guestCount: onboarding.guestCount,
        weddingStyle: onboarding.weddingStyle,
        planningPriority: onboarding.planningPriority,
      })
      const sr = calculateScore({
        totalBudget: onboarding.totalBudget,
        guestCount: onboarding.guestCount,
        weddingStyle: onboarding.weddingStyle,
        planningPriority: onboarding.planningPriority,
        weddingCity: onboarding.weddingCity,
        allocation: alloc,
      })

      await supabase.from('wedding_profiles').upsert({
        user_id: userId,
        partner_one_name: onboarding.partnerOneName,
        partner_two_name: onboarding.partnerTwoName,
        wedding_city: onboarding.weddingCity,
        city_tier: getCityTier(onboarding.weddingCity),
        wedding_date: onboarding.weddingDate || null,
        total_budget: onboarding.totalBudget,
        guest_count: onboarding.guestCount,
        wedding_style: onboarding.weddingStyle,
        event_type: onboarding.eventType,
        planning_priority: onboarding.planningPriority,
        readiness_score: sr.score,
        pressure_level: calculatePressureLevel(sr.score),
        allocation_result: alloc,
      }, { onConflict: 'user_id' })

      onboarding.reset()
    }
    router.replace('/dashboard')
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError('Login gagal. Silakan coba lagi.'); setLoading(false); return }
    await syncAndRedirect(data.user.id)
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen bg-nikah-bg flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-2">BudgetNikah</p>
        <h1 className="text-2xl font-extrabold text-nikah-text text-center mb-1">Masuk</h1>
        <p className="text-nikah-muted text-sm text-center mb-8 font-light">Simpan hasil dan akses dashboard kamu</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleEmail} className="space-y-3">
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" required
            className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-nikah-mauve"
          />
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" required
            className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-nikah-mauve"
          />
          <button
            type="submit" disabled={loading}
            className="w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Masuk →'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-nikah-border" />
          <span className="text-nikah-muted text-xs">atau</span>
          <div className="flex-1 h-px bg-nikah-border" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full bg-white border border-nikah-border text-nikah-text font-semibold py-4 rounded-full text-sm flex items-center justify-center gap-2 hover:bg-nikah-bg transition"
        >
          <span>G</span> Masuk dengan Google
        </button>

        <p className="text-center text-nikah-muted text-xs mt-6">
          Belum punya akun?{' '}
          <Link href="/auth/signup" className="text-nikah-deep font-semibold">Daftar</Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/app/auth/signup/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)
  const [loading, setLoading]   = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (err) { setError('Pendaftaran gagal. Coba lagi.'); setLoading(false); return }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-nikah-bg flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-xl font-extrabold text-nikah-text mb-2">Cek email kamu</h2>
          <p className="text-nikah-muted text-sm">Kami kirim link konfirmasi ke <strong>{email}</strong>.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-nikah-bg flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-2">BudgetNikah</p>
        <h1 className="text-2xl font-extrabold text-nikah-text text-center mb-1">Daftar</h1>
        <p className="text-nikah-muted text-sm text-center mb-8 font-light">Buat akun gratis kamu</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-3">
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" required
            className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-nikah-mauve"
          />
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password (min. 6 karakter)" required minLength={6}
            className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-nikah-mauve"
          />
          <button
            type="submit" disabled={loading}
            className="w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Daftar →'}
          </button>
        </form>

        <p className="text-center text-nikah-muted text-xs mt-6">
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="text-nikah-deep font-semibold">Masuk</Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `src/app/auth/callback/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { createClient }  from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/auth/
git commit -m "feat: add login, signup, and OAuth callback with localStorage sync"
```

---

## Phase 8: Dashboard

### Task 20: Dashboard components and page

**Files:**
- Create: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Create `src/app/dashboard/page.tsx`**

```tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { calculatePressureLevel } from '@/lib/scoring'
import type { PressureLevel } from '@/lib/scoring'

const LABEL_COLORS: Record<string, string> = {
  Healthy:   'text-green-700 bg-green-100',
  Moderate:  'text-orange-700 bg-orange-100',
  'High Risk':'text-red-700 bg-red-100',
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

function formatRupiah(n: number) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)}jt`
  return `Rp ${n.toLocaleString('id-ID')}`
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
          <div className="text-4xl mb-4">💍</div>
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

  const days    = daysUntil(profile.wedding_date)
  const score   = profile.readiness_score as number
  const label   = score >= 70 ? 'Healthy' : score >= 40 ? 'Moderate' : 'High Risk'
  const pressure = calculatePressureLevel(score)
  const alloc   = profile.allocation_result as Record<string, { percentage: number; estimatedAmount: number }> | null
  const top3    = alloc
    ? Object.entries(alloc).sort((a, b) => b[1].percentage - a[1].percentage).slice(0, 3)
    : []

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

        {/* Readiness summary */}
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
        {days !== null && (
          <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-1">Hitung Mundur</p>
              <p className="text-nikah-muted text-sm">Hari menuju hari H</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-nikah-deep">{days > 0 ? days : 0}</div>
              <div className="text-xs text-nikah-muted">hari lagi</div>
            </div>
          </div>
        )}

        {/* Biggest risk */}
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
            <p className="text-nikah-muted text-xs mb-3">Total: <strong className="text-nikah-text">{formatRupiah(profile.total_budget)}</strong></p>
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

        {/* Simulation shortcut */}
        <Link
          href="/result"
          className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center hover:opacity-90 transition"
        >
          🎛️ Buka Simulasi →
        </Link>

      </div>
    </main>
  )
}
```

- [ ] **Step 2: Run dev server and test full flow**

```bash
npm run dev
```

Test complete flow:
1. /onboarding → complete all 7 steps
2. /result → verify score, chart, simulation
3. Click "Simpan Hasil Ini" → /auth/login → register
4. /dashboard → verify profile data loaded from Supabase

- [ ] **Step 3: Run all tests**

```bash
npm test --no-coverage
```

Expected: All lib tests PASS.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete BudgetNikah MVP — dashboard, auth flow, full user journey"
```

---

## Self-Review Checklist

- [x] Landing page with 5 sections ✓
- [x] Onboarding 7 steps, quiz-style, localStorage persist ✓
- [x] Readiness score pure function (scoring.ts) ✓
- [x] Budget allocation pure function (allocation.ts) ✓
- [x] City tier multipliers ✓
- [x] Rule-based insights (3–5 cards) ✓
- [x] Result page layout B — narrative, big score hero ✓
- [x] Recharts pie chart lazy-loaded with skeleton ✓
- [x] Real-time simulation (slider + style switcher) via simulationStore ✓
- [x] Premium tease locked cards ✓
- [x] Sticky save CTA on result page ✓
- [x] Auth flow (email + Google OAuth) ✓
- [x] Post-login sync localStorage → Supabase (upsert) ✓
- [x] RLS policies on both tables ✓
- [x] Dashboard SSR from Supabase ✓
- [x] Dashboard empty state ✓
- [x] Middleware protects /dashboard ✓
- [x] Loading skeleton for chart ✓
- [x] No AI, no exact pricing, no random scoring ✓
