"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Filter, Briefcase, TrendingDown, Building2, Clock, DollarSign, Users } from "lucide-react"

export default function JobBoardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all-locations")
  const [typeFilter, setTypeFilter] = useState("all-types")
  const [levelFilter, setLevelFilter] = useState("all-levels")
  const [sortBy, setSortBy] = useState("relevance")

  const sampleJobs = [
    {
      id: 1,
      title: "MERN Stack Developer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      type: "Full-time",
      level: "Mid Level",
      salary: "$80,000 - $120,000",
      description:
        "Join our dynamic team to build scalable web applications using MongoDB, Express.js, React, and Node.js. Experience with cloud platforms preferred.",
      postedDate: "2 days ago",
      applicants: 45,
    },
    {
      id: 2,
      title: "Data Scientist",
      company: "DataInsights Inc",
      location: "New York, NY",
      type: "Full-time",
      level: "Senior Level",
      salary: "$100,000 - $150,000",
      description:
        "Analyze complex datasets and build machine learning models to drive business insights. Python, R, and SQL expertise required.",
      postedDate: "1 day ago",
      applicants: 32,
    },
    {
      id: 3,
      title: "Frontend Developer Intern",
      company: "StartupHub",
      location: "Remote",
      type: "Internship",
      level: "Entry Level",
      salary: "$20 - $25/hour",
      description:
        "Learn and contribute to modern React applications. Perfect opportunity for students to gain real-world experience.",
      postedDate: "3 days ago",
      applicants: 78,
    },
    {
      id: 4,
      title: "Full Stack Engineer",
      company: "InnovateTech",
      location: "Austin, TX",
      type: "Full-time",
      level: "Mid Level",
      salary: "$90,000 - $130,000",
      description:
        "Work on both frontend and backend systems using modern technologies. Experience with React, Node.js, and PostgreSQL required.",
      postedDate: "1 week ago",
      applicants: 23,
    },
    {
      id: 5,
      title: "UI/UX Designer",
      company: "DesignStudio Pro",
      location: "Los Angeles, CA",
      type: "Contract",
      level: "Mid Level",
      salary: "$60 - $80/hour",
      description:
        "Create intuitive user interfaces and experiences for web and mobile applications. Figma and Adobe Creative Suite expertise required.",
      postedDate: "4 days ago",
      applicants: 56,
    },
    {
      id: 6,
      title: "DevOps Engineer",
      company: "CloudFirst Systems",
      location: "Seattle, WA",
      type: "Full-time",
      level: "Senior Level",
      salary: "$110,000 - $160,000",
      description: "Manage cloud infrastructure and CI/CD pipelines. AWS, Docker, and Kubernetes experience essential.",
      postedDate: "5 days ago",
      applicants: 19,
    },
    {
      id: 7,
      title: "Python Developer",
      company: "AI Solutions Ltd",
      location: "Remote",
      type: "Part-time",
      level: "Entry Level",
      salary: "$40,000 - $60,000",
      description:
        "Develop Python applications for AI and machine learning projects. Great opportunity for recent graduates.",
      postedDate: "1 week ago",
      applicants: 67,
    },
    {
      id: 8,
      title: "Mobile App Developer",
      company: "MobileFirst Inc",
      location: "New York, NY",
      type: "Full-time",
      level: "Mid Level",
      salary: "$85,000 - $125,000",
      description:
        "Build native iOS and Android applications using React Native or Flutter. App Store deployment experience preferred.",
      postedDate: "6 days ago",
      applicants: 41,
    },
  ]

  const locations = [
    "All Locations",
    "New York, NY",
    "San Francisco, CA",
    "Los Angeles, CA",
    "Remote",
    "Austin, TX",
    "Seattle, WA",
  ]
  const jobTypes = ["All Types", "Full-time", "Part-time", "Contract", "Internship", "Freelance"]
  const experienceLevels = ["All Levels", "Entry Level", "Mid Level", "Senior Level", "Executive"]

  const filteredJobs = sampleJobs.filter((job) => {
    const matchesSearch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation =
      locationFilter === "all-locations" || job.location.toLowerCase().replace(/\s+/g, "-") === locationFilter

    const matchesType = typeFilter === "all-types" || job.type.toLowerCase().replace(/\s+/g, "-") === typeFilter

    const matchesLevel = levelFilter === "all-levels" || job.level.toLowerCase().replace(/\s+/g, "-") === levelFilter

    return matchesSearch && matchesLocation && matchesType && matchesLevel
  })

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      case "salary-high":
        return Number.parseInt(b.salary.split("$")[1]) - Number.parseInt(a.salary.split("$")[1])
      case "salary-low":
        return Number.parseInt(a.salary.split("$")[1]) - Number.parseInt(b.salary.split("$")[1])
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Briefcase className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Job Board</h1>
            <p className="text-emerald-100 text-lg">Discover your next career opportunity</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg bg-white border-2 border-gray-200 focus:border-emerald-500 rounded-lg text-gray-900"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="City, state, or remote"
                  className="pl-12 h-12 text-lg bg-white border-2 border-gray-200 focus:border-emerald-500 rounded-lg text-gray-900"
                />
              </div>
              <Button className="bg-gradient-to-r from-lime-500 to-yellow-500 hover:from-lime-600 hover:to-yellow-600 h-12 px-8 text-lg font-semibold shadow-lg hover:shadow-lime-200 transition-all duration-300 transform hover:scale-105 rounded-lg">
                <Search className="w-5 h-5 mr-2" />
                Search Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-emerald-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="border-emerald-300 focus:border-emerald-500">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location.toLowerCase().replace(/\s+/g, "-")}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="border-emerald-300 focus:border-emerald-500">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, "-")}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="border-emerald-300 focus:border-emerald-500">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level.toLowerCase().replace(/\s+/g, "-")}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="flex items-center gap-2 border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 bg-transparent"
            >
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Showing {sortedJobs.length} of {sampleJobs.length} jobs
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="date">Most Recent</SelectItem>
              <SelectItem value="salary-high">Salary: High to Low</SelectItem>
              <SelectItem value="salary-low">Salary: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedJobs.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
          <CardContent className="p-16 text-center">
            <div className="flex items-center justify-center mb-6">
              <TrendingDown className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No jobs found</h3>
            <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or filters to find more opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                onClick={() => {
                  setSearchTerm("")
                  setLocationFilter("all-locations")
                  setTypeFilter("all-types")
                  setLevelFilter("all-levels")
                }}
              >
                Clear All Filters
              </Button>
              <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
                Browse All Jobs
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedJobs.map((job) => (
            <Card
              key={job.id}
              className="border-emerald-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Building2 className="h-4 w-4 mr-2" />
                          <span className="font-medium">{job.company}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                          {job.type}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {job.level}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.postedDate}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {job.applicants} applicants
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:ml-6">
                    <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
                      Apply Now
                    </Button>
                    <Button
                      variant="outline"
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                    >
                      Save Job
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
