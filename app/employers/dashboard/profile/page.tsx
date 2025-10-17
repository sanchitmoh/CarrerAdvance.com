"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Save, X, Eye, Upload, MapPin, Globe, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { employerApiService, type EmployerProfile, type UpdateProfileRequest } from "@/lib/employer-api"
import { getBackendUrl, getBaseUrl } from "@/lib/api-config"
import { useToast } from "@/hooks/use-toast"
import BackButton from "@/components/back-button"

export default function EmployerProfilePage() {
  const { toast } = useToast()
  const [isPreviewMode, setIsPreviewMode] = useState(true)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    // User Info
    firstName: "",
    lastName: "",
    email: "",
    designation: "",
    phone: "",

    // Company Info
    companyLogo: "/placeholder.svg?height=100&width=100",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    website: "",
    foundedDate: "",
    employees: "",
    description: "",

    // Address
    country: "",
    province: "",
    city: "",
    postcode: "",
    fullAddress: "",

    // Social
    facebook: "",
    twitter: "",
    googlePlus: "",
    youtube: "",
    instagram: "",
    linkedin: "",
  })
  const [countries, setCountries] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)

  // Helpers to render names instead of numeric IDs in preview mode
  const getCountryName = (id: string | number | null | undefined) => {
    if (!id) return "";
    const match = countries.find((c: any) => String(c.id) === String(id));
    return match ? match.name : String(id);
  };
  const getStateName = (id: string | number | null | undefined) => {
    if (!id) return "";
    const match = states.find((s: any) => String(s.id) === String(id));
    return match ? match.name : String(id);
  };
  const getCityName = (id: string | number | null | undefined) => {
    if (!id) return "";
    const match = cities.find((ci: any) => String(ci.id) === String(id));
    return match ? match.name : String(id);
  };

  // Fetch profile data on component mount (guard against React StrictMode double invoke)
  const hasFetchedRef = useRef(false)
  useEffect(() => {
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      
      // Use the API route we created
      const response = await fetch(`/api/employer/profile/get_profile`)
      
      const data = await response.json()
      
      // Handle authentication errors
      if (response.status === 401 || (!data.success && data.message === "Not authenticated")) {
        toast({
          title: "Not authenticated",
          description: "Please login to access your profile",
          variant: "destructive",
        })
        // Redirect to login page
        window.location.href = '/employers/login'
        return
      }
      
      if (data.success && data.data) {
        const { employer, company } = data.data
        
        setProfileData({
          // User Info
          firstName: employer.firstname || "",
          lastName: employer.lastname || "",
          email: employer.email || "",
          designation: employer.designation || "",
          phone: employer.mobile_no || "",

          // Company Info
          companyLogo: employer.profile_picture ? employerApiService.getAssetUrl(employer.profile_picture) : "/placeholder.svg?height=100&width=100",
          companyName: company?.company_name || "",
          companyEmail: company?.company_email || "",
          companyPhone: company?.company_phone || "",
          website: company?.website || "",
          foundedDate: company?.founded_date || "",
          employees: company?.employees || "",
          description: company?.description || "",

          // Address
          country: company?.country || "",
          province: company?.state || "",
          city: company?.city || "",
          postcode: company?.postcode || "",
          fullAddress: company?.address || "",

          // Social
          facebook: company?.facebook_link || "",
          twitter: company?.twitter_link || "",
          googlePlus: company?.google_link || "",
          youtube: company?.youtube_link || "",
          instagram: company?.instagram || "",
          linkedin: company?.linkedin_link || "",
        })

        try {
          await fetchCountries()
          const countryId = company?.country ? String(company.country) : ""
          if (countryId) {
            await fetchStates(countryId)
            const stateId = company?.state ? String(company.state) : ""
            if (stateId) await fetchCities(stateId)
          }
        } catch {}
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to load profile data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await fetch(getBaseUrl('/api/common_api/country'), { credentials: 'include' })
      const data = await response.json()
      if (data.status === 1 && Array.isArray(data.data)) {
        setCountries(data.data)
      } else {
        setCountries([])
      }
    } catch (error) {
      setCountries([])
    }
  }

  const fetchStates = async (countryId: string) => {
    try {
      setLoadingStates(true)
      const response = await fetch(getBaseUrl(`/common_api/state?country_id=${countryId}`), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        setStates(data.data)
      } else if (data.status === 1 && Array.isArray(data.data)) {
        setStates(data.data)
      } else {
        setStates([])
      }
    } catch (error) {
      setStates([])
    } finally {
      setLoadingStates(false)
    }
  }

  const fetchCities = async (stateId: string) => {
    try {
      setLoadingCities(true)
      const response = await fetch(getBaseUrl(`/common_api/cities?state_id=${stateId}`), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      const data = await response.json()
      if (data.status === 1 && Array.isArray(data.data)) {
        setCities(data.data)
      } else {
        setCities([])
      }
    } catch (error) {
      setCities([])
    } finally {
      setLoadingCities(false)
    }
  }

  const handleEdit = (section: string) => {
    setEditingSection(section)
    setIsPreviewMode(false)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const updateData = {
        firstname: profileData.firstName,
        lastname: profileData.lastName,
        email: profileData.email,
        designation: profileData.designation,
        mobile_no: profileData.phone,
        company: {
          company_name: profileData.companyName,
          company_email: profileData.companyEmail,
          company_phone: profileData.companyPhone,
          website: profileData.website,
          description: profileData.description,
          address: profileData.fullAddress,
          city: profileData.city || "",
          state: profileData.province || "",
          country: profileData.country || "",
          postcode: profileData.postcode,
          founded_date: profileData.foundedDate,
          employees: profileData.employees,
          facebook_link: profileData.facebook,
          twitter_link: profileData.twitter,
          linkedin_link: profileData.linkedin,
          instagram: profileData.instagram,
          youtube_link: profileData.youtube,
          google_link: profileData.googlePlus,
        }
      }

      // Use the API route we created
      const response = await fetch('/api/employer/profile/update_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        setEditingSection(null)
        setIsPreviewMode(true)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingSection(null)
    setIsPreviewMode(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

	const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
		const formData = new FormData()
		formData.append('profile_picture', file)
		// include employer_id as backend fallback when session cookie isn't available
		try {
			const employerId = typeof window !== 'undefined' ? localStorage.getItem('employer_id') : null
			if (employerId) {
				formData.append('employer_id', employerId)
			}
		} catch {}
    
    try {
      setSaving(true)
      
			const response = await fetch(getBackendUrl('/index.php/api/Employer_api/upload_profile_picture'), {
				method: 'POST',
				body: formData,
				credentials: 'include',
			})
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        })
        
        // Update the profile picture in the state
        if (data.file_path) {
          setProfileData(prev => ({
            ...prev,
            companyLogo: employerApiService.getAssetUrl(data.file_path)
          }))
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to upload profile picture",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const SectionHeader = ({ title, section, icon: Icon }: { title: string; section: string; icon: any }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="flex space-x-2">
        {isPreviewMode ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(section)}
            className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        ) : editingSection === section ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
            >
              <Save className="h-4 w-4 mr-1" />
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </>
        ) : null}
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <BackButton />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile Management</h1>
          <p className="text-white">Manage your personal and company information</p>
        </div>
        <div className="flex space-x-2">
          
        </div>
      </div>

      {/* User Info Section */}
      <Card>
        <CardHeader>
          <SectionHeader title="User Information" section="user" icon={Users} />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                {editingSection === "user" ? (
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profileData.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                {editingSection === "user" ? (
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profileData.lastName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                {editingSection === "user" ? (
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profileData.email}</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="designation">Designation</Label>
                {editingSection === "user" ? (
                  <Input
                    id="designation"
                    value={profileData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profileData.designation}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                {editingSection === "user" ? (
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profileData.phone}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Info Section */}
      <Card>
        <CardHeader>
          <SectionHeader title="Company Information" section="company" icon={Globe} />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Company Logo */}
            <div className="lg:col-span-1">
              <Label>Company Logo</Label>
              <div className="mt-2 flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.companyLogo || "/placeholder.svg"} alt="Company Logo" />
                  <AvatarFallback className="bg-emerald-100 text-emerald-600 text-lg">
                    {profileData.companyName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {editingSection === "company" && (
                  <div>
                                         <input
                       type="file"
                       id="logo-upload"
                       className="hidden"
                       accept="image/*"
                       onChange={handleLogoUpload}
                       aria-label="Upload company logo"
                       title="Upload company logo"
                     />
                    <Button variant="outline" size="sm" onClick={() => document.getElementById('logo-upload')?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Company Details */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                
                <Label htmlFor="companyName">Company Name</Label>
                {editingSection === "company" ? (
                  <Input
                    id="companyName"
                    value={profileData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profileData.companyName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="companyEmail">Company Email</Label>
                {editingSection === "company" ? (
                  <Input
                    id="companyEmail"
                    type="email"
                    value={profileData.companyEmail}
                    onChange={(e) => handleInputChange("companyEmail", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profileData.companyEmail}</p>
                )}
              </div>
              <div>
                <Label htmlFor="companyPhone">Company Phone</Label>
                {editingSection === "company" ? (
                  <Input
                    id="companyPhone"
                    value={profileData.companyPhone}
                    onChange={(e) => handleInputChange("companyPhone", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profileData.companyPhone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                {editingSection === "company" ? (
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profileData.website}</p>
                )}
              </div>
              <div>
                <Label htmlFor="foundedDate">Founded Date</Label>
                {editingSection === "company" ? (
                 <Input
                 id="foundedDate"
                 type="date"
                 value={profileData.foundedDate ? new Date(profileData.foundedDate).toISOString().split("T")[0] : ""}
                 onChange={(e) => handleInputChange("foundedDate", e.target.value)}
               />
               
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profileData.foundedDate}</p>
                )}
              </div>
              <div>
                <Label htmlFor="employees">Number of Employees</Label>
                {editingSection === "company" ? (
                  <Select
                    value={profileData.employees}
                    onValueChange={(value) => handleInputChange("employees", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="11-50">11-50</SelectItem>
                      <SelectItem value="51-100">51-100</SelectItem>
                      <SelectItem value="101-500">101-500</SelectItem>
                      <SelectItem value="501-1000">501-1000</SelectItem>
                      <SelectItem value="1000+">1000+</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="secondary" className="mt-1">
                    {profileData.employees} employees
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Label htmlFor="description">Company Description</Label>
            {editingSection === "company" ? (
              <Textarea
                id="description"
                rows={4}
                value={profileData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{profileData.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Address Section */}
      <Card>
        <CardHeader>
          <SectionHeader title="Address Information" section="address" icon={MapPin} />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="country">Country</Label>
              {editingSection === "address" ? (
                <Select 
                  value={profileData.country || ""}
                  onValueChange={async (value) => {
                    handleInputChange("country", value)
                    setProfileData((prev) => ({ ...prev, province: "", city: "" }))
                    if (value) await fetchStates(value)
                  }}
                >
                  <SelectTrigger id="country-trigger">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c: any) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{getCountryName(profileData.country)}</p>
              )}
            </div>
            <div>
              <Label htmlFor="province">Province/State</Label>
              {editingSection === "address" ? (
                <Select
                  value={profileData.province || ""}
                  onValueChange={async (value) => {
                    handleInputChange("province", value)
                    setProfileData((prev) => ({ ...prev, city: "" }))
                    if (value) await fetchCities(value)
                  }}
                >
                  <SelectTrigger id="province-trigger">
                    <SelectValue placeholder={loadingStates ? "Loading..." : "Select a state"} />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s: any) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{getStateName(profileData.province)}</p>
              )}
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              {editingSection === "address" ? (
                <Select
                  value={profileData.city || ""}
                  onValueChange={(value) => handleInputChange("city", value)}
                >
                  <SelectTrigger id="city-trigger">
                    <SelectValue placeholder={loadingCities ? "Loading..." : "Select a city"} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((ci: any) => (
                      <SelectItem key={ci.id} value={String(ci.id)}>{ci.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{getCityName(profileData.city)}</p>
              )}
            </div>
            <div>
              <Label htmlFor="postcode">Postcode</Label>
              {editingSection === "address" ? (
                <Input
                  id="postcode"
                  value={profileData.postcode}
                  onChange={(e) => handleInputChange("postcode", e.target.value)}
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{profileData.postcode}</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="fullAddress">Full Address</Label>
            {editingSection === "address" ? (
              <Textarea
                id="fullAddress"
                rows={2}
                value={profileData.fullAddress}
                onChange={(e) => handleInputChange("fullAddress", e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{profileData.fullAddress}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Social Media Section */}
      <Card>
        <CardHeader>
          <SectionHeader title="Company Social Media" section="social" icon={Globe} />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/company" },
              { key: "twitter", label: "Twitter", placeholder: "https://twitter.com/company" },
              { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/company" },
              { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/company" },
              { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/company" },
              { key: "googlePlus", label: "Google Plus", placeholder: "https://plus.google.com/company" },
            ].map((social) => (
              <div key={social.key}>
                <Label htmlFor={social.key}>{social.label}</Label>
                {editingSection === "social" ? (
                  <Input
                    id={social.key}
                    value={profileData[social.key as keyof typeof profileData] as string}
                    onChange={(e) => handleInputChange(social.key, e.target.value)}
                    placeholder={social.placeholder}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {profileData[social.key as keyof typeof profileData] || "Not provided"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}