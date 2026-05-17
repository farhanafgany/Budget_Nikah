'use client'

import { useEffect, useState } from 'react'

interface Options {
  duration?: number
}

export function useAnimatedNumber(target: number, { duration = 1000 }: Options = {}) {
  const [value, setValue] = useState(target)

  useEffect(() => {
    const safeTarget = Number.isFinite(target) ? target : 0
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion || duration <= 0) {
      setValue(safeTarget)
      return
    }

    let animationFrame = 0
    const start = performance.now()
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    setValue(0)

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration)
      setValue(Math.round(safeTarget * easeOutCubic(progress)))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick)
      }
    }

    animationFrame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(animationFrame)
  }, [target, duration])

  return value
}
