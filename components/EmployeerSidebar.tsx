"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  User,
  Briefcase,
  Calendar,
  Users,
  FileText,
  Lock,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEmployerLogout } from "@/components/AuthForm"
import { getApiUrl, getAssetUrl } from "@/lib/api-config"

const menuItems = [
  { href: "/employers/dashboard/profile", label: "Profile", icon: User },
  { href: "/employers/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { href: "/employers/dashboard/interview-tracker", label: "Interview Tracker", icon: Calendar },
  { href: "/employers/dashboard/employee-managment", label: "Employee Management", icon: Users },
  { href: "/employers/dashboard/blogs", label: "Blogs", icon: FileText },
  { href: "/employers/dashboard/change-password", label: "Change Password", icon: Lock },
]

interface EmployerSidebarProps {
  onToggle?: () => void;
}

export default function EmployerSidebar({ onToggle }: EmployerSidebarProps = {}) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useEmployerLogout()
  const [user, setUser] = useState({
    name: "John Doe",
    title: "HR Manager",
    company: "TechCorp Inc.",
    avatar: ""
  })

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const showExpanded = !isCollapsed || isHovered

  // Emit sidebar state changes for layout
  useEffect(() => {
    const event = new CustomEvent("sidebarStateChange", {
      detail: { isExpanded: showExpanded }
    })
    window.dispatchEvent(event)
  }, [showExpanded])
  
  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
    if (onToggle) onToggle()
  }

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

  const handleLogout = () => {
    logout()
    router.push("/employers/login")
  }

  return (
    <TooltipProvider>
      <div
        className={`fixed left-0 top-16 h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 border-r border-emerald-700 transition-all duration-300 z-30 shadow-xl overflow-y-auto ${
          isMobile
            ? isCollapsed 
              ? '-translate-x-full' 
              : 'translate-x-0 w-64'
            : showExpanded 
              ? 'w-auto' 
              : 'w-auto'
        }`}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Mobile toggle button */}
        {isMobile && !isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="absolute right-2 top-2 h-10 w-10 md:h-12 md:w-12 p-0 hover:bg-emerald-700/50 text-emerald-200 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        )}
        {/* Header */}
        <div className="p-2 md:p-3 lg:p-4 border-b border-emerald-700/50">
          <div className="flex items-center justify-between">
            {showExpanded ? (
              <div className="flex items-center space-x-1.5 md:space-x-2 lg:space-x-3">
                <div className="relative">
                  <Avatar className="h-9 w-9 md:h-11  md:w-11 lg:h-12 lg:w-12 border-2 border-emerald-400">
                    <AvatarImage src={user.avatar || "/placeholder.svg?height=48&width=48"} alt="Employer" />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-500 text-emerald-900 font-bold text-sm md:text-base lg:text-lg">
                      {user.name.split(" ").map(n => n[0]).join("").toUpperCase() || "EM"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-2.5 w-2.5 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4 bg-green-400 border-2 border-emerald-900 rounded-full"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{user.name}</span>
                  <span className="text-xs text-emerald-200">{user.title}</span>
                  <div className="flex items-center mt-1">
                    <Building2 className="h-3 w-3 text-emerald-300 mr-1" />
                    <span className="text-xs text-emerald-300">{user.company}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-9 w-9 md:h-11 md:w-11 lg:h-12 lg:w-12 border-2 border-emerald-400">
                    <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} alt="Employer" />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-500 text-emerald-900 font-bold text-sm md:text-base lg:text-lg">
                      {user.name.split(" ").map(n => n[0]).join("").toUpperCase() || "EM"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-2.5 w-2.5 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4 bg-green-400 border-2 border-emerald-900 rounded-full"></div>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex h-8 w-8 p-0 hover:bg-emerald-700/50 text-emerald-200 hover:text-white transition-colors"
            >
              {isCollapsed ? <ChevronRight className="h-5 w-5 md:h-6 md:w-6" /> : <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />}
            </Button>
          </div>

          {/* Company Info - Only show when expanded */}
          {showExpanded && (
            <div className="mt-3 p-2 bg-emerald-800/50 rounded-lg border border-emerald-700/50">
              <div className="text-xs text-emerald-200">Active Jobs</div>
              <div className="text-lg font-bold text-white">12</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 md:p-3 lg:p-4">
          <ul className="space-y-1 md:space-y-1.5 lg:space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              const linkContent = (
                <Link
                  href={item.href}
                  className={`flex items-center ${showExpanded ? "space-x-2 md:space-x-3" : "justify-center"} px-2 md:px-3 py-2 md:py-2.5 lg:py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-lg transform scale-105"
                      : "text-emerald-100 hover:bg-emerald-700/50 hover:text-white hover:transform hover:scale-105"
                  }`}
                >
                  <Icon
                    className={`${!showExpanded ? 'h-6 w-6 md:h-7 md:w-7' : 'h-5 w-5 md:h-6 md:w-6'} ${
                      isActive ? "text-white" : "text-emerald-300 group-hover:text-white"
                    }`}
                  />
                  {showExpanded && (
                    <span
                      className={`font-medium transition-colors ${
                        isActive ? "text-white" : "text-emerald-100 group-hover:text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                  {isActive && showExpanded && <div className="ml-auto h-2 w-2 bg-white rounded-full"></div>}
                </Link>
              )

              if (!showExpanded) {
                return (
                  <li key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" className="bg-emerald-800 text-white border-emerald-600">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                )
              }

              return <li key={item.href}>{linkContent}</li>
            })}
          </ul>
        </nav>

        {/* Quick Stats - Only show when expanded */}
        {showExpanded && (
          <div className="px-4 py-2">
            <div className="bg-emerald-800/30 rounded-lg p-3 border border-emerald-700/50">
              <div className="text-xs text-emerald-200 mb-2">This Month</div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-white">24</div>
                  <div className="text-xs text-emerald-300">Applications</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">8</div>
                  <div className="text-xs text-emerald-300">Interviews</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="p-4 border-t border-emerald-700/50">
          {!showExpanded ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center p-3 text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-all duration-200 rounded-xl"
                >
                  <LogOut className="h-6 w-6 md:h-7 md:w-7" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-red-800 text-white border-red-600">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-3 text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-all duration-200 rounded-xl group"
            >
              <LogOut className="h-5 w-5 md:h-6 md:w-6 group-hover:transform group-hover:scale-110 transition-transform" />
              <span className="font-medium">Logout</span>
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
