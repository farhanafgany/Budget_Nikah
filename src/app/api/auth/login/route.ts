import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rateLimit'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  let body: { email?: string; password?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  const password = body.password

  if (!email || !password) {
    return NextResponse.json({ error: 'Email dan password diperlukan.' }, { status: 400 })
  }

  const limited = await checkRateLimit(request, {
    key: 'auth:login',
    limit: 5,
    window: '10 m',
    identifier: email,
  })
  if (limited) return limited

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message, status: error.status }, { status: error.status ?? 400 })
  }

  return NextResponse.json({ user_id: data.user.id })
}
