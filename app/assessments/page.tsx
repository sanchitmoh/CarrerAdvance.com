'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, BarChart2, Activity, CheckCircle, Star } from 'lucide-react'

export default function SkillAssessmentPage() {
  const [activeTab, setActiveTab] = useState('all')

  const assessments = [
    {
      id: 1,
      title: 'JavaScript Basics',
      description: 'Test your fundamental JavaScript skills',
      difficulty: 'Beginner',
      duration: '20 mins',
      category: 'Web Development',
      progress: 0,
    },
    {
      id: 2,
      title: 'React Advanced',
      description: 'Check your expertise in React concepts',
      difficulty: 'Intermediate',
      duration: '30 mins',
      category: 'Web Development',
      progress: 50,
    },
    {
      id: 3,
      title: 'Python Data Analysis',
      description: 'Assess your data handling skills using Python',
      difficulty: 'Intermediate',
      duration: '25 mins',
      category: 'Data Science',
      progress: 100,
    },
    {
      id: 4,
      title: 'UI/UX Design Challenge',
      description: 'Evaluate your design thinking and UI/UX skills',
      difficulty: 'Beginner',
      duration: '15 mins',
      category: 'Design',
      progress: 0,
    },
  ]

  const categories = [
    { id: 'all', label: 'All', count: assessments.length },
    { id: 'Web Development', label: 'Web Development', count: assessments.filter(a => a.category === 'Web Development').length },
    { id: 'Data Science', label: 'Data Science', count: assessments.filter(a => a.category === 'Data Science').length },
    { id: 'Design', label: 'Design', count: assessments.filter(a => a.category === 'Design').length },
  ]

  const filteredAssessments =
    activeTab === 'all'
      ? assessments
      : assessments.filter(ass => ass.category === activeTab)

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
            <Activity className="h-4 w-4 mr-1" />
            Skill Assessments
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            Test Your <span className="text-emerald-600">Skills</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take assessments to evaluate your knowledge, improve skills, and earn badges.
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
              {filteredAssessments.map(ass => (
                <Card
                  key={ass.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-emerald-50"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="font-semibold text-gray-900">{ass.title}</h2>
                        <p className="text-sm text-gray-600">{ass.description}</p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">{ass.difficulty}</Badge>
                    </div>

                    {/* Info */}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span><Clock className="inline h-4 w-4 mr-1" />{ass.duration}</span>
                      <span>{ass.category}</span>
                    </div>

                    {/* Progress */}
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-2 rounded-full ${getProgressColor(ass.progress)}`} style={{ width: `${ass.progress}%` }} />
                    </div>
                    <p className="text-xs text-gray-500">{ass.progress}% completed</p>

                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl">
                      {ass.progress === 100 ? 'Retake' : 'Start'}
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
              <BarChart2 className="h-12 w-12 mx-auto text-emerald-300 mb-4" />
              <h2 className="text-3xl font-bold">Ready to Challenge Yourself?</h2>
              <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                Complete skill assessments to track your growth and improve your expertise.
              </p>
              <Button className="mt-4 bg-white text-emerald-600 font-semibold rounded-xl px-6 py-2.5 hover:bg-gray-100">
                Browse All Assessments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}