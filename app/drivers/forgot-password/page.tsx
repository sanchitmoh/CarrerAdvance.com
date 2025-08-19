import AuthForm from '@/components/AuthForm'

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
