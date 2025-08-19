"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
} from "lucide-react"
import Link from "next/link" // Added Link import for navigation

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

  // Sample document categories
  const categories = [
    { id: "id-proofs", name: "ID Proofs", icon: FileText, color: "bg-blue-100 text-blue-800" },
    { id: "certificates", name: "Certificates", icon: FileText, color: "bg-green-100 text-green-800" },
    { id: "contracts", name: "Contracts", icon: FileText, color: "bg-purple-100 text-purple-800" },
    { id: "performance", name: "Performance Reports", icon: FileText, color: "bg-orange-100 text-orange-800" },
    { id: "personal", name: "Personal Documents", icon: FileText, color: "bg-gray-100 text-gray-800" },
  ]

  // Sample employees
  const employees = [
    { id: 1, name: "Sarah Johnson", department: "Engineering" },
    { id: 2, name: "Michael Chen", department: "Marketing" },
    { id: 3, name: "Emily Davis", department: "Design" },
    { id: 4, name: "David Wilson", department: "Sales" },
  ]

  // Sample documents
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

  const handleUploadDocument = () => {
    const newDocument = {
      id: documents.length + 1,
      name: uploadForm.name,
      category: uploadForm.category,
      employeeId: Number.parseInt(uploadForm.employeeId),
      employeeName: employees.find((emp) => emp.id === Number.parseInt(uploadForm.employeeId))?.name || "",
      uploadDate: new Date().toISOString().split("T")[0],
      expiryDate: uploadForm.expiryDate || null,
      size: "1.2 MB", // Simulated
      type: "pdf", // Simulated
      accessLevel: uploadForm.accessLevel,
      status: "active",
      uploadedBy: "HR Admin",
      description: uploadForm.description,
    }

    setDocuments([...documents, newDocument])
    setShowUploadDialog(false)
    setUploadForm({
      employeeId: "",
      category: "",
      name: "",
      description: "",
      expiryDate: "",
      accessLevel: "hr-only",
    })
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
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleUploadDocument} className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                    <Button variant="outline" onClick={() => setShowUploadDialog(false)} className="bg-transparent">
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">All Documents</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="expiry">Expiry Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search documents or employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
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
                    <SelectTrigger className="w-40">
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
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <span>Documents ({filteredDocuments.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {getFileIcon(document.type)}
                            <div>
                              <p className="font-medium text-sm">{document.name}</p>
                              <p className="text-xs text-gray-500">by {document.uploadedBy}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs">
                                {document.employeeName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{document.employeeName}</span>
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
                        <TableCell className="text-sm">{new Date(document.uploadDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-sm">
                          {document.expiryDate ? new Date(document.expiryDate).toLocaleDateString() : "No expiry"}
                        </TableCell>
                        <TableCell className="text-sm">{document.size}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {getAccessLevelIcon(document.accessLevel)}
                            <span className="text-xs capitalize">{document.accessLevel.replace("-", " ")}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(document.status)}>
                            {document.status === "expiring-soon" && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {document.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                            <span className="capitalize">{document.status.replace("-", " ")}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => {
                                setSelectedDocument(document)
                                setShowViewDialog(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => {
                                setSelectedDocument({ ...document })
                                setShowEditDialog(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 bg-transparent"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Document</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{document.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteDocument(document.id)}>
                                    Delete
                                  </AlertDialogAction>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const categoryDocs = documents.filter((doc) => doc.category === category.id)
              const Icon = category.icon

              return (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-3 rounded-lg ${category.color.replace("text-", "bg-").replace("800", "100")}`}
                        >
                          <Icon className={`h-6 w-6 ${category.color.replace("bg-", "text-")}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-gray-600">{categoryDocs.length} documents</p>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 bg-transparent">
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
                            <span className="text-sm truncate">{doc.name}</span>
                          </div>
                          <Badge variant="outline" className={getStatusColor(doc.status)}>
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
                      <div key={document.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getFileIcon(document.type)}
                            <div>
                              <p className="font-medium text-sm">{document.name}</p>
                              <p className="text-xs text-gray-600">{document.employeeName}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Expires: {expiryDate.toLocaleDateString()}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {daysUntilExpiry <= 30 && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                            <span className={`text-xs ${daysUntilExpiry <= 30 ? "text-yellow-600" : "text-gray-600"}`}>
                              {daysUntilExpiry > 0
                                ? `${daysUntilExpiry} days left`
                                : `Expired ${Math.abs(daysUntilExpiry)} days ago`}
                            </span>
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
              <div className="flex space-x-2 pt-4 border-t">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
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
              <div className="flex space-x-2 pt-4">
                <Button onClick={handleUpdateDocument} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setShowEditDialog(false)} className="bg-transparent">
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
