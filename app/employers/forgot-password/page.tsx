'use client'
import AuthForm from '@/components/AuthForm'

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
