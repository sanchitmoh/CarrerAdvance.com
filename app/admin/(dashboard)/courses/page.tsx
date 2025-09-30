"use client"

import { useState, useEffect } from "react"
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
  const coursesPerPage = 10

  const [courses] = useState<Course[]>([
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
    // Adding more sample data to demonstrate pagination
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
    {
      id: "11",
      title: "Cloud Computing with AWS",
      instructor: "Robert Davis",
      category: "Technology",
      status: "Published",
      students: 765,
      rating: 4.6,
      revenue: 15300,
      thumbnail: "/aws-course.png",
    },
    {
      id: "12",
      title: "Graphic Design Masterclass",
      instructor: "Maria Garcia",
      category: "Design",
      status: "Rejected",
      students: 0,
      rating: 0,
      revenue: 0,
      thumbnail: "/graphic-design-course.png",
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
        return <Badge className="bg-green-100 text-green-800 text-xs py-1 px-2 flex items-center gap-1"><Check className="w-3 h-3" />Published</Badge>
      case "Under Review":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs py-1 px-2 flex items-center gap-1"><Clock className="w-3 h-3" />Under Review</Badge>
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 text-xs py-1 px-2">Rejected</Badge>
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
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <BackButton />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-xs sm:text-base text-gray-600">Review and manage all platform courses</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto text-sm flex items-center justify-center py-2.5">
          <Plus className="w-4 h-4 mr-2" /> Add Course
        </Button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card className="text-center p-2 sm:p-4">
          <CardTitle className="text-xs sm:text-sm text-gray-500">Total Courses</CardTitle>
          <CardContent className="text-lg sm:text-2xl font-bold p-0 pt-1 sm:pt-2">📚 {totalCourses}</CardContent>
        </Card>
        <Card className="text-center p-2 sm:p-4">
          <CardTitle className="text-xs sm:text-sm text-gray-500">Published</CardTitle>
          <CardContent className="text-lg sm:text-2xl font-bold text-green-600 p-0 pt-1 sm:pt-2">✅ {publishedCount}</CardContent>
        </Card>
        <Card className="text-center p-2 sm:p-4">
          <CardTitle className="text-xs sm:text-sm text-gray-500">Under Review</CardTitle>
          <CardContent className="text-lg sm:text-2xl font-bold text-yellow-600 p-0 pt-1 sm:pt-2">⏳ {underReviewCount}</CardContent>
        </Card>
        <Card className="text-center p-2 sm:p-4">
          <CardTitle className="text-xs sm:text-sm text-gray-500">Total Revenue</CardTitle>
          <CardContent className="text-lg sm:text-2xl font-bold text-emerald-600 p-0 pt-1 sm:pt-2">💰 ${totalRevenue.toLocaleString()}</CardContent>
        </Card>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center sm:justify-between mt-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 sm:h-11 text-sm"
          />
        </div>

        <Select defaultValue="newest" className="w-full sm:w-56">
          <SelectTrigger className="h-10 sm:h-11 text-sm">
            <Filter className="w-4 h-4 mr-2" />
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
      <div className="flex overflow-x-auto space-x-1 sm:space-x-2 bg-gray-100 p-1 sm:p-2 rounded-lg scrollbar-hide mt-2">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedFilter(tab)}
            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium flex-shrink-0 min-w-max ${selectedFilter === tab
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
        <p className="text-sm text-gray-600">
          Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} courses
        </p>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-3 sm:gap-4 mt-2">
        {currentCourses.length === 0 ? (
          <div className="text-center py-8 sm:py-12 col-span-full text-gray-500 text-sm sm:text-base">
            📚 <br />
            No courses found
          </div>
        ) : (
          currentCourses.map((course) => (
            <Card key={course.id} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="space-y-3 p-3 sm:p-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2">{course.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">by {course.instructor}</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                      {getStatusBadge(course.status)}
                      <Badge variant="outline" className="text-xs py-0.5 sm:py-1 px-1.5 sm:px-2">{course.category}</Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0">
                        <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-xs sm:text-sm">
                      <DropdownMenuItem onClick={() => handleAction("view", course.id)} className="text-xs sm:text-sm">
                        <Eye className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> View
                      </DropdownMenuItem>
                      {course.status === "Under Review" && (
                        <>
                          <DropdownMenuItem onClick={() => handleAction("approve", course.id)} className="text-xs sm:text-sm">
                            <CheckCircle className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("reject", course.id)} className="text-xs sm:text-sm">
                            <XCircle className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => handleAction("delete", course.id)} className="text-red-600 text-xs sm:text-sm">
                        <Trash2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Stats - Fixed alignment */}
                <div className="grid grid-cols-3 text-center mt-2 gap-1 sm:gap-2">
                  <div className="flex flex-col items-center justify-center">
                    <div className="font-bold text-gray-900 text-sm sm:text-base">{course.students.toLocaleString()}</div>
                    <div className="text-[10px] sm:text-xs text-gray-500">Students</div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="font-bold text-yellow-500 flex items-center justify-center text-sm sm:text-base">
                      <span className="mr-1">★</span>{course.rating > 0 ? course.rating.toFixed(1) : "0.0"}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500">Rating</div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="font-bold text-emerald-600 text-sm sm:text-base">${course.revenue.toLocaleString()}</div>
                    <div className="text-[10px] sm:text-xs text-gray-500">Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block mt-2">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-separate border-spacing-0">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 rounded-tl-lg">Course</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Instructor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Students</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rating</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Revenue</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    No courses found
                  </td>
                </tr>
              ) : (
                currentCourses.map((course) => (
                  <tr key={course.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                        Thumbnail
                      </div>
                      <span className="line-clamp-2 font-medium">{course.title}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{course.instructor}</td>
                    <td className="px-4 py-3 text-gray-600">{course.category}</td>
                    <td className="px-4 py-3">{getStatusBadge(course.status)}</td>
                    <td className="px-4 py-3 text-gray-600 text-center">{course.students.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600 text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        {course.rating > 0 ? course.rating.toFixed(1) : "0.0"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-center">${course.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction("view", course.id)}><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                          {course.status === "Under Review" && (
                            <>
                              <DropdownMenuItem onClick={() => handleAction("approve", course.id)}><CheckCircle className="mr-2 h-4 w-4" /> Approve</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction("reject", course.id)}><XCircle className="mr-2 h-4 w-4" /> Reject</DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={() => handleAction("delete", course.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageClick(page)}
                  className={`h-8 w-8 p-0 ${
                    currentPage === page 
                      ? "bg-emerald-600 text-white" 
                      : "hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto p-0 mx-2 sm:mx-auto">
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-100">
            <DialogTitle className="text-lg sm:text-2xl font-bold text-gray-900">
              Course Details
            </DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs mx-auto sm:mx-0">
                  Thumbnail
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <h3 className="text-lg sm:text-2xl font-bold">{selectedCourse.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">by {selectedCourse.instructor}</p>
                  <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                    {getStatusBadge(selectedCourse.status)}
                    <Badge variant="outline" className="text-xs">{selectedCourse.category}</Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="font-bold text-gray-900 text-sm sm:text-base">{selectedCourse.students.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Students</div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="font-bold text-yellow-500 flex items-center justify-center text-sm sm:text-base">
                    <span className="mr-1">★</span>{selectedCourse.rating > 0 ? selectedCourse.rating.toFixed(1) : "0.0"}
                  </div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="font-bold text-emerald-600 text-sm sm:text-base">${selectedCourse.revenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Revenue</div>
                </div>
              </div>
              <div className="flex justify-center sm:justify-end pt-2">
                <Button onClick={() => setIsViewDialogOpen(false)} className="w-full sm:w-auto">Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}