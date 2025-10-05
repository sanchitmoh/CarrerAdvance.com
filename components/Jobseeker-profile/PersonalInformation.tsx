'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Phone, Calendar, Edit, Save, X, Camera } from 'lucide-react'
import { getAssetUrl } from '@/lib/api-config'

// Location data
const locationData = {
  'Philippines': {
    provinces: [
      { name: 'Metro Manila', cities: ['Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Marikina', 'Caloocan', 'Malabon', 'Navotas', 'Parañaque', 'Las Piñas', 'Muntinlupa', 'San Juan', 'Mandaluyong', 'Pasay', 'Pateros', 'Valenzuela'] },
      { name: 'Cebu', cities: ['Cebu City', 'Mandaue City', 'Lapu-Lapu City', 'Talisay City', 'Danao City', 'Toledo City', 'Naga City', 'Carcar City'] },
      { name: 'Davao', cities: ['Davao City', 'Digos City', 'Tagum City', 'Panabo City', 'Samal City'] },
      { name: 'Batangas', cities: ['Batangas City', 'Lipa City', 'Tanauan City', 'Santo Tomas', 'Calaca'] },
      { name: 'Pampanga', cities: ['Angeles City', 'San Fernando City', 'Mabalacat City', 'Mexico', 'Arayat'] }
    ]
  },
  'United States': {
    provinces: [
      { name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Oakland', 'Fresno', 'Long Beach'] },
      { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany'] },
      { name: 'Texas', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'] },
      { name: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'Tallahassee'] }
    ]
  },
  'Canada': {
    provinces: [
      { name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton', 'London', 'Windsor'] },
      { name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke'] },
      { name: 'British Columbia', cities: ['Vancouver', 'Surrey', 'Burnaby', 'Richmond', 'Abbotsford', 'Victoria'] },
      { name: 'Alberta', cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat'] }
    ]
  }
}

// Job categories
const jobCategories = [
  'Customer Service',
  'Information Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Marketing',
  'Sales',
  'Engineering',
  'Design',
  'Human Resources',
  'Legal',
  'Manufacturing',
  'Retail',
  'Hospitality',
  'Transportation',
  'Construction',
  'Agriculture',
  'Media & Entertainment',
  'Non-Profit',
  'Other'
]

// Experience levels
const experienceLevels = [
  'Entry Level (0-2 years)',
  'Junior (2-4 years)',
  'Mid-Level (4-7 years)',
  'Senior (7-10 years)',
  'Lead (10-15 years)',
  'Manager (15+ years)',
  'Director/Executive (15+ years)'
]

export default function PersonalInformation() {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || ''
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: 'Philippines',
    province: '',
    city: '',
    dateOfBirth: '',
    gender: 'male',
    jobCategory: 'Customer Service',
    yourTitle: '',
    experience: 'Entry Level (0-2 years)',
    bio: '',
    avatar: '/placeholder.svg?height=100&width=100'
  })

  const [availableProvinces, setAvailableProvinces] = useState<Array<{name: string, cities: string[]}>>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])

  // Load personal information from backend
  useEffect(() => {
    const loadPersonalInfo = async () => {
      try {
        const jobseekerId = localStorage.getItem('jobseeker_id')
        if (!jobseekerId) return setLoading(false)
        const res = await fetch(`/api/seeker/profile/get_personal_info?jobseeker_id=${jobseekerId}`)
        const data = await res.json()
        if (data.success && data.data) {
          setFormData({
            firstName: data.data.first_name || '',
            lastName: data.data.last_name || '',
            email: data.data.email || '',
            phone: data.data.phone || '',
            nationality: data.data.nationality || 'Philippines',
            province: data.data.province || '',
            city: data.data.city || '',
            dateOfBirth: data.data.date_of_birth || '',
            gender: data.data.gender || 'male',
            jobCategory: data.data.job_category || 'Customer Service',
            yourTitle: data.data.your_title || '',
            experience: data.data.experience_level || 'Entry Level (0-2 years)',
            bio: data.data.bio || '',
            avatar: data.data.avatar ? getAssetUrl(data.data.avatar) : '/placeholder.svg?height=100&width=100'
          })
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadPersonalInfo()
  }, [])

  // Update provinces when nationality changes
  useEffect(() => {
    if (formData.nationality && locationData[formData.nationality as keyof typeof locationData]) {
      setAvailableProvinces(locationData[formData.nationality as keyof typeof locationData].provinces)
      setFormData(prev => ({ ...prev, province: '', city: '' }))
    }
  }, [formData.nationality])

  // Update cities when province changes
  useEffect(() => {
    if (formData.province) {
      const selectedProvince = availableProvinces.find(p => p.name === formData.province)
      if (selectedProvince) {
        setAvailableCities(selectedProvince.cities)
        setFormData(prev => ({ ...prev, city: '' }))
      }
    }
  }, [formData.province, availableProvinces])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      const jobseekerId = localStorage.getItem('jobseeker_id')
      if (!jobseekerId) return
      const res = await fetch('/api/seeker/profile/update_personal_info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobseeker_id: jobseekerId, ...formData })
      })
      const data = await res.json()
      if (data.success) setIsEditing(false)
      else console.error(data.message)
    } catch (error) {
      console.error(error)
    }
  }
  
  const onClickAvatarButton = () => {
    setAvatarMessage(null)
    const input = document.getElementById('avatar_upload') as HTMLInputElement | null
    input?.click()
  }

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarMessage(null)
    const file = e.target.files?.[0]
    if (!file) return
    const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    const isValidSize = file.size <= 2 * 1024 * 1024
    if (!isValidType) {
      setAvatarMessage('Invalid file type. Upload JPG, PNG, or WEBP.')
      return
    }
    if (!isValidSize) {
      setAvatarMessage('File too large. Max 2MB.')
      return
    }

    // Optimistic preview
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }))
      }
    }
    reader.readAsDataURL(file)

    // Upload
    try {
      setIsUploadingAvatar(true)
      const jobseekerId = localStorage.getItem('jobseeker_id')
      if (!jobseekerId) {
        setAvatarMessage('Please login again to upload your photo.')
        return
      }
      const form = new FormData()
      form.append('jobseeker_id', jobseekerId)
      form.append('profile_photo', file)
      const res = await fetch('/api/seeker/profile/upload_photo', { method: 'POST', body: form })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json?.success) {
        setAvatarMessage(json?.message || 'Upload failed. Please try again.')
        return
      }
      const url: string | null = json?.data?.url || null
      if (url) {
        setFormData(prev => ({ ...prev, avatar: url }))
        localStorage.setItem('jobseeker_profile_photo_url', url)
        setAvatarMessage('Profile photo updated successfully.')
      }
    } catch (err) {
      setAvatarMessage('Unexpected error during upload.')
    } finally {
      setIsUploadingAvatar(false)
      // Reset the input value to allow re-selecting the same file
      const input = document.getElementById('avatar_upload') as HTMLInputElement | null
      if (input) input.value = ''
    }
  }

  const handleCancel = () => setIsEditing(false)

  return (
    <Card className="border-emerald-200 shadow-lg max-w-5xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-emerald-600" />
            <div>
              <CardTitle className="text-emerald-800 text-lg md:text-xl">Personal Information</CardTitle>
              <CardDescription className="text-emerald-600 text-sm md:text-base">
                Your basic profile information
              </CardDescription>
            </div>
          </div>
          <Button
            variant={isEditing ? "destructive" : "outline"}
            size="sm"
            onClick={isEditing ? handleCancel : () => setIsEditing(true)}
            className={isEditing ? "border-red-300 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700" : "border-emerald-300 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700"
}
          >
            {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-emerald-500/20">
              <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={`${formData.firstName} ${formData.lastName}`} />
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-500 text-white text-xl">
                {formData.firstName[0]}{formData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                size="sm"
                onClick={onClickAvatarButton}
                disabled={isUploadingAvatar}
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700 p-0 disabled:opacity-70"
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
            <input id="avatar_upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarFileChange} aria-label="Upload profile photo" title="Upload profile photo" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              {formData.firstName} {formData.lastName}
            </h3>
            <p className="text-gray-600 text-sm md:text-base">{formData.email}</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">{formData.jobCategory}</Badge>
              <Badge variant="outline" className="border-emerald-200 text-emerald-700">{formData.yourTitle}</Badge>
            </div>
            {avatarMessage && (
              <p className={`text-sm mt-2 ${avatarMessage.includes('successfully') ? 'text-emerald-600' : 'text-red-600'}`}>{avatarMessage}</p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={!isEditing}
              className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={!isEditing}
              className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}
            />
          </div>

          {/* Email */}
          <div className="space-y-2 relative">
            <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className={`pl-10 ${isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}`}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2 relative">
            <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className={`pl-10 ${isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}`}
              />
            </div>
          </div>

          {/* Job Category */}
          <div className="space-y-2">
            <Label htmlFor="jobCategory" className="text-gray-700 font-medium">Job Category</Label>
            <Select value={formData.jobCategory} onValueChange={(val) => handleInputChange('jobCategory', val)} disabled={!isEditing}>
              <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {jobCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Your Title */}
          <div className="space-y-2">
            <Label htmlFor="yourTitle" className="text-gray-700 font-medium">Your Title</Label>
            <Input
              id="yourTitle"
              value={formData.yourTitle}
              onChange={(e) => handleInputChange('yourTitle', e.target.value)}
              disabled={!isEditing}
              placeholder="e.g., Senior Software Developer"
              className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-gray-700 font-medium">Experience Level</Label>
            <Select value={formData.experience} onValueChange={(val) => handleInputChange('experience', val)} disabled={!isEditing}>
              <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <Label htmlFor="nationality" className="text-gray-700 font-medium">Nationality</Label>
            <Select value={formData.nationality} onValueChange={(val) => handleInputChange('nationality', val)} disabled={!isEditing}>
              <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(locationData).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Province */}
          <div className="space-y-2">
            <Label htmlFor="province" className="text-gray-700 font-medium">Province/State</Label>
            <Select value={formData.province} onValueChange={(val) => handleInputChange('province', val)} disabled={!isEditing || !availableProvinces.length}>
              <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                <SelectValue placeholder="Select province/state" />
              </SelectTrigger>
              <SelectContent>
                {availableProvinces.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-gray-700 font-medium">City</Label>
            <Select value={formData.city} onValueChange={(val) => handleInputChange('city', val)} disabled={!isEditing || !availableCities.length}>
              <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {availableCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              disabled={!isEditing}
              className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-gray-700 font-medium">Gender</Label>
            <Select value={formData.gender} onValueChange={(val) => handleInputChange('gender', val)} disabled={!isEditing}>
              <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bio */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="bio" className="text-gray-700 font-medium">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}
              placeholder="Tell something about yourself..."
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3 mt-4">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}