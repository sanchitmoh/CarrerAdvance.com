'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Briefcase, Target, FileText, TrendingUp } from 'lucide-react'

export default function DashboardWelcome() {
  const quickActions = [
    { icon: FileText, label: 'Update Resume', href: '/job-seekers/dashboard/resume', color: 'from-emerald-500 to-green-500' },
    { icon: Target, label: 'Find Jobs', href: '/job-seekers/dashboard/matching-jobs', color: 'from-green-500 to-teal-500' },
    { icon: Briefcase, label: 'Applications', href: '/job-seekers/dashboard/applications', color: 'from-teal-500 to-lime-500' },
    { icon: TrendingUp, label: 'Career Growth', href: '/courses', color: 'from-lime-500 to-yellow-500' }
  ]

  return (
    <Card className="border-emerald-200 shadow-lg mb-6">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Dashboard! 🎉</h2>
          <p className="text-gray-600">Ready to take the next step in your career journey?</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
