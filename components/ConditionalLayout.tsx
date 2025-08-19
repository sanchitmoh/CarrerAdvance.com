'use client'

import { usePathname } from 'next/navigation'
import ClientNavbarWrapper from '@/components/ClientNavbarWrapper'
import Footer from '@/components/Footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if we're in a dashboard that has its own layout
  const isJobSeekerDashboard = pathname?.startsWith('/job-seekers')
  const isEmployerDashboard = pathname?.startsWith('/employers')
  const isDashboardRoute = isJobSeekerDashboard || isEmployerDashboard
  
  // Only render the main navbar and footer for non-dashboard routes
  return (
    <>
      {!isDashboardRoute && <ClientNavbarWrapper />}
      {children}
      {!isDashboardRoute && <Footer />}
    </>
  )
}
