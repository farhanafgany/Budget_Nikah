'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MidtransPaymentButton } from './MidtransPaymentButton'

interface PremiumAccessButtonProps {
  isProduction?: boolean
  variant?: 'primary' | 'gold'
  loginChildren: React.ReactNode
  paymentChildren: React.ReactNode
}

export function PremiumAccessButton({
  isProduction = false,
  variant = 'primary',
  loginChildren,
  paymentChildren,
}: PremiumAccessButtonProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    let active = true
    const supabase = createClient()

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return
        setIsLoggedIn(Boolean(data.session?.user))
      })
      .catch(() => {
        if (!active) return
        setIsLoggedIn(false)
      })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session?.user))
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const className = variant === 'gold'
    ? 'inline-flex items-center justify-center rounded-full font-extrabold transition hover:brightness-105 active:scale-[0.99]'
    : 'inline-flex items-center justify-center rounded-full bg-nikah-deep text-white font-extrabold transition hover:opacity-90 active:scale-[0.99]'

  const style: React.CSSProperties = variant === 'gold'
    ? {
        minWidth: 260,
        border: 0,
        padding: '16px 28px',
        color: '#4A1822',
        background: 'linear-gradient(180deg, #E8D7A8 0%, #C9A961 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.34), 0 10px 28px rgba(0,0,0,0.08)',
      }
    : {
        width: '100%',
        border: 0,
        padding: '17px 24px',
        boxShadow: '0 10px 22px rgba(90, 30, 42, 0.12)',
      }

  if (isLoggedIn) {
    return (
      <MidtransPaymentButton
        isProduction={isProduction}
        className={className}
        style={style}
      >
        {paymentChildren}
      </MidtransPaymentButton>
    )
  }

  return (
    <Link
      href="/auth/login?next=/premium"
      className={className}
      style={style}
    >
      {loginChildren}
    </Link>
  )
}
