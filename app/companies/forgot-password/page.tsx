import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

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
