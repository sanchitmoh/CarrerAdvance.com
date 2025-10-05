'use client'

import { useState, useEffect } from 'react'
import JobSeekerSidebar from '@/components/JobseekerSidebar'
import JobSeekerNavbar from '@/components/JobseekerNavbar'
import { Toaster } from '@/components/ui/toaster'
import Footer from '@/components/Footer'

export default function JobSeekerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-green-50/20">
      {/* Job Seeker Navbar */}
      <JobSeekerNavbar onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      {/* Mobile overlay for sidebar */}
      {!sidebarCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      <div className="flex pt-16 pb-20"> {/* Add padding-top for navbar and padding-bottom for footer */}
        <JobSeekerSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobile={isMobile}
        />
        <main className={`flex-1 transition-all duration-300 ${
          isMobile 
            ? 'ml-0' 
            : sidebarCollapsed 
              ? 'ml-16' 
              : 'ml-64'
        } p-3 sm:p-4 md:p-6 min-h-[calc(100vh-4rem-80px)]`}>
          <div className="max-w-7xl mx-auto">
            {children}
            
          </div>
        </main>
        
      </div>
      <Footer/>
      {/* Toaster for notifications */}
      <Toaster />
    </div>
  )
}