'use client'
import AuthForm from '@/components/AuthForm'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function EmployersLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('employer_jwt') : null
      if (token) {
        // Check if there's a redirect URL
        const redirect = searchParams.get('redirect')
        const queryParams: string[] = []
        searchParams.forEach((value, key) => {
          if (key !== 'redirect') {
            queryParams.push(`${key}=${encodeURIComponent(value)}`)
          }
        })
        const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : ''
        
        if (redirect) {
          router.replace(redirect + queryString)
        } else {
          router.replace('/employers/dashboard')
        }
      }
    } catch (_) {}
  }, [router, searchParams])

  // Get redirect URL and preserve query params
  const redirect = searchParams.get('redirect')
  const preservedParams: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    if (key !== 'redirect') {
      preservedParams[key] = value
    }
  })

  return (
    <AuthForm
      role="Employers"
      type="login"
      title="Employer Login"
      subtitle="Access your employer dashboard and manage job postings"
      redirectUrl={redirect || undefined}
      preservedParams={Object.keys(preservedParams).length > 0 ? preservedParams : undefined}
    />
  )
}
