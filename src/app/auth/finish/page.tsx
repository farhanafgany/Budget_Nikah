'use client'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { clearOnboardingStore, useOnboardingStore } from '@/stores/onboardingStore'
import { BrandLogo } from '@/components/ui/BrandLogo'

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/dashboard'
  return next
}

function FinishContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = getSafeNextPath(searchParams.get('next'))
  const onboarding = useOnboardingStore()
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const cancelledRef = useRef(false)

  const runFinishAuth = useCallback(async () => {
    setError('')
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()
    const userId = data.session?.user.id

    if (!userId) {
      router.replace(`/auth/login?next=${encodeURIComponent(nextPath)}`)
      return
    }

    if (onboarding.isComplete()) {
      const response = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboarding }),
      })

      if (!response.ok) {
        if (!cancelledRef.current) setError('Gagal menyimpan data.')
        return
      }

      await clearOnboardingStore()
    }

    router.replace(nextPath)
  }, [nextPath, onboarding, router])

  useEffect(() => {
    cancelledRef.current = false
    runFinishAuth()
    return () => { cancelledRef.current = true }
  }, [runFinishAuth, retryCount])

  return (
    <main
      className="premium-theme min-h-screen bg-nikah-bg px-4 py-8 flex items-center justify-center"
      style={{ background: 'var(--landing-bg, var(--nikah-bg))' }}
    >
      <section
        className="w-full max-w-[380px] bg-white border border-nikah-border text-center"
        style={{ borderRadius: 'var(--d-radius)', padding: '34px 28px', boxShadow: '0 24px 70px rgba(110,38,56,0.08)' }}
      >
        <div className="flex justify-center" style={{ marginBottom: 22 }}>
          <BrandLogo size="md" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve" style={{ marginBottom: 8 }}>
          Menyimpan hasil
        </p>
        <h1 className="text-2xl font-extrabold text-nikah-text" style={{ marginBottom: 8 }}>
          Sebentar ya.
        </h1>

        {error ? (
          <>
            <p className="text-nikah-muted font-light" style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 20px' }}>
              {error} Silakan coba lagi atau kembali ke halaman hasil.
            </p>
            <div className="grid" style={{ gap: 8 }}>
              <button
                type="button"
                onClick={() => setRetryCount(c => c + 1)}
                className="w-full bg-nikah-deep text-white font-bold rounded-full text-sm hover:opacity-90 transition"
                style={{ padding: '13px 20px' }}
              >
                Coba lagi
              </button>
              <a
                href="/result"
                className="w-full inline-flex items-center justify-center border border-nikah-border bg-white text-nikah-deep font-bold rounded-full text-sm hover:bg-nikah-bg transition"
                style={{ padding: '13px 20px' }}
              >
                Kembali ke hasil
              </a>
            </div>
          </>
        ) : (
          <>
            <p className="text-nikah-muted font-light" style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 16px' }}>
              BudgetNikah sedang menghubungkan hasil analisis ke akun kamu.
            </p>
            <div className="flex items-center justify-center" style={{ gap: 5 }}>
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="inline-block rounded-full bg-nikah-mauve"
                  style={{
                    width: 7,
                    height: 7,
                    opacity: 0.5,
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.85); }
          40% { opacity: 0.9; transform: scale(1); }
        }
      `}</style>
    </main>
  )
}

export default function FinishPage() {
  return (
    <Suspense fallback={null}>
      <FinishContent />
    </Suspense>
  )
}
