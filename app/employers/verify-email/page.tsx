"use client"

import { useRouter, useSearchParams } from "next/navigation"
import OTPVerification from "@/components/OTPVerification"

export default function EmployersVerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "your-email@example.com"

  const handleVerificationSuccess = () => {
    // Redirect to employer dashboard after successful verification
    router.push("/employers/dashboard/profile")
  }

  return <OTPVerification email={email} role="Employers" onVerificationSuccess={handleVerificationSuccess} />
}
