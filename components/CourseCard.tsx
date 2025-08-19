import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, User, Star, Users, BookOpen, DollarSign } from 'lucide-react'

interface Course {
  id: number
  title: string
  instructor: string
  duration: string
  category: string
  image: string
  description: string
  price: string
  rating: number
  students: number
  level: string
}

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
      <div className="relative overflow-hidden">
        <Image
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-emerald-500 text-white font-semibold px-3 py-1"> {/* Changed to emerald */}
            {course.category}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-emerald-600 flex items-center"> {/* Changed to emerald */}
            <DollarSign className="h-3 w-3 mr-1" />
            {course.price}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-xs font-medium border-emerald-200 text-emerald-700"> {/* Changed to emerald */}
            {course.level}
          </Badge>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold text-gray-700">{course.rating}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2"> {/* Changed to emerald */}
          {course.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1 text-emerald-500" /> {/* Changed to emerald */}
              <span>{course.instructor}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-green-500" /> {/* Changed to green */}
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-teal-500" /> {/* Changed to teal */}
              <span>{course.students.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-emerald-200 transition-all duration-300 transform hover:scale-105"> {/* Changed to emerald */}
          <BookOpen className="w-4 h-4 mr-2" />
          Enroll Now
        </Button>
      </div>
    </div>
  )
}
