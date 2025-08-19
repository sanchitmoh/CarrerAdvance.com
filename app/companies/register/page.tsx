import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

export default function CompaniesRegisterPage() {
  return (
    <AuthForm
      role="Companies"
      type="register"
      title="Register Your Company"
      subtitle="Connect with top talent and grow your business"
    />
  )
}
