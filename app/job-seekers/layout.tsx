import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Job Seeker Dashboard - CareerAdvance',
  description: 'Manage your job applications, profile, and career development.',
}

export default function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="overflow-x-hidden">
      {children}
    </div>
  )
}