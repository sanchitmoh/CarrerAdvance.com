"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus, Edit, Trash2, Eye, Calendar, User, TrendingUp, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function BlogsPage() {
  const [activeTab, setActiveTab] = useState("published")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Sample blog data
  const [blogs] = useState([
    {
      id: 1,
      title: "Top 10 Interview Questions for Software Engineers",
      category: "Interview Tips",
      status: "published",
      author: "John Doe",
      publishDate: "2024-01-15",
      views: 1250,
      likes: 45,
      excerpt: "Essential questions every software engineer should be prepared to answer during technical interviews.",
    },
    {
      id: 2,
      title: "Remote Work Best Practices for Tech Teams",
      category: "Remote Work",
      status: "published",
      author: "Jane Smith",
      publishDate: "2024-01-12",
      views: 890,
      likes: 32,
      excerpt: "How to maintain productivity and team cohesion in a remote work environment.",
    },
    {
      id: 3,
      title: "Building a Strong Company Culture",
      category: "Company Culture",
      status: "draft",
      author: "John Doe",
      publishDate: "",
      views: 0,
      likes: 0,
      excerpt: "Strategies for creating and maintaining a positive workplace culture that attracts top talent.",
    },
  ])

  const [categories] = useState([
    "Interview Tips",
    "Remote Work",
    "Company Culture",
    "Career Development",
    "Technology Trends",
    "Recruitment",
  ])

  const [newBlog, setNewBlog] = useState({
    title: "",
    category: "",
    content: "",
    excerpt: "",
    tags: "",
    status: "draft",
  })

  const handleInputChange = (field: string, value: string) => {
    setNewBlog((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateBlog = () => {
    console.log("Creating blog:", newBlog)
    setIsDialogOpen(false)
    // Reset form
    setNewBlog({
      title: "",
      category: "",
      content: "",
      excerpt: "",
      tags: "",
      status: "draft",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filterBlogs = (status: string) => {
    return blogs.filter((blog) => blog.status === status)
  }

  // Fixed filter function with proper null checks
  const filteredBlogs = (status?: string) => {
    return blogs.filter((blog) => {
      const title = blog?.title || ""
      const category = blog?.category || ""
      const author = blog?.author || ""
      const blogStatus = blog?.status || ""

      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        author.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = status ? blogStatus === status : true

      return matchesSearch && matchesStatus
    })
  }

  const BlogCard = ({ blog }: { blog: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{blog.excerpt}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {blog.author}
              </span>
              {blog.publishDate && (
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(blog.publishDate).toLocaleDateString()}
                </span>
              )}
              <Badge variant="outline" className="text-xs">
                {blog.category}
              </Badge>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(blog.status)}>
            {blog.status}
          </Badge>
        </div>

        {blog.status === "published" && (
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {blog.views} views
            </span>
            <span className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {blog.likes} likes
            </span>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 bg-transparent"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent">
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600">Create and manage your company blog posts</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newBlog.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter blog post title"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newBlog.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={newBlog.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  placeholder="Brief description of the blog post"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newBlog.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Write your blog post content here..."
                  rows={12}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={newBlog.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder="Enter tags separated by commas"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={newBlog.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateBlog}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                >
                  Create Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
                <p className="text-sm text-gray-600">Total Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{filterBlogs("published").length}</p>
                <p className="text-sm text-gray-600">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{filterBlogs("draft").length}</p>
                <p className="text-sm text-gray-600">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{blogs.reduce((sum, blog) => sum + blog.views, 0)}</p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="published">Published ({filterBlogs("published").length})</TabsTrigger>
          <TabsTrigger value="draft">Drafts ({filterBlogs("draft").length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({filterBlogs("archived").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBlogs("published").map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
          {filteredBlogs("published").length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No published posts yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBlogs("draft").map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
          {filteredBlogs("draft").length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Edit className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No draft posts</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBlogs("archived").map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
          {filteredBlogs("archived").length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No archived posts</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
