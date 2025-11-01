'use client'
import AuthForm from '@/components/AuthForm'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginContent() {
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

export default function EmployersLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
