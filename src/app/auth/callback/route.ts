import { NextResponse } from 'next/server'
import { createClient }  from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')
  const nextPath = next && next.startsWith('/') && !next.startsWith('//')
    ? next
    : '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      // Kode kadaluarsa, sudah dipakai, atau OAuth gagal — arahkan ke login
      // dengan pesan yang jelas daripada diam-diam redirect ke halaman terproteksi.
      const loginUrl = new URL('/auth/login', origin)
      loginUrl.searchParams.set('next', nextPath)
      loginUrl.searchParams.set('auth_error', 'Tautan login sudah tidak valid. Silakan masuk lagi.')
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.redirect(`${origin}${nextPath}`)
}
