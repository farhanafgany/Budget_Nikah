import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Check, ChevronRight, Minus } from 'lucide-react'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { PremiumAccessButton } from '@/components/payment/PremiumAccessButton'
import { createClient } from '@/lib/supabase/server'
import { formatPaymentAmount, getPremiumPaymentAmount } from '@/lib/payment'

// Label metode pembayaran yang dikenal pengguna Indonesia
const PAYMENT_METHODS = ['QRIS', 'GoPay', 'OVO', 'Dana', 'BCA', 'Mandiri', 'BNI']

function PaymentMethodsRow() {
  return (
    <div className="flex flex-wrap items-center justify-center" style={{ gap: '6px 8px', marginTop: 14 }}>
      <span className="text-nikah-muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', marginRight: 2 }}>
        Tersedia via:
      </span>
      {PAYMENT_METHODS.map(method => (
        <span
          key={method}
          className="inline-flex items-center border border-nikah-border bg-white text-nikah-text font-bold"
          style={{ fontSize: 11, padding: '4px 9px', borderRadius: 6 }}
        >
          {method}
        </span>
      ))}
    </div>
  )
}

const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

const COMPARISON_ROWS = [
  { label: 'Readiness score & estimasi budget', free: true, premium: true },
  { label: 'Simulasi tamu / lokasi / gaya', free: true, premium: true },
  { label: 'Checklist 50+ item tersusun', free: false, premium: true },
  { label: 'Tracking pembayaran vendor', free: false, premium: true },
  { label: 'Tabungan & riwayat', free: false, premium: true },
  { label: 'Catatan & seserahan custom', free: false, premium: true },
  { label: 'Update sampai hari H', free: false, premium: true },
]

const TRUST_ITEMS = [
  { icon: '🔒', label: 'Pembayaran via', value: 'Midtrans Snap' },
  { icon: '↩', label: 'Garansi', value: '3 hari tanpa pertanyaan' },
  { icon: '∞', label: 'Model', value: 'Sekali bayar' },
]

function getFaqs(priceLabel: string) {
  return [
    {
      question: 'Apakah ada biaya langganan?',
      answer: `Tidak. ${priceLabel} adalah pembelian sekali bayar untuk satu rencana pernikahan, dipakai sampai hari H.`,
    },
    {
      question: 'Bagaimana jika setelah membeli ternyata tidak cocok?',
      answer: 'Garansi 3 hari uang kembali penuh. Cukup hubungi kami lewat email atau WhatsApp pembelian.',
    },
    {
      question: 'Apakah data saya aman?',
      answer: 'Data disimpan di Supabase dengan Row Level Security, sehingga hanya akun kalian yang bisa mengakses data sendiri.',
    },
    {
      question: 'Bisa diakses dari mana saja?',
      answer: 'Bisa dibuka dari HP, tablet, atau laptop selama kalian login dengan email yang sama.',
    },
  ]
}

function ComparisonMark({ active }: { active: boolean }) {
  if (!active) {
    return (
      <span className="inline-flex items-center justify-center text-nikah-muted" aria-label="Tidak termasuk">
        <Minus size={16} strokeWidth={2.2} />
      </span>
    )
  }

  return (
    <span className="inline-flex items-center justify-center text-nikah-deep" aria-label="Termasuk">
      <Check size={17} strokeWidth={3} />
    </span>
  )
}

export default async function PremiumPage() {
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true'
  const paymentAmount = getPremiumPaymentAmount()
  const priceLabel = formatPaymentAmount(paymentAmount)
  const faqs = getFaqs(priceLabel)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isSignedIn = Boolean(user)

  if (user) {
    const { data: appUser } = await supabase
      .from('app_users')
      .select('is_premium')
      .eq('id', user.id)
      .single()
    if (appUser?.is_premium) redirect('/dashboard')
  }

  return (
    <main
      className="premium-theme min-h-screen bg-nikah-bg"
      style={{ background: 'var(--landing-bg, #F6EFEC)' }}
    >
      {/* Desktop header */}
      <header className="hidden md:block border-b border-nikah-border bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1120px] items-center justify-between px-6">
          <Link href="/" className="inline-flex">
            <BrandLogo size="md" />
          </Link>
          <Link href="/result" className="text-sm font-bold text-nikah-deep hover:underline underline-offset-4">
            Kembali ke Hasil
          </Link>
        </div>
      </header>

      {/* Mobile header */}
      <header className="flex md:hidden items-center px-5 h-14">
        <Link href="/result" className="inline-flex items-center text-sm font-bold text-nikah-deep" style={{ gap: 6 }}>
          ← Hasil
        </Link>
      </header>

      <section className="mx-auto max-w-[900px] px-6 text-center" style={{ paddingTop: 62, paddingBottom: 42 }}>
        <p className="text-xs font-extrabold uppercase text-nikah-mauve" style={{ letterSpacing: '0.18em', margin: '0 0 18px' }}>
          BudgetNikah Premium
        </p>
        <h1
          className="text-nikah-deep"
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(44px, 6.4vw, 64px)',
            lineHeight: 1.02,
            letterSpacing: '-0.024em',
            margin: '0 auto 18px',
            maxWidth: 700,
            textWrap: 'balance',
          }}
        >
          Lanjutkan persiapan dengan lebih tenang.
        </h1>
        <p className="mx-auto text-nikah-muted" style={{ fontSize: 16.5, lineHeight: 1.62, margin: 0, maxWidth: 620 }}>
          Satu tempat untuk menyimpan progress pernikahan kalian sampai hari H — tanpa langganan, tanpa iklan.
        </p>
      </section>

      <section className="mx-auto max-w-[880px] px-6">
        <div
          className="overflow-hidden border border-nikah-border bg-white"
          style={{
            borderRadius: 24,
            boxShadow: '0 10px 32px rgba(90, 30, 42, 0.065)',
          }}
        >
          <div
            className="flex items-center justify-between text-white"
            style={{
              padding: '13px 20px',
              background: 'linear-gradient(160deg, var(--landing-deep, #5A1E2A) 0%, var(--landing-deep-dark, #3D1419) 100%)',
            }}
          >
            <p className="font-extrabold uppercase" style={{ fontSize: 11, letterSpacing: '0.12em', margin: 0 }}>
              Akses Sampai Hari H
            </p>
            <span
              style={{
                background: '#E8D7A8',
                color: '#5C3D08',
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 11px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {priceLabel} · Sekali bayar
            </span>
          </div>

          {/* Mobile layout: price → table → CTA → trust */}
          <div className="block lg:hidden" style={{ padding: '28px 24px 32px' }}>
            <div
              className="text-nikah-deep"
              style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 48, lineHeight: 1, letterSpacing: '-0.018em', marginBottom: 6 }}
            >
              {priceLabel}
            </div>
            <p className="text-nikah-muted" style={{ fontSize: 14, lineHeight: 1.55, margin: '0 0 24px' }}>
              Sekali bayar · tanpa langganan · termasuk update fitur
            </p>

            {/* Comparison table */}
            <div style={{ marginBottom: 24 }}>
              <div className="grid items-center text-nikah-muted font-extrabold uppercase border-b border-nikah-border" style={{ gridTemplateColumns: '1fr 52px 68px', gap: 8, fontSize: 10, letterSpacing: '0.08em', paddingBottom: 8, marginBottom: 2 }}>
                <span>Yang kalian dapat</span>
                <span className="text-center">Gratis</span>
                <span className="text-center text-nikah-deep">Premium</span>
              </div>
              {COMPARISON_ROWS.map(item => (
                <div
                  key={item.label}
                  className="grid items-center border-t border-nikah-border"
                  style={{ gridTemplateColumns: '1fr 52px 68px', gap: 8, padding: '11px 0' }}
                >
                  <p className="text-nikah-text" style={{ fontSize: 13, lineHeight: 1.35, margin: 0 }}>
                    {item.label}
                  </p>
                  <div className="flex justify-center"><ComparisonMark active={item.free} /></div>
                  <div className="flex justify-center"><ComparisonMark active={item.premium} /></div>
                </div>
              ))}
            </div>

            <PremiumAccessButton
              isProduction={isProduction}
              isSignedIn={isSignedIn}
              loginChildren={(
                <span className="inline-flex items-center justify-center" style={{ gap: 10 }}>
                  Mulai Premium — {priceLabel}
                  <ChevronRight size={18} strokeWidth={2.4} />
                </span>
              )}
              paymentChildren={(
                <span className="inline-flex items-center justify-center" style={{ gap: 10 }}>
                  Mulai Premium — {priceLabel}
                  <ChevronRight size={18} strokeWidth={2.4} />
                </span>
              )}
            />
            <p className="text-center text-nikah-muted" style={{ fontSize: 12, lineHeight: 1.5, marginTop: 10 }}>
              ✓ Garansi 3 hari — tidak cocok, uang kembali penuh. Tanpa pertanyaan.
            </p>

            <div className="grid grid-cols-3 border-t border-nikah-border" style={{ gap: 10, marginTop: 16, paddingTop: 16 }}>
              {TRUST_ITEMS.map(item => (
                <div key={item.label} className="text-center">
                  <p className="text-nikah-text font-extrabold" style={{ fontSize: 12, lineHeight: 1.3, margin: '0 0 2px' }}>
                    {item.value}
                  </p>
                  <p className="text-nikah-muted" style={{ fontSize: 11, lineHeight: 1.3, margin: 0 }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            <PaymentMethodsRow />
          </div>

          {/* Desktop layout: two-column side by side */}
          <div className="hidden lg:grid grid-cols-[1.05fr_0.95fr]">
            <div style={{ padding: '38px 36px 36px' }}>
              <div
                className="text-nikah-deep"
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(42px, 7vw, 52px)',
                  lineHeight: 1,
                  letterSpacing: '-0.018em',
                  marginBottom: 8,
                }}
              >
                {priceLabel}
              </div>
              <p className="text-nikah-muted" style={{ fontSize: 14.8, lineHeight: 1.55, margin: '0 0 2px' }}>
                Bayar sekali untuk satu rencana pernikahan.
              </p>
              <p className="text-nikah-muted" style={{ fontSize: 14.8, lineHeight: 1.55, margin: '0 0 24px' }}>
                Termasuk update fitur ke depannya.
              </p>
              <div
                className="border border-nikah-border"
                style={{
                  borderRadius: 16,
                  padding: '13px 15px',
                  marginBottom: 16,
                  background: 'linear-gradient(180deg, #FFFCF8 0%, #FBF6F1 92%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.72)',
                }}
              >
                <p className="text-nikah-muted" style={{ fontSize: 13.2, lineHeight: 1.55, margin: 0 }}>
                  Semua progress persiapan kalian akan tersusun dan tersimpan dalam satu tempat sampai hari pernikahan.
                </p>
              </div>

              <PremiumAccessButton
                isProduction={isProduction}
                isSignedIn={isSignedIn}
                loginChildren={(
                  <span className="inline-flex items-center justify-center" style={{ gap: 10 }}>
                    Simpan & Lanjut ke Pembayaran
                    <ChevronRight size={18} strokeWidth={2.4} />
                  </span>
                )}
                paymentChildren={(
                  <span className="inline-flex items-center justify-center" style={{ gap: 10 }}>
                    Mulai Premium — {priceLabel}
                    <ChevronRight size={18} strokeWidth={2.4} />
                  </span>
                )}
              />
              <p className="text-nikah-muted" style={{ fontSize: 12, lineHeight: 1.45, margin: '10px 0 0' }}>
                {!isSignedIn
                  ? 'Kalian akan masuk dulu agar hasil simulasi tersimpan sebelum pembayaran.'
                  : '✓ Garansi 3 hari — tidak cocok, uang kembali penuh. Tanpa pertanyaan.'}
              </p>

              <div className="grid grid-cols-3 border-t border-nikah-border" style={{ gap: 12, marginTop: 26, paddingTop: 17 }}>
                {TRUST_ITEMS.map(item => (
                  <div key={item.label} className="text-center">
                    <div style={{ fontSize: 18, marginBottom: 5 }}>{item.icon}</div>
                    <p className="text-nikah-text font-extrabold" style={{ fontSize: 12, lineHeight: 1.3, margin: '0 0 2px' }}>
                      {item.value}
                    </p>
                    <p className="text-nikah-muted" style={{ fontSize: 10.5, lineHeight: 1.3, margin: 0 }}>
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
              <PaymentMethodsRow />
            </div>

            <div
              style={{
                padding: '36px 34px',
                background: 'linear-gradient(180deg, #FCF8F4 0%, #F5EDE8 100%)',
                boxShadow: 'inset 1px 0 0 var(--landing-border, var(--nikah-border))',
              }}
            >
              <p className="text-nikah-muted font-extrabold uppercase" style={{ fontSize: 11, letterSpacing: '0.16em', margin: '0 0 20px' }}>
                Gratis vs Premium
              </p>

              <div className="grid items-center text-nikah-muted font-extrabold uppercase" style={{ gridTemplateColumns: '1fr 58px 74px', gap: 8, fontSize: 10.5, letterSpacing: '0.08em', marginBottom: 7 }}>
                <span>Yang kalian dapat</span>
                <span className="text-center">Gratis</span>
                <span className="text-center text-nikah-deep">Premium</span>
              </div>

              <div>
                {COMPARISON_ROWS.map(item => (
                  <div
                    key={item.label}
                    className="grid items-center border-t border-nikah-border"
                    style={{
                      gridTemplateColumns: '1fr 58px 74px',
                      gap: 8,
                      padding: '12.5px 0',
                    }}
                  >
                    <p className="text-nikah-text" style={{ fontSize: 13.2, lineHeight: 1.35, margin: 0 }}>
                      {item.label}
                    </p>
                    <div className="flex justify-center">
                      <ComparisonMark active={item.free} />
                    </div>
                    <div className="flex justify-center">
                      <ComparisonMark active={item.premium} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Yang Akan Kalian Buka" — mobile only */}
      <section className="lg:hidden mx-auto max-w-[880px] px-6" style={{ paddingTop: 40, paddingBottom: 8 }}>
        <p className="text-center text-xs font-extrabold uppercase text-nikah-mauve" style={{ letterSpacing: '0.18em', margin: '0 0 12px' }}>
          Yang Akan Kalian Buka
        </p>
        <div className="grid grid-cols-1" style={{ gap: 14 }}>
          {[
            { title: 'Dashboard Persiapan', body: 'Semua progress vendor, tabungan, dan checklist dalam satu layar.' },
            { title: 'Prioritas Sekarang', body: 'Tahu 4–5 hal terdekat yang perlu dibereskan minggu ini.' },
            { title: 'Tracking Pembayaran', body: 'DP, termin, dan pelunasan tidak lupa karena ada di satu tempat.' },
            { title: 'Riwayat & Catatan', body: 'Simpan keputusan penting, ide, dan info vendor sampai hari H.' },
          ].map(item => (
            <div
              key={item.title}
              className="bg-white border border-nikah-border"
              style={{ borderRadius: 16, padding: '18px 20px', boxShadow: '0 1px 4px rgba(90,30,42,0.04)' }}
            >
              <h3 className="text-nikah-text font-extrabold" style={{ fontSize: 15, lineHeight: 1.3, margin: '0 0 6px' }}>
                {item.title}
              </h3>
              <p className="text-nikah-muted" style={{ fontSize: 13.5, lineHeight: 1.55, margin: 0 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[760px] px-6" style={{ paddingTop: 58, paddingBottom: 62 }}>
        <p className="text-center text-xs font-extrabold uppercase text-nikah-mauve" style={{ letterSpacing: '0.18em', margin: '0 0 12px' }}>
          Sering Ditanyakan
        </p>
        <h2
          className="text-center text-nikah-deep"
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(32px, 4vw, 42px)',
            lineHeight: 1.08,
            letterSpacing: '-0.018em',
            margin: '0 0 26px',
          }}
        >
          Pertanyaan sebelum melanjutkan.
        </h2>
        <div>
          {faqs.map(item => (
            <div key={item.question} className="border-b border-nikah-border" style={{ padding: '19px 0' }}>
              <h3 className="text-nikah-text font-extrabold" style={{ fontSize: 15.5, lineHeight: 1.35, margin: '0 0 8px' }}>
                {item.question}
              </h3>
              <p className="text-nikah-muted" style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="px-6 text-center text-white"
        style={{
          paddingTop: 64,
          paddingBottom: 66,
          background: 'linear-gradient(160deg, var(--landing-deep, #5A1E2A) 0%, var(--landing-deep-dark, #3D1419) 100%)',
        }}
      >
        <h2
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(30px, 4.8vw, 42px)',
            lineHeight: 1.1,
            margin: '0 0 18px',
          }}
        >
          Siap melanjutkan persiapan dengan lebih tenang?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.84)', fontSize: 15.5, lineHeight: 1.68, margin: '0 auto 24px', maxWidth: 620 }}>
          Sekali bayar {priceLabel}. Tanpa langganan. Tanpa biaya tersembunyi.
          <br />
          Kalau tidak cocok dalam 3 hari, uang kembali penuh.
        </p>
        <PremiumAccessButton
          isProduction={isProduction}
          isSignedIn={isSignedIn}
          variant="gold"
          loginChildren={(
            <span className="inline-flex items-center justify-center" style={{ gap: 10 }}>
              Simpan & Lanjut ke Pembayaran
              <ChevronRight size={18} strokeWidth={2.4} />
            </span>
          )}
          paymentChildren={(
            <span className="inline-flex items-center justify-center" style={{ gap: 10 }}>
              Mulai Premium — {priceLabel}
              <ChevronRight size={18} strokeWidth={2.4} />
            </span>
          )}
        />
        <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 1.5, margin: '14px 0 0' }}>
          ✓ Garansi 3 hari — tidak cocok, uang kembali penuh. Tanpa pertanyaan.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: 12, lineHeight: 1.5, margin: '8px 0 0' }}>
          Pembayaran aman via QRIS, GoPay, OVO, Dana, BCA, dan Mandiri
        </p>
      </section>

    </main>
  )
}
