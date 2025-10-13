'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Users, Video, Share2 } from 'lucide-react'

export default function WebinarsPage() {
  const [viewUpcoming, setViewUpcoming] = useState(true)

  const webinars = [
    {
      id: 1,
      title: 'AI in 2025: Trends & Opportunities',
      speaker: 'Dr. Amanda Lee',
      company: 'Tech Innovators',
      date: 'Oct 20, 2025',
      time: '3:00 PM - 4:30 PM IST',
      duration: '1.5 hrs',
      type: 'Live',
      seats: 120,
      thumbnail: '/api/placeholder/300/200',
    },
    {
      id: 2,
      title: 'Mastering Remote Collaboration',
      speaker: 'Marcus Rodriguez',
      company: 'GlobalWork Inc',
      date: 'Oct 25, 2025',
      time: '5:00 PM - 6:00 PM IST',
      duration: '1 hr',
      type: 'Live',
      seats: 80,
      thumbnail: '/api/placeholder/300/200',
    },
    {
      id: 3,
      title: 'UX Design for Beginners',
      speaker: 'Jessica Williams',
      company: 'CreativeStudio',
      date: 'Recorded',
      time: 'N/A',
      duration: '45 mins',
      type: 'Recording',
      seats: 0,
      thumbnail: '/api/placeholder/300/200',
    },
    {
      id: 4,
      title: 'Data Science Bootcamp Overview',
      speaker: 'David Kim',
      company: 'AI Solutions Ltd',
      date: 'Oct 28, 2025',
      time: '2:00 PM - 3:30 PM IST',
      duration: '1.5 hrs',
      type: 'Live',
      seats: 50,
      thumbnail: '/api/placeholder/300/200',
    },
  ]

  return (
    <div className="pt-24 bg-gradient-to-br from-gray-50 to-emerald-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1.5 text-sm bg-white border-emerald-200 text-emerald-700">
            <Video className="h-4 w-4 mr-1" />
            Webinars
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            Learn Live with <span className="text-emerald-600">Experts</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join live sessions, interact with speakers, or watch recordings anytime.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center space-x-4">
          <Button
            variant={viewUpcoming ? 'default' : 'outline'}
            className="rounded-full px-6 py-2"
            onClick={() => setViewUpcoming(true)}
          >
            Upcoming
          </Button>
          <Button
            variant={!viewUpcoming ? 'default' : 'outline'}
            className="rounded-full px-6 py-2"
            onClick={() => setViewUpcoming(false)}
          >
            Recorded
          </Button>
        </div>

        {/* Featured Webinar */}
        <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 space-y-6">
                <Badge className="bg-white/20 text-white border-0">Featured Webinar</Badge>
                <h2 className="text-3xl font-bold">{webinars[0].title}</h2>
                <p className="text-white/80">
                  Speaker: {webinars[0].speaker} | {webinars[0].company}
                </p>
                <div className="flex items-center space-x-4 text-white/80">
                  <Calendar className="h-4 w-4" />
                  <span>{webinars[0].date}</span>
                  <Clock className="h-4 w-4" />
                  <span>{webinars[0].time}</span>
                </div>
                <Button className="bg-white text-emerald-600 font-semibold rounded-xl px-6 py-2.5 hover:bg-gray-100">
                  Register Now
                </Button>
              </div>
              <div className="flex items-center justify-center p-8">
                <img
                  src={webinars[0].thumbnail}
                  alt={webinars[0].title}
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Webinar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {webinars
            .filter(w => viewUpcoming ? w.type === 'Live' : w.type === 'Recording')
            .map(webinar => (
              <Card key={webinar.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-emerald-50">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={webinar.thumbnail}
                      alt={webinar.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge
                      className={`absolute top-3 left-3 ${
                        webinar.type === 'Live' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
                      }`}
                    >
                      {webinar.type}
                    </Badge>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">{webinar.title}</h3>
                    <p className="text-sm text-gray-600">Speaker: {webinar.speaker}</p>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span><Calendar className="inline h-4 w-4 mr-1" />{webinar.date}</span>
                      <span><Clock className="inline h-4 w-4 mr-1" />{webinar.time}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Duration: {webinar.duration}</span>
                      {webinar.seats > 0 && <span>Seats: {webinar.seats}</span>}
                    </div>
                    <Button
                      className={`w-full ${
                        webinar.type === 'Live'
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      } font-semibold rounded-xl`}
                    >
                      {webinar.type === 'Live' ? 'Register Now' : 'Watch Recording'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white text-center overflow-hidden">
          <CardContent className="p-12 space-y-6 relative">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative z-10">
              <Users className="h-12 w-12 mx-auto text-emerald-300 mb-4" />
              <h2 className="text-3xl font-bold">Stay Updated with Our Webinars</h2>
              <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                Register for live webinars or watch recordings to enhance your skills.
              </p>
              <Button className="mt-4 bg-white text-emerald-600 font-semibold rounded-xl px-6 py-2.5 hover:bg-gray-100">
                View All Webinars
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}