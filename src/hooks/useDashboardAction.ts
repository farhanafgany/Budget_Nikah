'use client'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { AUTH_ERROR } from '@/lib/dashboardActions'

export function useHandleActionError() {
  const router = useRouter()

  return useCallback((error: string | undefined): string | undefined => {
    if (error === AUTH_ERROR) {
      router.replace('/auth/login?next=/dashboard')
      return undefined
    }
    return error
  }, [router])
}
