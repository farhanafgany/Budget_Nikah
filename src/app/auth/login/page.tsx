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
              className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-nikah-mauve"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="sr-only">Password</label>
            <input
              id="login-password"
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password" required
              className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-nikah-mauve"
            />
          </div>
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
          <span aria-hidden="true">G</span> Masuk dengan Google
        </button>

        <p className="text-center text-nikah-muted text-xs mt-6">
          Belum punya akun?{' '}
          <Link href="/auth/signup" className="text-nikah-deep font-semibold">Daftar</Link>
        </p>
      </div>
    </div>
  )
}
