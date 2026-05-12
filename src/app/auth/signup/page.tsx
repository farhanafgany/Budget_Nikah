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
          <div className="text-4xl mb-4" aria-hidden="true">✉️</div>
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
              className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-nikah-mauve"
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="sr-only">Password</label>
            <input
              id="signup-password"
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password (min. 6 karakter)" required minLength={6}
              className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-nikah-mauve"
            />
          </div>
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
