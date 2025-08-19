'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { User, FileText, GraduationCap, Briefcase, Globe, Upload, Edit, CheckCircle, AlertCircle } from 'lucide-react'

import PersonalInformation from '@/components/Jobseeker-profile/PersonalInformation'
import Experience from '@/components/Jobseeker-profile/Experience'
import ProfessionalSummary from '@/components/Jobseeker-profile/ProfessionalSummary'
import Education from '@/components/Jobseeker-profile/Education'
import Languages from '@/components/Jobseeker-profile/Languages'
import ResumeUpload from '@/components/Jobseeker-profile/ResumeUpload'

export default function ProfilePage() {
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [loading, setLoading] = useState(true)

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
      } catch (error) {
        console.error('Error loading profile completion:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileCompletion();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-emerald-200">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Resume</h3>
            <p className="text-sm text-gray-600">Upload & manage</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200">
          <CardContent className="p-4 text-center">
            <Briefcase className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Applications</h3>
            <p className="text-sm text-gray-600">Track progress</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-teal-200">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-teal-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Matching Jobs</h3>
            <p className="text-sm text-gray-600">Find perfect fit</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-cyan-200">
          <CardContent className="p-4 text-center">
            <Edit className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Profile</h3>
            <p className="text-sm text-gray-600">Complete setup</p>
          </CardContent>
        </Card>
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
