"use client"

import { useState, useEffect } from "react"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Eye, CheckCircle, XCircle, Clock, Flag, MessageSquare, User, BookOpen, Star, Calendar, DollarSign } from "lucide-react"
import { getBackendUrl } from "@/lib/api-config"

// Interface for course data from ew_courses table
interface Course {
  id: number
  name: string
  title: string
  price: number
  sales_price: number
  is_free: number
  total_free_class: number
  total_class: number
  per_class_time: number
  image: string
  description: string
  full_description: string
  course_level: string
  level: string
  status: number
  is_published: number
  is_under_review: number
  is_rejected: number
  meta_key: string
  meta_description: string
  created_date: string
  updated_date: string
  duration: string
}

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = getBackendUrl(`/index.php/api${endpoint}`)
  
  const defaultOptions: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
  }
  
  const mergedOptions = { ...defaultOptions, ...options }
  
  try {
    const response = await fetch(url, mergedOptions)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Static data removed - now using real data from backend

export default function ModerationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewComment, setReviewComment] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [reviewHistory, setReviewHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [stats, setStats] = useState({ under_review: 0, rejected: 0, published: 0, total: 0 })
  const [courseReviewComments, setCourseReviewComments] = useState<{[key: number]: any[]}>({})
  const { toast } = useToast()

  // Fetch review comments for a specific course
  const fetchReviewComments = async (courseId: number) => {
    try {
      const response = await apiRequest(`/courses/review-history/${courseId}`)
      setCourseReviewComments(prev => ({
        ...prev,
        [courseId]: response.data || []
      }))
    } catch (err) {
      console.error('Error fetching review comments:', err)
    }
  }

  // Fetch courses data and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [coursesResponse, statsResponse] = await Promise.all([
          apiRequest('/courses/list'),
          apiRequest('/courses/stats')
        ])
        setCourses(coursesResponse.data || [])
        setStats(statsResponse.data || { under_review: 0, rejected: 0, published: 0, total: 0 })
        
        // Fetch review comments for approved/rejected courses
        const courses = coursesResponse.data || []
        const approvedOrRejectedCourses = courses.filter((course: Course) => 
          (course.is_published === 1 || course.is_published === "1") || 
          (course.is_rejected === 1 || course.is_rejected === "1")
        )
        
        // Fetch review comments for each approved/rejected course
        for (const course of approvedOrRejectedCourses) {
          await fetchReviewComments(course.id)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter courses based on search and status
  const filteredCourses = courses.filter((course) => {
    const courseName = course.name || course.title || ''
    const matchesSearch = courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesStatus = true
    if (statusFilter === "under_review") {
      matchesStatus = course.is_under_review === 1 || course.is_under_review === "1"
    } else if (statusFilter === "rejected") {
      matchesStatus = course.is_rejected === 1 || course.is_rejected === "1"
    } else if (statusFilter === "published") {
      matchesStatus = course.is_published === 1 || course.is_published === "1"
    }

    return matchesSearch && matchesStatus
  })

  // Use stats from backend
  const underReviewCount = stats.under_review
  const rejectedCount = stats.rejected
  const publishedCount = stats.published

  // Handle review actions
  const handleReview = async (course: Course) => {
    setSelectedCourse(course)
    setReviewComment("")
    setReviewDialogOpen(true)
    
    // Fetch review history
    try {
      setLoadingHistory(true)
      const response = await apiRequest(`/courses/review-history/${course.id}`)
      setReviewHistory(response.data || [])
    } catch (err) {
      console.error('Error fetching review history:', err)
      setReviewHistory([])
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleApprove = async () => {
    if (!selectedCourse) return
    
    try {
      setActionLoading(true)
      await apiRequest(`/courses/review/${selectedCourse.id}`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'approve',
          comment: reviewComment
        })
      })
      
      // Refresh data
      const [coursesResponse, statsResponse] = await Promise.all([
        apiRequest('/courses/list'),
        apiRequest('/courses/stats')
      ])
      setCourses(coursesResponse.data || [])
      setStats(statsResponse.data || { under_review: 0, rejected: 0, published: 0, total: 0 })
      
      // Refresh review comments for the updated course
      await fetchReviewComments(selectedCourse.id)
      
      toast({
        title: "Course Approved",
        description: "The course has been successfully approved and published.",
        variant: "default"
      })
      
      setReviewDialogOpen(false)
      setSelectedCourse(null)
      setReviewComment("")
    } catch (err) {
      console.error('Error approving course:', err)
      toast({
        title: "Error",
        description: "Failed to approve course. Please try again.",
        variant: "destructive"
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedCourse) return
    
    try {
      setActionLoading(true)
      await apiRequest(`/courses/review/${selectedCourse.id}`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'reject',
          comment: reviewComment
        })
      })
      
      // Refresh data
      const [coursesResponse, statsResponse] = await Promise.all([
        apiRequest('/courses/list'),
        apiRequest('/courses/stats')
      ])
      setCourses(coursesResponse.data || [])
      setStats(statsResponse.data || { under_review: 0, rejected: 0, published: 0, total: 0 })
      
      // Refresh review comments for the updated course
      await fetchReviewComments(selectedCourse.id)
      
      toast({
        title: "Course Rejected",
        description: "The course has been successfully rejected.",
        variant: "default"
      })
      
      setReviewDialogOpen(false)
      setSelectedCourse(null)
      setReviewComment("")
    } catch (err) {
      console.error('Error rejecting course:', err)
      toast({
        title: "Error",
        description: "Failed to reject course. Please try again.",
        variant: "destructive"
      })
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
       
      </div>

      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div>
          <BackButton />
          <h1 className="text-3xl font-bold tracking-tight">Content Moderation</h1>
          <p className="text-muted-foreground text-white">Review and manage reported content, users, and activities</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-r from-blue-500 to-sky-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
            <CardTitle className="text-sm font-medium text-white">Under Review</CardTitle>
            <Eye className="h-4 w-4 text-blue-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{underReviewCount}</div>
            <p className="text-xs text-muted-foreground text-white">Courses awaiting review</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-500 to-rose-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Rejected</CardTitle>
            <XCircle className="h-5 w-5 text-red-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground text-white">Courses rejected</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{publishedCount}</div>
            <p className="text-xs text-muted-foreground text-white">Courses published</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue">Course Moderation</TabsTrigger>
          <TabsTrigger value="actions">Recent Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Courses</CardTitle>
              <CardDescription>Search and filter courses for moderation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="w-full sm:flex-1 sm:min-w-[200px]">
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Items */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading courses...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">Error: {error}</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No courses found</p>
              </div>
            ) : (
              filteredCourses.map((course) => {
                const getStatusBadge = () => {
                  if (course.is_published === 1 || course.is_published === "1") return { text: "APPROVED", color: "bg-green-100 text-green-800 border-green-200" }
                  if (course.is_rejected === 1 || course.is_rejected === "1") return { text: "REJECTED", color: "bg-red-100 text-red-800 border-red-200" }
                  if (course.is_under_review === 1 || course.is_under_review === "1") return { text: "UNDER REVIEW", color: "bg-blue-100 text-blue-800 border-blue-200" }
                  return { text: "DRAFT", color: "bg-gray-100 text-gray-800 border-gray-200" }
                }

                const statusBadge = getStatusBadge()

              return (
                  <Card key={course.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                            <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <Badge className={statusBadge.color}>
                              {statusBadge.text}
                          </Badge>
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                              {(course.course_level || course.level || 'BEGINNER').toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                          <h3 className="font-semibold text-base break-words">{course.name || course.title || 'Untitled Course'}</h3>

                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <div className="break-words">
                              <strong>Price:</strong> ${course.is_free === 1 ? 'Free' : course.price || 0}
                              {course.sales_price > 0 && course.sales_price < course.price && (
                                <span className="text-green-600 ml-2">Sale: ${course.sales_price}</span>
                              )}
                          </div>
                            <div>Classes: {course.total_class || 0} ({course.total_free_class || 0} free)</div>
                            {course.duration && <div>Duration: {course.duration}</div>}
                            <div>Created: {course.created_date ? new Date(course.created_date).toLocaleDateString() : 'Unknown'}</div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm break-words">
                              <strong>Description:</strong> {course.description || 'No description available'}
                            </p>
                            {course.full_description && (
                              <p className="text-sm text-muted-foreground break-words">
                                {course.full_description.substring(0, 200)}...
                              </p>
                            )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full sm:w-auto bg-transparent"
                            onClick={() => handleReview(course)}
                          >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                          
                          {/* Quick Action Buttons - Only show for courses under review */}
                          {(course.is_under_review === 1 || course.is_under_review === "1") && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                                onClick={() => {
                                  setSelectedCourse(course);
                                  handleApprove();
                                }}
                                disabled={actionLoading}
                                className="w-full sm:w-auto text-green-600 hover:text-green-700 hover:bg-green-50 bg-transparent"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                                onClick={() => {
                                  setSelectedCourse(course);
                                  handleReject();
                                }}
                                disabled={actionLoading}
                                className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                          
                          {/* Status indicator for completed reviews */}
                          {course.is_published === 1 && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Approved</span>
                            </div>
                          )}
                          
                          {course.is_rejected === 1 && (
                            <div className="flex items-center gap-2 text-red-600">
                              <XCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Rejected</span>
                            </div>
                          )}

                          {/* Review Comments for approved/rejected courses */}
                          {((course.is_published === 1 || course.is_published === "1") || 
                            (course.is_rejected === 1 || course.is_rejected === "1")) && 
                           courseReviewComments[course.id] && 
                           courseReviewComments[course.id].length > 0 && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Review Comments
                              </h4>
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {courseReviewComments[course.id].map((review, index) => (
                                  <div key={index} className="text-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        review.action === 'approve' 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {review.action.toUpperCase()}
                                      </span>
                                      <span className="text-gray-500 text-xs">
                                        by {review.reviewer_name || 'Unknown'} • {new Date(review.reviewed_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                    {review.comment && (
                                      <p className="text-gray-700 text-xs bg-white p-2 rounded border">
                                        {review.comment}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
              })
            )}
          </div>
        </TabsContent>


        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Moderation Actions</CardTitle>
              <CardDescription>Latest actions taken by moderators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium break-words">Course "Fake Trading Signals" removed</p>
                    <p className="text-sm text-muted-foreground break-words">
                      Moderator: admin@example.com • 2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium break-words">User "spammer@example.com" suspended for 7 days</p>
                    <p className="text-sm text-muted-foreground break-words">
                      Moderator: admin@example.com • 4 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Flag className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium break-words">Comment flagged for review</p>
                    <p className="text-sm text-muted-foreground break-words">
                      Moderator: admin@example.com • 6 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Review
            </DialogTitle>
            <DialogDescription>
              Review course details and make a decision
            </DialogDescription>
          </DialogHeader>
          
          {selectedCourse && (
            <div className="space-y-6">
              {/* Course Header */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedCourse.name || selectedCourse.title}</h3>
                  <p className="text-gray-600 mt-1">{selectedCourse.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Created: {new Date(selectedCourse.created_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Price: ${selectedCourse.is_free === 1 ? 'Free' : selectedCourse.price}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      Level: {(selectedCourse.course_level || selectedCourse.level || 'BEGINNER').toUpperCase()}
                    </span>
                  </div>
                </div>
                <Badge className={`${
                  selectedCourse.is_published === 1 ? 'bg-green-100 text-green-800' :
                  selectedCourse.is_rejected === 1 ? 'bg-red-100 text-red-800' :
                  selectedCourse.is_under_review === 1 ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedCourse.is_published === 1 ? 'APPROVED' :
                   selectedCourse.is_rejected === 1 ? 'REJECTED' :
                   selectedCourse.is_under_review === 1 ? 'UNDER REVIEW' : 'DRAFT'}
                </Badge>
              </div>

              {/* Course Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Course Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Total Classes:</strong> {selectedCourse.total_class}</div>
                      <div><strong>Free Classes:</strong> {selectedCourse.total_free_class}</div>
                      <div><strong>Per Class Time:</strong> {selectedCourse.per_class_time} minutes</div>
                      {selectedCourse.duration && <div><strong>Duration:</strong> {selectedCourse.duration}</div>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Pricing</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Regular Price:</strong> ${selectedCourse.price}</div>
                      {selectedCourse.sales_price > 0 && (
                        <div><strong>Sale Price:</strong> ${selectedCourse.sales_price}</div>
                      )}
                      <div><strong>Free Course:</strong> {selectedCourse.is_free === 1 ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Full Description</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {selectedCourse.full_description || 'No detailed description available'}
                    </p>
                  </div>

                  {selectedCourse.meta_key && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Meta Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Meta Keywords:</strong> {selectedCourse.meta_key}</div>
                        {selectedCourse.meta_description && (
                          <div><strong>Meta Description:</strong> {selectedCourse.meta_description}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Review History */}
              {reviewHistory.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Review History</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {reviewHistory.map((review, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          review.action === 'approve' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-medium ${
                              review.action === 'approve' ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {review.action.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              by {review.reviewer_name || 'Unknown'} • {new Date(review.reviewed_at).toLocaleDateString()}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-gray-600">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Review Comment (Optional)
                </label>
                <Textarea
                  placeholder="Add any comments about your review decision..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            {selectedCourse && (selectedCourse.is_under_review === 1 || selectedCourse.is_under_review === "1") && (
              <>
                <Button
                  variant="outline"
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {actionLoading ? 'Rejecting...' : 'Reject'}
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {actionLoading ? 'Approving...' : 'Approve'}
                </Button>
              </>
            )}
            
            {/* Show status for already processed courses */}
            {selectedCourse && selectedCourse.is_published === 1 && (
              <div className="flex items-center gap-2 text-green-600 px-4 py-2">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">This course has been approved</span>
              </div>
            )}
            
            {selectedCourse && selectedCourse.is_rejected === 1 && (
              <div className="flex items-center gap-2 text-red-600 px-4 py-2">
                <XCircle className="h-4 w-4" />
                <span className="font-medium">This course has been rejected</span>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}