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
  const isJobSeekerAuthPage = pathname?.startsWith('/job-seekers') && (
    pathname.includes('/login') || pathname.includes('/register') || pathname.includes('/forgot-password')
  )
  const isEmployerAuthPage = pathname?.startsWith('/employers') && (
    pathname.includes('/login') || pathname.includes('/register') || pathname.includes('/forgot-password')
  )

  const isJobSeekerDashboard = pathname?.startsWith('/job-seekers') && !isJobSeekerAuthPage
  const isEmployerDashboard = pathname?.startsWith('/employers') && !isEmployerAuthPage
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
