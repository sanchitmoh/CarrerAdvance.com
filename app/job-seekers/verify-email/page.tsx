"use client"

import { useRouter, useSearchParams } from "next/navigation"
import OTPVerification from "@/components/OTPVerification"

export default function JobSeekersVerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "your-email@example.com"

  const handleVerificationSuccess = () => {
    // Redirect to job seeker dashboard after successful verification
    router.push("/job-seekers/dashboard/profile")
  }

  return <OTPVerification email={email} role="Job Seekers" onVerificationSuccess={handleVerificationSuccess} />
}
