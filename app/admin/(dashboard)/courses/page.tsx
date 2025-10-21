"use client"

import { useState, useEffect } from "react"
import { getApiUrl } from "@/lib/api-config"
import { Search, Filter, Plus, MoreHorizontal, Eye, Trash2, CheckCircle, XCircle, Clock, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import BackButton from "@/components/back-button"

interface Course {
  id: string
  title: string
  instructor: string
  category: string
  status: "Published" | "Under Review" | "Rejected"
  students: number
  rating: number
  revenue: number
  thumbnail: string
}

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("All Courses")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 8 // Reduced for better mobile experience

  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Complete Web Development Bootcamp",
      instructor: "John Smith",
      category: "Web Development",
      status: "Published",
      students: 1247,
      rating: 4.8,
      revenue: 24940,
      thumbnail: "/web-development-course.png",
    },
    {
      id: "2",
      title: "Digital Marketing Mastery",
      instructor: "Sarah Johnson",
      category: "Marketing",
      status: "Published",
      students: 892,
      rating: 4.6,
      revenue: 17840,
      thumbnail: "/digital-marketing-course.png",
    },
    {
      id: "3",
      title: "Data Science with Python",
      instructor: "Dr. Michael Chen",
      category: "Data Science",
      status: "Under Review",
      students: 0,
      rating: 0,
      revenue: 0,
      thumbnail: "/data-science-course.png",
    },
    {
      id: "4",
      title: "UI/UX Design Fundamentals",
      instructor: "Emily Rodriguez",
      category: "Design",
      status: "Published",
      students: 634,
      rating: 4.9,
      revenue: 12680,
      thumbnail: "/ui-ux-design-course.png",
    },
    {
      id: "5",
      title: "Project Management Professional",
      instructor: "David Wilson",
      category: "Business",
      status: "Under Review",
      students: 0,
      rating: 0,
      revenue: 0,
      thumbnail: "/project-management-course.png",
    },
    {
      id: "6",
      title: "Cybersecurity Essentials",
      instructor: "Lisa Thompson",
      category: "Technology",
      status: "Rejected",
      students: 0,
      rating: 0,
      revenue: 0,
      thumbnail: "/cybersecurity-course.png",
    },
    {
      id: "7",
      title: "Advanced JavaScript Patterns",
      instructor: "Alex Johnson",
      category: "Web Development",
      status: "Published",
      students: 543,
      rating: 4.7,
      revenue: 10860,
      thumbnail: "/javascript-course.png",
    },
    {
      id: "8",
      title: "Machine Learning Fundamentals",
      instructor: "Dr. Sarah Wilson",
      category: "Data Science",
      status: "Published",
      students: 876,
      rating: 4.5,
      revenue: 17520,
      thumbnail: "/ml-course.png",
    },
    {
      id: "9",
      title: "Mobile App Development with React Native",
      instructor: "Mike Brown",
      category: "Mobile Development",
      status: "Under Review",
      students: 0,
      rating: 0,
      revenue: 0,
      thumbnail: "/react-native-course.png",
    },
    {
      id: "10",
      title: "Content Marketing Strategy",
      instructor: "Jennifer Lee",
      category: "Marketing",
      status: "Published",
      students: 321,
      rating: 4.4,
      revenue: 6420,
      thumbnail: "/content-marketing-course.png",
    },
  ])

  const filterTabs = ["All Courses", "Published", "Under Review", "Rejected"]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      selectedFilter === "All Courses" || course.status === selectedFilter

    return matchesSearch && matchesFilter
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)
  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse)

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedFilter])

  useEffect(() => {
    const controller = new AbortController()
    const url = getApiUrl('courses/list')
    fetch(url, { signal: controller.signal, credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`)))
      .then(json => {
        const data = Array.isArray(json?.data) ? json.data : []
        if (data.length === 0) return
        const mapped: Course[] = data.map((c: any) => ({
          id: String(c.id ?? c.course_id ?? ''),
          title: String(c.title ?? c.name ?? 'Untitled Course'),
          instructor: String(c.instructor ?? c.teacher ?? 'Unknown Instructor'),
          category: String(c.category ?? 'General'),
          status: (String(c.status ?? 'Published') as Course['status']),
          students: Number(c.students ?? c.enrolled ?? 0),
          rating: Number(c.rating ?? 0),
          revenue: Number(c.revenue ?? 0),
          thumbnail: String(c.thumbnail ?? '/course.png')
        }))
        setCourses(mapped)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const totalCourses = courses.length
  const publishedCount = courses.filter(c => c.status === "Published").length
  const underReviewCount = courses.filter(c => c.status === "Under Review").length
  const totalRevenue = courses.reduce((acc, c) => acc + c.revenue, 0)

  const handleAction = (action: string, courseId: string) => {
    if (action === "view") {
      const course = courses.find((c) => c.id === courseId)
      if (course) {
        setSelectedCourse(course)
        setIsViewDialogOpen(true)
      }
      return
    }
    console.log(`${action} course:`, courseId)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return <Badge className="bg-green-100 text-green-800 text-xs py-0.5 px-2 flex items-center gap-1"><Check className="w-3 h-3" />Published</Badge>
      case "Under Review":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs py-0.5 px-2 flex items-center gap-1"><Clock className="w-3 h-3" />Under Review</Badge>
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 text-xs py-0.5 px-2">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-3 space-y-3 sm:space-y-4">
      <BackButton />

      {/* Header */}
      <div className="flex flex-col space-y-2 sm:space-y-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Course Management</h1>
          <p className="text-xs sm:text-sm text-white">Review and manage all platform courses</p>
        </div>
       
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <Card className="text-center p-2 sm:p-6 bg-gradient-to-r from-sky-400 to-cyan-400
">
          <CardTitle className="text-[10px] sm:text-xs text-white font-normal">Total Courses</CardTitle>
          <CardContent className="text-sm sm:text-lg font-bold text-white p-0 pt-1">📚 {totalCourses}</CardContent>
        </Card>
        <Card className="text-center p-2 sm:p-6 bg-gradient-to-r from-amber-400 to-yellow-400">
          <CardTitle className="text-[10px] sm:text-xs text-white font-normal">Published</CardTitle>
          <CardContent className="text-sm sm:text-lg font-bold text-white p-0 pt-1">✅ {publishedCount}</CardContent>
        </Card>
        <Card className="text-center p-2 sm:p-6 bg-gradient-to-r from-rose-400 to-pink-400">
          <CardTitle className="text-[10px] sm:text-xs text-white font-normal">Under Review</CardTitle>
          <CardContent className="text-sm sm:text-lg font-bold text-white p-0 pt-1">⏳ {underReviewCount}</CardContent>
        </Card>
        <Card className="text-center p-2 sm:p-6 bg-gradient-to-r from-emerald-400 to-teal-400">
          <CardTitle className="text-[10px] sm:text-xs text-white font-normal ">Total Revenue</CardTitle>
          <CardContent className="text-sm sm:text-lg font-bold text-white p-0 pt-1">💰 ${totalRevenue.toLocaleString()}</CardContent>
        </Card>
      </div>

      {/* Search + Filter */}
      <div className="space-y-2 sm:space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
          />
        </div>

        <Select defaultValue="newest">
          <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
            <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="revenue">Highest Revenue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-1 bg-gray-100 p-1 rounded-lg scrollbar-hide">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedFilter(tab)}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[10px] sm:text-xs font-medium flex-shrink-0 min-w-max ${
              selectedFilter === tab
                ? "bg-white text-emerald-600 shadow-sm border border-emerald-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center">
        <p className="text-[10px] sm:text-xs text-gray-600">
          Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} courses
        </p>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-2 sm:space-y-3">
        {currentCourses.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            📚 <br />
            No courses found
          </div>
        ) : (
          currentCourses.map((course) => (
            <Card key={course.id} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-2 sm:p-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2 leading-tight">{course.title}</h3>
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-1">by {course.instructor}</p>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
                      {getStatusBadge(course.status)}
                      <Badge variant="outline" className="text-[10px] sm:text-xs py-0.5 px-1.5 sm:px-2">{course.category}</Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-6 w-6 sm:h-7 sm:w-7 p-0 flex-shrink-0">
                        <MoreHorizontal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-xs">
                      <DropdownMenuItem onClick={() => handleAction("view", course.id)} className="text-xs">
                        <Eye className="mr-2 h-3.5 w-3.5" /> View
                      </DropdownMenuItem>
                      {course.status === "Under Review" && (
                        <>
                          <DropdownMenuItem onClick={() => handleAction("approve", course.id)} className="text-xs">
                            <CheckCircle className="mr-2 h-3.5 w-3.5" /> Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("reject", course.id)} className="text-xs">
                            <XCircle className="mr-2 h-3.5 w-3.5" /> Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => handleAction("delete", course.id)} className="text-red-600 text-xs">
                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 text-center gap-1 sm:gap-2 pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-gray-100">
                  <div className="flex flex-col items-center justify-center">
                    <div className="font-bold text-gray-900 text-xs sm:text-sm">{course.students.toLocaleString()}</div>
                    <div className="text-[9px] sm:text-[10px] text-gray-500">Students</div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="font-bold text-yellow-500 flex items-center justify-center text-xs sm:text-sm">
                      <span className="mr-0.5 sm:mr-1">★</span>{course.rating > 0 ? course.rating.toFixed(1) : "0.0"}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-gray-500">Rating</div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="font-bold text-emerald-600 text-xs sm:text-sm">${course.revenue.toLocaleString()}</div>
                    <div className="text-[9px] sm:text-[10px] text-gray-500">Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination - Mobile Optimized */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-gray-200">
          <div className="text-xs sm:text-sm text-gray-600 text-center">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1 text-[10px] sm:text-xs px-2 sm:px-3 py-1.5 sm:py-2"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              Prev
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 3) {
                  pageNum = i + 1
                } else if (currentPage === 1) {
                  pageNum = i + 1
                } else if (currentPage === totalPages) {
                  pageNum = totalPages - 2 + i
                } else {
                  pageNum = currentPage - 1 + i
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageClick(pageNum)}
                    className={`h-7 w-7 sm:h-8 sm:w-8 p-0 text-[10px] sm:text-xs ${
                      currentPage === pageNum 
                        ? "bg-emerald-600 text-white" 
                        : "hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    {pageNum}
                  </Button>
                )
              })}
              {totalPages > 3 && currentPage < totalPages - 1 && (
                <span className="text-gray-500 text-xs px-1">...</span>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 text-[10px] sm:text-xs px-2 sm:px-3 py-1.5 sm:py-2"
            >
              Next
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto p-0 mx-auto">
          <DialogHeader className="px-4 pt-4 pb-3 border-b border-gray-100">
            <DialogTitle className="text-lg font-bold text-gray-900">
              Course Details
            </DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="p-4 space-y-4">
              <div className="flex flex-col gap-4 items-center text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                  Thumbnail
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">{selectedCourse.title}</h3>
                  <p className="text-sm text-gray-600">by {selectedCourse.instructor}</p>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {getStatusBadge(selectedCourse.status)}
                    <Badge variant="outline" className="text-xs">{selectedCourse.category}</Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="font-bold text-gray-900 text-sm">{selectedCourse.students.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Students</div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="font-bold text-yellow-500 flex items-center justify-center text-sm">
                    <span className="mr-1">★</span>{selectedCourse.rating > 0 ? selectedCourse.rating.toFixed(1) : "0.0"}
                  </div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="font-bold text-emerald-600 text-sm">${selectedCourse.revenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Revenue</div>
                </div>
              </div>
              <div className="flex justify-center pt-2">
                <Button 
                  onClick={() => setIsViewDialogOpen(false)} 
                  className="w-full text-sm"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}