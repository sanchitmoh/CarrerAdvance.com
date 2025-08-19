import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

export default function JobSeekersForgotPasswordPage() {
  return (
    <AuthForm
      role="Job Seekers"
      type="forgot-password"
      title="Reset Job Seeker Password"
      subtitle="Enter your email to receive password reset instructions"
    />
  )
}
