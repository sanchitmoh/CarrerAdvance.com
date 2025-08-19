import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

export default function TeachersForgotPasswordPage() {
  return (
    <AuthForm
      role="Teachers"
      type="forgot-password"
      title="Reset Teacher Password"
      subtitle="Enter your email to receive password reset instructions"
    />
  )
}
