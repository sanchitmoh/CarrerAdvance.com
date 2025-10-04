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
  const isAdminAuthPage = pathname?.startsWith('/admin') && (
    pathname.includes('/login') || pathname.includes('/register') || pathname.includes('/forgot-password')
  )

  const isJobSeekerDashboard = pathname?.startsWith('/job-seekers') && !isJobSeekerAuthPage
  const isEmployerDashboard = pathname?.startsWith('/employers') && !isEmployerAuthPage
  const isAdminDashboard = pathname?.startsWith('/admin') && !isAdminAuthPage
  const isDashboardRoute = isJobSeekerDashboard || isEmployerDashboard || isAdminDashboard
  
  // Show navbar for non-dashboard routes and admin auth pages
  const shouldShowNavbar = !isDashboardRoute || isAdminAuthPage
  
  // Show footer for non-dashboard routes and ALL admin pages (including dashboard)
  const shouldShowFooter = !isDashboardRoute || pathname?.startsWith('/admin')
  
  return (
    <>
      {shouldShowNavbar && <ClientNavbarWrapper />}
      {children}
      {shouldShowFooter && <Footer />}
    </>
  )
}