# BudgetNikah

Folder utama BudgetNikah untuk pengembangan berikutnya:

```text
/Users/m/Projects/Budget_Nikah
```

Folder/copy lama sudah diarsipkan di:

```text
/Users/m/Projects/_BudgetNikah_archive_20260518
```

Fokus produk: mobile-first wedding planning app untuk pasangan Indonesia. Nuansanya calming, elegant, dan emotionally supportive, bukan finance dashboard atau fintech.

## Status Terakhir

- Landing, onboarding, result, premium, payment, dan dashboard sudah bisa dicek di localhost.
- Branch utama: `main`.
- Harga premium diseragamkan sebagai `Rp 149rb`.
- Model monetisasi: sekali bayar, akses seumur hidup.
- Midtrans Snap sandbox sudah terhubung untuk flow pembayaran.
- Aktivasi premium memakai `app_users.is_premium`.
- Data onboarding pre-auth disimpan di localStorage, lalu disync ke `wedding_profiles` setelah login/signup dan state onboarding dikosongkan.
- Mobile visual pass sudah dicek di viewport `390px` dan `430px`.

## Flow Utama

```text
Landing → Onboarding → Result → Premium → Login/Signup → Payment Snap → Premium Success → Dashboard
```

Pre-auth:

- User bisa menyelesaikan onboarding dan melihat result tanpa login.
- Data sementara disimpan di localStorage melalui `onboardingStore`.

Post-auth:

- Login/signup dengan `next=/premium` menyimpan hasil onboarding ke Supabase.
- Setelah tersimpan, onboarding localStorage dikosongkan agar data lama tidak nyangkut.

Payment:

- `POST /api/payments/midtrans/create` membuat row `payments` dan transaksi Midtrans Snap.
- Snap popup dibuka dari `MidtransPaymentButton`.
- `POST /api/payments/midtrans/webhook` tetap menjadi jalur utama update status pembayaran.
- `POST /api/payments/midtrans/confirm` menjadi guard tambahan dari callback sukses frontend untuk mengurangi risiko webhook telat.
- Jika status valid `settlement` atau `capture` accepted, `app_users.is_premium` diaktifkan.

## Local Development

```bash
npm install
npm run dev
```

Next.js akan memakai port kosong terdekat. Cek output terminal, misalnya:

```text
Local: http://localhost:3003
```

## Environment

Butuh `.env.local` dengan:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

MIDTRANS_SERVER_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
NEXT_PUBLIC_APP_URL=

NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_WHATSAPP_MESSAGE=
```

Catatan production:

- Ganti Midtrans sandbox keys dengan production keys.
- Set `MIDTRANS_IS_PRODUCTION=true`.
- Pastikan `NEXT_PUBLIC_APP_URL` memakai domain production.
- Daftarkan webhook URL publik:
  `https://<domain>/api/payments/midtrans/webhook`

## Verification

Perintah yang terakhir hijau:

```bash
npx tsc --noEmit
npm test -- --runInBand
```

Test terakhir: 47 tests pass.

## Reference

- Flow doc: `docs/budgetnikah-flow.md`
- Payment migration: `supabase/migrations/20260515_payments.sql`
- Premium page: `src/app/premium/page.tsx`
- Payment button: `src/components/payment/MidtransPaymentButton.tsx`
- Dashboard: `src/app/dashboard/page.tsx`
