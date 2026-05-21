'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BrandLogo } from '@/components/ui/BrandLogo'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    if (err) {
      setError('Gagal mengirim email. Periksa koneksi internet kamu, lalu coba lagi.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <main
      className="premium-theme min-h-screen bg-nikah-bg px-4 py-8 flex items-center justify-center"
      style={{ background: 'var(--landing-bg, var(--nikah-bg))' }}
    >
      <div
        className="w-full max-w-[420px] bg-white border border-nikah-border"
        style={{ borderRadius: 24, padding: '36px 32px', boxShadow: '0 12px 40px rgba(90,30,42,0.08)' }}
      >
        <div className="flex justify-center" style={{ marginBottom: 28 }}>
          <BrandLogo size="md" />
        </div>

        {sent ? (
          <div className="text-center">
            <div style={{ fontSize: 36, marginBottom: 16 }}>📬</div>
            <h1 className="text-xl font-extrabold text-nikah-text" style={{ marginBottom: 8 }}>
              Email terkirim
            </h1>
            <p className="text-nikah-muted font-light" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Cek inbox <strong>{email}</strong>. Link untuk membuat password baru sudah dikirim — berlaku 1 jam.
            </p>
            <p className="text-nikah-muted" style={{ fontSize: 13, lineHeight: 1.5 }}>
              Tidak dapat email?{' '}
              <button
                onClick={() => setSent(false)}
                className="text-nikah-deep font-semibold hover:underline"
              >
                Kirim ulang
              </button>
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve text-center" style={{ marginBottom: 8 }}>
              Reset password
            </p>
            <h1 className="text-xl font-extrabold text-nikah-text text-center" style={{ marginBottom: 6 }}>
              Lupa password?
            </h1>
            <p className="text-nikah-muted font-light text-center" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Masukkan email yang dipakai saat daftar. Kami akan kirimkan link untuk membuat password baru.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="reset-email" className="sr-only">Email</label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full bg-nikah-bg border border-nikah-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-nikah-mauve focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm disabled:opacity-50 hover:opacity-90 transition"
              >
                {loading ? 'Mengirim...' : 'Kirim link reset password'}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-nikah-muted text-xs mt-6">
          <Link href="/auth/login" className="text-nikah-deep font-semibold hover:underline">
            ← Kembali ke login
          </Link>
        </p>
      </div>
    </main>
  )
}
