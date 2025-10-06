'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AuthForm from '@/components/AuthForm'

export default function EmployersResetPasswordPage() {
  const params = useParams()
  const router = useRouter()
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const validateToken = async () => {
      try {
        if (params.token) {
          setIsValidToken(true)
        } else {
          setIsValidToken(false)
        }
      } catch (_e) {
        setIsValidToken(false)
      } finally {
        setIsLoading(false)
      }
    }
    validateToken()
  }, [params.token])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
          <p className="text-gray-600 mb-6">This password reset link is invalid or has expired.</p>
          <button
            onClick={() => router.push('/employers/forgot-password')}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    )
  }

  return (
    <AuthForm
      role="Employers"
      type="reset-password"
      title="Reset Your Password"
      subtitle="Enter your new password below"
      resetToken={params.token as string}
    />
  )
}






