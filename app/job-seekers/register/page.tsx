import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

export default function JobSeekersRegisterPage() {
  return (
    <AuthForm
      role="Job Seekers"
      type="register"
      title="Join as a Job Seeker"
      subtitle="Find your dream job and advance your career"
    />
  )
}
