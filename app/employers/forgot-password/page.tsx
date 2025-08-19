'use client'
import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

export default function EmployersForgotPasswordPage() {
  return (
    <AuthForm
      role="Employers"
      type="forgot-password"
      title="Reset Employer Password"
      subtitle="Enter your email to receive password reset instructions"
    />
  )
}
