'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, Star, Book, CheckCircle, Award } from 'lucide-react'

export default function LearningPathsPage() {
  const [activeTab, setActiveTab] = useState('all')

  const learningPaths = [
    {
      id: 1,
      title: 'Full-Stack Web Developer',
      description: 'Become a professional Full-Stack Web Developer with hands-on projects',
      difficulty: 'Intermediate',
      duration: '12 weeks',
      courses: 10,
      category: 'Web Development',
      progress: 30,
    },
    {
      id: 2,
      title: 'Data Science & AI',
      description: 'Learn Python, ML, and AI concepts to become a Data Scientist',
      difficulty: 'Advanced',
      duration: '16 weeks',
      courses: 12,
      category: 'Data Science',
      progress: 0,
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      description: 'Master UI/UX design principles and tools to design beautiful interfaces',
      difficulty: 'Beginner',
      duration: '8 weeks',
      courses: 8,
      category: 'Design',
      progress: 70,
    },
    {
      id: 4,
      title: 'Digital Marketing Expert',
      description: 'Learn SEO, SEM, and Social Media Marketing to boost online presence',
      difficulty: 'Beginner',
      duration: '6 weeks',
      courses: 6,
      category: 'Marketing',
      progress: 100,
    },
  ]

  const categories = [
    { id: 'all', label: 'All Paths', count: learningPaths.length },
    { id: 'Web Development', label: 'Web Development', count: learningPaths.filter(lp => lp.category === 'Web Development').length },
    { id: 'Data Science', label: 'Data Science', count: learningPaths.filter(lp => lp.category === 'Data Science').length },
    { id: 'Design', label: 'Design', count: learningPaths.filter(lp => lp.category === 'Design').length },
    { id: 'Marketing', label: 'Marketing', count: learningPaths.filter(lp => lp.category === 'Marketing').length },
  ]

  const filteredPaths = activeTab === 'all'
    ? learningPaths
    : learningPaths.filter(lp => lp.category === activeTab)

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-400'
    return 'bg-gray-300'
  }

  return (
    <div className="pt-24 bg-gradient-to-br from-gray-50 to-emerald-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1.5 text-sm bg-white border-emerald-200 text-emerald-700">
            <Book className="h-4 w-4 mr-1" />
            Learning Paths
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            Structured <span className="text-emerald-600">Learning</span> Paths
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow curated paths to gain skills step-by-step and track your progress.
          </p>
        </div>

        {/* Tabs / Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-white p-1 border border-emerald-100 rounded-xl">
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
              {filteredPaths.map(lp => (
                <Card key={lp.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-emerald-50">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="font-semibold text-gray-900">{lp.title}</h2>
                        <p className="text-sm text-gray-600">{lp.description}</p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">{lp.difficulty}</Badge>
                    </div>

                    {/* Info */}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span><Clock className="inline h-4 w-4 mr-1" />{lp.duration}</span>
                      <span>{lp.courses} Courses</span>
                    </div>

                    {/* Progress */}
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-2 rounded-full ${getProgressColor(lp.progress)}`} style={{ width: `${lp.progress}%` }} />
                    </div>
                    <p className="text-xs text-gray-500">{lp.progress}% completed</p>

                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl">
                      {lp.progress === 100 ? 'Review' : 'Start Learning'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white text-center overflow-hidden">
          <CardContent className="p-12 space-y-6 relative">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative z-10">
              <Award className="h-12 w-12 mx-auto text-emerald-300 mb-4" />
              <h2 className="text-3xl font-bold">Start Your Learning Journey Today</h2>
              <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                Pick a learning path, complete courses, earn certificates, and boost your career.
              </p>
              <Button className="mt-4 bg-white text-emerald-600 font-semibold rounded-xl px-6 py-2.5 hover:bg-gray-100">
                Browse All Learning Paths
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}