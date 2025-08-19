import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

export default function EmployersRegisterPage() {
  return (
    <AuthForm
      role="Employers"
      type="register"
      title="Join as an Employer"
      subtitle="Find the best talent for your organization"
    />
  )
}
