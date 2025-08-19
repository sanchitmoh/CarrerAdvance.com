import AuthForm from '@/components/AuthForm'

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
