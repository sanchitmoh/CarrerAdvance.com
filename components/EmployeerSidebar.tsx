"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  User,
  Briefcase,
  Calendar,
  Users,
  FileText,
  Lock,
  X,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// removed logout from sidebar
import { getApiUrl, getAssetUrl } from "@/lib/api-config"

const menuItems = [
  { href: "/employers/dashboard/", label: "Dashboard", icon: Home },
  { href: "/employers/dashboard/profile", label: "Profile", icon: User },
  { href: "/employers/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { href: "/employers/dashboard/interview-tracker", label: "Interview Tracker", icon: Calendar },
  { href: "/employers/dashboard/employee-managment", label: "Employee Management", icon: Users },
  { href: "/employers/dashboard/blogs", label: "Blogs", icon: FileText },
  { href: "/employers/dashboard/change-password", label: "Change Password", icon: Lock },
]

interface EmployerSidebarProps {
  onToggle?: () => void
  open?: boolean
  isMobileMenuOpen?: boolean
  onClose?: () => void
}

export default function EmployerSidebar({ onToggle, open, isMobileMenuOpen, onClose }: EmployerSidebarProps = {}) {
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const [user, setUser] = useState({
    name: "John Doe",
    title: "HR Manager",
    company: "TechCorp Inc.",
    avatar: ""
  })

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 1024)
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Fetch user details for avatar/name
  useEffect(() => {
    const employerId = typeof window !== "undefined" ? localStorage.getItem("employer_id") : null
    if (!employerId) return
    ;(async () => {
      try {
        const res = await fetch(getApiUrl(`employer/profile/get_profile?employer_id=${employerId}`), {
          credentials: "include",
        })
        const data = await res.json()
        if (data?.success && data?.data?.employer) {
          const p = data.data.employer
          const companyData = data?.data?.company
          const firstName = p.firstname || ""
          const lastName = p.lastname || ""
          const name = `${firstName} ${lastName}`.trim() || "Employer"
          const title = p.designation || p.job_title || p.position || "HR Manager"
          const company = (companyData && (companyData.company_name || companyData.name)) || p.company_name || p.company || "Company"
          const avatarPath = p.profile_picture || p.profile_pic || p.avatar || ""
          const avatar = avatarPath ? getAssetUrl(avatarPath) : ""
          setUser({ name, title, company, avatar })
        }
      } catch (_e) {
        // ignore
      }
    })()
  }, [])

  return (
    <TooltipProvider>
      {/* Desktop/Tablet sidebar */}
      <div className="hidden  md:flex fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 flex-col items-center py-4 z-20">
        {/* Logo */}
        

        {/* Navigation */}
        <nav className="flex-1 flex flex-col space-y-6 my-32">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative flex items-center justify-center w-12 h-12 rounded-lg transition-colors
                  ${isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <Icon className="w-6 h-6" />
                <div className="absolute left-full ml-2 px-1.5 py-0.5 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              </Link>
            )
          })}
          
        </nav>
      </div>

      {/* Mobile drawer */}
      <div
        className={`
        md:hidden fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
        ${(typeof isMobileMenuOpen === 'boolean' ? isMobileMenuOpen : !!open) ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">CareerAdvance</span>
          </div>
          <Button onClick={onClose || onToggle} variant="ghost" size="sm" className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </Button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100%-64px)]">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose || onToggle}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors
                  ${isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
          
        </nav>
      </div>
    </TooltipProvider>
  )
}