"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, FileText, Search, Edit, Trash2, Calendar, Eye, User, Tag } from "lucide-react"
import BackButton from "@/components/back-button"
import { blogsApiService, type EmployerBlogPost } from "@/lib/blogs-api"
import { useToast } from "@/hooks/use-toast"

interface BlogPostUI {
  id: number
  title: string
  content: string
  excerpt: string
  author: string
  category: string
  categoryId?: number
  status: "draft" | "published" | "archived"
  publishDate: string
  tags: string[]
  views: number
}

export default function BlogsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddingPost, setIsAddingPost] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPostUI | null>(null)
  const [previewingPost, setPreviewingPost] = useState<BlogPostUI | null>(null)

  const [blogPosts, setBlogPosts] = useState<BlogPostUI[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string>("")
  const [categoriesList, setCategoriesList] = useState<{ id: number; name: string }[]>([])

  const loadBlogs = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await blogsApiService.getEmployerBlogs()
        const cats = await blogsApiService.getCategories()
        if (cats.success) {
          setCategoriesList(cats.data || [])
        }
        if (res.success) {
          const mapped: BlogPostUI[] = (res.data || []).map((b: EmployerBlogPost) => ({
            id: Number(b.id),
            title: b.title || "",
            content: b.content || "",
            excerpt: (b as any).excerpt || "",
            author: b.author_name || (b as any).company_name || "",
            category: b.category_name || "",
            categoryId: (b as any).category_id ? Number((b as any).category_id) : undefined,
            status: (b.status as any) || "draft",
            publishDate: (b.published_at || b.created_at || new Date().toISOString()).split("T")[0],
            tags: (b as any).tags || [],
            views: Number(b.views_count || 0),
          }))
          setBlogPosts(mapped)
        } else {
          setBlogPosts([])
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load blogs")
        toast({
          title: "Error Loading Blogs",
          description: e?.message || "Failed to load blogs",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
  }

  useEffect(() => {
    loadBlogs()
  }, [])

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    categoryId: "" as string | number,
    tags: "",
    imageFile: null as File | null,
  })

  const categories = categoriesList

  const handleInputChange = (field: string, value: string) => {
    if (editingPost) {
      if (field === "tags") {
        const arr = value
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
        setEditingPost({ ...editingPost, tags: arr })
        return
      }
      if (field === "categoryId") {
        const idNum = value ? Number(value) : undefined
        const catName = idNum ? (categories.find((c) => c.id === idNum)?.name || "") : ""
        setEditingPost({ ...editingPost, categoryId: idNum, category: catName })
        return
      }
      setEditingPost({ ...editingPost, [field]: value })
    } else {
      setNewPost((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleAddPost = async (status: "draft" | "published") => {
    try {
      setCreating(true)
      setError("")
      const tags = newPost.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t)
        .join(",")
      const categoryId = newPost.categoryId ? Number(newPost.categoryId) : undefined
      const res = await blogsApiService.createBlog({
        title: newPost.title,
        content: newPost.content,
        excerpt: newPost.excerpt,
        summary: newPost.excerpt,
        keywords: "",
        category_id: categoryId as any,
        status,
        tags,
      })
      if (!res.success) throw new Error(res.message || "Create failed")
      await loadBlogs()
      setNewPost({ title: "", content: "", excerpt: "", categoryId: "", tags: "", imageFile: null })
      setIsAddingPost(false)
      toast({
        title: "Blog Post Created",
        description: `Blog post "${newPost.title}" has been ${status === "published" ? "published" : "saved as draft"} successfully.`,
        variant: "default",
      })
    } catch (e) {
      const errorMessage = (e as any)?.message || "Failed to create blog"
      setError(errorMessage)
      toast({
        title: "Creation Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const handleUpdatePost = async (data: BlogPostUI, imageFile?: File | null) => {
    try {
      setUpdating(true)
      setError("") // Clear any previous errors
      
      // Automatically set status to "published" when updating from draft
      const updatedStatus = data.status === "draft" ? "published" : data.status
      
      console.log('Updating blog post:', {
        id: data.id,
        title: data.title,
        status: updatedStatus,
        categoryId: data.categoryId,
        hasImageFile: !!imageFile
      })
      
      const res = await blogsApiService.updateBlog(data.id, {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        summary: data.excerpt,
        keywords: "",
        category_id: data.categoryId as any,
        status: updatedStatus,
        tags: data.tags.join(","),
        imageFile: imageFile || null,
      })
      
      console.log('Update response:', res)
      
      if (!res.success) {
        throw new Error(res.message || "Update failed")
      }
      
      await loadBlogs()
      setEditingPost(null)
      toast({
        title: "Blog Post Updated",
        description: `Blog post "${data.title}" has been updated successfully.`,
        variant: "default",
      })
    } catch (e) {
      console.error('Update error:', e)
      const errorMessage = (e as any)?.message || "Failed to update blog"
      setError(errorMessage)
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleDeletePost = async (id: number) => {
    const post = blogPosts.find(p => p.id === id)
    const confirmDelete = confirm(`Are you sure you want to delete "${post?.title || 'this blog post'}"? This action cannot be undone.`)
    if (!confirmDelete) return

    try {
      setDeleting(true)
      setError("")
      const res = await blogsApiService.deleteBlog(id)
      if (!res.success) throw new Error(res.message || "Delete failed")
      await loadBlogs()
      toast({
        title: "Blog Post Deleted",
        description: `Blog post "${post?.title || 'Unknown'}" has been deleted successfully.`,
        variant: "default",
      })
    } catch (e) {
      const errorMessage = (e as any)?.message || "Failed to delete blog"
      setError(errorMessage)
      toast({
        title: "Delete Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    const matchesTab = activeTab === "all" || post.status === activeTab

    return matchesSearch && matchesStatus && matchesTab
  })

  const publishedPosts = useMemo(() => blogPosts.filter((post) => post.status === "published"), [blogPosts])
  const draftPosts = useMemo(() => blogPosts.filter((post) => post.status === "draft"), [blogPosts])

  const BlogCard = ({ post }: { post: BlogPostUI }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge
                  variant={post.status === "published" ? "default" : post.status === "draft" ? "secondary" : "outline"}
                  className={
                    post.status === "published"
                      ? "bg-green-100 text-green-800"
                      : post.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }
                >
                  {post.status}
                </Badge>
                <Badge variant="outline" className="text-emerald-600 border-emerald-200 text-xs">
                  {post.category}
                </Badge>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base break-words">
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 break-words">{post.excerpt}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 2).map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Tag className="h-2 w-2 mr-1" />
                <span className="truncate max-w-16 sm:max-w-none">{tag}</span>
              </Badge>
            ))}
            {post.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 2}
              </Badge>
            )}
          </div>

          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 text-xs text-gray-500">
            <div className="flex flex-wrap items-center gap-2 xs:gap-4">
              <span className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                <span className="truncate max-w-20 sm:max-w-none">{post.author}</span>
              </span>
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span className="hidden xs:inline">{new Date(post.publishDate).toLocaleDateString("en-US")}</span>
                <span className="xs:hidden">
                  {new Date(post.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </span>
            </div>
            {post.status === "published" && (
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                <span>{post.views} views</span>
              </div>
            )}
          </div>

          <div className="flex flex-col xs:flex-row justify-end gap-2 xs:space-x-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewingPost(post)}
              className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 bg-transparent text-xs sm:text-sm"
            >
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingPost(post)
              }}
              className="text-blue-600 border-blue-600 hover:bg-blue-50 text-xs sm:text-sm"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeletePost(post.id)}
              className="text-red-600 border-red-600 hover:bg-red-50 text-xs sm:text-sm"
              disabled={deleting}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const CreatePostForm = ({
    onCancel,
    categories,
  }: {
    onCancel: () => void
    categories: { id: number; name: string }[]
  }) => {
    const [title, setTitle] = useState("")
    const [excerpt, setExcerpt] = useState("")
    const [category, setCategory] = useState("")
    const [tagsInput, setTagsInput] = useState("")
    const [content, setContent] = useState("")
    const [aiLoading, setAiLoading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)

    const parseTags = (val: string) =>
      val
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

    const handleSubmit = async (status: "draft" | "published") => {
      try {
        setCreating(true)
        setError("")
        const tags = tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
          .join(",")
        
        const selectedCategory = categories.find(c => c.name === category)
        const categoryId = selectedCategory ? selectedCategory.id : undefined

        const res = await blogsApiService.createBlog({
          title: title,
          content: content,
          excerpt: excerpt,
          summary: excerpt,
          keywords: "",
          category_id: categoryId as any,
          status,
          tags,
          imageFile: imageFile,
        })
        
        if (!res.success) throw new Error(res.message || "Create failed")
        await loadBlogs()
        setTitle("")
        setExcerpt("")
        setCategory("")
        setTagsInput("")
        setContent("")
        setImageFile(null)
        onCancel()
        toast({
          title: "Blog Post Created",
          description: `Blog post "${title}" has been ${status === "published" ? "published" : "saved as draft"} successfully.`,
          variant: "default",
        })
      } catch (e) {
        const errorMessage = (e as any)?.message || "Failed to create blog"
        setError(errorMessage)
        toast({
          title: "Creation Failed",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setCreating(false)
      }
    }

    const handleAIGenerate = async () => {
      if (!title || !category) {
        alert('Please enter a title and select a category before generating.')
        return
      }
      try {
        setAiLoading(true)
        const res = await blogsApiService.aiGenerateContent({ title, category })
        const ai = res && (res as any).data ? (res as any).data : undefined
        if (res.success && ai) {
          setContent(ai.content)
          setExcerpt(ai.excerpt)
        } else {
          alert(res?.message || 'AI generation failed')
        }
      } catch (e: any) {
        alert(e?.message || 'AI generation error')
      } finally {
        setAiLoading(false)
      }
    }

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Blog Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoComplete="off"
              placeholder="Enter blog post title"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              autoComplete="off"
              placeholder="Brief description of the blog post"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={(v) => setCategory(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleAIGenerate}
                disabled={aiLoading}
                className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              >
                Generate with AI
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              autoComplete="off"
              placeholder="Enter tags separated by commas"
            />
          </div>

          <div>
            <Label htmlFor="image">Featured Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0] ? e.target.files[0] : null
                setImageFile(file)
              }}
            />
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autoComplete="off"
              placeholder="Write your blog post content here..."
            />
          </div>
        </div>

        <div className="flex flex-col xs:flex-row justify-end gap-2 xs:space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="order-3 xs:order-1"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit("draft")}
            className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 order-2"
            disabled={creating}
          >
            {creating ? "Saving..." : "Save as Draft"}
          </Button>
          <Button
            onClick={() => handleSubmit("published")}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 order-1 xs:order-3"
            disabled={creating}
          >
            {creating ? "Publishing..." : "Publish Post"}
          </Button>
        </div>
      </div>
    )
  }

  const EditPostForm = ({
    onCancel,
    onSubmit,
    categories,
    post,
  }: {
    onCancel: () => void
    onSubmit: (data: BlogPostUI, imageFile?: File | null) => void
    categories: { id: number; name: string }[]
    post: BlogPostUI
  }) => {
    const [title, setTitle] = useState(post.title)
    const [excerpt, setExcerpt] = useState(post.excerpt)
    const [category, setCategory] = useState(post.category)
    const [tagsInput, setTagsInput] = useState(post.tags.join(", "))
    const [content, setContent] = useState(post.content)
    const [aiLoading, setAiLoading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)

    const parseTags = (val: string) =>
      val
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

    const handleAIGenerate = async () => {
      if (!title || !category) {
        alert('Please enter a title and select a category before generating.')
        return
      }
      try {
        setAiLoading(true)
        const res = await blogsApiService.aiGenerateContent({ title, category })
        const ai = res && (res as any).data ? (res as any).data : undefined
        if (res.success && ai) {
          setContent(ai.content)
          setExcerpt(ai.excerpt)
        } else {
          alert(res?.message || 'AI generation failed')
        }
      } catch (e: any) {
        alert(e?.message || 'AI generation error')
      } finally {
        setAiLoading(false)
      }
    }

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Blog Title *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoComplete="off"
              placeholder="Enter blog post title"
            />
          </div>

          <div>
            <Label htmlFor="edit-excerpt">Excerpt *</Label>
            <Textarea
              id="edit-excerpt"
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              autoComplete="off"
              placeholder="Brief description of the blog post"
            />
          </div>

          <div>
            <Label htmlFor="edit-category">Category *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleAIGenerate}
              disabled={aiLoading}
              className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50"
            >
              Generate with AI
            </Button>
          </div>

          <div>
            <Label htmlFor="edit-tags">Tags</Label>
            <Input
              id="edit-tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              autoComplete="off"
              placeholder="Enter tags separated by commas"
            />
          </div>

          <div>
            <Label htmlFor="edit-image">Featured Image</Label>
            <Input
              id="edit-image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0] ? e.target.files[0] : null
                setImageFile(file)
              }}
            />
          </div>

          <div>
            <Label htmlFor="edit-content">Content *</Label>
            <Textarea
              id="edit-content"
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autoComplete="off"
              placeholder="Write your blog post content here..."
            />
          </div>
        </div>

        <div className="flex flex-col xs:flex-row justify-end gap-2 xs:space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="order-3 xs:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              const selectedCategory = categories.find(c => c.name === category)
              const categoryId = selectedCategory ? selectedCategory.id : post.categoryId
              const updatedPost: BlogPostUI = {
                ...post,
                title,
                excerpt,
                category,
                categoryId,
                tags: parseTags(tagsInput),
                content,
                // Keep the original status - it will be automatically changed to published in handleUpdatePost
                status: post.status,
              }
              onSubmit(updatedPost, imageFile)
            }}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 order-1 xs:order-3"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Post"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div>
          <BackButton />
          <h1 className="text-2xl font-bold text-white">Blog Management</h1>
          <p className="text-white">Create and manage your blog content</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-white">
            <FileText className="h-4 w-4" />
            <span>{publishedPosts.length} Published</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-800">
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading Overlay */}
      {loading && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-blue-800">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="font-medium">Loading blogs...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 gap-1 h-auto p-1">
          <TabsTrigger
            value="all"
            className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 py-2"
          >
            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">All</span>
            <span className="xs:hidden">All</span>
          </TabsTrigger>
          <TabsTrigger
            value="published"
            className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 py-2"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Published ({publishedPosts.length})</span>
            <span className="sm:hidden">Pub ({publishedPosts.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 py-2"
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Drafts ({draftPosts.length})</span>
            <span className="sm:hidden">Draft ({draftPosts.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Search and Filter Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center space-y-2 xs:space-y-0 xs:space-x-2 sm:space-x-4">
               
                <Button
                  onClick={() => setIsAddingPost(true)}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 w-full xs:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="sm:hidden">New</span>
                  <span className="hidden sm:inline">New Post</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Post Form */}
        {isAddingPost && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-emerald-600" />
                <span>Create New Blog Post</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CreatePostForm
                categories={categories}
                onCancel={() => setIsAddingPost(false)}
              />
            </CardContent>
          </Card>
        )}

        {/* Edit Post Dialog */}
        <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5 text-emerald-600" />
                <span>Edit Blog Post</span>
              </DialogTitle>
            </DialogHeader>
            {editingPost && (
              <EditPostForm
                categories={categories}
                onCancel={() => {
                  setEditingPost(null)
                }}
                onSubmit={(data, img) => handleUpdatePost(data, img)}
                post={editingPost}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Blog Preview Dialog */}
        <Dialog open={!!previewingPost} onOpenChange={() => setPreviewingPost(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-emerald-600" />
                <span>Blog Preview</span>
              </DialogTitle>
            </DialogHeader>
            {previewingPost && (
              <div className="space-y-6">
                {/* Blog Header */}
                <div className="space-y-4 border-b pb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        previewingPost.status === "published"
                          ? "default"
                          : previewingPost.status === "draft"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        previewingPost.status === "published"
                          ? "bg-green-100 text-green-800"
                          : previewingPost.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }
                    >
                      {previewingPost.status}
                    </Badge>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                      {previewingPost.category}
                    </Badge>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{previewingPost.title}</h1>

                  <p className="text-lg text-gray-600 leading-relaxed">{previewingPost.excerpt}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>By {previewingPost.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(previewingPost.publishDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {previewingPost.status === "published" && (
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        <span>{previewingPost.views} views</span>
                      </div>
                    )}
                  </div>

                  {previewingPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {previewingPost.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Blog Content */}
                <div className="prose prose-gray max-w-none">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{previewingPost.content}</div>
                </div>

                {/* Preview Footer */}
                <div className="flex justify-end pt-6 border-t">
                  <Button variant="outline" onClick={() => setPreviewingPost(null)}>
                    Close Preview
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* All Posts Tab */}
        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          {filteredPosts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No blog posts found</p>
              <p className="mb-4 text-sm sm:text-base px-4">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </TabsContent>

        {/* Published Posts Tab */}
        <TabsContent value="published" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {publishedPosts
              .filter((post) => {
                const matchesSearch =
                  post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  post.category.toLowerCase().includes(searchTerm.toLowerCase())
                return matchesSearch
              })
              .map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>

        {/* Draft Posts Tab */}
        <TabsContent value="draft" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {draftPosts
              .filter((post) => {
                const matchesSearch =
                  post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  post.category.toLowerCase().includes(searchTerm.toLowerCase())
                return matchesSearch
              })
              .map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
          </div>
          {draftPosts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Edit className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No draft posts</p>
              <p className="mb-4 text-sm sm:text-base px-4">Create your first draft to get started</p>
            </div>
          )}
        </TabsContent>

      </Tabs>
    </div>
  )
}