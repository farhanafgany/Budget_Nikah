import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rateLimit'
import { createClient } from '@/lib/supabase/server'

function getSafeNextPath(next?: string) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/dashboard'
  return next
}

export async function POST(request: Request) {
  let body: { email?: string; next?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email) {
    return NextResponse.json({ error: 'Email diperlukan.' }, { status: 400 })
  }

  const limited = await checkRateLimit(request, {
    key: 'auth:otp',
    limit: 3,
    window: '10 m',
    identifier: email,
  })
  if (limited) return limited

  const origin = new URL(request.url).origin
  const nextPath = getSafeNextPath(body.next)
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message, status: error.status }, { status: error.status ?? 400 })
  }

  return NextResponse.json({ ok: true })
}
