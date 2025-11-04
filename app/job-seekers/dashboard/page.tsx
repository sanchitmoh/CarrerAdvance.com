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
        <DialogContent className="w-full max-w-2xl mx-auto sm:mx-0 rounded-lg p-4 sm:p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-emerald-700">
              Welcome to Your Profile
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 mt-2">
              {showUploadInline ? 'Upload your resume to auto-fill your profile' : "Choose how you'd like to set up your profile"}
            </DialogDescription>
          </DialogHeader>

          {showUploadInline ? (
            <div className="mt-4">
              <ResumeUpload />
              <div className="mt-4 flex gap-3">
                <Button
                  variant="outline"
                  className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => setShowUploadInline(false)}
                >
                  <Edit3 className="w-4 h-4 mr-2" /> Switch to Manual Entry
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => {
                    setShowSetupDialog(false)
                    router.push('/job-seekers/dashboard/profile')
                  }}
                >
                  Go to Profile
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8">
                <button
                  onClick={handleUploadResume}
                  className="group flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-emerald-200 rounded-lg hover:bg-emerald-50 transition-all duration-300 hover:border-emerald-500"
                >
                  <div className="mb-4 p-3 sm:p-4 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Upload Resume</h3>
                  <p className="text-sm sm:text-base text-gray-600 text-center">
                    Fetch data from resume - Upload your resume and we'll automatically extract your information
                  </p>
                </button>

                <button
                  onClick={handleManualEntry}
                  className="group flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-emerald-200 rounded-lg hover:bg-emerald-50 transition-all duration-300 hover:border-emerald-500"
                >
                  <div className="mb-4 p-3 sm:p-4 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
                    <Edit3 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Add Personal Information Manually</h3>
                  <p className="text-sm sm:text-base text-gray-600 text-center">
                    Manually enter your information step by step
                  </p>
                </button>
              </div>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  onClick={handleUploadResume}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 sm:py-4 rounded-lg transition-colors"
                >
                  Upload Resume
                </Button>
                <Button
                  onClick={handleManualEntry}
                  variant="outline"
                  className="flex-1 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold py-3 sm:py-4 rounded-lg transition-colors bg-transparent"
                >
                  Add Manually
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