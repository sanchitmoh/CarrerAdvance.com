import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

export default function DriversForgotPasswordPage() {
  return (
    <AuthForm
      role="Drivers"
      type="forgot-password"
      title="Reset Driver Password"
      subtitle="Enter your email to receive password reset instructions"
    />
  )
}
