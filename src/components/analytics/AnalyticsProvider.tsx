'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { flushPendingNavigationEvent, track } from '@/lib/analytics'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    track('page_viewed', { path: pathname })
    flushPendingNavigationEvent()
  }, [pathname])

  return <>{children}</>
}
