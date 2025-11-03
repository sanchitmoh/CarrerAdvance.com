"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BackButton from "@/components/back-button"
import { Plus, Search, FileText, Eye, PenSquare, Wand2, Trash2 } from "lucide-react"
import Image from "next/image"

interface BlogFormData {
  id?: number
  title: string
  excerpt: string
  category: string
  tags: string
  content: string
  featuredImage: File | null
}

export default function AdminBlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [blogs, setBlogs] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewBlog, setViewBlog] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<any>(null)
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    excerpt: "",
    category: "",
    tags: "",
    content: "",
    featuredImage: null,
  })
  const [fileName, setFileName] = useState("")

  const publishedCount = blogs.filter((b) => b.status === "published").length
  const draftsCount = blogs.filter((b) => b.status === "draft").length

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "published" && blog.status === "published") ||
      (activeTab === "draft" && blog.status === "draft")
    return matchesSearch && matchesTab
  })

  const handleFormChange = (field: keyof BlogFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setFormData((prev) => ({
        ...prev,
        featuredImage: file,
      }))
    }
  }

  const handlePublishPost = () => {
    const imageUrl = formData.featuredImage ? URL.createObjectURL(formData.featuredImage) : null

    const newBlog = {
      id: Date.now(),
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      status: "published",
      author: "Admin",
      date: new Date().toLocaleDateString(),
      imageUrl, // Store image URL
    }
    setBlogs((prev) => [newBlog, ...prev])
    resetForm()
    setIsDialogOpen(false)
  }

  const handleSaveDraft = () => {
    const imageUrl = formData.featuredImage ? URL.createObjectURL(formData.featuredImage) : null

    const newBlog = {
      id: Date.now(),
      title: formData.title || "Untitled Draft",
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      status: "draft",
      author: "Admin",
      date: new Date().toLocaleDateString(),
      imageUrl, // Store image URL
    }
    setBlogs((prev) => [newBlog, ...prev])
    resetForm()
    setIsDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      category: "",
      tags: "",
      content: "",
      featuredImage: null,
    })
    setFileName("")
  }

  const handleCancel = () => {
    resetForm()
    setIsDialogOpen(false)
  }

  const handleDeleteBlog = (id: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      setBlogs((prev) => prev.filter((blog) => blog.id !== id))
    }
  }

  const handleViewBlog = (blog: any) => {
    setViewBlog(blog)
    setIsViewDialogOpen(true)
  }

  const handleEditBlog = (blog: any) => {
    setEditingBlog(blog)
    setFormData({
      id: blog.id,
      title: blog.title,
      excerpt: blog.excerpt,
      category: blog.category,
      tags: blog.tags.join(", "),
      content: blog.content,
      featuredImage: null,
    })
    setFileName("")
    setIsEditDialogOpen(true)
  }

  const handleUpdatePost = () => {
    const imageUrl = formData.featuredImage ? URL.createObjectURL(formData.featuredImage) : editingBlog.imageUrl

    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === editingBlog.id
          ? {
              ...blog,
              title: formData.title,
              excerpt: formData.excerpt,
              content: formData.content,
              category: formData.category,
              tags: formData.tags.split(",").map((tag) => tag.trim()),
              imageUrl, // Update image URL
            }
          : blog,
      ),
    )
    resetForm()
    setIsEditDialogOpen(false)
    setEditingBlog(null)
  }

  const handlePublishDraft = () => {
    const imageUrl = formData.featuredImage ? URL.createObjectURL(formData.featuredImage) : editingBlog.imageUrl

    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === editingBlog.id
          ? {
              ...blog,
              title: formData.title,
              excerpt: formData.excerpt,
              content: formData.content,
              category: formData.category,
              tags: formData.tags.split(",").map((tag) => tag.trim()),
              status: "published",
              imageUrl, // Update image URL
            }
          : blog,
      ),
    )
    resetForm()
    setIsEditDialogOpen(false)
    setEditingBlog(null)
  }

  const handleCancelEdit = () => {
    resetForm()
    setIsEditDialogOpen(false)
    setEditingBlog(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 sm:p-8 text-white shadow-lg">
          <BackButton />
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Blog Management</h1>
              <p className="text-emerald-50">Create and manage your blog content</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg w-fit">
              <FileText className="w-5 h-5" />
              <span className="font-semibold">{publishedCount} Published</span>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto gap-2 sm:gap-0 sm:bg-gray-200 p-1">
            <TabsTrigger value="all" className="text-sm sm:text-base">
              📋 All
            </TabsTrigger>
            <TabsTrigger value="published" className="text-sm sm:text-base">
              👁️ Published ({publishedCount})
            </TabsTrigger>
            <TabsTrigger value="draft" className="text-sm sm:text-base">
              ✏️ Drafts ({draftsCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and New Post Section */}
        <Card className="shadow-md border-0">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-2 text-sm"
                />
              </div>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                <Plus className="w-5 h-5" />
                New Post
              </Button>
            </div>
          </div>
        </Card>

        {/* Content Area */}
        {filteredBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <FileText className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No blog posts found</h3>
            <p className="text-sm sm:text-base text-gray-500 text-center px-4">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                {blog.imageUrl && (
                  <div className="relative w-full h-48 bg-gray-200">
                    <Image src={blog.imageUrl || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
                  </div>
                )}

                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">{blog.title}</h3>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          blog.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {blog.status === "published" ? "Published" : "Draft"}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{blog.excerpt}</p>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {blog.tags.slice(0, 2).map((tag: string, idx: number) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 2 && (
                          <span className="text-xs text-gray-500 px-2 py-1">+{blog.tags.length - 2} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mb-4 mt-auto">
                    <span>By {blog.author}</span>
                    <span className="mx-2">•</span>
                    <span>{blog.date}</span>
                  </div>

                  {/* View, Edit, and Delete buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => handleViewBlog(blog)}
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 bg-transparent border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    <Button
                      onClick={() => handleEditBlog(blog)}
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 bg-transparent border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <PenSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      onClick={() => handleDeleteBlog(blog.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 bg-transparent border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* View Blog Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">{viewBlog?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {viewBlog?.imageUrl && (
              <div className="relative w-full h-64 sm:h-80 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={viewBlog.imageUrl || "/placeholder.svg"}
                  alt={viewBlog.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Category</p>
              <p className="text-gray-900">{viewBlog?.category || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Excerpt</p>
              <p className="text-gray-700">{viewBlog?.excerpt}</p>
            </div>

            {viewBlog?.tags && viewBlog.tags.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {viewBlog.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Content</p>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{viewBlog?.content}</p>
              </div>
            </div>

            <div className="text-xs text-gray-500 pt-4 border-t">
              <span>Published by {viewBlog?.author}</span>
              <span className="mx-2">•</span>
              <span>{viewBlog?.date}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Blog Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <Plus className="w-5 h-5" />
              Create New Blog Post
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            {/* Blog Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter blog post title"
                value={formData.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Brief description of the blog post"
                value={formData.excerpt}
                onChange={(e) => handleFormChange("excerpt", e.target.value)}
                className="w-full min-h-24 resize-none"
              />
            </div>

            {/* Category and AI Generate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <Select value={formData.category} onValueChange={(value) => handleFormChange("category", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="career">Career</SelectItem>
                    <SelectItem value="tips">Tips & Tricks</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 gap-2 bg-transparent"
                >
                  <Wand2 className="w-4 h-4" />
                  Generate with AI
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Tags</label>
              <Input
                placeholder="Enter tags separated by commas"
                value={formData.tags}
                onChange={(e) => handleFormChange("tags", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Featured Image</label>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" className="w-full sm:w-auto bg-transparent">
                  <label className="cursor-pointer flex items-center gap-2">
                    Choose File
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </Button>
                <span className="text-sm text-gray-500">{fileName || "No file chosen"}</span>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Write your blog post content here..."
                value={formData.content}
                onChange={(e) => handleFormChange("content", e.target.value)}
                className="w-full min-h-32 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button onClick={handlePublishPost} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Publish Post
              </Button>
              <Button
                onClick={handleSaveDraft}
                variant="outline"
                className="w-full border-amber-500 text-amber-600 hover:bg-amber-50 bg-transparent"
              >
                Save as Draft
              </Button>
              <Button onClick={handleCancel} variant="ghost" className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Blog Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <PenSquare className="w-5 h-5" />
              Edit Blog Post
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            {/* Blog Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter blog post title"
                value={formData.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Brief description of the blog post"
                value={formData.excerpt}
                onChange={(e) => handleFormChange("excerpt", e.target.value)}
                className="w-full min-h-24 resize-none"
              />
            </div>

            {/* Category and AI Generate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <Select value={formData.category} onValueChange={(value) => handleFormChange("category", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="career">Career</SelectItem>
                    <SelectItem value="tips">Tips & Tricks</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 gap-2 bg-transparent"
                >
                  <Wand2 className="w-4 h-4" />
                  Generate with AI
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Tags</label>
              <Input
                placeholder="Enter tags separated by commas"
                value={formData.tags}
                onChange={(e) => handleFormChange("tags", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Featured Image</label>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" className="w-full sm:w-auto bg-transparent">
                  <label className="cursor-pointer flex items-center gap-2">
                    Choose File
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </Button>
                <span className="text-sm text-gray-500">{fileName || "No file chosen"}</span>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Write your blog post content here..."
                value={formData.content}
                onChange={(e) => handleFormChange("content", e.target.value)}
                className="w-full min-h-32 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              {editingBlog?.status === "draft" && (
                <Button onClick={handlePublishDraft} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Publish Post
                </Button>
              )}
              <Button onClick={handleUpdatePost} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Update Post
              </Button>
              <Button onClick={handleCancelEdit} variant="ghost" className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}