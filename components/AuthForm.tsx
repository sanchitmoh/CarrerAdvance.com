'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, CheckCircle, Building } from 'lucide-react'
import { getApiUrl, getBaseUrl, getBackendUrl } from '@/lib/api-config'

interface AuthFormProps {
  role: string
  type: 'login' | 'register' | 'forgot-password' | 'reset-password' | 'change-password'
  title: string
  subtitle: string
  resetToken?: string
}

const roleIcons: { [key: string]: string } = {
  'Teachers': '👨‍🏫',
  'Students': '🎓',
  'Drivers': '🚗',
  'Employers': '💼',
  'Companies': '🏢',
  'Job Seekers': '🔍'
}

const roleColors: { [key: string]: string } = {
  'Teachers': 'from-emerald-500 to-emerald-600', // Changed to emerald
  'Students': 'from-green-500 to-green-600',     // Changed to green
  'Drivers': 'from-teal-500 to-teal-600',       // Changed to teal
  'Employers': 'from-lime-500 to-lime-600',     // Changed to lime
  'Companies': 'from-cyan-500 to-cyan-600',     // Changed to cyan (for variety within green/blue spectrum)
  'Job Seekers': 'from-emerald-700 to-green-700' // Changed to darker emerald/green
}

// Utility to get JWT from localStorage
export function getJobseekerToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jobseeker_jwt')
  }
  return null
}

// Utility to log out jobseeker
export function logoutJobseeker() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jobseeker_jwt')
    localStorage.removeItem('jobseeker_id')
    // Clear cookie
    document.cookie = 'jobseeker_jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'
  }
}

// Hook to use logout and update auth state
export function useJobseekerLogout() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getJobseekerToken())
  const logout = () => {
    logoutJobseeker()
    setIsLoggedIn(false)
  }
  return { isLoggedIn, logout }
}

// Simple hook for auth state
export function useJobseekerAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    setIsLoggedIn(!!getJobseekerToken())
  }, [])
  return { isLoggedIn }
}

// --- Employer Auth Utilities ---

// Utility to get employer JWT from localStorage
export function getEmployerToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('employer_jwt')
  }
  return null
}

// Utility to log out employer
export function logoutEmployer() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('employer_jwt')
    localStorage.removeItem('employer_id')
    // Clear cookie
    document.cookie = 'employer_jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'
  }
}

// Hook to use logout and update auth state
export function useEmployerLogout() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getEmployerToken())
  const logout = () => {
    logoutEmployer()
    setIsLoggedIn(false)
  }
  return { isLoggedIn, logout }
}

// Simple hook for auth state
export function useEmployerAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    setIsLoggedIn(!!getEmployerToken())
  }, [])
  return { isLoggedIn }
}

// --- Student Auth Utilities ---

// Utility to get student JWT from localStorage
export function getStudentToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('student_jwt')
  }
  return null
}

// Utility to log out student
export function logoutStudent() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('student_jwt')
    localStorage.removeItem('student_id')
    // Clear cookie
    document.cookie = 'student_jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'
    document.cookie = 'student_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'
  }
}

// Hook to use logout and update auth state
export function useStudentLogout() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getStudentToken())
  const logout = () => {
    logoutStudent()
    setIsLoggedIn(false)
  }
  return { isLoggedIn, logout }
}

// Simple hook for auth state
export function useStudentAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    setIsLoggedIn(!!getStudentToken())
  }, [])
  return { isLoggedIn }
}

export default function AuthForm({ role, type, title, subtitle, resetToken }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    oldPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    company: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Basic validation
    if (type !== 'reset-password' && type !== 'change-password' && !formData.email) {
      toast({
        title: 'Error',
        description: 'Email is required',
        variant: 'destructive'
      })
      setIsLoading(false)
      return
    }

    if (type === 'register' && formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      })
      setIsLoading(false)
      return
    }

    if (type === 'reset-password') {
      if (!formData.password || !formData.confirmPassword) {
        toast({
          title: 'Error',
          description: 'Please enter and confirm your new password',
          variant: 'destructive'
        })
        setIsLoading(false)
        return
      }
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: 'Error',
          description: 'Passwords do not match',
          variant: 'destructive'
        })
        setIsLoading(false)
        return
      }
    }

    if (type === 'change-password') {
      if (!formData.oldPassword || !formData.password || !formData.confirmPassword) {
        toast({
          title: 'Error',
          description: 'Please fill all password fields',
          variant: 'destructive'
        })
        setIsLoading(false)
        return
      }
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: 'Error',
          description: 'Passwords do not match',
          variant: 'destructive'
        })
        setIsLoading(false)
        return
      }
    }

    // --- Job Seeker Auth Integration ---
    if (role === 'Job Seekers') {
      let endpoint = ''
      let body: URLSearchParams | undefined = undefined
      let method = 'POST'
      let headers: Record<string, string> = {}
      let successMsg = ''
      let errorMsg = ''
      let redirectUrl = ''

      if (type === 'login') {
        endpoint = getApiUrl('seeker/auth/api_login')
        body = new URLSearchParams()
        body.append('email', formData.email)
        body.append('password', formData.password)
        successMsg = 'Login successful!'
        errorMsg = 'Invalid email or password.'
      } else if (type === 'register') {
        endpoint = getApiUrl('seeker/auth/api_register')
        body = new URLSearchParams()
        body.append('firstname', formData.firstName)
        body.append('lastname', formData.lastName)
        body.append('email', formData.email)
        body.append('password', formData.password)
        body.append('confirmpassword', formData.confirmPassword)
        successMsg = 'Registration successful! Please check your email to verify your account.'
        errorMsg = 'Registration failed. Please check your details.'
      } else if (type === 'forgot-password') {
        endpoint = getApiUrl('seeker/auth/api_forgot_password')
        body = new URLSearchParams()
        body.append('email', formData.email)
        successMsg = 'Password reset link sent! Please check your email.'
        errorMsg = 'Failed to send reset link. Please check your email.'
      } else if (type === 'reset-password') {
        endpoint = getApiUrl('seeker/auth/reset_password/' + resetToken)
        body = new URLSearchParams()
        body.append('password', formData.password)
        body.append('confirm_password', formData.confirmPassword)
        successMsg = 'Password reset successfully! You can now log in with your new password.'
        errorMsg = 'Failed to reset password. Please try again.'
      }

      try {
        const res = await fetch(endpoint, {
          method,
          headers: {}, // Let browser set Content-Type for form data
          body: body as URLSearchParams,
          credentials: 'include',
        })
        const data = await res.json()
        if (data.success) {
          toast({ title: 'Success!', description: data.message || successMsg })
                      if (type === 'login' && data.token) {
              localStorage.setItem('jobseeker_jwt', data.token)
              // Also set cookie for middleware access
              document.cookie = `jobseeker_jwt=${data.token}; path=/; max-age=86400; SameSite=Strict`
              // Store jobseeker ID if available in response
              if (data.jobseeker_id) {
                localStorage.setItem('jobseeker_id', data.jobseeker_id.toString())
              }
              router.push('/job-seekers/dashboard')
            }
          if (type === 'reset-password') {
            // Redirect to login page after successful password reset
            setTimeout(() => {
              router.push('/job-seekers/login')
            }, 2000)
          }
          // Optionally redirect or update auth state here
        } else {
          toast({ title: 'Error', description: data.message || errorMsg, variant: 'destructive' })
        }
      } catch (err) {
        toast({ title: 'Error', description: 'Network error', variant: 'destructive' })
      }
      setIsLoading(false)
      return
    }
    // --- End Job Seeker Auth Integration ---

    // --- Employer Auth Integration ---
    if (role === 'Employers') {
      let endpoint = ''
      let body: URLSearchParams | undefined = undefined
      let method = 'POST'
      let headers: Record<string, string> = {}
      let successMsg = ''
      let errorMsg = ''

      if (type === 'login') {
        endpoint = getApiUrl('employers/auth/api_login')
        body = new URLSearchParams()
        body.append('email', formData.email)
        body.append('password', formData.password)
        successMsg = 'Login successful!'
        errorMsg = 'Invalid email or password.'
      } else if (type === 'register') {
        endpoint = getApiUrl('employers/auth/api_register')
        body = new URLSearchParams()
        body.append('firstname', formData.firstName)
        body.append('lastname', formData.lastName)
        body.append('email', formData.email)
        body.append('password', formData.password)
        body.append('confirmpassword', formData.confirmPassword)
        body.append('company', formData.company)
        body.append('phone', formData.phone)
        successMsg = 'Registration successful! Please check your email to verify your account.'
        errorMsg = 'Registration failed. Please check your details.'
      } else if (type === 'forgot-password') {
        endpoint = getApiUrl('employers/auth/api_forgot_password')
        body = new URLSearchParams()
        body.append('email', formData.email)
        successMsg = 'Password reset link sent! Please check your email.'
        errorMsg = 'Failed to send reset link. Please check your email.'
      } else if (type === 'reset-password') {
        // Employers reset: call API endpoint that accepts token and new password
        endpoint = getBackendUrl('/index.php/api/Emp_api/resetpassword')
        body = new URLSearchParams()
        body.append('token', (resetToken || ''))
        body.append('password', formData.password)
        body.append('confirm_password', formData.confirmPassword)
        successMsg = 'Password reset successfully! You can now log in with your new password.'
        errorMsg = 'Failed to reset password. Please try again.'
      } else if (type === 'change-password') {
        // Employers dashboard change password (ensure index.php/api path in some environments)
        endpoint = getBackendUrl('/index.php/api/Emp_api/changepass')
        // JSON payload for this endpoint
        headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        successMsg = 'Password updated successfully.'
        errorMsg = 'Failed to change password. Please check your old password.'
      }

      try {
        // attempt primary endpoint
        let res: Response
        if (type === 'change-password') {
          // Send JSON for change-password
          const employerId = (typeof window !== 'undefined') ? localStorage.getItem('employer_id') : null
          const payload = {
            id: employerId ? parseInt(employerId as string, 10) : 0,
            old_password: formData.oldPassword,
            password: formData.password,
          }
          res = await fetch(endpoint, {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify(payload),
          })
        } else {
          res = await fetch(endpoint, {
            method,
            headers: {}, // Let browser set Content-Type for form data
            body: body as URLSearchParams,
            credentials: 'include',
          })
        }

        // If reset-password and primary returns 404, try index.php fallback
        if (type === 'reset-password' && res.status === 404) {
          const webFallback = getBackendUrl('/index.php/employers/auth/reset_password/' + (resetToken || ''))
          const form = new URLSearchParams()
          form.append('password', formData.password)
          form.append('confirm_password', formData.confirmPassword)
          form.append('submit', '1')
          res = await fetch(webFallback, {
            method: 'POST',
            headers: {},
            body: form,
            credentials: 'include',
          })
        }

        let data: any = null
        try {
          data = await res.clone().json()
        } catch (_jsonErr) {
          const text = await res.text()
          data = res.ok ? { success: true, message: text?.slice(0, 200) || successMsg } : { success: false, message: text?.slice(0, 200) || errorMsg }
        }
        if (data && data.success) {
          toast({ title: 'Success!', description: data.message || successMsg })
          if (type === 'register') {
            router.push('/employers/login')
            return
          }
          if (type === 'login' && data.token) {
            localStorage.setItem('employer_jwt', data.token)
            // Also set cookie for middleware access
            document.cookie = `employer_jwt=${data.token}; path=/; max-age=86400; SameSite=Strict`
            // Store employer ID if available in response
            if (data.user && data.user.id) {
              localStorage.setItem('employer_id', data.user.id.toString())
              // Ensure server routes can read employer_id from cookies
              document.cookie = `employer_id=${data.user.id}; path=/; max-age=86400; SameSite=Lax`
            }
            router.push('/employers/dashboard')
          }
          if (type === 'reset-password') {
            setTimeout(() => {
              router.push('/employers/login')
            }, 1500)
          }
        } else {
          toast({ title: 'Error', description: (data && data.message) || errorMsg, variant: 'destructive' })
        }
      } catch (err) {
        toast({ title: 'Error', description: 'Network error', variant: 'destructive' })
      }
      setIsLoading(false)
      return
    }
    // --- End Employer Auth Integration ---

    // --- Student Auth Integration ---
    if (role === 'Students') {
      let endpoint = ''
      let method = 'POST'
      let successMsg = ''
      let errorMsg = ''
      let payload: any = {}

      if (type === 'login') {
        endpoint = getApiUrl('student/login?format=json')
        payload = { email: formData.email, password: formData.password }
        successMsg = 'Login successful!'
        errorMsg = 'Invalid email or password.'
      } else if (type === 'register') {
        endpoint = getApiUrl('student/registration?format=json')
        payload = {
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmpassword: formData.confirmPassword,
          phone: formData.phone,
        }
        successMsg = 'Registration successful! Please check your email to verify your account.'
        errorMsg = 'Registration failed. Please check your details.'
      } else if (type === 'forgot-password') {
        endpoint = getApiUrl('student/forgotpass?format=json')
        payload = { email: formData.email }
        successMsg = 'Password reset link sent! Please check your email.'
        errorMsg = 'Failed to send reset link. Please check your email.'
      }

      try {
        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        })
        const data = await res.json()
        if (data.success) {
          toast({ title: 'Success!', description: data.message || successMsg })
          if (type === 'login') {
            const token = data.token || (data.data && data.data.token)
            const user = data.user || (data.data && data.data.user)
            if (token) {
              localStorage.setItem('student_jwt', token)
              document.cookie = `student_jwt=${token}; path=/; max-age=86400; SameSite=Strict`
            }
            if (user && user.id) {
              localStorage.setItem('student_id', user.id.toString())
              document.cookie = `student_id=${user.id}; path=/; max-age=86400; SameSite=Lax`
            }
            router.push('/students/dashboard')
          }
        } else {
          toast({ title: 'Error', description: data.message || errorMsg, variant: 'destructive' })
        }
      } catch (err) {
        toast({ title: 'Error', description: 'Network error', variant: 'destructive' })
      }
      setIsLoading(false)
      return
    }
    // --- End Student Auth Integration ---

    // Simulate API call for other roles
    setTimeout(() => {
      toast({
        title: 'Success!',
        description: `${type === 'login' ? 'Login' : type === 'register' ? 'Registration' : 'Password reset'} successful!`,
      })
      setIsLoading(false)
    }, 1500)
  }

  const roleBasePath = role.toLowerCase().replace(' ', '-')
  const gradientClass = roleColors[role] || 'from-emerald-500 to-emerald-600' // Default to emerald

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${gradientClass} text-white text-2xl mb-4 shadow-lg`}>
            {roleIcons[role] || '👤'}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${gradientClass}`}></div>
          
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              {type === 'login' ? 'Welcome Back!' : 
               type === 'register' ? 'Create Account' :
               type === 'change-password' ? 'Change Password' :
               'Reset Password'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {type === 'login' ? 'Sign in to your account' : 
               type === 'register' ? 'Join our community today' : 
               type === 'forgot-password' ? 'We\'ll send you a reset link' :
               type === 'change-password' ? 'Update your account password' :
               'Enter your new password below'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-0">
            <form noValidate onSubmit={handleSubmit} className="space-y-5">
              {type === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  {(role === 'Companies' || role === 'Employers') && (
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                        Company Name
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          required
                          value={formData.company}
                          onChange={handleInputChange}
                          className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                          placeholder="Your Company"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {type !== 'reset-password' && type !== 'change-password' && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              )}

              {type === 'reset-password' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {type === 'change-password' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword" className="text-sm font-medium text-gray-700">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="oldPassword"
                        name="oldPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.oldPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </>
              )}

              {(type !== 'forgot-password' && type !== 'reset-password' && type !== 'change-password') && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {type === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className={`w-full bg-gradient-to-r ${gradientClass} hover:shadow-lg text-white h-12 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    {type === 'login' ? 'Sign In' : 
                     type === 'register' ? 'Create Account' : 
                     type === 'forgot-password' ? 'Send Reset Link' :
                     type === 'change-password' ? 'Change Password' :
                     'Reset Password'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>

            {/* Links */}
            <div className="mt-8 text-center space-y-4">
              {type === 'login' && (
                <>
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link href={`/${roleBasePath}/register`} className={`font-semibold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent hover:underline`}>
                      Sign up here
                    </Link>
                  </p>
                  <p>
                    <Link href={`/${roleBasePath}/forgot-password`} className="text-gray-500 hover:text-emerald-600 transition-colors">
                      Forgot your password?
                    </Link>
                  </p>
                </>
              )}
              {type === 'register' && (
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link href={`/${roleBasePath}/login`} className={`font-semibold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent hover:underline`}>
                    Sign in here
                  </Link>
                </p>
              )}
              {type === 'forgot-password' && (
                <p className="text-gray-600">
                  Remember your password?{' '}
                  <Link href={`/${roleBasePath}/login`} className={`font-semibold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent hover:underline`}>
                    Sign in here
                  </Link>
                </p>
              )}
              {type === 'reset-password' && (
                <p className="text-gray-600">
                  Remember your password?{' '}
                  <Link href={`/${roleBasePath}/login`} className={`font-semibold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent hover:underline`}>
                    Sign in here
                  </Link>
                </p>
              )}
            </div>

            {/* Benefits for Registration */}
            {type === 'register' && (
              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">Why join us?</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Access to thousands of job opportunities</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Professional networking and mentorship</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Skill development courses and certifications</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}21