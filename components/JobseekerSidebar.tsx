'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, FileText, PenTool, CheckCircle, Briefcase, Target, Heart, Lock, LogOut, Menu, X } from 'lucide-react'
import { useJobseekerLogout } from '@/components/AuthForm'
import { getApiUrl } from '@/lib/api-config'


interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  isMobile?: boolean
}

const sidebarItems = [
  { name: 'My Profile', href: '/job-seekers/dashboard/profile', icon: User },
  { name: 'Resume Management', href: '/job-seekers/dashboard/resume', icon: FileText },
  { name: 'My Applications', href: '/job-seekers/dashboard/applications', icon: Briefcase },
  { name: 'Matching Jobs', href: '/job-seekers/dashboard/matching-jobs', icon: Target },
  { name: 'Saved Jobs', href: '/job-seekers/dashboard/saved-jobs', icon: Heart },
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
        const res = await fetch(`http://localhost:8080/index.php/api/seeker/profile/get_profile?jobseeker_id=${jobseekerId}`, {
          credentials: 'include',
        })
        const data = await res.json()
        if (data?.success && data?.data?.profile) {
          const p = data.data.profile
          const firstName = p.firstname || ''
          const lastName = p.lastname || ''
          const name = `${firstName} ${lastName}`.trim() || 'Job Seeker'
          const email = p.email || ''
          const avatarPath = p.profile_picture || p.profile_pic || p.avatar || ''
          const avatar = avatarPath
            ? (/^https?:\/\//i.test(avatarPath) ? avatarPath : `http://localhost:8080/${avatarPath}`)
            : ''
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

  const shouldExpand = !collapsed || isHovered

  return (
    <aside 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem-80px)] bg-gradient-to-b from-gray-950 via-emerald-950 to-gray-950 text-white transition-all duration-300 z-50 ${
        isMobile
          ? collapsed 
            ? '-translate-x-full' 
            : 'translate-x-0 w-64'
          : shouldExpand 
            ? 'w-64' 
            : 'w-16'
      } shadow-2xl`}
      onMouseEnter={!isMobile ? () => setIsHovered(true) : undefined}
      onMouseLeave={!isMobile ? () => setIsHovered(false) : undefined}
    >
      {/* Header */}
      <div className="p-4 border-b border-emerald-800/50">
        <div className="flex items-center justify-between">
          {(shouldExpand || isMobile) && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </div>
          )}
          {!shouldExpand && !isMobile && (
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mx-auto">
              <User className="h-4 w-4 text-white" />
            </div>
          )}
          {(shouldExpand || isMobile) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-emerald-400 hover:text-white hover:bg-emerald-800/50 p-2"
            >
              {isMobile ? <X className="h-4 w-4" /> : (collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />)}
            </Button>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-emerald-800/50">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 ring-2 ring-emerald-500/50 flex-shrink-0">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-500 text-white">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {(shouldExpand || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-300 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link key={item.name} href={item.href} onClick={() => isMobile && onToggle()}>
              <div className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-emerald-800/50'
              }`}>
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-emerald-400 group-hover:text-white'}`} />
                {(shouldExpand || isMobile) && (
                  <span className="font-medium truncate">{item.name}</span>
                )}
                {!shouldExpand && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-emerald-800/50">
        <Button
          variant="ghost"
          className={`w-full flex items-center space-x-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-red-600/20 rounded-xl transition-all duration-200 group relative ${
            !shouldExpand && !isMobile ? 'justify-center' : ''
          }`}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 text-red-400 flex-shrink-0" />
          {(shouldExpand || isMobile) && <span className="font-medium">Logout</span>}
          {!shouldExpand && !isMobile && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </Button>
      </div>
    </aside>
  )
}
