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
import { getApiUrl, getAssetUrl } from '@/lib/api-config'
import Image from 'next/image'

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
          const avatar = avatarPath ? getAssetUrl(avatarPath) : ''
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
      <div className="max-w-8xl  px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}

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

         <Image
          src="/logo1.png"
          alt="CareerAdvance"
          width={160}
          height={180}
         />

          {/* Mobile Menu Button */}
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            
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