"use client"

import type React from "react"

import { useState, useEffect } from "react"
import EmployerSidebar from "@/components/EmployeerSidebar"
import EmployerNavbar from "@/components/EmployeerNavbar"
import Footer from "@/components/Footer"

export default function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(64) // Default to collapsed (64px)
  const [isMobile, setIsMobile] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Handle responsive behavior
  useEffect(() => {
    setMounted(true)
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Listen for sidebar state changes
  useEffect(() => {
    const handleSidebarStateChange = (e: CustomEvent) => {
      setSidebarWidth(e.detail.isExpanded ? 256 : 64)
    }

    window.addEventListener('sidebarStateChange', handleSidebarStateChange as EventListener)
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange as EventListener)
    }
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 flex" suppressHydrationWarning />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex" suppressHydrationWarning>
      {/* Sidebar */}
      <EmployerSidebar 
        onToggle={() => isMobile && setIsMobileMenuOpen(!isMobileMenuOpen)} 
        isMobileMenuOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content area */}
      <div 
        className={`flex-1 transition-all duration-300 flex flex-col ${
          isMobile ? '' : (sidebarWidth === 256 ? 'md:ml-64' : 'md:ml-16')
        }`}
      >
        {/* Fixed navbar */}
        <div className="sticky top-0 z-20">
          <EmployerNavbar onMobileMenuToggle={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
        </div>
        
        {/* Main content */}
        <main className="p-4 lg:p-6 bg-gray-50 flex-grow">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}