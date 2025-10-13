'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { User, FileText, GraduationCap, Briefcase, Globe, Upload, Edit, CheckCircle, AlertCircle, Camera } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import PersonalInformation from '@/components/Jobseeker-profile/PersonalInformation'
import Experience from '@/components/Jobseeker-profile/Experience'
import ProfessionalSummary from '@/components/Jobseeker-profile/ProfessionalSummary'
import Education from '@/components/Jobseeker-profile/Education'
import Languages from '@/components/Jobseeker-profile/Languages'
import ResumeUpload from '@/components/Jobseeker-profile/ResumeUpload'
import Link from 'next/link'

export default function ProfilePage() {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || ''
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [loading, setLoading] = useState(true)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)

  // Load profile completion on component mount
  useEffect(() => {
    const loadProfileCompletion = async () => {
      try {
        // Get jobseeker ID from localStorage (set after login)
        const jobseekerId = localStorage.getItem('jobseeker_id');
        
        if (!jobseekerId) {
          console.error('No jobseeker ID found. Please login again.');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/seeker/profile/get_profile_completion?jobseeker_id=${jobseekerId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setProfileCompletion(data.data);
        }

        // Try to load existing profile photo URL if stored by your app
        const storedPhotoUrl = localStorage.getItem('jobseeker_profile_photo_url');
        if (storedPhotoUrl) {
          setProfilePhotoUrl(storedPhotoUrl);
        }
      } catch (error) {
        console.error('Error loading profile completion:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileCompletion();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadMessage(null)
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
    if (file) {
      // Validate image size (<= 2MB) and type (jpeg/png/webp)
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      const isValidSize = file.size <= 2 * 1024 * 1024
      if (!isValidType) {
        setSelectedFile(null)
        setPreviewUrl(null)
        setUploadMessage('Invalid file type. Please upload JPG, PNG, or WEBP.')
        return
      }
      if (!isValidSize) {
        setSelectedFile(null)
        setPreviewUrl(null)
        setUploadMessage('File too large. Max size is 2MB.')
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPreviewUrl(reader.result)
        }
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    setUploadMessage(null)
    try {
      const jobseekerId = localStorage.getItem('jobseeker_id')
      if (!jobseekerId) {
        setUploadMessage('Please login again to upload your photo.')
        return
      }
      const formData = new FormData()
      formData.append('jobseeker_id', jobseekerId)
      formData.append('profile_photo', selectedFile)

      // Adjust this endpoint to match your backend
      const response = await fetch('/api/Seeker_api/upload_profile_photo', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setUploadMessage(result?.message || 'Upload failed. Please try again.')
        return
      }

      // Prefer URL from backend; otherwise use preview as optimistic update
      const newUrl: string | null = result?.data?.url || previewUrl
      if (newUrl) {
        setProfilePhotoUrl(newUrl)
        localStorage.setItem('jobseeker_profile_photo_url', newUrl)
      }
      setSelectedFile(null)
      setPreviewUrl(null)
      setUploadMessage('Profile photo updated successfully.')
    } catch (e) {
      setUploadMessage('Unexpected error during upload.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-emerald-100">Complete your profile to get better job matches</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{profileCompletion}%</div>
            <div className="text-sm text-emerald-100">Profile Complete</div>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={profileCompletion} className="h-2 bg-emerald-700" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href={"/job-seekers/dashboard/resume"}>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-emerald-200">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Resume</h3>
            <p className="text-sm text-gray-600">Upload & manage</p>
          </CardContent>
        </Card>
        </Link>
        
        <Link href={"/job-seekers/dashboard/applications"}>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200">
          <CardContent className="p-4 text-center">
            <Briefcase className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Applications</h3>
            <p className="text-sm text-gray-600">Track progress</p>
          </CardContent>
        </Card>
        </Link>
        
        <Link href={"/job-seekers/dashboard/matching-jobs"}>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-teal-200">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-teal-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Matching Jobs</h3>
            <p className="text-sm text-gray-600">Find perfect fit</p>
          </CardContent>
        </Card>
        </Link>
        
       
      </div>

      {/* Profile Sections */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-emerald-800">
            <User className="h-5 w-5" />
            <span>Profile Management</span>
          </CardTitle>
          <CardDescription className="text-emerald-600">
            Manage your professional profile and increase your visibility to employers
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Profile Photo handled inside PersonalInformation component */}
          
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="personal" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-emerald-600">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Personal</span>
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-emerald-600">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Summary</span>
              </TabsTrigger>
              <TabsTrigger value="experience" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-emerald-600">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Experience</span> 



              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-emerald-600">
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Education</span>
              </TabsTrigger>
              <TabsTrigger value="languages" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-emerald-600">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Languages</span>
              </TabsTrigger>
              <TabsTrigger value="resume" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-emerald-600">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Resume</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <PersonalInformation />
            </TabsContent>

            <TabsContent value="summary" className="space-y-6">
              <ProfessionalSummary />
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <Experience />
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <Education />
            </TabsContent>

            <TabsContent value="languages" className="space-y-6">
              <Languages />
            </TabsContent>

            <TabsContent value="resume" className="space-y-6">
              <ResumeUpload />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}