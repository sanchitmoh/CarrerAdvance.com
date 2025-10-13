'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Star,
  Clock,
  Award,
  Users,
  GraduationCap,
  Rocket,
  ThumbsUp,
  Share2,
} from 'lucide-react'

export default function CertificationsPage() {
  const [activeTab, setActiveTab] = useState('all')

  const certifications = [
    {
      id: 1,
      title: 'Full Stack Web Development',
      subtitle: 'Learn to build modern web apps',
      icon: '/api/placeholder/80/80',
      duration: '12 weeks',
      level: 'Beginner',
      lessons: 48,
      price: 'Free',
      badge: 'New',
      rating: 5,
      category: 'Web Development',
      instructor: 'John Doe',
    },
    {
      id: 2,
      title: 'Data Science with Python',
      subtitle: 'Master Python for data analysis',
      icon: '/api/placeholder/80/80',
      duration: '8 weeks',
      level: 'Intermediate',
      lessons: 36,
      price: '$99',
      badge: 'Most Popular',
      rating: 4,
      category: 'Data Science',
      instructor: 'Jane Smith',
    },
    {
      id: 3,
      title: 'UI/UX Design Essentials',
      subtitle: 'Design beautiful user interfaces',
      icon: '/api/placeholder/80/80',
      duration: '6 weeks',
      level: 'Beginner',
      lessons: 24,
      price: '$79',
      badge: 'Hot',
      rating: 5,
      category: 'Design',
      instructor: 'Alice Johnson',
    },
  ]

  const categories = [
    { id: 'all', label: 'All', count: certifications.length },
    { id: 'Web Development', label: 'Web Development', count: certifications.filter(c => c.category === 'Web Development').length },
    { id: 'Data Science', label: 'Data Science', count: certifications.filter(c => c.category === 'Data Science').length },
    { id: 'Design', label: 'Design', count: certifications.filter(c => c.category === 'Design').length },
  ]

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const filteredCertifications =
    activeTab === 'all'
      ? certifications
      : certifications.filter(cert => cert.category === activeTab)

  return (
    <div className="pt-24 bg-gradient-to-br from-gray-50 to-emerald-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1.5 text-sm bg-white border-emerald-200 text-emerald-700">
            <GraduationCap className="h-4 w-4 mr-1" />
            Verified Certifications
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            Boost Your <span className="text-emerald-600">Skills & Career</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our professional certifications and gain recognized credentials to showcase your expertise.
          </p>
        </div>

        {/* Tabs / Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white p-1 border border-emerald-100 rounded-xl">
            {categories.map(cat => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all duration-200"
              >
                {cat.label} ({cat.count})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertifications.map(cert => (
                <Card key={cert.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-emerald-50">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-4 items-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {cert.title.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h2 className="font-semibold text-gray-900">{cert.title}</h2>
                          <p className="text-sm text-gray-600">{cert.subtitle}</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">{cert.badge}</Badge>
                    </div>

                    {/* Info */}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span><Clock className="inline h-4 w-4 mr-1" />{cert.duration}</span>
                      <span>{cert.level}</span>
                      <span>{cert.lessons} Lessons</span>
                      <span className="font-semibold">{cert.price}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">{getRatingStars(cert.rating)}</div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center space-x-3 pt-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {cert.instructor.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-sm text-gray-700">Instructor: {cert.instructor}</div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl">
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white text-center overflow-hidden">
          <CardContent className="p-12 space-y-6 relative">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative z-10">
              <GraduationCap className="h-12 w-12 mx-auto text-emerald-300 mb-4" />
              <h2 className="text-3xl font-bold">Start Your Certification Journey Today!</h2>
              <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                Earn verified certificates and showcase your skills to employers worldwide.
              </p>
              <Button className="mt-4 bg-white text-emerald-600 font-semibold rounded-xl px-6 py-2.5 hover:bg-gray-100">
                Browse All Certifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}