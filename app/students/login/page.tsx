'use client '
import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'))

export default function StudentsLoginPage() {
  return (
    <AuthForm
      role="Students"
      type="login"
      title="Student Login"
      subtitle="Access your learning dashboard and track your progress"
    />
  )
}
