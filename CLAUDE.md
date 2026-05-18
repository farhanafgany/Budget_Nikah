# BudgetNikah Claude Design V2 — Project Context

## Overview

Project eksperimen untuk membandingkan arah desain baru BudgetNikah dari Claude, bukan folder asli utama.

BudgetNikah adalah mobile-first wedding planning web app untuk pasangan Indonesia. Tujuannya membantu pasangan memahami apakah rencana pernikahan mereka realistis, mensimulasikan keputusan, dan memberi kejelasan finansial + emosional.

**Nuansa yang diinginkan:** calming, elegant, emotionally supportive. BUKAN finance dashboard, BUKAN fintech, dan BUKAN hard-selling agresif.

## Communication

- Komunikasi dengan user dalam **Bahasa Indonesia**.
- Kode, nama variabel, nama file tetap dalam Bahasa Inggris.
- Jangan redesign besar-besaran tanpa konfirmasi.
- Untuk pass desain sekarang, fokus pada flow, conversion, mobile UX, spacing, teks, tombol, dan bug visual yang jelas.
- Kalau mau mengubah layout desktop besar atau mobile besar, konfirmasi dulu sebelum implementasi.

## Current Safe Restore Point

Design terakhir yang disetujui dari sesi Codex ini sudah dikembalikan ke commit:

```text
a4e194b Polish premium payment flow and mobile UX
```

Perubahan desain besar dari Claude Code yang terjadi setelah itu sudah dibackup di branch:

```text
backup/claude-misfire-20260518
```

Jangan mengambil perubahan dari backup branch itu tanpa review dan konfirmasi user.

## Latest Status (2026-05-18)

- Branch aktif sudah reset ke `a4e194b`.
- Worktree bersih sebelum update instruksi ini.
- Landing, onboarding, result, premium, payment popup, success, dan dashboard sudah pernah dicek di localhost pada sesi Codex ini.
- Mobile visual pass sudah pernah dicek di viewport `390px` dan `430px`.
- Verifikasi terakhir sebelum restore:
  - `npm run build` pass
  - `npx tsc --noEmit` pass
  - `npm test -- --runInBand` pass, 47 tests
- Setelah restore, dev server project ini belum tentu aktif. Jalankan `npm run dev` dan ikuti port yang muncul di terminal.

## Adaptive Layout Hybrid Strategy

Project ini memakai strategi **adaptive layout hybrid** antara versi desktop/web dan mobile.

Aturan penting:

- Desktop dan mobile boleh punya layout berbeda kalau itu membuat UX lebih baik.
- Jangan menganggap desain desktop otomatis harus mengubah mobile.
- Jangan menganggap desain mobile otomatis harus mengubah desktop.
- Saat sedang memperbaiki **mobile**, jaga desktop tetap stabil kecuali user eksplisit minta keduanya.
- Saat sedang memperbaiki **desktop**, jaga mobile tetap stabil kecuali user eksplisit minta keduanya.
- Setiap perubahan visual harus dicek minimal di viewport mobile (`390px`/`430px`) dan desktop (`1280px`/`1440px`) kalau area tersebut terdampak.
- Hindari refactor layout global yang menyentuh breakpoint besar tanpa alasan jelas.
- Jika ada kebutuhan menyelaraskan desktop dan mobile, jelaskan tradeoff dan minta konfirmasi dulu.

Contoh penerapan:

- Sticky CTA mobile boleh tidak ada di desktop.
- Floating WhatsApp boleh tampil di desktop/tablet dan disembunyikan di mobile.
- Dashboard card density mobile boleh lebih stacked, desktop boleh lebih bento/grid.
- Premium/landing hero desktop boleh lebih lapang, mobile boleh lebih ringkas.

## Monetization

- Model: **one-time purchase**.
- Harga aktif: **Rp 149rb**.
- Akses: seumur hidup.
- Pendekatan jual: landing page style "spill everything" — tunjukkan apa yang didapat sebelum user bayar.
- TIDAK ada vendor comparison.

## Current User Flow

```text
Landing
→ /onboarding
→ /result
→ /premium
→ /auth/login atau /auth/signup
→ Midtrans Snap payment popup
→ /premium/success
→ /dashboard
```

Pre-auth:

- User tidak perlu login untuk onboarding dan melihat result.
- Data onboarding disimpan di localStorage melalui `onboardingStore`.

Post-auth:

- Login/signup dengan `next=/premium` menyimpan hasil onboarding ke Supabase table `wedding_profiles`.
- Setelah sync berhasil, localStorage onboarding dikosongkan melalui `clearOnboardingStore()`.

Payment:

- Payment memakai Midtrans Snap sandbox.
- `POST /api/payments/midtrans/create` membuat row `payments` dan transaksi Snap.
- `POST /api/payments/midtrans/webhook` adalah jalur utama update status pembayaran.
- `POST /api/payments/midtrans/confirm` adalah guard tambahan dari callback sukses frontend untuk mengurangi risiko webhook telat.
- Premium aktif via `app_users.is_premium = true`.

## Tech Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand
- Supabase Auth + PostgreSQL
- Midtrans Snap
- Jest + React Testing Library

## Architecture

```text
/                     → Server Component, landing SEO
/onboarding           → Client Component, Zustand + localStorage
/result               → Client Component, score/result + premium bridge
/premium              → Server page + client-side auth/payment button
/premium/success      → Success page after Snap
/dashboard            → Server Component, auth + premium gated
/auth/*               → Client Component auth flow
/api/payments/*       → Server routes for Midtrans
```

## Key Files

```text
src/lib/
  cityTiers.ts
  allocation.ts
  scoring.ts
  insights.ts
  payment.ts
  midtrans.ts

src/stores/
  onboardingStore.ts      # Zustand persist + clearOnboardingStore()
  authStore.ts
  simulationStore.ts

src/components/
  landing/
    HeroSection.tsx
    PricingSection.tsx
    FloatingWhatsApp.tsx  # hidden on mobile to avoid crowding sticky CTA
  result/
    ScoreHero.tsx
    PremiumTease.tsx
  payment/
    PremiumAccessButton.tsx
    MidtransPaymentButton.tsx
  dashboard/
    DashboardClient.tsx
    ChecklistPernikahan.tsx
    TabunganNikah.tsx
    VendorPaymentTracker.tsx
    SeserahanList.tsx

src/app/api/payments/midtrans/
  create/route.ts
  webhook/route.ts
  confirm/route.ts
```

## Database

- `wedding_profiles` — satu row per user, `UNIQUE user_id`, RLS enabled.
- `app_users` — mirror auth user + premium status.
- `payments` — Midtrans transaction records.
- `simulations` — snapshot simulasi, RLS enabled, ada di schema lama tapi flow terbaru fokus sync profile.

## Design Decisions

| Keputusan | Pilihan |
|---|---|
| Font | Plus Jakarta Sans + serif display via Playfair/Cormorant fallback |
| Warna | Dusty mauve/pink, deep burgundy, soft gold |
| Tone | Calming, elegant, supportive |
| Onboarding | 7 layar, satu fokus per layar |
| Result | Score + metrics + premium bridge |
| Dashboard | Bento/card utility dashboard, bukan fintech dashboard |
| Pricing copy | `Rp 149rb`, sekali bayar, akses seumur hidup |

## Scoring Logic

```text
allocation = calculateAllocation(input)
score = calculateScore({ ...input, allocation })

budgetPerGuest < 120k → -25
luxury + budget < 100jt → -20
elegant + budgetPerGuest < 180k → -10
guestCount > 800 → -10
hemat priority → +5
emergencyFund < 10% → -10
× cityMultiplier (Tier A 1.25 / B 1.0 / C 0.85)
clamp(0, 100)

0-39: High Risk
40-69: Moderate
70-100: Healthy
```

## Important Constraints

- TIDAK perlu login sebelum onboarding atau result.
- Scoring deterministik dan explainable.
- Insights rule-based only, bukan AI-generated.
- Simulasi di `/result` harus real-time, tanpa loading state.
- Jangan tambahkan vendor comparison.
- Jangan ubah flow payment besar-besaran tanpa konfirmasi.
- Jangan ubah besar-besaran desain desktop saat task hanya mobile, dan sebaliknya.
- Kalau membuat perubahan visual, fokus pada bug jelas atau polish kecil.

## Recent Polish Notes

- WhatsApp floating disembunyikan di mobile agar tidak bentrok dengan sticky CTA landing.
- Harga display diseragamkan ke `Rp 149rb`.
- Dashboard checklist timeline tabs dibuat wrap dua baris di mobile agar tidak kepotong.
- `PremiumAccessButton` melakukan client-side login check agar `/premium` terasa lebih cepat.
- `MidtransPaymentButton` mencoba confirm payment di frontend success callback, lalu tetap redirect ke `/premium/success`.
- `clearOnboardingStore()` menulis persisted onboarding state kosong agar data pre-auth tidak nyangkut setelah sync.

## Docs & References

- README terbaru: `README.md`
- Flow doc: `docs/budgetnikah-flow.md`
- Payment migration: `supabase/migrations/20260515_payments.sql`
- Claude screenshots/HTML referensi ada di `~/Downloads`:
  - `_ Landing _ Desktop _full page_.png/html`
  - `_ Result _ Premium Bridge _ Desktop _full page_.png/html`
  - `_ Premium Paywall.png/html`
  - `Dashboard _ Desktop _full_.png/html`

## Next Suggested Work

1. Manual QA di browser asli dari landing sampai payment popup.
2. Deploy preview dan test Midtrans sandbox dari URL publik.
3. Final copy pass: `kamu` vs `kalian`, `subscription` vs `langganan`, `akses seumur hidup` vs `sampai hari H`.
4. Production payment readiness: production keys, public webhook URL, pending/close/error QA.
