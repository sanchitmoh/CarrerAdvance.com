"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Menu, X, User, LogOut, Briefcase, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getApiUrl, getAssetUrl, getBackendUrl } from "@/lib/api-config"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useEmployerLogout } from "@/components/AuthForm"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  job_id: string
  job_title: string
  applicant_name: string
  applicant_id: string
  applied_date: string
  is_read?: boolean
}

interface EmployerNavbarProps {
  onMobileMenuToggle: () => void
  isMobileMenuOpen: boolean
}

export default function EmployerNavbar({ onMobileMenuToggle, isMobileMenuOpen }: EmployerNavbarProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const router = useRouter()
  const { logout } = useEmployerLogout()
  const { toast } = useToast()
  const [user, setUser] = useState({
    name: 'Employer',
    email: '',
    avatar: ''
  })

  // Fetch user details for avatar/name
  useEffect(() => {
    const employerId = typeof window !== 'undefined' ? localStorage.getItem('employer_id') : null

    if (!employerId) return
      ; (async () => {
        try {
          // Use backend employer profile API to fetch profile data

          const res = await fetch(getBackendUrl(`/index.php/api/employer/profile/get_profile?employer_id=${employerId}`), {
            credentials: 'include',
          })

          const data = await res.json()
          console.log('Navbar API Response:', data) // Debug log
          if (data?.success && data?.data?.employer) {
            const p = data.data.employer
            const firstName = p.firstname || ''
            const lastName = p.lastname || ''
            const name = `${firstName} ${lastName}`.trim() || 'Employer'
            const email = p.email || ''
            // Use profile_picture or company_logo with proper URL construction
            const avatarPath = p.profile_picture || p.company_logo || ''
            const avatar = avatarPath ? getBackendUrl(`/${avatarPath}`) : ''
            console.log('Avatar construction - Path:', avatarPath, 'Full URL:', avatar)
            setUser({ name, email, avatar })
            console.log('User state set:', { name, email, avatar })
          }
        } catch (_e) {
          // ignore
          console.error('Navbar fetch error:', _e)
        }
      })()
  }, [])

  // Fetch notifications (job applications)
  const fetchNotifications = async () => {
    const employerId = typeof window !== 'undefined' ? localStorage.getItem('employer_id') : null
    if (!employerId) return

    setIsLoadingNotifications(true)
    try {
      const res = await fetch(getBackendUrl(`/index.php/api/employer/get_applications?employer_id=${employerId}`), {
        credentials: 'include',
      })

      const data = await res.json()
      if (data?.success && data?.data?.applications) {
        const apps = data.data.applications.map((app: any) => ({
          id: app.id || app.application_id,
          job_id: app.job_id,
          job_title: app.job_title || app.title || 'Job Application',
          applicant_name: app.applicant_name || `${app.firstname || ''} ${app.lastname || ''}`.trim() || 'Applicant',
          applicant_id: app.seeker_id || app.applicant_id,
          applied_date: app.applied_date || app.created_date,
          is_read: app.is_read || false
        }))
        setNotifications(apps)
        setUnreadCount(apps.filter((n: Notification) => !n.is_read).length)
      } else {
        // Fallback: try alternative endpoint structure
        const altRes = await fetch(getBackendUrl(`/index.php/api/jobs/get_applications?employer_id=${employerId}`), {
          credentials: 'include',
        })
        const altData = await altRes.json()
        if (altData?.success && altData?.data) {
          const apps = Array.isArray(altData.data) ? altData.data : altData.data.applications || []
          const formattedApps = apps.map((app: any) => ({
            id: app.id || app.application_id,
            job_id: app.job_id,
            job_title: app.job_title || app.title || 'Job Application',
            applicant_name: app.applicant_name || `${app.firstname || ''} ${app.lastname || ''}`.trim() || 'Applicant',
            applicant_id: app.seeker_id || app.applicant_id,
            applied_date: app.applied_date || app.created_date,
            is_read: false
          }))
          setNotifications(formattedApps)
          setUnreadCount(formattedApps.length)
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      // Set empty notifications on error
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setIsLoadingNotifications(false)
    }
  }

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const handleNotificationClick = (notification: Notification) => {
    // Navigate to jobs page or application details
    router.push(`/employers/dashboard/jobs?job_id=${notification.job_id}&application_id=${notification.id}`)
  }

  const handleLogout = () => {
    toast({
      title: '👋 Logged Out Successfully',
      description: 'You have been logged out. Thank you for using CareerAdvance!',
      duration: 3000
    })
    logout()
    router.push('/employers/login')
  }

  console.log('Navbar render - user state:', user) // Debug log

  return (
    <header className="bg-white border-b border-gray-200 px-3 py-2 lg:px-6 z-100 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={onMobileMenuToggle}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo/Title */}
          <div className="flex items-center ">
           <Link href={"/employers/dashboard"}>
            <Image
              src={"/logo1.png"}
              height={160}
              width={180}
              className="transition-transform duration-200 hover:scale-105 cursor-pointer"
              
              
              alt="CareerAdvance"
              />
              </Link>
          </div>
        </div>

        {/* Center - removed search bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8" />

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    fetchNotifications()
                  }}
                >
                  Refresh
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[400px]">
                {isLoadingNotifications ? (
                  <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-sm text-gray-500">
                    <Bell className="h-8 w-8 mb-2 opacity-50" />
                    <p>No new notifications</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.slice(0, 20).map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start w-full space-x-3">
                          <div className={`flex-shrink-0 mt-1 ${!notification.is_read ? 'text-emerald-600' : 'text-gray-400'}`}>
                            <Briefcase className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                                New Application
                              </p>
                              {!notification.is_read && (
                                <span className="h-2 w-2 bg-emerald-500 rounded-full flex-shrink-0"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              <span className="font-medium">{notification.applicant_name}</span> applied for{' '}
                              <span className="font-medium">{notification.job_title}</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(notification.applied_date)}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </ScrollArea>
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-center justify-center cursor-pointer"
                    onClick={() => router.push('/employers/dashboard/jobs')}
                  >
                    View All Applications
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-12 w-12">
                  {user.avatar ? (
                    <AvatarImage
                      src={user.avatar}
                      alt={user.name}
                      onError={() => {
                        console.log('Avatar image failed to load:', user.avatar)
                      }}
                    />
                  ) : null}
                  <AvatarFallback className="bg-emerald-500 text-white">
                    {user.name && user.name !== 'Employer'
                      ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                      : 'EM'
                    }
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/employers/dashboard/profile')} className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 text-red-600">
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search removed */}
    </header>
  )
}