import AuthForm from '@/components/AuthForm'

export default function CompaniesForgotPasswordPage() {
  return (
    <AuthForm
      role="Companies"
      type="forgot-password"
      title="Reset Company Password"
      subtitle="Enter your email to receive password reset instructions"
    />
  )
}
