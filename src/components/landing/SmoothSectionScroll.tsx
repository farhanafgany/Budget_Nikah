'use client'
import { useEffect } from 'react'

export function SmoothSectionScroll() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const targetId = params.get('scroll') || window.location.hash.replace('#', '')
    if (!targetId) return

    const timeout = window.setTimeout(() => {
      const target = document.getElementById(targetId)
      if (!target) return

      target.scrollIntoView({ behavior: 'smooth', block: 'start' })

      if (params.get('scroll')) {
        const nextUrl = `${window.location.pathname}#${targetId}`
        window.history.replaceState(null, '', nextUrl)
      }
    }, 120)

    return () => window.clearTimeout(timeout)
  }, [])

  return null
}
