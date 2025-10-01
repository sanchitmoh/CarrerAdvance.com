"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  Upload,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  ArrowLeft,
  FileImage,
  FileSpreadsheet,
  File,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Lock,
  Unlock,
  ImageIcon,
  Save,
  Plus,
  Filter,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { API_BASE_URL } from "@/lib/api-config"

export default function DocumentManagement() {
  const [documentsPage, setDocumentsPage] = useState(1)
  const [verificationPage, setVerificationPage] = useState(1)
  const [categoryPage, setCategoryPage] = useState(1)
  const [expiryPage, setExpiryPage] = useState(1)

  const documentsPerPage = 8
  const verificationPerPage = 5
  const categoryPerPage = 4
  const expiryPerPage = 8

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedEmployee, setSelectedEmployee] = useState("all")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [verificationForm, setVerificationForm] = useState({
    verifier: "",
    category: "",
    description: "",
    status: "verified",
    notes: "",
  })
  const [uploadForm, setUploadForm] = useState({
    employeeId: "",
    category: "",
    name: "",
    description: "",
    expiryDate: "",
    accessLevel: "",
  })
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  })

  const [permissions, setPermissions] = useState<{ id: string; name: string }[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string; icon: any; color: string }[]>([])
  const [employees, setEmployees] = useState<{ id: number; name: string; department?: string }[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [mobileActionMenu, setMobileActionMenu] = useState<number | null>(null)

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-600" />
      case "image":
        return <FileImage className="h-4 w-4 text-green-600" />
      case "spreadsheet":
        return <FileSpreadsheet className="h-4 w-4 text-blue-600" />
      default:
        return <File className="h-4 w-4 text-gray-600" />
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

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <UserCheck className="h-3 w-3 mr-1" />
      case "pending":
        return <Clock className="h-3 w-3 mr-1" />
      case "rejected":
        return <AlertTriangle className="h-3 w-3 mr-1" />
      default:
        return <Shield className="h-3 w-3 mr-1" />
    }
  }

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case "hr-only":
        return <Lock className="h-3 w-3 text-red-600" />
      case "manager-only":
        return <Lock className="h-3 w-3 text-orange-600" />
      case "public":
        return <Unlock className="h-3 w-3 text-green-600" />
      default:
        return <Lock className="h-3 w-3 text-gray-600" />
    }
  }

  const formatDate = (date: string | number | Date) => {
    const d = new Date(date)
    if (isNaN(d.getTime())) return ""
    return new Intl.DateTimeFormat("en-CA").format(d)
  }

  const getAccessLevelName = (levelId: string | number) => {
    if (!levelId) return ""
    const idStr = String(levelId)
    const p = permissions.find((x) => String(x.id) === idStr)
    return p ? p.name : idStr
  }

  const resolveVerifiedByName = (idOrName: any) => {
    if (!idOrName && idOrName !== 0) return ""
    if (typeof idOrName === "string" && isNaN(Number(idOrName))) return idOrName
    const idNum = Number(idOrName)
    const emp = employees.find((e) => Number(e.id) === idNum)
    return emp ? emp.name : String(idOrName)
  }

  const handleAddCategory = async () => {
    if (!categoryForm.name.trim()) return
    try {
      const companyId = getEmployerId()
      const url = `${API_BASE_URL}/document-categories${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: categoryForm.name, description: categoryForm.description }),
      })
      const json = await res.json()
      if (json && json.success) {
        const newCat = {
          id: (json.data?.slug as string) || categoryForm.name.toLowerCase().replace(/\s+/g, "-"),
          name: categoryForm.name,
          icon: FileText,
          color: "bg-gray-100 text-gray-800",
        }
        setCategories((prev) => [...prev, newCat])
        setShowCategoryDialog(false)
        setCategoryForm({ name: "", description: "" })
        setUploadForm((f) => ({ ...f, category: newCat.id }))
      }
    } catch (e) {
      // noop
    }
  }

  function getEmployerId() {
    if (typeof document === "undefined") return ""
    const match = document.cookie.match(/(?:^|;\s*)employer_id=([^;]+)/)
    return match ? decodeURIComponent(match[1]) : ""
  }

  async function fetchCategories() {
    try {
      const companyId = getEmployerId()
      const url = `${API_BASE_URL}/document-categories${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
      const res = await fetch(url, { credentials: "include" })
      const json = await res.json()
      if (json && json.success && Array.isArray(json.data)) {
        const mapped = json.data.map((row: any) => ({
          id: row.slug,
          name: row.name,
          icon: FileText,
          color: "bg-gray-100 text-gray-800",
        }))
        setCategories(mapped)
      }
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    fetchCategories()
    ;(async () => {
      try {
        const companyId = getEmployerId()
        const url = `${API_BASE_URL}/company-employees${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
        const res = await fetch(url, { credentials: "include" })
        const json = await res.json()
        if (json && json.success && Array.isArray(json.data)) {
          const mapped = json.data.map((r: any) => ({ id: Number(r.id), name: r.emp_name || r.name, department: r.department || r.designation }))
          setEmployees(mapped)
        }
      } catch (e) {
        // ignore
      }
    })()
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/document-permissions`, { credentials: "include" })
        const json = await res.json()
        if (json && json.success && Array.isArray(json.data)) {
          const mapped = json.data.map((r: any) => ({ id: String(r.id), name: r.name }))
          setPermissions(mapped)
          if (!uploadForm.accessLevel && mapped[0]) setUploadForm((f) => ({ ...f, accessLevel: mapped[0].id }))
        }
      } catch (e) {
        // ignore
      }
    })()
    ;(async () => {
      try {
        const companyId = getEmployerId()
        const url = `${API_BASE_URL}/documents${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
        const res = await fetch(url, { credentials: "include" })
        const json = await res.json()
        if (json && json.success && Array.isArray(json.data)) {
          setDocuments(json.data)
        }
      } catch (e) {
        // ignore
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUploadDocument = async () => {
    const selectedEmployeeId = Number.parseInt(uploadForm.employeeId)
    if (!uploadFile) return
    try {
      const form = new FormData()
      form.append("employee_id", String(selectedEmployeeId))
      form.append("category_slug", uploadForm.category)
      form.append("name", uploadForm.name || uploadFile.name)
      form.append("description", uploadForm.description)
      if (uploadForm.expiryDate) form.append("expiry_date", uploadForm.expiryDate)
      form.append("access_level", uploadForm.accessLevel)
      form.append("file", uploadFile)

      const companyId = getEmployerId()
      const url = `${API_BASE_URL}/documents${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
      const res = await fetch(url, { method: "POST", body: form, credentials: "include" })
      const json = await res.json()
      if (json && json.success) {
        const detectedType = (() => {
          const name = uploadFile.name.toLowerCase()
          if (name.endsWith(".pdf")) return "pdf"
          if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image"
          if (name.endsWith(".xls") || name.endsWith(".xlsx") || name.endsWith(".csv")) return "spreadsheet"
          return "pdf"
        })()
        const computedSize = `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`
        const newDocument = {
          id: json.data?.id || documents.length + 1,
          name: uploadForm.name || uploadFile.name,
          category: uploadForm.category,
          employeeId: selectedEmployeeId,
          employeeName: employees.find((emp) => emp.id === selectedEmployeeId)?.name || "",
          uploadDate: new Date().toISOString().split("T")[0],
          expiryDate: uploadForm.expiryDate || null,
          size: computedSize,
          type: detectedType,
          accessLevel: uploadForm.accessLevel,
          status: "active",
          uploadedBy: "HR Admin",
          description: uploadForm.description,
          verificationStatus: "pending",
          verifiedBy: null,
          verifiedDate: null,
          verificationNotes: null,
          fileUrl: json.data?.file_url || "",
          file: null,
        }
        setDocuments([...documents, newDocument])
        setShowUploadDialog(false)
        setUploadForm({ employeeId: "", category: "", name: "", description: "", expiryDate: "", accessLevel: "hr-only" })
        setUploadFile(null)
      }
    } catch (e) {
      // ignore
    }
  }

  const handleUpdateDocument = () => {
    const updatedDoc = { ...selectedDocument }
    if (selectedDocument.newFile) {
      updatedDoc.file = selectedDocument.newFile
      updatedDoc.size = `${(selectedDocument.newFile.size / 1024).toFixed(1)} KB`
      updatedDoc.uploadDate = new Date().toLocaleDateString()
      delete updatedDoc.newFile
    }
    setDocuments(documents.map((doc) => (doc.id === selectedDocument.id ? updatedDoc : doc)))
    setShowEditDialog(false)
  }

  const handleVerifyDocument = () => {
    const updatedDocument = {
      ...selectedDocument,
      verificationStatus: "verified",
      verifiedBy: verificationForm.verifier,
      verifiedDate: new Date().toISOString().split("T")[0],
      verificationNotes: verificationForm.description,
    }

    setDocuments(documents.map((doc) => (doc.id === selectedDocument.id ? updatedDocument : doc)))
    setShowVerificationDialog(false)
    setVerificationForm({
      verifier: "",
      category: "",
      description: "",
      status: "verified",
      notes: "",
    })
  }

  const handleRejectDocument = () => {
    const updatedDocument = {
      ...selectedDocument,
      verificationStatus: "rejected",
      verifiedBy: verificationForm.verifier,
      verifiedDate: new Date().toISOString().split("T")[0],
      verificationNotes: verificationForm.description,
    }

    setDocuments(documents.map((doc) => (doc.id === selectedDocument.id ? updatedDocument : doc)))
    setShowVerificationDialog(false)
    setVerificationForm({
      verifier: "",
      category: "",
      description: "",
      status: "rejected",
      notes: "",
    })
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

  const totalDocumentsPages = Math.ceil(filteredDocuments.length / documentsPerPage)
  const paginatedDocuments = filteredDocuments.slice(
    (documentsPage - 1) * documentsPerPage,
    documentsPage * documentsPerPage,
  )

  const pendingDocuments = documents.filter((doc) => doc.verificationStatus === "pending")
  const totalVerificationPages = Math.ceil(pendingDocuments.length / verificationPerPage)
  const paginatedPendingDocuments = pendingDocuments.slice(
    (verificationPage - 1) * verificationPerPage,
    verificationPage * verificationPerPage,
  )

  const documentsByCategory = categories
    .map((category) => ({
      ...category,
      documents: documents.filter((doc) => doc.category === category.id),
    }))
    .filter((category) => category.documents.length > 0)

  const totalCategoryPages = Math.ceil(documentsByCategory.length / categoryPerPage)
  const paginatedCategoryDocuments = documentsByCategory.slice(
    (categoryPage - 1) * categoryPerPage,
    categoryPage * categoryPerPage,
  )

  const expiringDocuments = documents.filter((doc) => doc.status === "expiring-soon")
  const totalExpiryPages = Math.ceil(expiringDocuments.length / expiryPerPage)
  const paginatedExpiringDocuments = expiringDocuments.slice(
    (expiryPage - 1) * expiryPerPage,
    expiryPage * expiryPerPage,
  )

  const PaginationControls: React.FC<{
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    label: string
  }> = ({ currentPage, totalPages, onPageChange, label }) => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-1">
      <p className="text-sm text-gray-600 whitespace-nowrap">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="h-9 px-3"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span className="hidden xs:inline">Previous</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 px-3"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )

  const totalDocuments = documents.length
  const expiringSoon = documents.filter((doc) => doc.status === "expiring-soon").length
  const hrOnlyDocs = documents.filter((doc) => doc.accessLevel === "hr-only").length
  const totalSize = documents.reduce((sum, doc) => sum + Number.parseFloat(doc.size), 0)
  const pendingVerification = documents.filter((doc) => doc.verificationStatus === "pending").length
  const verifiedDocs = documents.filter((doc) => doc.verificationStatus === "verified").length

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
     {/* Header */}
<div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
    {/* Left side - Back button and Title */}
    <div className="flex flex-col gap-3 sm:gap-4 sm:flex-1">
      {/* Back button */}
      <div className="w-full sm:w-auto">
        <Link href="/employers/dashboard/employee-managment">
          <Button
            variant="secondary"
            size="sm"
            className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border-white/30 justify-center text-xs sm:text-sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Back to Employment
          </Button>
        </Link>
      </div>

      {/* Title and description */}
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Document Management</h1>
        <p className="text-emerald-100 text-sm sm:text-base">Manage employee documents and verification</p>
      </div>
    </div>

    {/* Right side - Action buttons (Desktop) */}
    <div className="hidden sm:flex gap-2 flex-shrink-0">
      <Button
        variant="secondary"
        className="bg-white/20 hover:bg-white/30 text-white border-white/30 justify-center text-sm"
        onClick={() => setShowUploadDialog(true)}
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload Document
      </Button>
      <Button
        variant="secondary"
        className="bg-white/20 hover:bg-white/30 text-white border-white/30 justify-center text-sm"
        onClick={() => setShowCategoryDialog(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Category
      </Button>
    </div>

    {/* Mobile Action buttons */}
    <div className="flex flex-col xs:flex-row gap-2 w-full sm:hidden">
      <Button
        variant="secondary"
        className="w-full xs:w-auto bg-white/20 hover:bg-white/30 text-white border-white/30 justify-center text-xs py-2 h-auto"
        onClick={() => setShowUploadDialog(true)}
      >
        <Upload className="h-3 w-3 mr-1 sm:mr-2" />
        Upload Document
      </Button>
      <Button
        variant="secondary"
        className="w-full xs:w-auto bg-white/20 hover:bg-white/30 text-white border-white/30 justify-center text-xs py-2 h-auto"
        onClick={() => setShowCategoryDialog(true)}
      >
        <Plus className="h-3 w-3 mr-1 sm:mr-2" />
        Add Category
      </Button>
    </div>
  </div>
</div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 rounded-lg bg-blue-100">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-gray-900">{totalDocuments}</p>
                <p className="text-xs text-gray-600">Total Docs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 rounded-lg bg-yellow-100">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-gray-900">{expiringSoon}</p>
                <p className="text-xs text-gray-600">Expiring</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 rounded-lg bg-red-100">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-gray-900">{hrOnlyDocs}</p>
                <p className="text-xs text-gray-600">Confidential</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow xs:col-span-1 lg:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 rounded-lg bg-orange-100">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-gray-900">{pendingVerification}</p>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow xs:col-span-1 lg:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 rounded-lg bg-green-100">
                <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-gray-900">{verifiedDocs}</p>
                <p className="text-xs text-gray-600">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 gap-1">
          <TabsTrigger value="documents" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white flex items-center justify-center">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="truncate">Documents</span>
          </TabsTrigger>
          <TabsTrigger value="verification" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white flex items-center justify-center">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="truncate">Verification</span>
          </TabsTrigger>
          <TabsTrigger value="category" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white flex items-center justify-center">
            <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="truncate">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="expiry" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white flex items-center justify-center">
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="truncate">Expiry</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4 sm:space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search documents or employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div className="flex flex-col xs:flex-row gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full xs:w-40 text-sm">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger className="w-full xs:w-40 text-sm">
                      <SelectValue placeholder="Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                <span>Documents ({filteredDocuments.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[180px]">Document</TableHead>
                        <TableHead className="min-w-[100px]">Employee</TableHead>
                        <TableHead className="min-w-[90px]">Category</TableHead>
                        <TableHead className="min-w-[90px]">Upload Date</TableHead>
                        <TableHead className="min-w-[90px]">Status</TableHead>
                        <TableHead className="min-w-[70px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedDocuments.map((document) => (
                        <TableRow key={document.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              {getFileIcon(document.type)}
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm truncate">{document.name}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-xs text-gray-500">{document.size}</p>
                                  <span className="text-xs text-gray-400">•</span>
                                  <div className="flex items-center space-x-1">
                                    {getAccessLevelIcon(document.accessLevel)}
                                    <span className="text-xs text-gray-500 capitalize">
                                      {document.accessLevel.replace("-", " ")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs">
                                  {document.employeeName
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm truncate">{document.employeeName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                categories.find((c) => c.id === document.category)?.color || "bg-gray-100 text-gray-800"
                              }
                            >
                              {categories.find((c) => c.id === document.category)?.name}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm whitespace-nowrap">
                            {formatDate(document.uploadDate)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge variant="outline" className={getStatusColor(document.status)}>
                                {document.status === "expiring-soon" && <AlertTriangle className="h-3 w-3 mr-1" />}
                                {document.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                                <span className="capitalize text-xs">{document.status.replace("-", " ")}</span>
                              </Badge>
                              <Badge variant="outline" className={getVerificationStatusColor(document.verificationStatus)}>
                                {getVerificationStatusIcon(document.verificationStatus)}
                                <span className="capitalize text-xs">{document.verificationStatus}</span>
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setSelectedDocument(document)
                                  setShowViewDialog(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  if (document.fileUrl) {
                                    window.open(document.fileUrl, '_blank')
                                  }
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Document</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{document.name}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={async () => {
                                      try {
                                        const companyId = getEmployerId()
                                        const url = `${API_BASE_URL}/documents/${encodeURIComponent(document.id)}/delete${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
                                        await fetch(url, { method: 'POST', credentials: 'include' })
                                        handleDeleteDocument(document.id)
                                      } catch (e) {}
                                    }}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile View */}
                <div className="sm:hidden">
                  <div className="divide-y">
                    {paginatedDocuments.map((document) => (
                      <div key={document.id} className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-2 flex-1 min-w-0">
                            {getFileIcon(document.type)}
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm truncate">{document.name}</p>
                              <div className="flex items-center space-x-1 mt-1">
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs">
                                    {document.employeeName
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-600 truncate">{document.employeeName}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                <Badge
                                  variant="outline"
                                  className={
                                    categories.find((c) => c.id === document.category)?.color || "bg-gray-100 text-gray-800 text-xs"
                                  }
                                >
                                  {categories.find((c) => c.id === document.category)?.name}
                                </Badge>
                                <Badge variant="outline" className={getStatusColor(document.status) + " text-xs"}>
                                  {document.status === "expiring-soon" && <AlertTriangle className="h-2 w-2 mr-1" />}
                                  {document.status === "active" && <CheckCircle className="h-2 w-2 mr-1" />}
                                  <span className="capitalize">{document.status.replace("-", " ")}</span>
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">{formatDate(document.uploadDate)}</span>
                                <span className="text-xs text-gray-500">{document.size}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => setMobileActionMenu(mobileActionMenu === document.id ? null : document.id)}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            
                            {mobileActionMenu === document.id && (
                              <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg z-10 min-w-[120px]">
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-xs h-8"
                                  onClick={() => {
                                    setSelectedDocument(document)
                                    setShowViewDialog(true)
                                    setMobileActionMenu(null)
                                  }}
                                >
                                  <Eye className="h-3 w-3 mr-2" />
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-xs h-8"
                                  onClick={() => {
                                    if (document.fileUrl) {
                                      window.open(document.fileUrl, '_blank')
                                    }
                                    setMobileActionMenu(null)
                                  }}
                                >
                                  <Download className="h-3 w-3 mr-2" />
                                  Download
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start text-xs h-8 text-red-600"
                                    >
                                      <Trash2 className="h-3 w-3 mr-2" />
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Document</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{document.name}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={async () => {
                                        try {
                                          const companyId = getEmployerId()
                                          const url = `${API_BASE_URL}/documents/${encodeURIComponent(document.id)}/delete${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
                                          await fetch(url, { method: 'POST', credentials: 'include' })
                                          handleDeleteDocument(document.id)
                                          setMobileActionMenu(null)
                                        } catch (e) {}
                                      }}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {filteredDocuments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                  <p className="text-base font-medium">No documents found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}
              <PaginationControls
                currentPage={documentsPage}
                totalPages={totalDocumentsPages}
                onPageChange={setDocumentsPage}
                label="documents"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Pending Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl font-bold text-orange-600">{pendingDocuments.length}</div>
                <p className="text-xs text-gray-500">Documents awaiting review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Recently Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl font-bold text-green-600">{verifiedDocs}</div>
                <p className="text-xs text-gray-500">Verified this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Rejected Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl font-bold text-red-600">
                  {documents.filter((doc) => doc.verificationStatus === "rejected").length}
                </div>
                <p className="text-xs text-gray-500">Need resubmission</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                <span>Pending Verification ({pendingDocuments.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paginatedPendingDocuments.map((document) => (
                  <div key={document.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-start space-x-3 min-w-0 flex-1">
                        {getFileIcon(document.type)}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm leading-5 break-words">{document.name}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-xs text-blue-600">{document.employeeName}</span>
                            <span className="text-xs text-gray-500">{formatDate(document.uploadDate)}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">by {document.uploadedBy}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col xs:flex-row gap-2 justify-end">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1 h-8"
                          onClick={() => {
                            setSelectedDocument(document)
                            setVerificationForm({
                              verifier: "",
                              category: document.category,
                              description: "",
                              status: "verified",
                              notes: "",
                            })
                            setShowVerificationDialog(true)
                          }}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50 text-xs px-3 py-1 h-8"
                          onClick={() => {
                            setSelectedDocument(document)
                            setVerificationForm({
                              verifier: "",
                              category: document.category,
                              description: "",
                              status: "rejected",
                              notes: "",
                            })
                            setShowVerificationDialog(true)
                          }}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {pendingDocuments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                  <p className="text-base font-medium">No pending verifications</p>
                  <p className="text-sm">All documents are verified</p>
                </div>
              )}
              <PaginationControls
                currentPage={verificationPage}
                totalPages={totalVerificationPages}
                onPageChange={setVerificationPage}
                label="verification"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {paginatedCategoryDocuments.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${category.color.replace("text-", "bg-").replace("800", "500")}`}
                      />
                      <span className="text-base sm:text-lg">{category.name}</span>
                      <Badge variant="outline" className="text-xs">{category.documents.length} documents</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.documents.slice(0, 3).map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          {getFileIcon(document.type)}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-xs sm:text-sm truncate">{document.name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">{document.size}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {new Date(document.uploadDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(document.status) + " text-xs"}>
                          {document.status === "expiring-soon" ? "Expiring" : "Active"}
                        </Badge>
                      </div>
                    ))}
                    {category.documents.length > 3 && (
                      <p className="text-xs text-gray-500 text-center pt-1">
                        +{category.documents.length - 3} more documents
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {documentsByCategory.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Filter className="h-10 w-10 mx-auto text-gray-300 mb-3" />
              <p className="text-base font-medium">No categories with documents</p>
              <p className="text-sm">Upload documents to see them organized by category</p>
            </div>
          )}
          <PaginationControls
            currentPage={categoryPage}
            totalPages={totalCategoryPages}
            onPageChange={setCategoryPage}
            label="categories"
          />
        </TabsContent>

        <TabsContent value="expiry" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                <span>Expiring Soon ({expiringDocuments.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paginatedExpiringDocuments.map((document) => {
                  const expiry = document.expiryDate ? new Date(document.expiryDate as unknown as string) : new Date()
                  const daysLeft = Math.ceil((expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  return (
                    <div key={document.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-start space-x-3 min-w-0 flex-1">
                          {getFileIcon(document.type)}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm leading-5 break-words">{document.name}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-xs text-blue-600">{document.employeeName}</span>
                              <Badge variant="outline" className="text-xs">
                                {categories.find(c => c.id === document.category)?.name}
                              </Badge>
                              <span className="text-xs text-gray-500">{document.size}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                          <div className="flex flex-col items-end gap-1">
                            <Badge
                              variant="outline"
                              className={(daysLeft <= 7 ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800") + " text-xs"}
                            >
                              {daysLeft} days left
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Expires: {formatDate(document.expiryDate as unknown as string)}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedDocument(document)
                                setShowViewDialog(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                if (document.fileUrl) {
                                  window.open(document.fileUrl, '_blank')
                                }
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {expiringDocuments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                  <p className="text-base font-medium">No expiring documents</p>
                  <p className="text-sm">All documents are up to date</p>
                </div>
              )}
              <PaginationControls
                currentPage={expiryPage}
                totalPages={totalExpiryPages}
                onPageChange={setExpiryPage}
                label="expiring documents"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Document Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Upload className="h-5 w-5 text-indigo-600" />
              <span>Upload Document</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="employee" className="text-sm sm:text-base">Employee</Label>
              <Select
                value={uploadForm.employeeId}
                onValueChange={(value) => setUploadForm({ ...uploadForm, employeeId: value })}
              >
                <SelectTrigger className="text-sm sm:text-base">
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
              <Label htmlFor="category" className="text-sm sm:text-base">Category</Label>
              <Select
                value={uploadForm.category}
                onValueChange={(value) => setUploadForm({ ...uploadForm, category: value })}
              >
                <SelectTrigger className="text-sm sm:text-base">
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
              <Label htmlFor="name" className="text-sm sm:text-base">Document Name</Label>
              <Input
                id="name"
                value={uploadForm.name}
                onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                placeholder="Enter document name (optional)"
                className="text-sm sm:text-base"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
              <Textarea
                id="description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                placeholder="Enter document description"
                rows={3}
                className="text-sm sm:text-base"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry" className="text-sm sm:text-base">Expiry Date (optional)</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={uploadForm.expiryDate}
                  onChange={(e) => setUploadForm({ ...uploadForm, expiryDate: e.target.value })}
                  className="text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="access" className="text-sm sm:text-base">Access Level</Label>
                <Select
                  value={uploadForm.accessLevel}
                  onValueChange={(value) => setUploadForm({ ...uploadForm, accessLevel: value })}
                >
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {permissions.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-sm sm:text-base">Document File</Label>
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files?.[0]
                  if (file) setUploadFile(file)
                }}
                className="mt-2 border-2 border-dashed rounded-lg p-4 sm:p-6 text-center hover:border-indigo-300 transition-colors"
              >
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-600">Drag & drop file here, or click to browse</p>
                <div className="mt-3">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setUploadFile(file)
                    }}
                    className="cursor-pointer text-xs sm:text-sm"
                  />
                </div>
                {uploadFile && (
                  <p className="text-xs text-green-600 mt-2 flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Selected: {uploadFile.name}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button onClick={handleUploadDocument} className="flex-1 text-sm sm:text-base" disabled={!uploadFile}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadDialog(false)
                  setUploadFile(null)
                }}
                className="flex-1 text-sm sm:text-base"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Plus className="h-5 w-5 text-indigo-600" />
              <span>Add Category</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name" className="text-sm sm:text-base">Category Name</Label>
              <Input
                id="category-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="Enter category name"
                className="text-sm sm:text-base"
              />
            </div>
            <div>
              <Label htmlFor="category-description" className="text-sm sm:text-base">Description</Label>
              <Textarea
                id="category-description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Describe this category"
                rows={3}
                className="text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button onClick={handleAddCategory} className="flex-1 text-sm sm:text-base" disabled={!categoryForm.name.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCategoryDialog(false)}
                className="flex-1 text-sm sm:text-base"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Eye className="h-5 w-5 text-indigo-600" />
              <span>Document Details</span>
            </DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Document Preview */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Document Preview</Label>
                  <div className="border rounded-lg p-3 sm:p-4 bg-gray-50 min-h-[200px] sm:min-h-[300px] flex items-center justify-center">
                    {selectedDocument.type === "image" && selectedDocument.fileUrl ? (
                      <img src={selectedDocument.fileUrl} alt={selectedDocument.name} className="max-h-[200px] sm:max-h-[300px] max-w-full object-contain" />
                    ) : selectedDocument.type === "pdf" && selectedDocument.fileUrl ? (
                      <iframe src={selectedDocument.fileUrl} title="Document preview" className="w-full h-[200px] sm:h-[300px] rounded" />
                    ) : selectedDocument.type === "office" && selectedDocument.fileUrl ? (
                      <a href={selectedDocument.fileUrl} target="_blank" rel="noreferrer" className="text-indigo-600 text-sm underline">
                        Open in new tab (DOC/DOCX/PPT)
                      </a>
                    ) : (
                      <div className="text-center">
                        <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No preview available</p>
                        {selectedDocument.fileUrl && (
                          <a href={selectedDocument.fileUrl} target="_blank" rel="noreferrer" className="text-indigo-600 text-xs underline">
                            Open file
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Details */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Document Name</Label>
                      <p className="text-sm text-gray-900 break-words">{selectedDocument.name}</p>
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
                      <p className="text-sm text-gray-900">{formatDate(selectedDocument.uploadDate)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Expiry Date</Label>
                      <p className="text-sm text-gray-900">
                        {selectedDocument.expiryDate ? formatDate(selectedDocument.expiryDate) : "No expiry"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Access Level</Label>
                      <p className="text-sm text-gray-900">
                        {getAccessLevelName(selectedDocument.accessLevel)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Verification Status</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant="outline"
                          className={getVerificationStatusColor(selectedDocument.verificationStatus)}
                        >
                          {getVerificationStatusIcon(selectedDocument.verificationStatus)}
                          <span className="capitalize text-xs">{selectedDocument.verificationStatus}</span>
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {(() => {
                            const name = selectedDocument.verifiedBy || resolveVerifiedByName(selectedDocument.verified_by || selectedDocument.verifiedById)
                            return name ? `by ${name}` : ""
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <p className="text-sm text-gray-900 break-words">{selectedDocument.description}</p>
                  </div>
                  {selectedDocument.verificationNotes && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Verification Notes</Label>
                      <p className="text-sm text-gray-900 break-words">{selectedDocument.verificationNotes}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                <Button 
                  className="flex-1 text-sm sm:text-base"
                  onClick={() => {
                    if (selectedDocument.fileUrl) {
                      window.open(selectedDocument.fileUrl, '_blank')
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                {selectedDocument.verificationStatus === "pending" && (
                  <Button
                    variant="outline"
                    className="flex-1 text-sm sm:text-base"
                    onClick={() => {
                      setVerificationForm({
                        verifier: "",
                        category: selectedDocument.category,
                        description: selectedDocument.description,
                        status: "pending",
                        notes: "",
                      })
                      setShowViewDialog(false)
                      setShowVerificationDialog(true)
                    }}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                )}
                <Button variant="outline" className="flex-1 text-sm sm:text-base" onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Verification Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Shield className="h-5 w-5 text-indigo-600" />
              <span>Verify Document</span>
            </DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(selectedDocument.type)}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm break-words">{selectedDocument.name}</p>
                    <p className="text-xs text-gray-600 break-words">
                      {selectedDocument.employeeName} • Uploaded: {formatDate(selectedDocument.uploadDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="verifier" className="text-sm sm:text-base">Verifier Name</Label>
                <Select
                  value={verificationForm.verifier}
                  onValueChange={(value) => setVerificationForm({ ...verificationForm, verifier: value })}
                >
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Select verifier" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.name}>
                        {employee.name} - {employee.department}
                      </SelectItem>
                    ))}
                    <SelectItem value="HR Admin">HR Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm sm:text-base">Verification Notes</Label>
                <Textarea
                  id="notes"
                  value={verificationForm.notes}
                  onChange={(e) => setVerificationForm({ ...verificationForm, notes: e.target.value })}
                  placeholder="Add verification notes or comments..."
                  rows={3}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button onClick={async () => {
                  if (!selectedDocument) return
                  try {
                    const companyId = getEmployerId()
                    const url = `${API_BASE_URL}/documents/${encodeURIComponent(selectedDocument.id)}/verify${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
                    await fetch(url, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({ status: "verified", verified_by: companyId, verification_description: verificationForm.notes || null }),
                    })
                    handleVerifyDocument()
                  } catch (e) {
                    // ignore
                  }
                }} className="flex-1 text-sm sm:text-base">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Approve & Verify
                </Button>
                <Button variant="destructive" onClick={async () => {
                  if (!selectedDocument) return
                  try {
                    const companyId = getEmployerId()
                    const url = `${API_BASE_URL}/documents/${encodeURIComponent(selectedDocument.id)}/verify${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
                    await fetch(url, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({ status: "rejected", verified_by: companyId, verification_description: verificationForm.notes || null }),
                    })
                    handleRejectDocument()
                  } catch (e) {
                    // ignore
                  }
                }} className="flex-1 text-sm sm:text-base">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowVerificationDialog(false)}
                className="w-full text-sm sm:text-base"
              >
                Cancel
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Edit className="h-5 w-5 text-indigo-600" />
              <span>Edit Document</span>
            </DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name" className="text-sm sm:text-base">Document Name</Label>
                <Input
                  id="edit-name"
                  value={selectedDocument.name}
                  onChange={(e) => setSelectedDocument({ ...selectedDocument, name: e.target.value })}
                  className="text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="edit-description" className="text-sm sm:text-base">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedDocument.description}
                  onChange={(e) => setSelectedDocument({ ...selectedDocument, description: e.target.value })}
                  rows={3}
                  className="text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="edit-expiry" className="text-sm sm:text-base">Expiry Date</Label>
                <Input
                  id="edit-expiry"
                  type="date"
                  value={selectedDocument.expiryDate || ""}
                  onChange={(e) => setSelectedDocument({ ...selectedDocument, expiryDate: e.target.value })}
                  className="text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="edit-access" className="text-sm sm:text-base">Access Level</Label>
                <Select
                  value={String(selectedDocument.accessLevel || "")}
                  onValueChange={(value) => setSelectedDocument({ ...selectedDocument, accessLevel: value })}
                >
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {permissions.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button onClick={async () => {
                  try {
                    const companyId = getEmployerId()
                    const url = `${API_BASE_URL}/documents/${encodeURIComponent(selectedDocument.id)}/update${companyId ? `?company_id=${encodeURIComponent(companyId)}` : ""}`
                    // Use multipart if a new file is selected
                    if (selectedDocument.newFile) {
                      const form = new FormData()
                      form.append("name", selectedDocument.name || "")
                      form.append("description", selectedDocument.description || "")
                      if (selectedDocument.expiryDate) form.append("expiry_date", selectedDocument.expiryDate)
                      if (selectedDocument.accessLevel) form.append("access_level", String(selectedDocument.accessLevel))
                      form.append("file", selectedDocument.newFile)
                      await fetch(url, { method: "POST", body: form, credentials: "include" })
                    } else {
                      await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                          name: selectedDocument.name,
                          description: selectedDocument.description,
                          expiry_date: selectedDocument.expiryDate || null,
                          access_level: selectedDocument.accessLevel,
                        }),
                      })
                    }
                    handleUpdateDocument()
                  } catch (e) {
                    // ignore
                  }
                }} className="flex-1 text-sm sm:text-base">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1 text-sm sm:text-base">
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