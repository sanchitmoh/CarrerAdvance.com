"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Lock,
  Unlock,
  FolderOpen,
  File,
  ImageIcon,
  FileSpreadsheet,
  Save,
  ArrowLeft,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { 
  fetchCompanyEmployees, 
  type CompanyEmployee 
} from "@/lib/hrms-api"
import { API_BASE_URL } from "@/lib/api-config"

export default function DocumentManagementPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedEmployee, setSelectedEmployee] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [uploadForm, setUploadForm] = useState({
    employeeId: "",
    category: "",
    name: "",
    description: "",
    expiryDate: "",
    accessLevel: "hr-only",
  })

  const [loading, setLoading] = useState(false)
  const [apiEmployees, setApiEmployees] = useState<CompanyEmployee[]>([])

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true)
        const employeeList = await fetchCompanyEmployees()
        setApiEmployees(employeeList)
      } catch (error) {
        console.error("Failed to fetch employees:", error)
        setApiEmployees([])
      } finally {
        setLoading(false)
      }
    }
    fetchEmployees()
  }, [])

  // Document categories
  const [categories, setCategories] = useState([
    { id: "id-proofs", name: "ID Proofs", icon: FileText, color: "bg-blue-100 text-blue-800" },
    { id: "certificates", name: "Certificates", icon: FileText, color: "bg-green-100 text-green-800" },
    { id: "contracts", name: "Contracts", icon: FileText, color: "bg-purple-100 text-purple-800" },
    { id: "performance", name: "Performance Reports", icon: FileText, color: "bg-orange-100 text-orange-800" },
    { id: "personal", name: "Personal Documents", icon: FileText, color: "bg-gray-100 text-gray-800" },
  ])

  const [permissions, setPermissions] = useState<{ id: string; name: string }[]>([])

  // Use API employees or fallback to sample data
  const employees = apiEmployees.length > 0 ? apiEmployees.map(emp => ({
    id: emp.id,
    name: emp.name || `Employee ${emp.id}`,
    department: `Department ${emp.department_id || 'N/A'}`,
    emp_code: emp.emp_code,
    email: emp.email,
    mobile: emp.mobile,
    work_status: emp.work_status,
    emp_type: emp.emp_type
  })) : [
    { id: 1, name: "Sarah Johnson", department: "Engineering", emp_code: "EMP001", email: "sarah@company.com", mobile: "+1-555-0123", work_status: "active", emp_type: "Full-time" },
    { id: 2, name: "Michael Chen", department: "Marketing", emp_code: "EMP002", email: "michael@company.com", mobile: "+1-555-0456", work_status: "active", emp_type: "Full-time" },
    { id: 3, name: "Emily Davis", department: "Design", emp_code: "EMP003", email: "emily@company.com", mobile: "+1-555-0789", work_status: "active", emp_type: "Full-time" },
    { id: 4, name: "David Wilson", department: "Sales", emp_code: "EMP004", email: "david@company.com", mobile: "+1-555-0321", work_status: "active", emp_type: "Full-time" },
  ]

  const getEmployeeById = (employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId)
    if (!employee) return null
    
    return {
      emp_id: employee.emp_code || `EMP${employee.id}`,
      emp_name: employee.name,
      email: employee.email || `${employee.name.toLowerCase().replace(' ', '.')}@company.com`,
      mobile: employee.mobile || "+1 (555) 000-0000",
      designation: `Designation ${employee.department}`,
      work_status: employee.work_status,
      emp_type: employee.emp_type,
      salary: "N/A",
      joining_date: "N/A",
      emergency_contact: "N/A",
      emergency_contact_name: "N/A",
      image: "/placeholder.svg?height=40&width=40",
    }
  }

  // UserInfoPopover component
  const UserInfoPopover = ({ employee, children }: { employee: any; children: React.ReactNode }) => {
    const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)

    if (!employee) return <>{children}</>

    const handleMouseEnter = (e: React.MouseEvent) => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        setHoverTimeout(null)
      }

      const rect = e.currentTarget.getBoundingClientRect()
      setPopoverPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + 8,
      })
      setHoveredEmployee(employee)
    }

    const handleMouseLeave = () => {
      const timeout = setTimeout(() => {
        setHoveredEmployee(null)
      }, 150)
      setHoverTimeout(timeout)
    }

    const handlePopoverMouseEnter = () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        setHoverTimeout(null)
      }
    }

    const handlePopoverMouseLeave = () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        setHoverTimeout(null)
      }
      setHoveredEmployee(null)
    }

    return (
      <div className="relative inline-block">
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="cursor-pointer hover:text-blue-600 transition-colors"
        >
          {children}
        </div>

        {hoveredEmployee?.emp_id === employee.emp_id && (
          <div
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-[9999] w-64 max-w-[90vw] sm:w-72"
            style={{
              left: `${Math.max(8, Math.min(popoverPosition.x - 128, window.innerWidth - 264))}px`,
              top: `${popoverPosition.y}px`,
              transform: "translateX(0)",
            }}
            onMouseEnter={handlePopoverMouseEnter}
            onMouseLeave={handlePopoverMouseLeave}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                <AvatarImage src={employee.image || "/placeholder.svg"} alt={employee.emp_name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                  {employee.emp_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">{employee.emp_name}</h4>
                <p className="text-xs text-gray-600 truncate">{employee.designation}</p>
              </div>
              <Badge
                className={`text-xs px-1 py-0.5 ${employee.work_status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {employee.work_status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 text-xs">
              <div className="flex items-center space-x-1">
                <span className="text-gray-500 flex-shrink-0">ID:</span>
                <span className="font-medium truncate">{employee.emp_id}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500 flex-shrink-0">Type:</span>
                <span className="font-medium truncate">{employee.emp_type}</span>
              </div>
              <div className="flex items-center space-x-1 col-span-1 sm:col-span-2">
                <span className="text-gray-500 flex-shrink-0">Email:</span>
                <span className="font-medium truncate">{employee.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500 flex-shrink-0">Mobile:</span>
                <span className="font-medium truncate">{employee.mobile}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500 flex-shrink-0">Salary:</span>
                <span className="font-medium">{employee.salary}</span>
              </div>
              <div className="flex items-center space-x-1 col-span-1 sm:col-span-2">
                <span className="text-gray-500 flex-shrink-0">Joined:</span>
                <span className="font-medium">{employee.joining_date}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-2 pt-2">
              <div className="text-xs">
                <span className="text-gray-500">Emergency:</span>
                <div className="font-medium truncate">{employee.emergency_contact_name}</div>
                <div className="text-gray-600 truncate">{employee.emergency_contact}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Documents
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Driver_License_Sarah_Johnson.pdf",
      category: "id-proofs",
      employeeId: 1,
      employeeName: "Sarah Johnson",
      uploadDate: "2024-01-15",
      expiryDate: "2026-03-15",
      size: "2.4 MB",
      type: "pdf",
      accessLevel: "hr-only",
      status: "active",
      uploadedBy: "HR Admin",
      description: "Driver's license for identification purposes",
    },
    {
      id: 2,
      name: "AWS_Certification_Sarah.pdf",
      category: "certificates",
      employeeId: 1,
      employeeName: "Sarah Johnson",
      uploadDate: "2024-01-10",
      expiryDate: "2025-01-10",
      size: "1.8 MB",
      type: "pdf",
      accessLevel: "public",
      status: "expiring-soon",
      uploadedBy: "Sarah Johnson",
      description: "AWS Solutions Architect certification",
    },
    {
      id: 3,
      name: "Employment_Contract_Michael.pdf",
      category: "contracts",
      employeeId: 2,
      employeeName: "Michael Chen",
      uploadDate: "2023-12-01",
      expiryDate: "2025-12-01",
      size: "3.2 MB",
      type: "pdf",
      accessLevel: "hr-only",
      status: "active",
      uploadedBy: "HR Admin",
      description: "Employment contract and terms",
    },
    {
      id: 4,
      name: "Q4_Performance_Review_Emily.pdf",
      category: "performance",
      employeeId: 3,
      employeeName: "Emily Davis",
      uploadDate: "2024-01-05",
      expiryDate: null,
      size: "1.5 MB",
      type: "pdf",
      accessLevel: "manager-only",
      status: "active",
      uploadedBy: "Manager",
      description: "Quarterly performance evaluation",
    },
    {
      id: 5,
      name: "Passport_David_Wilson.jpg",
      category: "id-proofs",
      employeeId: 4,
      employeeName: "David Wilson",
      uploadDate: "2024-01-20",
      expiryDate: "2029-05-20",
      size: "4.1 MB",
      type: "image",
      accessLevel: "hr-only",
      status: "active",
      uploadedBy: "HR Admin",
      description: "Passport for international travel verification",
    },
    {
      id: 6,
      name: "Medical_Certificate_Michael.pdf",
      category: "personal",
      employeeId: 2,
      employeeName: "Michael Chen",
      uploadDate: "2024-01-18",
      expiryDate: "2024-02-15",
      size: "0.8 MB",
      type: "pdf",
      accessLevel: "hr-only",
      status: "expiring-soon",
      uploadedBy: "Michael Chen",
      description: "Medical fitness certificate",
    },
  ])

  function getEmployerId() {
    if (typeof document === "undefined") return ""
    const match = document.cookie.match(/(?:^|;\s*)employer_id=([^;]+)/)
    return match ? decodeURIComponent(match[1]) : ""
  }

  // Fetch categories, permissions, documents from backend (fallback to existing state on failure)
  useEffect(() => {
    const load = async () => {
      try {
        const companyId = getEmployerId()
        // Categories
        try {
          const url = `${API_BASE_URL}/document-categories${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
          const res = await fetch(url, { credentials: "include" })
          const json = await res.json()
          if (json?.success && Array.isArray(json.data)) {
            setCategories(json.data.map((row: any) => ({ id: row.slug, name: row.name, icon: FileText, color: "bg-gray-100 text-gray-800" })))
          }
        } catch {}
        // Permissions
        try {
          const res = await fetch(`${API_BASE_URL}/document-permissions`, { credentials: "include" })
          const json = await res.json()
          if (json?.success && Array.isArray(json.data)) {
            setPermissions(json.data.map((r: any) => ({ id: String(r.id), name: r.name })))
          }
        } catch {}
        // Documents
        try {
          const url = `${API_BASE_URL}/documents${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
          const res = await fetch(url, { credentials: "include" })
          const json = await res.json()
          if (json?.success && Array.isArray(json.data)) {
            setDocuments(json.data)
          }
        } catch {}
      } catch {}
    }
    load()
  }, [])

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-600" />
      case "image":
        return <ImageIcon className="h-5 w-5 text-green-600" />
      case "spreadsheet":
        return <FileSpreadsheet className="h-5 w-5 text-blue-600" />
      default:
        return <File className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expiring-soon":
        return "bg-yellow-100 text-yellow-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case "hr-only":
        return <Lock className="h-4 w-4 text-red-600" />
      case "manager-only":
        return <Lock className="h-4 w-4 text-orange-600" />
      case "public":
        return <Unlock className="h-4 w-4 text-green-600" />
      default:
        return <Lock className="h-4 w-4 text-gray-600" />
    }
  }

  const handleUploadDocument = async () => {
    const selectedEmployeeId = Number.parseInt(uploadForm.employeeId)
    if (!selectedEmployeeId || !uploadForm.category) return
    try {
      const companyId = getEmployerId()
      const url = `${API_BASE_URL}/documents${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
      const body = new FormData()
      body.append("employee_id", String(selectedEmployeeId))
      body.append("category_slug", uploadForm.category)
      body.append("name", uploadForm.name || "Document")
      body.append("description", uploadForm.description || "")
      if (uploadForm.expiryDate) body.append("expiry_date", uploadForm.expiryDate)
      body.append("access_level", uploadForm.accessLevel)
      const res = await fetch(url, { method: "POST", body, credentials: "include" })
      const json = await res.json()
      if (json?.success) {
        const employeeName = employees.find((emp) => emp.id === selectedEmployeeId)?.name || ""
        const newDoc = {
          id: json.data?.id || Date.now(),
          name: uploadForm.name || "Document",
          category: uploadForm.category,
          employeeId: selectedEmployeeId,
          employeeName,
          uploadDate: new Date().toISOString().split("T")[0],
          expiryDate: uploadForm.expiryDate || null,
          size: json.data?.size || "",
          type: json.data?.type || "pdf",
          accessLevel: uploadForm.accessLevel,
          status: "active",
          uploadedBy: "HR Admin",
          description: uploadForm.description,
          fileUrl: json.data?.file_url || "",
        }
        setDocuments((prev) => [...prev, newDoc])
        setShowUploadDialog(false)
        setUploadForm({ employeeId: "", category: "", name: "", description: "", expiryDate: "", accessLevel: "hr-only" })
      }
    } catch {}
  }

  const handleUpdateDocument = () => {
    setDocuments(documents.map((doc) => (doc.id === selectedDocument.id ? { ...selectedDocument } : doc)))
    setShowEditDialog(false)
  }

  const handleDeleteDocument = (documentId: number) => {
    setDocuments(documents.filter((doc) => doc.id !== documentId))
  }

  const handleRemoveByCategory = (categoryId: string) => {
    setDocuments(documents.filter((doc) => doc.category !== categoryId))
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    const matchesEmployee = selectedEmployee === "all" || doc.employeeId.toString() === selectedEmployee
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesEmployee && matchesSearch
  })

  const totalDocuments = documents.length
  const expiringSoon = documents.filter((doc) => doc.status === "expiring-soon").length
  const hrOnlyDocs = documents.filter((doc) => doc.accessLevel === "hr-only").length
  const totalSize = documents.reduce((sum, doc) => sum + Number.parseFloat(doc.size), 0)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/employers/dashboard/employee-managment">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Employment
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold mb-2">Document Management</h1>
              <p className="text-indigo-100">Securely store and manage employee documents with expiry tracking</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload New Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="employee">Employee</Label>
                    <Select
                      value={uploadForm.employeeId}
                      onValueChange={(value) => setUploadForm({ ...uploadForm, employeeId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id.toString()}>
                            {employee.name} - {employee.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={uploadForm.category}
                      onValueChange={(value) => setUploadForm({ ...uploadForm, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="name">Document Name</Label>
                    <Input
                      id="name"
                      value={uploadForm.name}
                      onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                      placeholder="Enter document name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      placeholder="Enter document description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiry">Expiry Date (Optional)</Label>
                    <Input
                      id="expiry"
                      type="date"
                      value={uploadForm.expiryDate}
                      onChange={(e) => setUploadForm({ ...uploadForm, expiryDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="access">Access Level</Label>
                    <Select
                      value={uploadForm.accessLevel}
                      onValueChange={(value) => setUploadForm({ ...uploadForm, accessLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr-only">HR Only</SelectItem>
                        <SelectItem value="manager-only">Manager Only</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 pt-4">
                    <Button onClick={handleUploadDocument} className="flex-1 w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowUploadDialog(false)}
                      className="flex-1 w-full sm:w-auto bg-transparent"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Download className="h-4 w-4 mr-2" />
              Export List
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalDocuments}</p>
                <p className="text-sm text-gray-600">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{expiringSoon}</p>
                <p className="text-sm text-gray-600">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-100">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{hrOnlyDocs}</p>
                <p className="text-sm text-gray-600">Confidential</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-100">
                <FolderOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalSize.toFixed(1)} MB</p>
                <p className="text-sm text-gray-600">Storage Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="documents" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white">
            All Documents
          </TabsTrigger>
          <TabsTrigger value="categories" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white">
            By Category
          </TabsTrigger>
          <TabsTrigger value="expiry" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white">
            Expiry Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((category) => {
              const categoryDocs = documents.filter((doc) => doc.category === category.id)
              const Icon = category.icon

              return (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 sm:p-3 rounded-lg ${category.color.replace("text-", "bg-").replace("800", "100")}`}
                        >
                          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${category.color.replace("bg-", "text-")}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base sm:text-lg">{category.name}</CardTitle>
                          <p className="text-xs sm:text-sm text-gray-600">{categoryDocs.length} documents</p>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 h-8 w-8 p-0 bg-transparent">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Category Documents</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove all {categoryDocs.length} documents in the "
                              {category.name}" category? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemoveByCategory(category.id)}>
                              Remove All
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categoryDocs.slice(0, 3).map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            {getFileIcon(doc.type)}
                            <span className="text-xs sm:text-sm truncate">{doc.name}</span>
                          </div>
                          <Badge variant="outline" className={`${getStatusColor(doc.status)} text-xs`}>
                            {doc.status === "expiring-soon" ? "Expiring" : "Active"}
                          </Badge>
                        </div>
                      ))}
                      {categoryDocs.length > 3 && (
                        <p className="text-xs text-gray-500 text-center pt-2">
                          +{categoryDocs.length - 3} more documents
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="expiry" className="space-y-6">
          {/* Expiry Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <span>Document Expiry Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents
                  .filter((doc) => doc.expiryDate)
                  .sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime())
                  .map((document) => {
                    const expiryDate = new Date(document.expiryDate!)
                    const today = new Date()
                    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

                    return (
                      <div key={document.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          {/* Document Info */}
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="flex-shrink-0">{getFileIcon(document.type)}</div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm leading-5 break-words">{document.name}</p>
                              <p className="text-xs text-gray-600 mt-1 truncate">{document.employeeName}</p>
                            </div>
                          </div>

                          {/* Expiry Info */}
                          <div className="flex flex-col sm:text-right space-y-1 flex-shrink-0">
                            <p className="text-sm font-medium">
                              <span className="text-gray-500 sm:hidden">Expires: </span>
                              {expiryDate.toLocaleDateString()}
                            </p>
                            <div className="flex items-center space-x-2 sm:justify-end">
                              {daysUntilExpiry <= 30 && (
                                <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                              )}
                              <span
                                className={`text-xs ${daysUntilExpiry <= 30 ? "text-yellow-600" : "text-gray-600"}`}
                              >
                                {daysUntilExpiry > 0
                                  ? `${daysUntilExpiry} days left`
                                  : `Expired ${Math.abs(daysUntilExpiry)} days ago`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Document Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-indigo-600" />
              <span>Document Details</span>
            </DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Document Name</Label>
                  <p className="text-sm text-gray-900">{selectedDocument.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Employee</Label>
                  <p className="text-sm text-gray-900">{selectedDocument.employeeName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Category</Label>
                  <p className="text-sm text-gray-900">
                    {categories.find((c) => c.id === selectedDocument.category)?.name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Upload Date</Label>
                  <p className="text-sm text-gray-900">{new Date(selectedDocument.uploadDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Expiry Date</Label>
                  <p className="text-sm text-gray-900">
                    {selectedDocument.expiryDate
                      ? new Date(selectedDocument.expiryDate).toLocaleDateString()
                      : "No expiry"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Access Level</Label>
                  <p className="text-sm text-gray-900 capitalize">{selectedDocument.accessLevel.replace("-", " ")}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <p className="text-sm text-gray-900">{selectedDocument.description}</p>
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 pt-4 border-t">
                <Button className="flex-1 w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="flex-1 w-full sm:w-auto bg-transparent">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-indigo-600" />
              <span>Edit Document</span>
            </DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Document Name</Label>
                <Input
                  id="edit-name"
                  value={selectedDocument.name}
                  onChange={(e) => setSelectedDocument({ ...selectedDocument, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedDocument.description}
                  onChange={(e) => setSelectedDocument({ ...selectedDocument, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-expiry">Expiry Date</Label>
                <Input
                  id="edit-expiry"
                  type="date"
                  value={selectedDocument.expiryDate || ""}
                  onChange={(e) => setSelectedDocument({ ...selectedDocument, expiryDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-access">Access Level</Label>
                <Select
                  value={selectedDocument.accessLevel}
                  onValueChange={(value) => setSelectedDocument({ ...selectedDocument, accessLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr-only">HR Only</SelectItem>
                    <SelectItem value="manager-only">Manager Only</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 pt-4">
                <Button onClick={handleUpdateDocument} className="flex-1 w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                  className="w-full sm:w-auto bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
