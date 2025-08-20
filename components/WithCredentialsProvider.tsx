'use client'

import { useEffect } from 'react'

export default function WithCredentialsProvider() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.fetch !== 'function') return

    const originalFetch = window.fetch
    if ((originalFetch as any).__withCredentialsWrapped) return

    const wrappedFetch: typeof fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const nextInit: RequestInit = {
        ...init,
        credentials: init?.credentials ?? 'include',
      }
      return originalFetch(input as any, nextInit as any)
    }

    ;(wrappedFetch as any).__withCredentialsWrapped = true
    // @ts-expect-error override global fetch
    window.fetch = wrappedFetch

    return () => {
      // restore on unmount to be safe in dev HMR
      // @ts-expect-error restore global fetch
      window.fetch = originalFetch
    }
  }, [])

  return null
}


