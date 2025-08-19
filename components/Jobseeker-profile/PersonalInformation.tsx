'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Camera, Briefcase, Award } from 'lucide-react'

// Sample data for provinces and cities
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
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
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

  // Load personal information on component mount
  useEffect(() => {
    const loadPersonalInfo = async () => {
      try {
        // Get jobseeker ID from localStorage (set after login)
        const jobseekerId = localStorage.getItem('jobseeker_id');
        
        if (!jobseekerId) {
          console.error('No jobseeker ID found. Please login again.');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/seeker/profile/get_personal_info?jobseeker_id=${jobseekerId}`);
        const data = await response.json();
        
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
            avatar: data.data.avatar || '/placeholder.svg?height=100&width=100'
          });
        }
      } catch (error) {
        console.error('Error loading personal information:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPersonalInfo();
  }, []);

  const [availableProvinces, setAvailableProvinces] = useState<Array<{name: string, cities: string[]}>>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])

  useEffect(() => {
    if (formData.nationality && locationData[formData.nationality as keyof typeof locationData]) {
      setAvailableProvinces(locationData[formData.nationality as keyof typeof locationData].provinces)
      setFormData(prev => ({ ...prev, province: '', city: '' }))
    }
  }, [formData.nationality])

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
      const jobseekerId = localStorage.getItem('jobseeker_id');
      
      if (!jobseekerId) {
        console.error('No jobseeker ID found. Please login again.');
        return;
      }

      const response = await fetch('/api/seeker/profile/update_personal_info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobseeker_id: jobseekerId,
          ...formData
        }),
      });
      console.log('Response:', response); 
      const data = await response.json();
      
      if (data.success) {
        setIsEditing(false);
        // You can add a toast notification here
      } else {
        console.error('Failed to save:', data.message);
      }
    } catch (error) {
      console.error('Error saving personal information:', error);
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    setIsEditing(false)
  }

  return (
    <Card className="border-emerald-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-emerald-600" />
            <div>
              <CardTitle className="text-emerald-800">Personal Information</CardTitle>
              <CardDescription className="text-emerald-600">
                Your basic profile information
              </CardDescription>
            </div>
          </div>
          <Button
            variant={isEditing ? "destructive" : "outline"}
            size="sm"
            onClick={isEditing ? handleCancel : () => setIsEditing(true)}
            className={isEditing ? "border-red-200 text-red-600 hover:bg-red-50" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"}
          >
            {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-6">
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
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {formData.firstName} {formData.lastName}
              </h3>
              <p className="text-gray-600">{formData.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  {formData.jobCategory}
                </Badge>
                <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                  {formData.yourTitle}
                </Badge>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="space-y-2">
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

            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label htmlFor="jobCategory" className="text-gray-700 font-medium">Job Category</Label>
              <Select
                value={formData.jobCategory}
                onValueChange={(value) => handleInputChange('jobCategory', value)}
                disabled={!isEditing}
              >
                <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {jobCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yourTitle" className="text-gray-700 font-medium">Your Title</Label>
              <Input
                id="yourTitle"
                value={formData.yourTitle}
                onChange={(e) => handleInputChange('yourTitle', e.target.value)}
                disabled={!isEditing}
                className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}
                placeholder="e.g., Senior Software Developer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-gray-700 font-medium">Experience Level</Label>
              <Select
                value={formData.experience}
                onValueChange={(value) => handleInputChange('experience', value)}
                disabled={!isEditing}
              >
                <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality" className="text-gray-700 font-medium">Nationality</Label>
              <Select
                value={formData.nationality}
                onValueChange={(value) => handleInputChange('nationality', value)}
                disabled={!isEditing}
              >
                <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Philippines">Philippines</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="province" className="text-gray-700 font-medium">Province/State</Label>
              <Select
                value={formData.province}
                onValueChange={(value) => handleInputChange('province', value)}
                disabled={!isEditing || !availableProvinces.length}
              >
                <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                  <SelectValue placeholder="Select province/state" />
                </SelectTrigger>
                <SelectContent>
                  {availableProvinces.map((province) => (
                    <SelectItem key={province.name} value={province.name}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-700 font-medium">City</Label>
              <Select
                value={formData.city}
                onValueChange={(value) => handleInputChange('city', value)}
                disabled={!isEditing || !availableCities.length}
              >
                <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                  className={`pl-10 ${isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-700 font-medium">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
                disabled={!isEditing}
              >
                <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>


          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-700 font-medium">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              rows={4}
              className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


