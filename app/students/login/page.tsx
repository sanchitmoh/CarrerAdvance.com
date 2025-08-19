'use client'
import AuthForm from '@/components/AuthForm'

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
