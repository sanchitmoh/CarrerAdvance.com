'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, TrendingUp, Users, Award, Zap, Play, ArrowRight, Sparkles, Star, Briefcase, BookOpen } from 'lucide-react'

const popularKeywords = ['React Developer', 'AI/ML Engineer', 'Product Manager', 'Digital Marketing', 'Data Scientist', 'Cybersecurity Analyst']

const floatingElements = [
  { icon: TrendingUp, position: 'top-20 left-10', delay: 0, color: 'text-emerald-500' }, // Changed to emerald
  { icon: Users, position: 'top-32 right-20', delay: 0.5, color: 'text-green-500' },     // Changed to green
  { icon: Award, position: 'bottom-32 left-20', delay: 1, color: 'text-teal-500' },     // Changed to teal
  { icon: Zap, position: 'bottom-20 right-10', delay: 1.5, color: 'text-lime-500' },     // Changed to lime
]

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '15K+', label: 'Jobs Posted' },
  { value: '500+', label: 'Companies' },
  { value: '98%', label: 'Success Rate' },
]

export default function Hero() {
  const router = useRouter()
  const [jobSearch, setJobSearch] = useState('')
  const [location, setLocation] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Build query parameters
    const params = new URLSearchParams()
    if (jobSearch) params.append('title', jobSearch)
    if (location) params.append('location', location)
    
    // Navigate to jobs page with search parameters
    const queryString = params.toString()
    const jobsUrl = queryString ? `/jobs?${queryString}` : '/jobs'
    router.push(jobsUrl)
  }

  const handleKeywordClick = (keyword: string) => {
    setJobSearch(keyword)
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-950 overflow-hidden pt-20 flex items-center justify-center"> {/* Changed background gradient */}
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div 
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-emerald-400/20 via-green-400/20 to-teal-400/20 rounded-full blur-3xl animate-[pulse_20s_ease-in-out_infinite_alternate]" // Changed to emerald/green/teal
        />
        <div 
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-green-400/20 via-lime-400/20 to-yellow-400/20 rounded-full blur-3xl animate-[pulse_15s_ease-in-out_infinite_alternate_2s]" // Changed to green/lime/yellow
        />
        
        {/* Cyber Grid with subtle animation */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-[grid-pan_60s_linear_infinite]"></div>
        
        {/* Floating Icons */}
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className={`absolute ${element.position} opacity-30 animate-float`}
            style={{ animationDelay: `${element.delay}s` }}
          >
            <element.icon className={`w-12 h-12 ${element.color} drop-shadow-lg`} />
          </div>
        ))}
      </div>
      
      <div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 opacity-0 animate-fade-in-up"
      >
        <div className="text-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 text-emerald-200 text-sm font-semibold mb-8 shadow-lg transition-transform duration-300 hover:scale-105 hover:translate-y-[-2px] active:scale-95" // Changed to emerald/green
          >
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            #1 Next-Gen Career Platform 2024
            <Sparkles className="w-4 h-4 ml-2 text-green-500" /> {/* Changed to green */}
          </div>
          
          {/* Main Headline */}
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8 tracking-tight animate-fade-in-up delay-200 text-white drop-shadow-2xl"
          >
            <span 
              className="bg-gradient-to-r from-white via-emerald-300 to-green-300 bg-clip-text text-transparent animate-[gradient-shift_5s_infinite_alternate]" // Changed to emerald/green
            >
              Transform Your
            </span>
            <br />
            <span 
              className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent relative animate-[gradient-shift_3s_infinite_alternate]" // Changed to emerald/green/teal
            >
              Career Journey
              <div
                className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full scale-x-0 animate-[scaleX_1.5s_ease-out_forwards_1s]" // Changed to emerald/green
              />
            </span>
          </h1>
          
          {/* Subheading */}
          <p 
            className="text-xl md:text-2xl text-emerald-100 max-w-4xl mx-auto mb-12 leading-relaxed font-medium animate-fade-in-up delay-400" // Changed to emerald
          >
            Join the future of work with our AI-powered platform connecting{' '}
            <span 
              className="font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent transition-transform duration-200 hover:scale-105 inline-block" // Changed to emerald/teal
            >
              talent
            </span>,{' '}
            <span 
              className="font-bold bg-gradient-to-r from-green-300 to-lime-300 bg-clip-text text-transparent transition-transform duration-200 hover:scale-105 inline-block" // Changed to green/lime
            >
              opportunities
            </span>, and{' '}
            <span 
              className="font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent transition-transform duration-200 hover:scale-105 inline-block" // Kept yellow/orange for contrast
            >
              innovation
            </span>
          </p>
          
          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up delay-600"
          >
            <div
              className="transition-transform duration-300 hover:scale-105 hover:translate-y-[-2px] active:scale-95"
            >
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-10 py-4 text-lg font-bold shadow-2xl hover:shadow-emerald-300 transition-all duration-300 rounded-2xl group"> {/* Changed to emerald/green */}
                <Briefcase className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                Find Your Dream Job
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div
              className="transition-transform duration-300 hover:scale-105 hover:translate-y-[-2px] active:scale-95"
            >
              <Button size="lg" variant="outline" className="border-2 border-emerald-400 text-emerald-200 hover:bg-emerald-500/10 hover:text-white hover:border-emerald-300 px-10 py-4 text-lg font-bold transition-all duration-300 rounded-2xl group backdrop-blur-sm"> {/* Changed to emerald */}
                <BookOpen className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Explore Courses
              </Button>
            </div>
          </div>
          
          {/* Modern Search Form */}
          <div 
            className="max-w-5xl mx-auto mb-16 animate-fade-in-up delay-800"
          >
            <form 
              onSubmit={handleSearch} 
              className="modern-card p-8 shadow-2xl border-2 border-gray-200/50 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl bg-white/10 backdrop-blur-md border-white/20"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                <div 
                  className="flex-1 relative group transition-transform duration-200 focus-within:scale-[1.02]"
                >
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 group-focus-within:text-emerald-500 transition-colors" /> {/* Changed to emerald */}
                  <Input
                    type="text"
                    placeholder="Job title, skills, or company"
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    className="pl-16 h-16 text-lg border-2 border-gray-200 focus:border-emerald-500 rounded-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium text-gray-900" // Changed to emerald
                  />
                </div>
                <div 
                  className="flex-1 relative group transition-transform duration-200 focus-within:scale-[1.02]"
                >
                  <MapPin className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 group-focus-within:text-green-500 transition-colors" /> {/* Changed to green */}
                  <Input
                    type="text"
                    placeholder="Location or remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-16 h-16 text-lg border-2 border-gray-200 focus:border-green-500 rounded-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium text-gray-900" // Changed to green
                  />
                </div>
                <div
                  className="transition-transform duration-300 hover:scale-105 active:scale-95"
                >
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 h-16 px-10 text-lg font-bold shadow-xl hover:shadow-emerald-300 transition-all duration-300 rounded-2xl" // Changed to emerald/green
                  >
                    Search
                  </Button>
                </div>
              </div>
              
              {/* Popular Keywords */}
              <div className="mt-8 text-left">
                <span className="text-emerald-300 font-bold mr-6 text-lg">Trending:</span> {/* Changed to emerald */}
                <div className="inline-flex flex-wrap gap-3 mt-3">
                  {popularKeywords.map((keyword, index) => (
                    <span
                      key={keyword}
                      onClick={() => handleKeywordClick(keyword)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-900/30 to-green-900/30 text-emerald-200 rounded-full text-sm font-semibold hover:from-emerald-800/50 hover:to-green-800/50 cursor-pointer transition-all duration-300 hover:scale-110 hover:translate-y-[-2px] active:scale-95 opacity-0 translate-y-10 animate-fade-in-up" // Changed to emerald/green
                      style={{ animationDelay: `${2 + index * 0.1}s` }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Stats */}
          <div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in-up delay-[2.5s]"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group opacity-0 scale-50 animate-fade-in-up"
                style={{ animationDelay: `${2.5 + index * 0.1}s` }}
              >
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent mb-2"> {/* Changed to emerald/green */}
                  {stat.value}
                </div>
                <div className="text-emerald-100 font-semibold">{stat.label}</div> {/* Changed to emerald */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
