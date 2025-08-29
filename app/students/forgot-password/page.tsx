'use client '
import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'))

export default function StudentsForgotPasswordPage() {
  return (
    <AuthForm
      role="Students"
      type="forgot-password"
      title="Reset Student Password"
      subtitle="Enter your email to receive password reset instructions"
    />
  )
}