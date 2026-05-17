'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { AlarmClock, BriefcaseBusiness, Coins } from 'lucide-react'

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/dashboard'
  return next
}

function getLoginErrorMessage(err: { message?: string; status?: number }) {
  const message = (err.message ?? '').toLowerCase()

  if (message.includes('invalid login credentials')) {
    return 'Password salah. Periksa kembali, lalu coba lagi.'
  }
  if (message.includes('email not confirmed')) {
    return 'Akun ini belum bisa masuk karena email confirmation masih aktif di Supabase.'
  }
  if (message.includes('too many requests') || err.status === 429) {
    return 'Terlalu banyak percobaan login. Tunggu sebentar, lalu coba lagi.'
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Koneksi ke server bermasalah. Periksa internet kamu, lalu coba lagi.'
  }
  return `Login gagal: ${err.message ?? 'penyebab tidak diketahui.'}`
}

async function getInvalidCredentialMessage(email: string) {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('email_is_registered', { email_to_check: email })

  if (!error && data === false) {
    return 'Akun dengan email ini belum terdaftar. Silakan daftar dulu.'
  }

  return 'Password salah. Periksa kembali, lalu coba lagi.'
}

function LoginContent() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = getSafeNextPath(searchParams.get('next'))
  const signupHref = `/auth/signup?next=${encodeURIComponent(nextPath)}`
  const onboarding = useOnboardingStore()
  const isPremiumContinuation = nextPath === '/premium'
  const authEyebrow = isPremiumContinuation ? 'Simpan sebelum pembayaran' : 'Simpan hasil perencanaan kalian'
  const authTitle = isPremiumContinuation
    ? 'Simpan hasil kalian sebelum lanjut pembayaran.'
    : 'Lanjutkan persiapan pernikahan dengan lebih tenang.'
  const authCopy = isPremiumContinuation
    ? 'Masuk untuk menyimpan hasil simulasi, lalu lanjut ke pembayaran premium tanpa mulai dari awal.'
    : 'Masuk untuk menyimpan hasil simulasi dan melanjutkan persiapan pernikahan di satu tempat.'
  const formTitle = isPremiumContinuation ? 'Masuk untuk lanjut pembayaran' : 'Simpan hasil perencanaan kalian'
  const formCopy = isPremiumContinuation
    ? 'Hasil kalian akan disimpan dulu, lalu kalian kembali ke halaman premium.'
    : 'Masuk untuk menyimpan hasil simulasi dan melanjutkan persiapan.'

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

      onboarding.reset()
    }
    router.replace(nextPath)
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      const message = err.message?.toLowerCase().includes('invalid login credentials')
        ? await getInvalidCredentialMessage(email)
        : getLoginErrorMessage(err)
      setError(message); setLoading(false); return
    }
    await syncAndRedirect(data.user.id)
  }

  async function handleGoogle() {
    const supabase = createClient()
    const finishPath = `/auth/finish?next=${encodeURIComponent(nextPath)}`
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(finishPath)}` },
    })
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
              { Icon: AlarmClock, title: 'Prioritas Sekarang', body: 'Tugas dan deadline terdekat.' },
              { Icon: BriefcaseBusiness, title: 'Pembayaran Vendor', body: 'DP, sisa bayar, dan jatuh tempo.' },
              { Icon: Coins, title: 'Tabungan Nikah', body: 'Progress dan target bulanan.' },
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
            <div className="flex items-center justify-center" style={{ marginBottom: 24 }}>
              <BrandLogo size="md" />
            </div>
            <p className="text-center text-xs font-bold uppercase tracking-widest text-nikah-mauve" style={{ marginBottom: 8 }}>Masuk ke akun</p>
            <h2 className="text-2xl font-extrabold text-nikah-text text-center mb-1">{formTitle}</h2>
            <p className="text-nikah-muted text-sm text-center mb-7 font-light">{formCopy}</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleEmail} className="space-y-3">
              <div>
                <label htmlFor="login-email" className="sr-only">Email</label>
                <input
                  id="login-email"
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email" required
                  className="w-full bg-nikah-bg border border-nikah-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-nikah-mauve focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="login-password" className="sr-only">Password</label>
                <input
                  id="login-password"
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Password" required
                  className="w-full bg-nikah-bg border border-nikah-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-nikah-mauve focus:bg-white"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm disabled:opacity-50 hover:opacity-90 transition"
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
              <span aria-hidden="true">G</span> Masuk dengan Google
            </button>

            <p className="text-center text-nikah-muted text-xs mt-6">
              Belum punya akun?{' '}
              <Link href={signupHref} className="text-nikah-deep font-semibold">Daftar</Link>
              <span className="mx-2 text-nikah-border">·</span>
              <Link href="/" className="text-nikah-deep font-semibold">Lihat penawaran</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  )
}
