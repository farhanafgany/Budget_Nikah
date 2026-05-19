'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { AlarmClock, BriefcaseBusiness, CheckCircle2, Coins } from 'lucide-react'
import { clearOnboardingStore, useOnboardingStore } from '@/stores/onboardingStore'

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/dashboard'
  return next
}

function getSignupErrorMessage(err: { message?: string; status?: number }) {
  const message = (err.message ?? '').toLowerCase()

  if (message.includes('already registered') || message.includes('already exists')) {
    return 'Email ini sudah terdaftar. Masuk dengan email tersebut atau gunakan email lain.'
  }
  if (message.includes('password') || message.includes('weak')) {
    return 'Password terlalu pendek atau terlalu mudah ditebak. Gunakan minimal 6 karakter.'
  }
  if (message.includes('too many requests') || err.status === 429) {
    return 'Terlalu banyak percobaan daftar. Tunggu sebentar, lalu coba lagi.'
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Koneksi ke server bermasalah. Periksa internet kamu, lalu coba lagi.'
  }
  return `Pendaftaran gagal: ${err.message ?? 'penyebab tidak diketahui.'}`
}

function SignupContent() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = getSafeNextPath(searchParams.get('next'))
  const loginHref = `/auth/login?next=${encodeURIComponent(nextPath)}`
  const onboarding = useOnboardingStore()
  const isPremiumContinuation = nextPath === '/premium'
  const authEyebrow = isPremiumContinuation ? 'Simpan sebelum pembayaran' : 'Simpan hasil perencanaan kalian'
  const authTitle = isPremiumContinuation
    ? 'Buat akun untuk menyimpan hasil kalian.'
    : 'Lanjutkan persiapan pernikahan dengan lebih tenang.'
  const authCopy = isPremiumContinuation
    ? 'Setelah akun dibuat, hasil simulasi akan tersimpan dan kalian bisa lanjut ke pembayaran premium.'
    : 'Buat akun untuk menyimpan hasil simulasi dan melanjutkan persiapan pernikahan di satu tempat.'
  const formTitle = isPremiumContinuation ? 'Buat akun untuk lanjut pembayaran' : 'Simpan hasil perencanaan kalian'
  const formCopy = isPremiumContinuation
    ? 'Hasil kalian akan disimpan dulu, lalu kalian kembali ke halaman premium.'
    : 'Buat akun untuk menyimpan hasil simulasi dan melanjutkan persiapan.'

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

      const { error: upsertErr } = await supabase.from('wedding_profiles').upsert({
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

      if (upsertErr) {
        setError('Gagal menyimpan data. Silakan coba lagi.')
        setLoading(false)
        return
      }

      await clearOnboardingStore()
    }
    router.replace(nextPath)
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (err) { setError(getSignupErrorMessage(err)); setLoading(false); return }

    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      setError('Email ini sudah terdaftar. Masuk dengan email tersebut atau gunakan email lain.')
      setLoading(false)
      return
    }

    if (data.session) {
      await syncAndRedirect(data.session.user.id)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  async function handleGoogle() {
    const supabase = createClient()
    const finishPath = `/auth/finish?next=${encodeURIComponent(nextPath)}`
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(finishPath)}` },
    })
  }

  if (success) {
    return (
      <main
        className="premium-theme min-h-screen bg-nikah-bg px-4 py-8 flex items-center justify-center"
        style={{
          background: 'var(--landing-bg, var(--nikah-bg))',
        }}
      >
        <div className="w-full max-w-[420px] text-center">
          <div className="flex justify-center" style={{ marginBottom: 28 }}>
            <BrandLogo size="md" />
          </div>

          <div className="bg-white border border-nikah-border" style={{ borderRadius: 'var(--d-radius)', padding: '36px 30px', boxShadow: '0 24px 70px rgba(110,38,56,0.08)' }}>
            <span
              className="inline-flex items-center justify-center bg-nikah-bg text-nikah-deep"
              style={{ width: 54, height: 54, borderRadius: 18, marginBottom: 18 }}
            >
              <CheckCircle2 size={25} strokeWidth={1.8} />
            </span>
            <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve" style={{ marginBottom: 8 }}>
              Akun berhasil dibuat
            </p>
            <h1
              className="text-nikah-text"
              style={{
                fontFamily: 'var(--font-fraunces, Georgia, serif)',
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 32,
                lineHeight: 1.1,
                margin: '0 0 10px',
              }}
            >
              {isPremiumContinuation ? 'Lanjutkan ke premium.' : 'Masuk untuk lanjut.'}
            </h1>
            <p className="text-nikah-muted font-light" style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>
              Akun dengan email <strong className="font-bold text-nikah-text">{email}</strong> sudah dibuat. Silakan masuk untuk melanjutkan dari hasil yang sudah kalian isi.
            </p>

            <div className="grid" style={{ gap: 10 }}>
              <Link
                href={loginHref}
                className="block w-full bg-nikah-deep text-white font-bold rounded-full text-sm text-center hover:opacity-90 transition"
                style={{ padding: '14px 22px' }}
              >
                Masuk Sekarang
              </Link>
              <Link
                href="/"
                className="block w-full border border-nikah-deep text-nikah-deep font-bold rounded-full text-sm text-center hover:bg-nikah-bg transition"
                style={{ padding: '14px 22px' }}
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main
      className="premium-theme min-h-screen bg-nikah-bg px-4 py-8 flex items-center justify-center"
      style={{
        background: 'var(--landing-bg, var(--nikah-bg))',
      }}
    >
      <div
        className="w-full max-w-[940px] min-w-0 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] bg-white border border-nikah-border overflow-hidden"
        style={{ borderRadius: 'var(--d-radius)', boxShadow: '0 24px 70px rgba(110,38,56,0.08)' }}
      >
        <section className="min-w-0 p-6 sm:p-8 lg:p-10 flex flex-col justify-between" style={{ background: 'var(--landing-band, #EFE4DE)' }}>
          <div className="min-w-0">
            <BrandLogo size="lg" />
            <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve" style={{ margin: '34px 0 10px' }}>
              {authEyebrow}
            </p>
            <h1
              className="text-nikah-text"
              style={{
                fontFamily: 'var(--font-fraunces, Georgia, serif)',
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 'clamp(27px, 8vw, 36px)',
                lineHeight: 1.08,
                margin: '0 0 12px',
                overflowWrap: 'break-word',
              }}
            >
              {authTitle}
            </h1>
            <p className="text-nikah-muted font-light" style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              {authCopy}
            </p>
          </div>

          <div className="grid" style={{ gap: 10, marginTop: 34 }}>
            {[
              { Icon: AlarmClock, title: 'Prioritas Sekarang', body: 'Lihat hal yang paling perlu dibereskan.' },
              { Icon: BriefcaseBusiness, title: 'Pembayaran Vendor', body: 'Catat DP, sisa bayar, dan jatuh tempo.' },
              { Icon: Coins, title: 'Tabungan Nikah', body: 'Pantau target tabungan sampai hari H.' },
            ].map(item => (
              <div key={item.title} className="flex items-start bg-white border border-nikah-border" style={{ gap: 12, padding: 12, borderRadius: 14 }}>
                <span className="inline-flex items-center justify-center bg-white text-nikah-deep" style={{ width: 30, height: 30, borderRadius: 10, flexShrink: 0 }}>
                  <item.Icon size={16} strokeWidth={1.9} />
                </span>
                <div>
                  <div className="font-extrabold text-nikah-text" style={{ fontSize: 13 }}>{item.title}</div>
                  <div className="text-nikah-muted" style={{ fontSize: 12, marginTop: 2 }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="min-w-0 p-6 sm:p-8 lg:p-10 flex items-center">
          <div className="w-full max-w-sm min-w-0 mx-auto">
            <div className="flex items-center justify-center lg:hidden" style={{ marginBottom: 24 }}>
              <BrandLogo size="md" />
            </div>
            <p className="text-center text-xs font-bold uppercase tracking-widest text-nikah-mauve" style={{ marginBottom: 8 }}>Buat akun</p>
            <h2 className="text-2xl font-extrabold text-nikah-text text-center mb-1">{formTitle}</h2>
            <p className="text-nikah-muted text-sm text-center mb-7 font-light">{formCopy}</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-3">
              <div>
                <label htmlFor="signup-email" className="sr-only">Email</label>
                <input
                  id="signup-email"
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email" required
                  className="w-full bg-nikah-bg border border-nikah-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-nikah-mauve focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="signup-password" className="sr-only">Password</label>
                <input
                  id="signup-password"
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Password (min. 6 karakter)" required minLength={6}
                  className="w-full bg-nikah-bg border border-nikah-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-nikah-mauve focus:bg-white"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm disabled:opacity-50 hover:opacity-90 transition"
              >
                {loading ? 'Memproses...' : 'Daftar →'}
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
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Daftar dengan Google
            </button>

            <p className="text-center text-nikah-muted text-xs mt-6">
              Sudah punya akun?{' '}
              <Link href={loginHref} className="text-nikah-deep font-semibold">Masuk</Link>
              <span className="mx-2 text-nikah-border">·</span>
              <Link href="/" className="text-nikah-deep font-semibold">Lihat penawaran</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupContent />
    </Suspense>
  )
}
