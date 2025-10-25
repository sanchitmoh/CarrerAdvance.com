"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Plus, Search, Users, Mail, Calendar, DollarSign, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { getBaseUrl, getAssetUrl } from "@/lib/api-config"
import { fetchDepartments, fetchDesignations, type Department, type Designation } from "@/lib/hrms-api"
import { useToast } from "@/hooks/use-toast"

type EmployeeRow = {
  id: number
  name: string
  email: string
  empType: string
  salary: number | string
  income: number | string
  joiningDate: string
  empId: string
  image?: string
  emergencyContactName?: string
  emergencyContactNumber?: string
  department?: string
  position?: string
  status: string
}

export default function EmployeesPage() {
  const { toast } = useToast()
  const [employees, setEmployees] = useState<EmployeeRow[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [page, setPage] = useState(1)
  const [perPage] = useState(10)
  const [departments, setDepartments] = useState<Department[]>([])
  const [designations, setDesignations] = useState<Designation[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editEmployee, setEditEmployee] = useState<EmployeeRow | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    empType: "",
    salary: "",
    income: "",
    joiningDate: "",
    empId: "",
    image: "",
    emergencyContactName: "",
    emergencyContactNumber: ""
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [checkingEmpId, setCheckingEmpId] = useState(false)
  const [empIdError, setEmpIdError] = useState<string | null>(null)
  const [checkingEditEmpId, setCheckingEditEmpId] = useState(false)
  const [editEmpIdError, setEditEmpIdError] = useState<string | null>(null)
  const [empIdTimeout, setEmpIdTimeout] = useState<NodeJS.Timeout | null>(null)
  const [editEmpIdTimeout, setEditEmpIdTimeout] = useState<NodeJS.Timeout | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Form state for adding new employee
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    empType: "",
    workingHours: "",
    salary: "",
    income: "",
    joiningDate: "",
    empId: "",
    image: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    emergencyContact: "",
    department: "",
    position: "",
  })

  const filteredEmployees = employees.filter((employee) => {
    const q = (searchTerm || '').toLowerCase()
    const name = ((employee as any)?.name ?? '').toString().toLowerCase()
    const empId = ((employee as any)?.empId ?? '').toString().toLowerCase()
    const email = ((employee as any)?.email ?? '').toString().toLowerCase()
    const matchesSearch = name.includes(q) || empId.includes(q) || email.includes(q)
    const empDept = ((employee as any)?.department ?? '').toString()
    const matchesDepartment = selectedDepartment === "all" || empDept === selectedDepartment
    const matchesType = selectedType === "all" || ((employee as any)?.empType === selectedType)
    return matchesSearch && matchesDepartment && matchesType
  })

  // Reset to first page when filters/search change
  useEffect(() => {
    setPage(1)
  }, [searchTerm, selectedDepartment, selectedType])

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / perPage))
  const paginatedEmployees = filteredEmployees.slice(
    (page - 1) * perPage,
    page * perPage
  )

  const openEdit = (employee: EmployeeRow) => {
    setEditEmployee(employee)
    setEditForm({
      name: employee.name || "",
      email: employee.email || "",
      empType: employee.empType || "",
      salary: String(employee.salary ?? ""),
      income: String(employee.income ?? ""),
      joiningDate: employee.joiningDate || "",
      empId: employee.empId || "",
      image: employee.image || "",
      emergencyContactName: employee.emergencyContactName || "",
      emergencyContactNumber: employee.emergencyContactNumber || ""
    })
    setIsEditDialogOpen(true)
  }

  const handleEditChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  const saveEdit = async () => {
    if (!editEmployee) return

    // Validate required fields
    const requiredFields = [
      { field: 'name', label: 'Full Name' },
      { field: 'email', label: 'Email Address' },
      { field: 'empId', label: 'Employee ID' },
      { field: 'empType', label: 'Employment Type' }
    ]

    const missingFields = requiredFields.filter(({ field }) => {
      const value = (editForm as any)[field]
      return !value || (typeof value === 'string' && value.trim() === '')
    })

    if (missingFields.length > 0) {
      const missingLabels = missingFields.map(f => f.label).join(', ')
      toast({
        title: "Validation Error",
        description: `Please fill in the following required fields: ${missingLabels}`,
        variant: "destructive",
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(editForm.email)) {
      toast({
        title: "Validation Error",
        description: 'Please enter a valid email address',
        variant: "destructive",
      })
      return
    }

    // Validate salary and income are numbers (if provided)
    if (editForm.salary && (isNaN(Number(editForm.salary)) || Number(editForm.salary) <= 0)) {
      toast({
        title: "Validation Error",
        description: 'Please enter a valid salary amount',
        variant: "destructive",
      })
      return
    }

    if (editForm.income && (isNaN(Number(editForm.income)) || Number(editForm.income) <= 0)) {
      toast({
        title: "Validation Error",
        description: 'Please enter a valid annual income amount',
        variant: "destructive",
      })
      return
    }

    // Check if Employee ID has validation error
    if (editEmpIdError) {
      toast({
        title: "Validation Error",
        description: editEmpIdError,
        variant: "destructive",
      })
      return
    }

    const url = getBaseUrl(`/company-employees/${editEmployee.id}`)
    const payload: any = {
      emp_name: editForm.name,
      email: editForm.email,
      emp_type: editForm.empType,
      salary: editForm.salary,
      income: editForm.income,
      joining_date: editForm.joiningDate,
      emp_id: editForm.empId,
      image: editForm.image,
      emergency_contact_name: editForm.emergencyContactName,
      emergency_contact_phone: editForm.emergencyContactNumber
    }
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
    const json = await res.json().catch(() => ({}))
    if (res.ok && json?.success) {
      // Update local list
      setEmployees(prev => prev.map(e => e.id === editEmployee.id ? {
        ...e,
        name: editForm.name,
        email: editForm.email,
        empType: editForm.empType,
        salary: isNaN(Number(editForm.salary)) ? editForm.salary : Number(editForm.salary),
        income: isNaN(Number(editForm.income)) ? editForm.income : Number(editForm.income),
        joiningDate: editForm.joiningDate,
        empId: editForm.empId,
        image: editForm.image,
        emergencyContactName: editForm.emergencyContactName,
        emergencyContactNumber: editForm.emergencyContactNumber
      } : e))
      setIsEditDialogOpen(false)
      setEditEmployee(null)
      toast({
        title: "Employee Updated",
        description: `Employee ${editForm.name} has been successfully updated.`,
        variant: "default",
      })
    } else {
      toast({
        title: "Update Failed",
        description: json?.message || 'Failed to update employee',
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        const url = getBaseUrl('/company-employees')
        const res = await fetch(url, { credentials: 'include' })
        const json = await res.json().catch(() => ({}))
        if (res.ok && json?.success) {
          setEmployees(json.data as EmployeeRow[])
        } else {
          setEmployees([])
        }
      } catch (e) {
        setEmployees([])
      }
    }
    load()
  }, [])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (empIdTimeout) {
        clearTimeout(empIdTimeout)
      }
      if (editEmpIdTimeout) {
        clearTimeout(editEmpIdTimeout)
      }
    }
  }, [empIdTimeout, editEmpIdTimeout])

  // Load departments and designations for dropdowns
  useEffect(() => {
    const loadDeps = async () => {
      try {
        const [deps, dess] = await Promise.all([fetchDepartments(), fetchDesignations()])
        setDepartments(deps)
        setDesignations(dess)
      } catch (e) {
        setDepartments([])
        setDesignations([])
      }
    }
    loadDeps()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('type', 'profile_picture')

      const response = await fetch(getBaseUrl('/upload-image'), {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        setFormData(prev => ({ ...prev, image: result.data.path }))
        setSelectedFile(file)
        toast({
          title: "Image Uploaded",
          description: "Profile image uploaded successfully",
          variant: "default",
        })
      } else {
        toast({
          title: "Upload Failed",
          description: result.message || "Failed to upload image",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const checkEmployeeIdAvailability = async (empId: string, isEdit: boolean = false) => {
    if (!empId || empId.trim() === '') {
      if (isEdit) {
        setEditEmpIdError(null)
      } else {
        setEmpIdError(null)
      }
      return
    }

    try {
      if (isEdit) {
        setCheckingEditEmpId(true)
        setEditEmpIdError(null)
      } else {
        setCheckingEmpId(true)
        setEmpIdError(null)
      }
      
      const response = await fetch(getBaseUrl('/api/company-employees/check-emp-id'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          emp_id: empId.trim(),
          exclude_id: isEdit ? editEmployee?.id : null
        })
      })
      
      const data = await response.json()
      
      if (data.success === false) {
        if (isEdit) {
          setEditEmpIdError(data.message || 'Employee ID already exists')
        } else {
          setEmpIdError(data.message || 'Employee ID already exists')
        }
      } else {
        if (isEdit) {
          setEditEmpIdError(null)
        } else {
          setEmpIdError(null)
        }
      }
    } catch (error) {
      console.error('Error checking Employee ID:', error)
      if (isEdit) {
        setEditEmpIdError('Error checking Employee ID availability')
      } else {
        setEmpIdError('Error checking Employee ID availability')
      }
    } finally {
      if (isEdit) {
        setCheckingEditEmpId(false)
      } else {
        setCheckingEmpId(false)
      }
    }
  }

  const handleAddEmployee = async () => {
    // Validate required fields
    const requiredFields = [
      { field: 'name', label: 'Full Name' },
      { field: 'email', label: 'Email Address' },
      { field: 'empId', label: 'Employee ID' },
      { field: 'empType', label: 'Employment Type' },
      { field: 'salary', label: 'Salary' },
      { field: 'income', label: 'Annual Income' },
      { field: 'joiningDate', label: 'Joining Date' },
      { field: 'emergencyContactName', label: 'Emergency Contact Name' },
      { field: 'emergencyContactNumber', label: 'Emergency Contact Number' },
      { field: 'department', label: 'Department' },
      { field: 'position', label: 'Position' }
    ]

    const missingFields = requiredFields.filter(({ field }) => {
      const value = (formData as any)[field]
      return !value || (typeof value === 'string' && value.trim() === '')
    })

    if (missingFields.length > 0) {
      const missingLabels = missingFields.map(f => f.label).join(', ')
      toast({
        title: "Validation Error",
        description: `Please fill in the following required fields: ${missingLabels}`,
        variant: "destructive",
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: 'Please enter a valid email address',
        variant: "destructive",
      })
      return
    }

    // Validate salary and income are numbers
    if (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      toast({
        title: "Validation Error",
        description: 'Please enter a valid salary amount',
        variant: "destructive",
      })
      return
    }

    if (isNaN(Number(formData.income)) || Number(formData.income) <= 0) {
      toast({
        title: "Validation Error",
        description: 'Please enter a valid annual income amount',
        variant: "destructive",
      })
      return
    }

    // Check if Employee ID has validation error
    if (empIdError) {
      toast({
        title: "Validation Error",
        description: empIdError,
        variant: "destructive",
      })
      return
    }

    // Map selected department/designation names to IDs
    const dept = departments.find((d) => d.name === formData.department)
    const desig = designations.find((x) => x.name === formData.position && (!dept || x.department_id === dept.id))

    const payload: any = {
      emp_name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      emp_type: formData.empType,
      working_hours: formData.workingHours,
      salary: formData.salary,
      income: formData.income,
      joining_date: formData.joiningDate,
      emp_id: formData.empId,
      image: formData.image,
      emergency_contact_name: formData.emergencyContactName,
      emergency_contact_phone: formData.emergencyContactNumber,
      emergency_contact: formData.emergencyContact,
      department_id: dept ? dept.id : null,
      designation_id: desig ? desig.id : null,
    }

    try {
      const url = getBaseUrl('/company-employees')
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok && json?.success) {
        // Either use returned row or refetch list
        const created = json.data
        if (created) {
          setEmployees((prev) => [created as any, ...prev])
        } else {
          // fallback: refetch list
          const listRes = await fetch(getBaseUrl('/company-employees'), { credentials: 'include' })
          const listJson = await listRes.json().catch(() => ({}))
          if (listRes.ok && listJson?.success) setEmployees(listJson.data as EmployeeRow[])
        }
        setFormData({
          name: "",
          email: "",
          mobile: "",
          empType: "",
          salary: "",
          income: "",
          workingHours: "",
          joiningDate: "",
          empId: "",
          image: "",
          emergencyContactName: "",
          emergencyContactNumber: "",
          emergencyContact: "",
          department: "",
          position: "",
        })
        setSelectedFile(null)
        setIsAddDialogOpen(false)
        toast({
          title: "Employee Added",
          description: `Employee ${formData.name} has been successfully added.`,
          variant: "default",
        })
      } else {
        toast({
          title: "Add Failed",
          description: json?.error || json?.message || 'Failed to add employee',
          variant: "destructive",
        })
      }
    } catch (e) {
      toast({
        title: "Add Failed",
        description: 'Failed to add employee',
        variant: "destructive",
      })
    }
  }

  const handleDeleteEmployee = async (id: number) => {
    const employee = employees.find(emp => emp.id === id)
    const ok = confirm(`Are you sure you want to delete ${employee?.name || 'this employee'}?`)
    if (!ok) return
    try {
      const url = getBaseUrl(`/company-employees/${id}`)
      const res = await fetch(url, { method: 'DELETE', credentials: 'include' })
      const json = await res.json().catch(() => ({}))
      if (res.ok && json?.success) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id))
        toast({
          title: "Employee Deleted",
          description: `${employee?.name || 'Employee'} has been successfully deleted.`,
          variant: "default",
        })
      } else {
        toast({
          title: "Delete Failed",
          description: json?.message || 'Failed to delete employee',
          variant: "destructive",
        })
      }
    } catch (e) {
      toast({
        title: "Delete Failed",
        description: 'Failed to delete employee',
        variant: "destructive",
      })
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "fulltime":
        return "bg-green-100 text-green-800 border-green-200"
      case "parttime":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "internship":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "fulltime":
        return "Full Time"
      case "parttime":
        return "Part Time"
      case "internship":
        return "Internship"
      default:
        return type
    }
  }

  // SSR-safe date formatting to avoid hydration mismatches
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const dt = new Date(dateString)
    const y = dt.getUTCFullYear()
    const m = String(dt.getUTCMonth() + 1).padStart(2, '0')
    const d = String(dt.getUTCDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-xl bg-gradient-to-r from-purple-800 via-purple-900 to-purple-950 text-white">
  {/* Back button */}
  <div>
    <Link href="/employers/dashboard/employee-managment">
      <Button
       variant="secondary"
       size="sm"
       className="bg-white/20 hover:bg-white/30 text-white border-white/30 w-full sm:w-auto mb-2 sm:mb-0"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Employment
      </Button>
    </Link>
  </div>

  {/* Title + subtitle */}
  <div className="min-w-0 text-center sm:text-left flex-1">
    <h1 className="text-3xl font-bold">Employee Management</h1>
    <p className="text-base opacity-90">
      Manage employee information and records
    </p>
  </div>

  {/* Add Employee dialog */}
  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
    <DialogTrigger asChild>
      <Button variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 w-full sm:w-auto mb-2 sm:mb-0">
        <Plus className="h-4 w-4 mr-2" />
        Add Employee
      </Button>
    </DialogTrigger>

    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogDescription>
          Fill in the employee details to add them to the system
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Full form content you provided, unchanged */}
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter full name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              value={formData.mobile}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              placeholder="e.g., +1 555-123-4567"
              className="mt-1"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="empId">Employee ID *</Label>
            <div className="relative">
              <Input
                id="empId"
                value={formData.empId}
                onChange={(e) => {
                  handleInputChange("empId", e.target.value)
                  
                  // Clear existing timeout
                  if (empIdTimeout) {
                    clearTimeout(empIdTimeout)
                  }
                  
                  // Set new timeout
                  const timeoutId = setTimeout(() => {
                    checkEmployeeIdAvailability(e.target.value, false)
                  }, 500)
                  setEmpIdTimeout(timeoutId)
                }}
                placeholder="e.g., EMP004"
                className={`mt-1 ${empIdError ? 'border-red-500' : ''}`}
              />
              {checkingEmpId && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
            {empIdError && (
              <p className="text-sm text-red-600 mt-1">{empIdError}</p>
            )}
            {!empIdError && formData.empId && !checkingEmpId && (
              <p className="text-sm text-green-600 mt-1">✓ Employee ID is available</p>
            )}
          </div>
          <div>
            <Label htmlFor="empType">Employment Type *</Label>
            <Select
              value={formData.empType}
              onValueChange={(value) => handleInputChange("empType", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fulltime">Full Time</SelectItem>
                <SelectItem value="parttime">Part Time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => {
                handleInputChange("department", value)
                handleInputChange("position", "")
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.name}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="position">Position *</Label>
            <Select
              value={formData.position}
              onValueChange={(value) => handleInputChange("position", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select designation" />
              </SelectTrigger>
              <SelectContent>
                {(() => {
                  const selectedDept = departments.find(
                    (d) => d.name === formData.department
                  )
                  const filtered = selectedDept
                    ? designations.filter(
                        (des) => des.department_id === selectedDept.id
                      )
                    : []
                  return filtered.map((des) => (
                    <SelectItem key={des.id} value={des.name}>
                      {des.name}
                    </SelectItem>
                  ))
                })()}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="salary">Salary *</Label>
            <Input
              id="salary"
              type="number"
              value={formData.salary}
              onChange={(e) => handleInputChange("salary", e.target.value)}
              placeholder="Monthly salary or hourly rate"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="income">Annual Income *</Label>
            <Input
              id="income"
              type="number"
              value={formData.income}
              onChange={(e) => handleInputChange("income", e.target.value)}
              placeholder="Annual income"
              className="mt-1"
            />
          </div>
        </div>

        {/* Row 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="workingHours">Working Hours</Label>
            <Input
              id="workingHours"
              value={formData.workingHours}
              onChange={(e) => handleInputChange("workingHours", e.target.value)}
              placeholder="e.g., 9:00 AM - 6:00 PM"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="joiningDate">Joining Date *</Label>
            <Input
              id="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={(e) => handleInputChange("joiningDate", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Row 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyContactName">
              Emergency Contact Name *
            </Label>
            <Input
              id="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={(e) =>
                handleInputChange("emergencyContactName", e.target.value)
              }
              placeholder="Emergency contact name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="emergencyContactNumber">
              Emergency Contact Number *
            </Label>
            <Input
              id="emergencyContactNumber"
              value={formData.emergencyContactNumber}
              onChange={(e) =>
                handleInputChange("emergencyContactNumber", e.target.value)
              }
              placeholder="+1-555-0000"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="emergencyContactEmail">
              Emergency Contact Email
            </Label>
            <Input
              id="emergencyContactEmail"
              type="email"
              value={formData.emergencyContact}
              onChange={(e) =>
                handleInputChange("emergencyContact", e.target.value)
              }
              placeholder="contact@example.com"
              className="mt-1"
            />
          </div>
        </div>

        {/* Row 7 - Profile Image */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="image">Profile Image</Label>
            <div className="mt-1 space-y-3">
              {/* File Upload */}
              <div>
                <Label htmlFor="file-upload" className="text-sm font-medium text-gray-700">
                  Upload Photo
                </Label>
                <div className="mt-1 flex items-center space-x-3">
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file)
                    }}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={uploadingImage}
                  />
                  {uploadingImage && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Uploading...</span>
                    </div>
                  )}
                </div>
                {selectedFile && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {selectedFile.name} uploaded successfully
                  </p>
                )}
              </div>

              {/* URL Input */}
              <div>
                <Label htmlFor="image-url" className="text-sm font-medium text-gray-700">
                  Or Enter Image URL
                </Label>
                <Input
                  id="image-url"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>

              {/* Preview */}
              {formData.image && (
                <div className="mt-3">
                  <Label className="text-sm font-medium text-gray-700">Preview</Label>
                  <div className="mt-1 flex items-center space-x-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={getAssetUrl(formData.image)} alt="Preview" />
                      <AvatarFallback>IMG</AvatarFallback>
                    </Avatar>
                    <div className="text-sm text-gray-600">
                      <p>Image will be displayed like this</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Optional: Upload a photo or provide image URL. Leave blank for default avatar.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            onClick={handleAddEmployee}
            className="flex-1 bg-black text-white hover:bg-gray-900"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsAddDialogOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-blue-600">{employees.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Full Time</p>
                <p className="text-3xl font-bold text-green-600">
                  {employees.filter((emp) => emp.empType === "fulltime").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Part Time</p>
                <p className="text-3xl font-bold text-blue-600">
                  {employees.filter((emp) => emp.empType === "parttime").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interns</p>
                <p className="text-3xl font-bold text-purple-600">
                  {employees.filter((emp) => emp.empType === "internship").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Employees</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="department">Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="type">Employment Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fulltime">Full Time</SelectItem>
                  <SelectItem value="parttime">Part Time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <div className="grid gap-4">
        {paginatedEmployees.map((employee, index) => (
          <Card key={employee.id || employee.empId || `employee-${index}`}>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={getAssetUrl(employee.image || "/placeholder.svg")} alt={employee.name || "Employee"} />
                    <AvatarFallback>
                      {employee.name
                        ?.split(" ")
                        ?.map((n) => n[0])
                        ?.join("") || "EMP"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{employee.name || "Unknown Employee"}</h3>
                    <p className="text-gray-600">
                      {employee.position} • {employee.department}
                    </p>
                    <p className="text-sm text-gray-500">{employee.empId}</p>
                  </div>
                </div>

                <div className="w-full sm:w-auto grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:items-center sm:justify-end sm:gap-6">
                  <div className="text-center sm:text-left min-w-[140px]">
                    <p className="text-sm text-gray-600">Type</p>
                    <Badge className={getTypeColor(employee.empType)}>{getTypeLabel(employee.empType)}</Badge>
                  </div>

                  <div className="text-center sm:text-left min-w-0">
                    <p className="text-sm text-gray-600">Email</p>
                    <div className="flex items-center justify-center sm:justify-start space-x-1">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <p className="font-medium text-sm break-all truncate max-w-[140px] sm:max-w-[260px] lg:max-w-none">{employee.email}</p>
                    </div>
                  </div>

                  <div className="text-center sm:text-left min-w-[140px] col-span-1">
                    <p className="text-sm text-gray-600">Salary</p>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <p className="font-semibold text-green-600">
                        {employee.empType === "parttime"
                          ? `$${employee.salary || 0}/hr`
                          : `$${(employee.salary || 0).toLocaleString()}/mo`}
                      </p>
                    </div>
                  </div>

                  <div className="text-center sm:text-left min-w-[140px] col-span-1">
                    <p className="text-sm text-gray-600">Joined</p>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <p className="font-medium text-sm">{formatDate(employee.joiningDate)}</p>
                    </div>
                  </div>

                  <div className="col-span-2 flex w-full sm:w-auto flex-row gap-2 sm:space-x-2 sm:self-end justify-center sm:justify-end">
                    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-auto"
                          onClick={() => {
                            setSelectedEmployee(employee)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Employee Details - {selectedEmployee?.name}</DialogTitle>
                          <DialogDescription>Complete employee information and records</DialogDescription>
                        </DialogHeader>
                        {selectedEmployee && (
                          <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-20 w-20">
                                <AvatarImage
                                  src={getAssetUrl(selectedEmployee.image || "/placeholder.svg")}
                                  alt={selectedEmployee.name}
                                />
                                <AvatarFallback className="text-lg">
                                  {selectedEmployee.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-xl font-semibold">{selectedEmployee.name}</h3>
                                <p className="text-gray-600">{selectedEmployee.position}</p>
                                <Badge className={getTypeColor(selectedEmployee.empType)}>
                                  {getTypeLabel(selectedEmployee.empType)}
                                </Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-3">Personal Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Employee ID:</span>
                                    <span className="font-medium">{selectedEmployee.empId}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Email:</span>
                                    <span className="font-medium">{selectedEmployee.email}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Department:</span>
                                    <span className="font-medium">{selectedEmployee.department}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Joining Date:</span>
                                    <span className="font-medium">
                                      {formatDate(selectedEmployee.joiningDate)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-3">Compensation</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Employment Type:</span>
                                    <span className="font-medium">{getTypeLabel(selectedEmployee.empType)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Salary:</span>
                                    <span className="font-medium text-green-600">
                                      {selectedEmployee.empType === "parttime"
                                        ? `$${selectedEmployee.salary || 0}/hr`
                                        : `$${(selectedEmployee.salary || 0).toLocaleString()}/mo`}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Annual Income:</span>
                                    <span className="font-medium text-green-600">
                                      ${(selectedEmployee.income || 0).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-3">Emergency Contact</h4>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div className="flex justify-between">
                                    <span>Contact Name:</span>
                                    <span className="font-medium">{selectedEmployee.emergencyContactName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Contact Number:</span>
                                    <span className="font-medium">{selectedEmployee.emergencyContactNumber}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-auto"
                          onClick={() => openEdit(employee)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Employee - {editEmployee?.name}</DialogTitle>
                          <DialogDescription>Update employee details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit_name">Full Name *</Label>
                              <Input id="edit_name" value={editForm.name} onChange={(e)=>handleEditChange('name', e.target.value)} className="mt-1" />
                            </div>
                            <div>
                              <Label htmlFor="edit_email">Email *</Label>
                              <Input id="edit_email" type="email" value={editForm.email} onChange={(e)=>handleEditChange('email', e.target.value)} className="mt-1" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit_empId">Employee ID *</Label>
                              <div className="relative">
                                <Input 
                                  id="edit_empId" 
                                  value={editForm.empId} 
                                  onChange={(e) => {
                                    handleEditChange('empId', e.target.value)
                                    
                                    // Clear existing timeout
                                    if (editEmpIdTimeout) {
                                      clearTimeout(editEmpIdTimeout)
                                    }
                                    
                                    // Set new timeout
                                    const timeoutId = setTimeout(() => {
                                      checkEmployeeIdAvailability(e.target.value, true)
                                    }, 500)
                                    setEditEmpIdTimeout(timeoutId)
                                  }}
                                  className={`mt-1 ${editEmpIdError ? 'border-red-500' : ''}`}
                                />
                                {checkingEditEmpId && (
                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                  </div>
                                )}
                              </div>
                              {editEmpIdError && (
                                <p className="text-sm text-red-600 mt-1">{editEmpIdError}</p>
                              )}
                              {!editEmpIdError && editForm.empId && !checkingEditEmpId && (
                                <p className="text-sm text-green-600 mt-1">✓ Employee ID is available</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="edit_empType">Employment Type *</Label>
                              <Select value={editForm.empType} onValueChange={(v)=>handleEditChange('empType', v)}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select employment type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="fulltime">Full Time</SelectItem>
                                  <SelectItem value="parttime">Part Time</SelectItem>
                                  <SelectItem value="internship">Internship</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit_salary">Salary</Label>
                              <Input id="edit_salary" type="number" value={editForm.salary} onChange={(e)=>handleEditChange('salary', e.target.value)} className="mt-1" />
                            </div>
                            <div>
                              <Label htmlFor="edit_income">Annual Income</Label>
                              <Input id="edit_income" type="number" value={editForm.income} onChange={(e)=>handleEditChange('income', e.target.value)} className="mt-1" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit_joining">Joining Date</Label>
                              <Input id="edit_joining" type="date" value={editForm.joiningDate} onChange={(e)=>handleEditChange('joiningDate', e.target.value)} className="mt-1" />
                            </div>
                            <div>
                              <Label htmlFor="edit_image">Profile Image URL</Label>
                              <Input id="edit_image" value={editForm.image} onChange={(e)=>handleEditChange('image', e.target.value)} className="mt-1" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit_ec_name">Emergency Contact Name</Label>
                              <Input id="edit_ec_name" value={editForm.emergencyContactName} onChange={(e)=>handleEditChange('emergencyContactName', e.target.value)} className="mt-1" />
                            </div>
                            <div>
                              <Label htmlFor="edit_ec_number">Emergency Contact Number</Label>
                              <Input id="edit_ec_number" value={editForm.emergencyContactNumber} onChange={(e)=>handleEditChange('emergencyContactNumber', e.target.value)} className="mt-1" />
                            </div>
                          </div>

                          <div className="flex space-x-2 pt-2">
                            <Button onClick={saveEdit} className="flex-1">Save</Button>
                            <Button variant="outline" className="flex-1" onClick={()=>setIsEditDialogOpen(false)}>Cancel</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="w-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {filteredEmployees.length > perPage && (
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, filteredEmployees.length)} of {filteredEmployees.length} employees
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
                  if (pageNum > totalPages) return null
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'default' : 'outline'}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-600 mb-4">No employees match your current search criteria.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Employee
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
