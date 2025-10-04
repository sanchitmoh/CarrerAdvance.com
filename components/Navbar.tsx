'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X, ChevronDown, Zap, Shield, Sparkles } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useToast } from '@/hooks/use-toast'

const userRoles = [
  { name: 'Teachers', path: '/teachers', icon: '🎓', color: 'from-emerald-500 to-emerald-600' },
  { name: 'Students', path: '/students', icon: '📚', color: 'from-green-500 to-green-600' },
  //{ name: 'Drivers', path: '/drivers', icon: '🚗', color: 'from-teal-500 to-teal-600' },
  { name: 'Companies', path: '/employers', icon: '💼', color: 'from-lime-500 to-lime-600' },
  //{ name: 'Companies', path: '/companies', icon: '🏢', color: 'from-cyan-500 to-cyan-600' },
  { name: 'Job Seekers', path: '/job-seekers', icon: '🔍', color: 'from-emerald-700 to-green-700' },
  { name: 'Admin', path: '/admin', icon: '⚡', color: 'from-green-700 to-teal-700' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [homeOpen, setHomeOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  const links = ['Home', 'Courses', 'Blogs', 'Jobs']

  const isHome = pathname === '/'
  const showPopoverBehavior =
    isHome ||
    pathname?.includes('/login') ||
    [
      '/jobs',
      '/blogs',
      '/courses',
      '/certifications',
      '/assessments',
      '/learning-paths',
      '/webinars',
      '/about',
      '/team',
      '/careers',
      '/press',
      '/contact',
      '/post-job',
      '/candidates',
      '/employer-dashboard',
      '/pricing',
      '/success-stories',
      '/register',
      '/resume-builder',
      '/career-advice',
      '/salary-guide',
      '/privacy',
      '/terms',
      '/cookies',
      '/accessibility',
      '/admin/register'
    ].some((prefix) => pathname?.startsWith(prefix))

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePopoverOpenChange = (open: boolean) => {
    if (mounted) {
      setHomeOpen(open)
    }
  }

  const handlePopoverClick = () => {
    if (mounted) {
      setHomeOpen(false)
    }
  }

  const handleRoleNav = (e: React.MouseEvent, roleName: string, href: string) => {
    if (roleName === 'Students' || roleName === 'Teachers') {
      e.preventDefault()
      toast({
        title: 'Coming soon',
        description: `${roleName} portal is launching shortly. Stay tuned! ✨`,
      })
      return
    }
    // allow default navigation for other roles
  }

  // Hide homepage Navbar on admin pages except the admin login and register pages
  if (
    (pathname?.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/register') ||
    (pathname?.startsWith('/job-seekers') &&
      !pathname?.includes('/login') &&
      !pathname?.includes('/register') &&
      !pathname?.includes('/forgot-password')) ||
    (pathname?.startsWith('/employers') &&
      !pathname?.includes('/login') &&
      !pathname?.includes('/register') &&
      !pathname?.includes('/forgot-password'))
  ) {
    return null
  }

  return (
    <nav 
      className={`fixed w-full z-[9998] transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
          : 'bg-white/80 backdrop-blur-sm'
      } animate-slide-down`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div 
              className="relative transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-200 transition-all duration-300 relative overflow-hidden"> {/* Changed to emerald/green/teal */}
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white z-10" />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite_linear]"
                />
              </div>
              <div 
                className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center animate-pulse-slow"
              >
                <Sparkles className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-lg sm:text-xl leading-none tracking-tight">CareerAdvance</span>
              <span className="text-[10px] sm:text-xs bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent font-semibold">Next-Gen Career Platform</span> {/* Changed to emerald/green */}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {links.map((item, index) => (
              <div
                key={item}
                className="opacity-0 translate-y-[-20px] animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
              >
                <Link 
                  href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                  className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group text-lg" // Changed to emerald
                >
                  {item}
                  <span 
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full w-0 group-hover:w-full transition-all duration-300" // Changed to emerald/green
                  />
                </Link>
              </div>
            ))}
            
            {/* Login Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 font-medium hover:bg-emerald-50 hover:text-emerald-600 rounded-xl px-4 py-2 text-lg"> {/* Changed to emerald */}
                  <span>Login</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-3 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-2xl">
                <div className="grid grid-cols-1 gap-2">
                  {userRoles.map((role) => (
                    <DropdownMenuItem key={role.name} asChild>
                      <Link href={role.name === 'Students' || role.name === 'Teachers' ? '#' : `${role.path}/login`} onClick={(e) => handleRoleNav(e, role.name, `${role.path}/login`)} className="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all duration-300 group"> {/* Changed to emerald/green */}
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${role.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <span className="text-lg">{role.icon}</span>
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">{role.name}</span> {/* Changed to emerald */}
                          <div className="text-xs text-gray-500">Access your dashboard</div>
                        </div>
                        {role.name === 'Admin' && (
                          <Shield className="h-4 w-4 text-orange-500" />
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* CTA Buttons */}
            <div
              className="flex items-center space-x-3 opacity-0 scale-80 animate-fade-in"
              style={{ animationDelay: '0.6s' }}
            >
              <Link href='/employers/login'>
                <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-emerald-200 transition-all duration-300 transform hover:scale-105 rounded-xl px-6 py-2.5 font-semibold"> {/* Changed to emerald/green */}
                  Post Job
                </Button>
              </Link>
              <Link href='/jobs'>
                <Button variant="outline" className="border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 font-semibold rounded-xl px-6 py-2.5"> {/* Changed to emerald */}
                  Find Jobs
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button / popover */}
          <div className="lg:hidden flex items-center">
            {showPopoverBehavior ? (
              <Popover open={mounted ? homeOpen : false} onOpenChange={handlePopoverOpenChange}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" aria-label="Open navigation menu" className="relative z-[9999] rounded-xl p-2 sm:p-3 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] touch-manipulation">
                    <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  sideOffset={8}
                  className="w-56 sm:w-64 rounded-xl border-2 sm:border-4 border-gray-800 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-2 sm:ring-4 ring-gray-600/20 z-[9999]"
                >
                  <div className="px-2 pb-2 pt-1">
                    <p className="text-xs sm:text-sm font-medium text-foreground">Navigate to:</p>
                  </div>
                  <nav className="flex flex-col">
                    {userRoles.map((role) => (
                      <Link
                        key={role.name}
                        href={role.name === 'Students' || role.name === 'Teachers' ? '#' : `${role.path}/login`}
                        onClick={(e) => { handleRoleNav(e, role.name, `${role.path}/login`); handlePopoverClick(); }}
                        className="flex items-center gap-2 sm:gap-3 rounded-md px-2 py-2 text-xs sm:text-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`${role.name} login`}
                      >
                        <span
                          className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-r ${role.color} text-white shadow`}
                          aria-hidden="true"
                        >
                          <span className="text-sm sm:text-base leading-none">{role.icon}</span>
                        </span>
                        <span className="font-medium text-foreground">{role.name}</span>
                      </Link>
                    ))}
                  </nav>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                aria-label="Toggle menu"
                onClick={() => setIsOpen((v) => !v)}
                className="relative z-[9999] rounded-xl p-2 sm:p-3 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] touch-manipulation"
              >
                {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation overlay (for non-popover behavior) */}
        {isOpen && !showPopoverBehavior && (
          <div className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-xl lg:hidden" role="dialog" aria-modal="true">
            <div className="min-h-screen pt-16 sm:pt-20 px-3 sm:px-4 lg:px-6 pb-24 overflow-y-auto overscroll-contain">
              <nav aria-label="Mobile" className="space-y-4 sm:space-y-6">
                <div className="space-y-1 sm:space-y-2">
                  {links.map((item, index) => (
                    <div key={item} className="opacity-0 translate-x-[-20px] animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <Link
                        href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                        onClick={() => setIsOpen(false)}
                        className="block py-2.5 sm:py-3 text-base sm:text-lg font-semibold text-gray-700 transition-colors hover:text-emerald-600"
                      >
                        {item}
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 sm:space-y-3 border-t border-gray-200 pt-4 sm:pt-6">
                  <p className="mb-2 text-xs sm:text-sm font-bold text-gray-900">Choose Your Role:</p>
                  <div className="grid grid-cols-1 gap-2 sm:gap-3">
                    {userRoles.map((role, index) => (
                      <div key={role.name} className="opacity-0 translate-y-[20px] animate-fade-in-up" style={{ animationDelay: `${0.4 + index * 0.05}s` }}>
                        <Link
                          href={`${role.path}/login`}
                          onClick={() => setIsOpen(false)}
                          className="group flex items-center gap-3 sm:gap-4 rounded-xl p-3 sm:p-4 transition-colors hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50"
                        >
                          <div className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-r ${role.color} text-white shadow-lg`}>
                            <span className="text-base sm:text-lg">{role.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 text-sm sm:text-base">{role.name}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500">Access dashboard</div>
                          </div>
                          {role.name === 'Admin' && <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500" />}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3 opacity-0 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                 <Link href='/employers/login'>
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl py-2.5 sm:py-3 font-semibold text-sm sm:text-base">
                   Post a Job
                  </Button>
                 </Link>
                 <Link href='/jobs'>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-emerald-200 text-emerald-600 rounded-xl py-2.5 sm:py-3 font-semibold text-sm sm:text-base"
                    >
                    Find Jobs
                  </Button>
                    </Link>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}