'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { rememberNavigationEvent, track } from '@/lib/analytics'

type TrackedLinkProps = ComponentProps<typeof Link> & {
  event: string
  eventProps?: Record<string, string | number | boolean | null | undefined>
}

export function TrackedLink({
  event,
  eventProps,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        rememberNavigationEvent(event, eventProps)
        track(event, eventProps)
        onClick?.(e)
      }}
    />
  )
}
