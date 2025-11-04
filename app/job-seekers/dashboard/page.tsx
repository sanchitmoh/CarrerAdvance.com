"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/back-button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, Edit3 } from "lucide-react"
import ResumeUpload from "@/components/Jobseeker-profile/ResumeUpload"

export default function DashboardPage() {
  const router = useRouter()
  const [showSetupDialog, setShowSetupDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showUploadInline, setShowUploadInline] = useState(false)

  useEffect(() => {
    const hasSetupProfile = localStorage.getItem("jobSeekerProfileSetup")

    if (!hasSetupProfile) {
      // First time user - show the dialog
      setShowSetupDialog(true)
      setIsLoading(false)
    } else {
      // Already completed setup - redirect to profile
      router.replace("/job-seekers/dashboard/profile")
    }
  }, [router])

  const handleUploadResume = () => {
    localStorage.setItem("jobSeekerProfileSetup", "true")
    // Show the upload form inline in the dialog
    setShowUploadInline(true)
  }

  const handleManualEntry = () => {
    localStorage.setItem("jobSeekerProfileSetup", "true")
    setShowSetupDialog(false)
    router.push("/job-seekers/dashboard/profile")
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="p-4">
          <BackButton />
        </div>

        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="w-full max-w-md mx-auto sm:mx-0 rounded-lg p-4">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-emerald-700">
              Welcome to Your Profile
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 mt-2">
              {showUploadInline ? 'Upload your resume to auto-fill your profile' : "Choose how you'd like to set up your profile"}
            </DialogDescription>
          </DialogHeader>

          {showUploadInline ? (
            <div className="mt-4">
              <ResumeUpload />
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleManualEntry}
                  variant="outline"
                  className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  <Edit3 className="w-4 h-4 mr-2" /> Add Manually
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-4 flex flex-col gap-3">
                <Button
                  onClick={handleUploadResume}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" /> Upload Resume
                </Button>
                <Button
                  onClick={handleManualEntry}
                  variant="outline"
                  className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                >
                  <Edit3 className="w-4 h-4 mr-2" /> Add Manually
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex flex-col min-h-screen">
        <div className="p-4">
          <BackButton />
        </div>

        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-gray-600">Redirecting...</p>
          </div>
        </div>
      </div>
    </>
  )
}