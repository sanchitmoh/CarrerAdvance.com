"use client"

import { useState } from "react"
import { Search, Filter, Plus, MoreHorizontal, Eye, Trash2, CheckCircle, XCircle, Clock, Check } from "lucide-react"
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
        return <Badge className="bg-green-100 text-green-800 text-xs py-1 px-2 flex items-center gap-1"><Check className="w-3 h-3"/>Published</Badge>
      case "Under Review":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs py-1 px-2 flex items-center gap-1"><Clock className="w-3 h-3"/>Under Review</Badge>
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 text-xs py-1 px-2">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <BackButton />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Review and manage all platform courses</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto text-sm flex items-center justify-center">
          <Plus className="w-4 h-4 mr-2" /> Add Course
        </Button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <CardTitle className="text-sm text-gray-500">Total Courses</CardTitle>
          <CardContent className="text-2xl font-bold">📚 {totalCourses}</CardContent>
        </Card>
        <Card className="text-center p-4">
          <CardTitle className="text-sm text-gray-500">Published</CardTitle>
          <CardContent className="text-2xl font-bold text-green-600">✅ {publishedCount}</CardContent>
        </Card>
        <Card className="text-center p-4">
          <CardTitle className="text-sm text-gray-500">Under Review</CardTitle>
          <CardContent className="text-2xl font-bold text-yellow-600">⏳ {underReviewCount}</CardContent>
        </Card>
        <Card className="text-center p-4">
          <CardTitle className="text-sm text-gray-500">Total Revenue</CardTitle>
          <CardContent className="text-2xl font-bold text-emerald-600">💰 ${totalRevenue.toLocaleString()}</CardContent>
        </Card>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        <Select defaultValue="newest" className="w-full sm:w-56">
          <SelectTrigger className="h-11">
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
      <div className="flex overflow-x-auto space-x-2 bg-gray-100 p-2 rounded-lg scrollbar-hide mt-2">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedFilter(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium flex-shrink-0 ${
              selectedFilter === tab
                ? "bg-white text-emerald-600 shadow-sm border border-emerald-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 mt-2">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 col-span-full text-gray-500">
            📚 <br />
            No courses found
          </div>
        ) : (
          filteredCourses.map((course) => (
            <Card key={course.id} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-600">by {course.instructor}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getStatusBadge(course.status)}
                      <Badge variant="outline" className="text-xs py-1 px-2">{course.category}</Badge>
                    </div>
                  </div>
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
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 text-center mt-2 gap-2">
                  <div>
                    <div className="font-bold text-gray-900">{course.students.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Students</div>
                  </div>
                  <div>
                    <div className="font-bold text-yellow-500 flex items-center justify-center">
                      <span className="mr-1">★</span>{course.rating.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div>
                    <div className="font-bold text-emerald-600">${course.revenue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Revenue</div>
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
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    No courses found
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={course.thumbnail} alt={course.title} className="w-12 h-12 rounded-lg object-cover" />
                      <span className="line-clamp-2">{course.title}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{course.instructor}</td>
                    <td className="px-4 py-3 text-gray-600">{course.category}</td>
                    <td className="px-4 py-3">{getStatusBadge(course.status)}</td>
                    <td className="px-4 py-3 text-gray-600">{course.students.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600 flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>{course.rating.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">${course.revenue.toLocaleString()}</td>
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

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-100">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
              Course Details
            </DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="p-4 sm:p-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <img
                  src={selectedCourse.thumbnail}
                  alt={selectedCourse.title}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg object-cover"
                />
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg sm:text-2xl font-bold">{selectedCourse.title}</h3>
                  <p className="text-sm sm:text-base">by {selectedCourse.instructor}</p>
                  <div className="flex gap-2 flex-wrap">
                    {getStatusBadge(selectedCourse.status)}
                    <Badge variant="outline">{selectedCourse.category}</Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-bold text-gray-900">{selectedCourse.students.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Students</div>
                </div>
                <div>
                  <div className="font-bold text-yellow-500 flex items-center justify-center">
                    <span className="mr-1">★</span>{selectedCourse.rating.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
                <div>
                  <div className="font-bold text-emerald-600">${selectedCourse.revenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Revenue</div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
