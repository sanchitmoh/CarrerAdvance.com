"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Trash2, FileText, Upload, Download, Shield, File, Loader2 } from "lucide-react"
import { useMemo, useRef, useState, useEffect } from "react"
import { getApiUrl } from "@/lib/api-config"
import { useToast } from "@/hooks/use-toast"


type DocRecord = {
  id: string
  category: string
  name: string
  description?: string
  expiry?: string | null
  fileName: string
  fileType: string
  fileSize: number
  uploadedAt: string // ISO string
  previewUrl?: string
}

function formatDate(iso?: string | null) {
  if (!iso) return "No expiry"
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return iso
  }
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "–"
  const sizes = ["Bytes", "KB", "MB", "GB"]
  if (bytes === 0) return "0 Bytes"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const val = bytes / Math.pow(1024, i)
  return `${val.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`
}

type BackendCategory = { id: number; company_id: number; name: string; slug?: string }

export default function JobSeekerDocumentPage() {
  const [isHired, setIsHired] = useState<boolean | null>(null)
  const [loadingHired, setLoadingHired] = useState<boolean>(true)
  const [categories, setCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true)
  const [category, setCategory] = useState<string>("")
  const [docName, setDocName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [expiry, setExpiry] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loadingDocuments, setLoadingDocuments] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)

  // Preview + dialogs state
  const [uploadedDocs, setUploadedDocs] = useState<DocRecord[]>([])
  const [viewOpen, setViewOpen] = useState(false)
  const [docToView, setDocToView] = useState<DocRecord | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [docToDelete, setDocToDelete] = useState<DocRecord | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [docToPreview, setDocToPreview] = useState<DocRecord | null>(null)
  const previewUrlsRef = useRef<Set<string>>(new Set())
const { toast } = useToast()


  useEffect(() => {
    // Check hire status on mount
    const checkHired = async () => {
      try {
        const jsId = typeof window !== 'undefined' ? window.localStorage.getItem('jobseeker_id') : null
        if (!jsId) {
          setIsHired(false)
          return
        }
        const res = await fetch(getApiUrl(`seeker/profile/is_hired?jobseeker_id=${encodeURIComponent(jsId)}`), { credentials: 'include' })
        const data = await res.json().catch(() => ({} as any))
        const hired = !!(data?.data?.is_hired)
        setIsHired(hired)
      } catch {
        setIsHired(false)
      } finally {
        setLoadingHired(false)
      }
    }
    checkHired()

    // Load categories for hired users
    const loadCategories = async () => {
      try {
        const ls = typeof window !== 'undefined' ? window.localStorage : null
        const jsId = ls ? ls.getItem('jobseeker_id') : null
        const empId = ls ? ls.getItem('employer_id') : null
        let query = ''
        if (empId) {
          query = `employer_id=${encodeURIComponent(empId)}`
        } else if (jsId) {
          // If only jobseeker_id is present, try to resolve hiring employers first
          const hiredRes = await fetch(getApiUrl(`seeker/profile/get_hiring_employers?jobseeker_id=${encodeURIComponent(jsId)}`), { credentials: 'include' })
          const hiredData = await hiredRes.json().catch(() => ({} as any))
          const ids = Array.isArray(hiredData?.data) ? hiredData.data : []
          if (ids.length > 0) {
            query = `employer_id=${encodeURIComponent(ids[0])}`
          } else {
            query = `jobseeker_id=${encodeURIComponent(jsId)}`
          }
        } else {
          setCategories([])
          return
        }
        const res = await fetch(getApiUrl(`seeker/profile/get_document_categories?${query}`), { credentials: 'include' })
        const data = await res.json().catch(() => ({} as any))
        const names = Array.isArray(data?.data) ? data.data.map((c: BackendCategory) => c?.name).filter((n: any) => typeof n === 'string' && n.trim() !== '') : []
        // Ensure "Other" option exists and uniqueness
        const unique = Array.from(new Set([...(names || [])])) as string[]
        if (!unique.includes('Other')) unique.push('Other')
        unique.sort((a, b) => a.localeCompare(b))
        setCategories(unique)
      } catch {
        setCategories(['Other'])
      } finally {
        setLoadingCategories(false)
      }
    }
    loadCategories()

    // Load documents if hired
    if (isHired) {
      loadDocuments()
    }

    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      previewUrlsRef.current.clear()
    }
  }, [isHired])

  const requiresCustomName = useMemo(() => category === "Other", [category])

  // Load documents from API
  const loadDocuments = async () => {
    try {
      const jsId = typeof window !== 'undefined' ? window.localStorage.getItem('jobseeker_id') : null
      if (!jsId) return

      const response = await fetch(getApiUrl(`seeker/profile/get_documents?jobseeker_id=${encodeURIComponent(jsId)}`), {
        credentials: 'include'
      })
      const result = await response.json()

      if (result.success) {
        const documents: DocRecord[] = result.data.map((doc: any) => ({
          id: doc.id.toString(),
          category: doc.category_name || doc.name,
          name: doc.name,
          description: doc.description || "",
          expiry: doc.expiry_date || null,
          fileName: doc.original_filename,
          fileType: doc.mime_type || "unknown",
          fileSize: doc.file_size || 0,
          uploadedAt: doc.created_at,
          previewUrl: doc.file_url
        }))
        setUploadedDocs(documents)
      }
    } catch (error) {
      console.error('Error loading documents:', error)
    }
  }

  function onDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const dropped = e.dataTransfer.files && e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  function onDragOver(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  function onDragLeave(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  function onChooseFile() {
    fileInputRef.current?.click()
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!category) {
      toast({
        title: "Please select a document category.",
        description: "Please select a document category to upload your document.",
        variant: "destructive",
      })
      return
    }
    if (requiresCustomName && !docName.trim()) {
      toast({
        title: "Please provide a Document Name for the 'Other' category.",
        description: "Please provide a document name for the 'Other' category to upload your document.",
        variant: "destructive",
      })
      return
    }
    if (!file) {
      toast({
        title: "Please select a file to upload.",
        description: "Please select a file to upload your document.",
        variant: "destructive",
      })
      return
    }

    const jsId = typeof window !== 'undefined' ? window.localStorage.getItem('jobseeker_id') : null
    if (!jsId) {
      toast({
        title: "Please log in to upload documents.",
        description: "Please log in to upload your document.",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('jobseeker_id', jsId)
      formData.append('category', category)
      formData.append('name', requiresCustomName ? docName.trim() : category)
      formData.append('description', description?.trim() || "")
      formData.append('expiry_date', expiry || "")
      formData.append('file', file)

      const response = await fetch(getApiUrl('seeker/profile/upload_document'), {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Document uploaded successfully.",
        })
        setCategory("")
        setDocName("")
        setDescription("")
        setExpiry("")
        setFile(null)
        // Refresh the documents list
        loadDocuments()
      } else {
        toast({
          title: "Upload failed.",
          description: `Upload failed: ${result.message}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed.",
        description: "Upload failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  if (loadingHired) {
    return (
      <main className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">Checking access…</div>
      </main>
    )
  }

  if (!isHired) {
    return (
      <main className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="rounded-xl border bg-amber-50 border-amber-200 p-6 text-center">
          <h2 className="text-lg font-semibold text-foreground">Documents are available after you are hired</h2>
          <p className="text-sm text-muted-foreground mt-2">Once an employer marks you as hired, this section will unlock.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white ">
        <div className="flex items-center space-x-3 ">
          <File className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Documents</h1>
            <p className="text-emerald-100">Upload and organize your important documents for applications and profile verification.</p>
          </div>
        </div>
      </div>
          
      {/* Upload Form */}
      <form onSubmit={onSubmit} className="rounded-xl border bg-background p-4 sm:p-5 md:p-6 mt-6 mb-6 sm:mb-8" noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Document Details Section */}
          <section aria-labelledby="document-details-title" className="space-y-4 sm:space-y-5">
            <h2 id="document-details-title" className="text-lg font-semibold text-foreground">
              Document Details
            </h2>

            <div className="space-y-2">
              <label htmlFor="doc-category" className="text-sm font-medium text-foreground">
                Document Category *
              </label>
              <select
                id="doc-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                aria-describedby="doc-category-help"
                disabled={loadingCategories}
              >
                <option value="" disabled>
                  {loadingCategories ? 'Loading categories…' : 'Select a category'}
                </option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <p id="doc-category-help" className="text-xs text-muted-foreground">
                Choose the document type. Select "Other" if it's not listed.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="doc-name" className="text-sm font-medium text-foreground">
                Document Name {requiresCustomName ? '*' : <span className="text-xs text-muted-foreground">(Optional)</span>}
              </label>
              <input
                id="doc-name"
                type="text"
                placeholder="Enter document name"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                aria-describedby="doc-name-help"
              />
              <p id="doc-name-help" className="text-xs text-muted-foreground">
                {requiresCustomName ? 'Required when category is Other.' : 'Optional; used for clarity.'}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="doc-desc" className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="doc-desc"
                placeholder="Add a short description (optional)"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-y rounded-lg border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="doc-expiry" className="text-sm font-medium text-foreground">
                Expiry Date (Optional)
              </label>
              <input
                id="doc-expiry"
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </section>

          {/* Upload Section */}
          <section aria-labelledby="upload-title" className="space-y-4 sm:space-y-5">
            <h2 id="upload-title" className="text-lg font-semibold text-foreground">
              Upload File
            </h2>

            <input
              ref={fileInputRef}
              id="file-input"
              type="file"
              className="sr-only"
              onChange={onFileChange}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.heic,.txt,.rtf,.xls,.xlsx,.csv,.ppt,.pptx,image/*,application/pdf"
            />

            <label
              htmlFor="file-input"
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={[
                "flex h-40 sm:h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 text-center transition-colors",
                dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:bg-muted/50",
              ].join(" ")}
              aria-label="Drag and drop your file here, or click to browse"
            >
              <div className="text-center">
                <Upload className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mb-2" />
                <p className="font-medium text-foreground text-sm sm:text-base">Drag and drop your file here</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">or</p>
              </div>
              <button
                type="button"
                onClick={onChooseFile}
                className="mt-2 inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
              >
                Choose file
              </button>

              {file && (
                <div className="mt-2 max-w-full px-2">
                  <p className="text-xs text-muted-foreground truncate">
                    Selected: <span className="font-medium text-foreground">{file.name}</span>
                  </p>
                </div>
              )}
            </label>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Supported formats:</strong> PDF, DOC, DOCX, Images, PPT, XLS, CSV
              </p>
              <p className="text-xs text-blue-800 mt-1">
                <strong>Max size:</strong> 10MB per file
              </p>
            </div>
          </section>
        </div>

        <div className="mt-6 sm:mt-8 flex items-center justify-end">
         {
          loadingDocuments ? (
            <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading.....
            </Button> 
          ) :  <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
          disabled={!category || (requiresCustomName && !docName.trim()) || !file || uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </>
          )}
        </button>
         }
        </div>
      </form>

      {/* Uploaded Documents Table */}
      <section aria-labelledby="uploaded-documents-title" className="rounded-xl border bg-background p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
          <div>
            <h2 id="uploaded-documents-title" className="text-lg sm:text-xl font-semibold text-foreground">
              Your Documents
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {uploadedDocs.length} document{uploadedDocs.length !== 1 ? 's' : ''} uploaded
            </p>
          </div>
          {uploadedDocs.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="sm:self-start"
              onClick={() => {
                // Download all documents as a zip (this would require backend implementation)
                toast({
                  title: "Coming Soon",
                  description: "Export functionality will be implemented in a future update.",
                })
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          )}
        </div>

        <div className="w-full overflow-x-auto -mx-2 sm:mx-0">
          <div className="min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%] sm:w-auto">File</TableHead>
                  <TableHead className="hidden xs:table-cell">Uploaded</TableHead>
                  <TableHead className="hidden sm:table-cell">Expiry</TableHead>
                  <TableHead className="text-right w-[60px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadedDocs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 sm:py-12">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <FileText className="h-12 w-12 mb-3 opacity-50" />
                        <p className="text-sm font-medium">No documents uploaded yet</p>
                        <p className="text-xs mt-1">Upload your first document using the form above</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  uploadedDocs.map((doc) => (
                    <TableRow key={doc.id} className="group hover:bg-muted/50">
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-lg bg-blue-50 border border-blue-100 flex-shrink-0">
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-foreground text-sm truncate">{doc.fileName}</div>
                            <div className="text-xs text-muted-foreground truncate mt-1">
                              <span className="font-medium">{doc.name}</span>
                              <span className="mx-1">•</span>
                              <span>{doc.category}</span>
                              <span className="mx-1 hidden sm:inline">•</span>
                              <span className="hidden sm:inline">{formatBytes(doc.fileSize)}</span>
                            </div>
                            <div className="text-xs text-muted-foreground sm:hidden mt-1">
                              {formatBytes(doc.fileSize)} • {formatDate(doc.uploadedAt)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4 hidden xs:table-cell">
                        <div className="text-sm text-foreground">{formatDate(doc.uploadedAt)}</div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4 hidden sm:table-cell">
                        <div className="text-sm text-foreground">{formatDate(doc.expiry)}</div>
                      </TableCell>
                      <TableCell className="py-3 sm:py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 sm:h-8 sm:w-8 opacity-70 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() => {
                                setDocToPreview(doc)
                                setPreviewOpen(true)
                              }}
                              className="cursor-pointer text-xs sm:text-sm"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setDocToView(doc)
                                setViewOpen(true)
                              }}
                              className="cursor-pointer text-xs sm:text-sm"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer text-xs sm:text-sm"
                              onClick={() => {
                                setDocToDelete(doc)
                                setDeleteOpen(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* View Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-md sm:max-w-lg md:max-w-2xl mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Document Details</DialogTitle>
            <DialogDescription>Full information about the selected document</DialogDescription>
          </DialogHeader>

          {docToView ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div className="sm:col-span-2">
                <div className="text-muted-foreground text-xs font-medium mb-1">File Name</div>
                <div className="font-medium text-foreground text-sm p-2 bg-muted rounded-lg break-words">
                  {docToView.fileName}
                </div>
              </div>
              
              <div>
                <div className="text-muted-foreground text-xs font-medium mb-1">Document Name</div>
                <div className="font-medium text-foreground text-sm p-2 bg-muted rounded-lg">{docToView.name}</div>
              </div>
              
              <div>
                <div className="text-muted-foreground text-xs font-medium mb-1">Category</div>
                <div className="font-medium text-foreground text-sm p-2 bg-muted rounded-lg">{docToView.category}</div>
              </div>
              
              <div className="sm:col-span-2">
                <div className="text-muted-foreground text-xs font-medium mb-1">Description</div>
                <div className="font-medium text-foreground text-sm p-2 bg-muted rounded-lg min-h-[60px]">
                  {docToView.description || "No description provided"}
                </div>
              </div>
              
              <div>
                <div className="text-muted-foreground text-xs font-medium mb-1">File Type</div>
                <div className="font-medium text-foreground text-sm p-2 bg-muted rounded-lg">{docToView.fileType || "Unknown"}</div>
              </div>
              
              <div>
                <div className="text-muted-foreground text-xs font-medium mb-1">File Size</div>
                <div className="font-medium text-foreground text-sm p-2 bg-muted rounded-lg">{formatBytes(docToView.fileSize)}</div>
              </div>
              
              <div>
                <div className="text-muted-foreground text-xs font-medium mb-1">Uploaded On</div>
                <div className="font-medium text-foreground text-sm p-2 bg-muted rounded-lg">{formatDate(docToView.uploadedAt)}</div>
              </div>
              
              <div>
                <div className="text-muted-foreground text-xs font-medium mb-1">Expiry Date</div>
                <div className="font-medium text-foreground text-sm p-2 bg-muted rounded-lg">{formatDate(docToView.expiry)}</div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Preview Document Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg sm:max-w-2xl md:max-w-3xl mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Preview Document</DialogTitle>
            <DialogDescription className="text-sm">{docToPreview?.fileName || "Document preview"}</DialogDescription>
          </DialogHeader>

          {docToPreview?.previewUrl ? (
            <div className="space-y-3">
              {docToPreview.fileType?.startsWith("image/") ? (
                <div className="w-full max-h-[50vh] sm:max-h-[60vh] overflow-auto">
                  <img
                    src={docToPreview.previewUrl}
                    alt={docToPreview.fileName}
                    className="max-w-full h-auto mx-auto rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  <div className="hidden text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-3">Image preview not available</p>
                    <a
                      href={docToPreview.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      Open in new tab
                    </a>
                  </div>
                </div>
              ) : docToPreview.fileType === "application/pdf" ? (
                <iframe 
                  title="PDF Preview" 
                  src={docToPreview.previewUrl} 
                  className="w-full h-[50vh] sm:h-[60vh] rounded border" 
                />
              ) : (
                <div className="rounded border p-4 text-sm text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-3">
                    Preview is limited for this file type. You can open it in a new tab:
                  </p>
                  <a
                    href={docToPreview.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    Open in new tab
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              Preview is not available for this document.
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="max-w-md mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">Delete Document?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This will permanently remove{" "}
              <span className="font-medium text-foreground">{docToDelete?.fileName || "this file"}</span> from your
              documents. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0 flex-1 sm:flex-none">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 flex-1 sm:flex-none"
              disabled={deleting}
              onClick={async () => {
                if (docToDelete) {
                  try {
                    setDeleting(true)
                    const jsId = typeof window !== 'undefined' ? window.localStorage.getItem('jobseeker_id') : null
                    if (!jsId) {
                      toast({
                        title: "Authentication required",
                        description: "Please log in to delete documents.",
                        variant: "destructive",
                      })
                      return
                    }

                    const response = await fetch(getApiUrl('seeker/profile/delete_document'), {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        jobseeker_id: jsId,
                        document_id: docToDelete.id
                      }),
                      credentials: 'include'
                    })

                    const result = await response.json()

                    if (result.success) {
                      // Remove from local state
                      setUploadedDocs((prev) => prev.filter((d) => d.id !== docToDelete.id))
                      toast({
                        title: "Success",
                        description: "Document deleted successfully.",
                      })
                    } else {
                      toast({
                        title: "Delete failed",
                        description: result.message || "Failed to delete document.",
                        variant: "destructive",
                      })
                    }
                  } catch (error) {
                    console.error('Delete error:', error)
                    toast({
                      title: "Delete failed",
                      description: "Delete failed. Please try again.",
                      variant: "destructive",
                    })
                  } finally {
                    setDeleting(false)
                  }
                }
                setDocToDelete(null)
                setDeleteOpen(false)
              }}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Document"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}