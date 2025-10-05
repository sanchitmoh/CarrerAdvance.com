'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Zap, Sparkles, User, Settings, LogOut, Home, Briefcase, Menu } from 'lucide-react'
import { useJobseekerLogout } from '@/components/AuthForm'
import { getApiUrl } from '@/lib/api-config'

interface JobSeekerNavbarProps {
  onMenuToggle?: () => void
}

export default function JobSeekerNavbar({ onMenuToggle }: JobSeekerNavbarProps) {
  const router = useRouter()
  const { logout } = useJobseekerLogout()
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState({
    name: 'Job Seeker',
    email: '',
    avatar: ''
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Avoid SSR hydration mismatch by rendering only after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch user details for avatar/name
  useEffect(() => {
    const jobseekerId = typeof window !== 'undefined' ? localStorage.getItem('jobseeker_id') : null
    if (!jobseekerId) return
    ;(async () => {
      try {
        const res = await fetch( getApiUrl(`seeker/profile/get_profile?jobseeker_id=${jobseekerId}`), {
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
          const avatar = avatarPath
            ? (/^https?:\/\//i.test(avatarPath) ? avatarPath : `http://localhost:8080/${avatarPath.replace(/^\//, '')}`)
            : ''
          setUser({ name, email, avatar })
        }
      } catch (_e) {
        // ignore
      }
    })()
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/job-seekers/login')
  }

  if (!mounted) return null

  return (
    <nav 
      className={`fixed w-full z-40 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
          : 'bg-white/80 backdrop-blur-sm'
      } animate-slide-down`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div 
              className="relative transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-200 transition-all duration-300 relative overflow-hidden">
                <Zap className="h-5 w-5 text-white z-10" />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite_linear]"
                />
              </div>
              <div 
                className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center animate-pulse-slow"
              >
                <Sparkles className="h-1.5 w-1.5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-lg leading-none tracking-tight">CareerAdvance</span>
              <span className="text-xs bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent font-semibold">Job Seeker Portal</span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
              <span className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full w-0 group-hover:w-full transition-all duration-300" />
            </Link>
            
            <Link 
              href="/jobs" 
              className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group"
            >
              <Briefcase className="h-4 w-4" />
              <span>Jobs</span>
              <span className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full w-0 group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          {/* User Profile Dropdown */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 hover:bg-emerald-50 rounded-xl px-3 py-2">
                  <Avatar className="h-8 w-8 ring-2 ring-emerald-500/20">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-500 text-white text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">Job Seeker</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-2xl p-2">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                
                <DropdownMenuItem asChild>
                  <Link href="/job-seekers/dashboard/profile" className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors">
                    <User className="h-4 w-4 text-emerald-600" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/job-seekers/dashboard/change-password" className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors">
                    <Settings className="h-4 w-4 text-emerald-600" />
                    <span>Password Reset </span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="my-2" />
                
                <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
