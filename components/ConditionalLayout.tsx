'use client'

import { usePathname } from 'next/navigation'
import ClientNavbarWrapper from '@/components/ClientNavbarWrapper'
import Footer from '@/components/Footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Simple and direct logic: hide navbar for jobseeker and employer dashboards
  const isJobSeekerDashboard = pathname?.startsWith('/job-seekers') && 
    !pathname?.includes('/login') && 
    !pathname?.includes('/register') && 
    !pathname?.includes('/forgot-password')
    
  const isEmployerDashboard = pathname?.startsWith('/employers') && 
    !pathname?.includes('/login') && 
    !pathname?.includes('/register') && 
    !pathname?.includes('/forgot-password')
    
  const isAdminAuthPage = pathname?.startsWith('/admin') && (
    pathname.includes('/login') || pathname.includes('/register') || pathname.includes('/forgot-password')
  )
  
  // Show footer only if NOT on jobseeker or employer dashboards, OR if on admin pages
  const shouldShowFooter = !isJobSeekerDashboard && !isEmployerDashboard && (pathname?.startsWith('/admin') || (!pathname?.startsWith('/admin')))
  
  // Show navbar only if NOT on jobseeker or employer dashboards, OR if on admin auth pages
  const shouldShowNavbar = !isJobSeekerDashboard && !isEmployerDashboard && (isAdminAuthPage || (!pathname?.startsWith('/admin')))
  
  // Force hide navbar for jobseeker dashboard pages only (not auth pages)
  if (pathname?.startsWith('/job-seekers') && !pathname?.includes('/login') && !pathname?.includes('/register') && !pathname?.includes('/forgot-password')) {
    return (
      <>
        {children}
        {shouldShowFooter && <Footer />}
      </>
    )
  }
  
  // Debug logging
  if (typeof window !== 'undefined' && pathname?.startsWith('/job-seekers')) {
    console.log('ConditionalLayout Debug:', {
      pathname,
      isJobSeekerDashboard,
      isEmployerDashboard,
      shouldShowNavbar,
      shouldShowFooter
    })
  }
  
  return (
    <>
      {shouldShowNavbar && <ClientNavbarWrapper />}
      {children}
      {shouldShowFooter && <Footer />}
    </>
  )
}