import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

export default function TeachersLoginPage() {
  return (
    <AuthForm
      role="Teachers"
      type="login"
      title="Teacher Login"
      subtitle="Access your teaching dashboard and manage your courses"
    />
  )
}
