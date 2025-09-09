"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Shield,
  Zap,
  Settings,
  BarChart3,
  Users,
  Database,
  Key,
  Fingerprint,
  Smartphone,
  AlertTriangle,
} from "lucide-react"

interface AdminAuthFormProps {
  type: "login" | "register" | "forgot-password"
  title: string
  subtitle: string
}

const securityFeatures = [
  { icon: Shield, text: "Multi-factor Authentication" },
  { icon: Fingerprint, text: "Biometric Security" },
  { icon: Database, text: "Encrypted Data Access" },
  { icon: Key, text: "Advanced Permissions" },
]

const adminStats = [
  { icon: Users, value: "50K+", label: "Users Managed" },
  { icon: BarChart3, value: "99.9%", label: "Uptime" },
  { icon: Settings, value: "24/7", label: "Monitoring" },
  { icon: Zap, value: "< 1s", label: "Response Time" },
]

export default function AdminAuthForm({ type, title, subtitle }: AdminAuthFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    adminCode: "",
    twoFactorCode: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [pendingAdminId, setPendingAdminId] = useState<number | null>(null)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

        try {
      if (type === "register") {
        // Validate authorization code
        if (formData.adminCode !== "0512") {
          toast({
            title: "Access Denied",
            description: "Invalid authorization code. Contact system administrator.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          })
          setIsLoading(false)
          return


          
        }


        // Call registration API
        const response = await fetch('/api/admin/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.email,
            email: formData.email,
            password: formData.password,
            firstname: formData.firstName,
            lastname: formData.lastName,
            mobile_no: formData.phone,
            auth_code: formData.adminCode,
          }),
        })

        if (response.ok) {
          toast({
            title: "Success!",
            description: "Admin account created successfully. You can now login.",
          })
          // Redirect to login
          window.location.href = "/admin/login"
        } else {
          const error = await response.json()
          toast({
            title: "Registration Failed",
            description: error.message || "Failed to create admin account",
            variant: "destructive",
          })
        }
      } else if (type === "login") {
        if (!showTwoFactor) {
          // First step: validate credentials and send OTP
          const response = await fetch('/api/admin/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: formData.email,
              password: formData.password,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            if (data.requires_otp) {
              setPendingAdminId(data.admin_id)
              setShowTwoFactor(true)
              toast({
                title: "Security Check",
                description: "OTP sent to your email. Please check and enter the code.",
              })
            } else {
              // Direct login success
              window.location.href = "/admin/dashboard"
            }
          } else {
            const error = await response.json()
            toast({
              title: "Login Failed",
              description: error.message || "Invalid credentials",
              variant: "destructive",
            })
          }
        } else {
          // Second step: verify OTP
          const response = await fetch('/api/admin/auth/verify_otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              admin_id: pendingAdminId,
              otp: formData.twoFactorCode,
            }),
          })

          if (response.ok) {
            toast({
              title: "Success!",
              description: "2FA verification successful. Logging you in...",
            })
            // Redirect to admin dashboard
            window.location.href = "/admin/dashboard"
          } else {
            const error = await response.json()
            toast({
              title: "Verification Failed",
              description: error.message || "Invalid OTP",
              variant: "destructive",
          })
          }
        }
      } else if (type === "forgot-password") {
        // Handle forgot password
        const response = await fetch('/api/admin/auth/forgot_password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
          }),
        })

        if (response.ok) {
          toast({
            title: "Reset Link Sent",
            description: "Password reset instructions sent to your email.",
          })
        } else {
          const error = await response.json()
          toast({
            title: "Failed",
            description: error.message || "Failed to send reset link",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-20 relative overflow-hidden">
      {" "}
      {/* Changed background gradient */}
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full blur-3xl animate-float" // Changed to emerald/green
        />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float delay-200" // Changed to teal/cyan
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-lime-500/10 to-yellow-500/10 rounded-full blur-3xl animate-float delay-400" // Changed to lime/yellow
        />
      </div>
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div className="w-full max-w-6xl flex">
        {/* Left Side - Info Panel */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 text-white animate-fade-in-up">
          <div className="mb-8 transition-transform duration-500 ease-out hover:scale-105">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-white text-3xl mb-6 shadow-2xl">
              {" "}
              {/* Changed to emerald/green */}
              <Shield className="h-10 w-10" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent animate-fade-in-up delay-200">
            {title}
          </h1>

          <p className="text-xl text-gray-300 mb-8 animate-fade-in-up delay-300">{subtitle}</p>

          {/* Security Features */}
          <div className="space-y-4 mb-8 animate-fade-in-up delay-400">
            <h3 className="text-lg font-semibold text-white mb-4">Security Features</h3>
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 opacity-0 translate-y-5 animate-fade-in-up"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                  {" "}
                  {/* Changed to emerald/green */}
                  <feature.icon className="h-4 w-4 text-emerald-400" /> {/* Changed to emerald */}
                </div>
                <span className="text-gray-300">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Admin Stats */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in-up delay-500">
            {adminStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all duration-200 hover:scale-105 hover:bg-white/10"
              >
                <stat.icon className="h-6 w-6 text-emerald-400 mb-2" /> {/* Changed to emerald */}
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 animate-fade-in-up delay-600">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <div
              className="h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 animate-slide-in-x" // Changed to emerald/green
            />

            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 transition-transform duration-500 ease-out hover:scale-110">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center text-white shadow-lg">
                  {" "}
                  {/* Changed to emerald/green */}
                  <Shield className="h-8 w-8" />
                </div>
              </div>

              <CardTitle className="text-2xl font-bold text-gray-900">
                {showTwoFactor
                  ? "Two-Factor Authentication"
                  : type === "login"
                    ? "Admin Login"
                    : type === "register"
                      ? "Create Admin Account"
                      : "Reset Admin Password"}
              </CardTitle>

              <CardDescription className="text-gray-600">
                {showTwoFactor
                  ? "Enter the 6-digit code sent to your email"
                  : type === "login"
                    ? "Sign in to access the admin dashboard"
                    : type === "register"
                      ? "Register as a system administrator"
                      : "We'll send you a secure reset link"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              {showTwoFactor ? (
                <div className="animate-fade-in">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white mb-4 animate-pulse-slow">
                        <Smartphone className="h-8 w-8" />
                      </div>
                      <p className="text-sm text-gray-600 mb-6">Check your email for the 6-digit OTP code</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twoFactorCode" className="text-sm font-medium text-gray-700">
                        Authentication Code
                      </Label>
                      <Input
                        id="twoFactorCode"
                        name="twoFactorCode"
                        type="text"
                        maxLength={6}
                        required
                        value={formData.twoFactorCode}
                        onChange={handleInputChange}
                        className="text-center text-2xl font-mono tracking-widest h-14 border-2 border-gray-200 focus:border-emerald-500 rounded-xl" // Changed to emerald
                        placeholder="000000"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white h-12 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105" // Changed to emerald/green
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2 animate-spin" />
                          Verifying...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          Verify & Login
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </div>
                      )}
                    </Button>

                    <div className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowTwoFactor(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ← Back to login
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {type === "register" && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 animate-fade-in-up">
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
                                className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl" // Changed to emerald
                                placeholder="John"
                              />
                            </div>
                          </div>
                          <div className="space-y-2 animate-fade-in-up delay-100">
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
                                className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl" // Changed to emerald
                                placeholder="Doe"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 animate-fade-in-up delay-200">
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
                              className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl" // Changed to emerald
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 animate-fade-in-up delay-300">
                          <Label htmlFor="adminCode" className="text-sm font-medium text-gray-700 flex items-center">
                            <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />
                            Admin Authorization Code
                          </Label>
                          <div className="relative">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              id="adminCode"
                              name="adminCode"
                              type="password"
                              required
                              value={formData.adminCode}
                              onChange={handleInputChange}
                              className="pl-10 h-12 border-2 border-orange-200 focus:border-orange-500 rounded-xl"
                              placeholder="Enter admin code"
                            />
                          </div>
                          <p className="text-xs text-orange-600">Contact system administrator for authorization code</p>
                        </div>
                      </>
                    )}

                    <div className="space-y-2 animate-fade-in-up delay-400">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Admin Email Address
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
                          className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl" // Changed to emerald
                          placeholder="admin@careeradvance.com"
                        />
                      </div>
                    </div>

                    {type !== "forgot-password" && (
                      <div className="space-y-2 animate-fade-in-up delay-500">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl" // Changed to emerald
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

                    {type === "register" && (
                      <div className="space-y-2 animate-fade-in-up delay-600">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl" // Changed to emerald
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

                    <div className="animate-fade-in-up delay-700">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white h-12 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105" // Changed to emerald/green
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2 animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            {type === "login"
                              ? "Secure Login"
                              : type === "register"
                                ? "Create Admin Account"
                                : "Send Reset Link"}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Links */}
              {!showTwoFactor && (
                <div className="mt-8 text-center space-y-4 animate-fade-in-up delay-800">
                  {type === "login" && (
                    <>
                      <p className="text-gray-600">
                        Need admin access?{" "}
                        <Link
                          href="/admin/register"
                          className="font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent hover:underline"
                        >
                          {" "}
                          {/* Changed to emerald/green */}
                          Request Account
                        </Link>
                      </p>
                      <p>
                        <Link
                          href="/admin/forgot-password"
                          className="text-gray-500 hover:text-emerald-600 transition-colors"
                        >
                          {" "}
                          {/* Changed to emerald */}
                          Forgot your password?
                        </Link>
                      </p>
                    </>
                  )}
                  {type === "register" && (
                    <p className="text-gray-600">
                      Already have admin access?{" "}
                      <Link
                        href="/admin/login"
                        className="font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent hover:underline"
                      >
                        {" "}
                        {/* Changed to emerald/green */}
                        Sign in here
                      </Link>
                    </p>
                  )}
                  {type === "forgot-password" && (
                    <p className="text-gray-600">
                      Remember your password?{" "}
                      <Link
                        href="/admin/login"
                        className="font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent hover:underline"
                      >
                        {" "}
                        {/* Changed to emerald/green */}
                        Sign in here
                      </Link>
                    </p>
                  )}
                </div>
              )}

              {/* Security Notice */}
              {type === "register" && !showTwoFactor && (
                <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 animate-fade-in-up delay-900">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800 text-sm">Security Notice</h4>
                      <p className="text-xs text-orange-700 mt-1">
                        Admin accounts require authorization. Contact your system administrator for approval and setup
                        of two-factor authentication.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
