'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { flushPendingNavigationEvent, track } from '@/lib/analytics'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // $pageview dibutuhkan PostHog Web Analytics dashboard
    track('$pageview', {
      $current_url: window.location.href,
      $host: window.location.hostname,
      $pathname: pathname,
    })
    // page_viewed tetap dikirim untuk custom funnel/insights
    track('page_viewed', { path: pathname })
    flushPendingNavigationEvent()
  }, [pathname])

  return <>{children}</>
}
