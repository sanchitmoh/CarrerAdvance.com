"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight, CheckCircle, RefreshCw, Mail } from "lucide-react"
import { getApiUrl } from "@/lib/api-config"

interface OTPVerificationProps {
  email: string
  role: string
  onVerificationSuccess: () => void
}

const roleColors: { [key: string]: string } = {
  Teachers: "from-emerald-500 to-emerald-600",
  Students: "from-green-500 to-green-600",
  Drivers: "from-teal-500 to-teal-600",
  Employers: "from-lime-500 to-lime-600",
  Companies: "from-cyan-500 to-cyan-600",
  "Job Seekers": "from-emerald-700 to-green-700",
}

const roleIcons: { [key: string]: string } = {
  Teachers: "👨‍🏫",
  Students: "🎓",
  Drivers: "🚗",
  Employers: "💼",
  Companies: "🏢",
  "Job Seekers": "🔍",
}

export default function OTPVerification({ email, role, onVerificationSuccess }: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const { toast } = useToast()

  // Timer for OTP expiration
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value

    // Auto-focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }

    setOtp(newOtp)
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerify = async () => {
    const otpCode = otp.join("")

    if (otpCode.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter all 6 digits",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const endpoint = role === "Employers"
        ? getApiUrl("employers/auth/verify_otp")
        : getApiUrl("seeker/auth/verify_otp")
      const body = new URLSearchParams()
      body.append("email", email)
      body.append("otp", otpCode)
      const res = await fetch(endpoint, { method: "POST", body, credentials: "include" })
      const data = await res.json().catch(() => ({ status: 0, message: "Unexpected response" }))
      if (data.status === 1) {
        toast({ title: "Success!", description: "Email verified successfully" })
        onVerificationSuccess()
      } else {
        toast({ title: "Error", description: data.message || "Invalid OTP. Please try again", variant: "destructive" })
      }
    } catch (_e) {
      toast({ title: "Network error", description: "Could not verify. Try again.", variant: "destructive" })
    }
    setIsLoading(false)
  }

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""])
    setTimeLeft(300)
    setCanResend(false)
    toast({
      title: "OTP Resent",
      description: "A new OTP has been sent to your email",
    })
  }

  const gradientClass = roleColors[role] || "from-emerald-500 to-emerald-600"
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${gradientClass} text-white text-2xl mb-4 shadow-lg`}
          >
            {roleIcons[role] || "👤"}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">We've sent a 6-digit code to {email}</p>
        </div>

        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${gradientClass}`}></div>

          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">Enter Verification Code</CardTitle>
            <CardDescription className="text-gray-600">Check your email for the 6-digit OTP code</CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-8">
              {/* OTP Input Fields */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 focus:border-emerald-500 rounded-lg"
                    placeholder="-"
                    inputMode="numeric"
                  />
                ))}
              </div>

              {/* Timer and Resend */}
              <div className="text-center">
                {timeLeft > 0 ? (
                  <p className="text-sm text-gray-600">
                    Code expires in <span className="font-semibold text-emerald-600">{formatTime(timeLeft)}</span>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">Code has expired</p>
                )}

                {canResend ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-2 text-emerald-600 hover:text-emerald-700"
                    onClick={handleResend}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resend OTP
                  </Button>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">You can resend OTP after the timer expires</p>
                )}
              </div>

              {/* Verify Button */}
              <Button
                onClick={handleVerify}
                className={`w-full bg-gradient-to-r ${gradientClass} hover:shadow-lg text-white h-12 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105`}
                disabled={isLoading || otp.join("").length !== 6}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Verify Email
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Didn't receive the code?
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure the email address is correct</li>
                <li>• Wait a few minutes and try resending</li>
              </ul>
            </div>

            {/* Benefits */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-3">After verification:</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                  <span>Complete account setup</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                  <span>Access all platform features</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                  <span>Secure your account</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
