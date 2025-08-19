import CourseCard from '@/components/CourseCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, Star, Clock, Users, BookOpen, Lightbulb } from 'lucide-react'

const courses = [
  {
    id: 1,
    title: 'Full Stack Web Development Bootcamp',
    instructor: 'John Smith',
    duration: '12 weeks',
    category: 'Programming',
    image: '/web-development-course.png',
    description: 'Master modern web development with React, Node.js, and databases. Build real-world projects and launch your career.',
    price: '$299',
    rating: 4.9,
    students: 2847,
    level: 'Beginner to Advanced'
  },
  {
    id: 2,
    title: 'Digital Marketing Mastery',
    instructor: 'Sarah Johnson',
    duration: '8 weeks',
    category: 'Marketing',
    image: '/digital-marketing-course.png',
    description: 'Master SEO, social media marketing, Google Ads, and analytics to grow any business and become a marketing expert.',
    price: '$199',
    rating: 4.8,
    students: 1923,
    level: 'Intermediate'
  },
  {
    id: 3,
    title: 'Data Science & Machine Learning',
    instructor: 'Dr. Mike Chen',
    duration: '16 weeks',
    category: 'Data Science',
    image: '/data-science-course.png',
    description: 'Learn Python, statistics, machine learning, and AI. Work with real datasets and solve complex problems.',
    price: '$399',
    rating: 4.9,
    students: 1456,
    level: 'Advanced'
  },
  {
    id: 4,
    title: 'UI/UX Design Masterclass',
    instructor: 'Emily Davis',
    duration: '10 weeks',
    category: 'Design',
    image: '/ui-ux-design-course.png',
    description: 'Create beautiful, user-friendly interfaces. Learn Figma, prototyping, and user research to build compelling digital products.',
    price: '$249',
    rating: 4.7,
    students: 2134,
    level: 'Beginner'
  },
  {
    id: 5,
    title: 'Project Management Professional',
    instructor: 'Robert Wilson',
    duration: '6 weeks',
    category: 'Management',
    image: '/project-management-course.png',
    description: 'Learn agile methodologies, project planning, and leadership skills for modern teams. Get certified and lead with confidence.',
    price: '$179',
    rating: 4.6,
    students: 987,
    level: 'Intermediate'
  },
  {
    id: 6,
    title: 'Cybersecurity Fundamentals',
    instructor: 'Lisa Anderson',
    duration: '14 weeks',
    category: 'Security',
    image: '/cybersecurity-course.png',
    description: 'Protect systems and networks from digital attacks. Learn ethical hacking and security best practices to safeguard data.',
    price: '$349',
    rating: 4.8,
    students: 756,
    level: 'Advanced'
  }
]

const categories = ['All', 'Programming', 'Marketing', 'Data Science', 'Design', 'Management', 'Security']

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white"> {/* Changed to emerald/green/teal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-sm font-semibold mb-6">
            <Lightbulb className="w-4 h-4 mr-2" />
            Unlock Your Potential
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Learn New Skills,
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-lime-300 bg-clip-text text-transparent"> {/* Changed to yellow/lime */}
              Advance Your Career
            </span>
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8"> {/* Changed to emerald */}
            Choose from hundreds of expert-led courses designed to help you master in-demand skills and achieve your career goals.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-emerald-200">Courses</div> {/* Changed to emerald */}
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-emerald-200">Students</div> {/* Changed to emerald */}
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4.8★</div>
              <div className="text-emerald-200">Average Rating</div> {/* Changed to emerald */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search courses, instructors, or topics..."
                className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-emerald-500 rounded-xl" // Changed to emerald
              />
            </div>
            <Button className="bg-emerald-500 hover:bg-emerald-600 h-12 px-8 text-lg font-semibold rounded-xl"> {/* Changed to emerald */}
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-12 px-6 border-2 border-gray-200 hover:border-emerald-300 rounded-xl"> {/* Changed to emerald */}
              <Filter className="h-5 w-5" />
              Filters
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'All' ? 'default' : 'outline'}
                className={`rounded-full px-6 py-2 font-medium transition-all duration-300 ${
                  category === 'All' 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg' // Changed to emerald
                    : 'border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50' // Changed to emerald
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="px-8 py-3 text-lg font-semibold border-2 border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl"> {/* Changed to emerald */}
            Load More Courses
          </Button>
        </div>
      </div>
    </div>
  )
}
