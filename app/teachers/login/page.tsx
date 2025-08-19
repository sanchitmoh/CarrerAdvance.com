import AuthForm from '@/components/AuthForm'

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
