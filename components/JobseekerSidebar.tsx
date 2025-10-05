'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, FileText, PenTool, CheckCircle, Briefcase, Target, Heart, Lock, LogOut, Menu, X, FileIcon, Clock } from 'lucide-react'
import { useJobseekerLogout } from '@/components/AuthForm'
import { getApiUrl , getAssetUrl } from '@/lib/api-config'


interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  isMobile?: boolean
}

const sidebarItems = [
  { name: 'My Profile', href: '/job-seekers/dashboard/profile', icon: User },
  { name: 'Resume Management', href: '/job-seekers/dashboard/resume', icon: FileText },
  { name: 'Document', href: '/job-seekers/dashboard/document', icon: FileIcon },
  { name: 'My Applications', href: '/job-seekers/dashboard/applications', icon: Briefcase },
  { name: 'Matching Jobs', href: '/job-seekers/dashboard/matching-jobs', icon: Target },
  { name: 'Saved Jobs', href: '/job-seekers/dashboard/saved-jobs', icon: Heart },
  { name: 'Time Tracker', href: '/job-seekers/dashboard/time-tracker', icon: Clock },
  { name: 'Change Password', href: '/job-seekers/dashboard/change-password', icon: Lock },
]

export default function JobSeekerSidebar({ collapsed, onToggle, isMobile = false }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useJobseekerLogout()
  const [isHovered, setIsHovered] = useState(false)
  const [user, setUser] = useState({
    name: 'Job Seeker',
    email: '',
    avatar: ''
  })

  // Load user profile for avatar/name
  useEffect(() => {
    const jobseekerId = typeof window !== 'undefined' ? localStorage.getItem('jobseeker_id') : null
    if (!jobseekerId) return

    const fetchProfile = async () => {
      try {
        const res = await fetch(getApiUrl(`seeker/profile/get_profile?jobseeker_id=${jobseekerId}`), {
          credentials: 'include',
        })
        const data = await res.json()
        if (data?.success && data?.data?.profile) {
          const p = data.data.profile
          const firstName = p.firstname || ''
          const lastName = p.lastname || ''
          const name = `${firstName} ${lastName}`.trim() || 'Job Seeker'
          const email = p.email || ''
          const avatarPath = p.profile_picture || ''
          const avatar = getAssetUrl(avatarPath)
          setUser({ name, email, avatar })
        }
      } catch (_e) {
        // ignore errors, keep defaults
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/job-seekers/login')
  }

  // Sidebar sizing follows employer sidebar: desktop fixed narrow; mobile slide-in when open
  const shouldExpand = !collapsed

  return (
    <TooltipProvider>
      <div
        className={`fixed left-0 top-16 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-30 shadow-sm overflow-y-auto ${
          isMobile
            ? collapsed
              ? '-translate-x-full'
              : 'translate-x-0 w-64'
            : 'w-16'
        }`}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Mobile header */}
        {isMobile && !collapsed && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">J</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Job Seeker</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onToggle} className="p-2 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        )}

        {/* Logo (desktop) */}
        <div className="hidden md:flex items-center justify-center py-4">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">J</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`${isMobile ? 'p-4' : 'p-2'} flex-1`}>
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              const linkContent = (
                <Link
                  href={item.href}
                  className={`group relative flex items-center ${isMobile && !collapsed ? 'space-x-3 px-3 py-3 rounded-lg' : 'justify-center w-12 h-12 rounded-lg'} transition-colors ${
                    isActive ? 'bg-emerald-100 text-emerald-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={item.name}
                  onClick={() => {
                    if (isMobile) onToggle?.()
                  }}
                >
                  <Icon className="w-5 h-5" />
                  {isMobile && !collapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              )

              if (!isMobile) {
                return (
                  <li key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                )
              }

              return <li key={item.href}>{linkContent}</li>
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className={`${isMobile ? 'p-4' : 'p-2'} border-t border-gray-200`}>
          {isMobile && !collapsed ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-3 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}