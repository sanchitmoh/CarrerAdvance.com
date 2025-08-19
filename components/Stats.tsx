'use client'

import { useEffect, useState, useRef } from 'react'
import { Users, Briefcase, GraduationCap, Building, TrendingUp, Award, CheckCircle } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: 75000,
    label: 'Active Professionals',
    suffix: '+',
    color: 'from-emerald-500 to-green-500', // Changed to emerald/green
    description: 'A thriving community of ambitious individuals.'
  },
  {
    icon: Briefcase,
    value: 25000,
    label: 'Dream Jobs Posted',
    suffix: '+',
    color: 'from-green-500 to-teal-500', // Changed to green/teal
    description: 'New opportunities added every single month.'
  },
  {
    icon: Building,
    value: 5000,
    label: 'Top Companies',
    suffix: '+',
    color: 'from-teal-500 to-lime-500', // Changed to teal/lime
    description: 'Leading organizations trust our platform.'
  },
  {
    icon: Award,
    value: 98,
    label: 'Success Rate',
    suffix: '%',
    color: 'from-lime-500 to-yellow-500', // Changed to lime/yellow
    description: 'Proven track record in job placement.'
  }
]

function CountUp({ end, duration = 2000, inView }: { end: number; duration?: number; inView: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, inView])

  return <span>{count.toLocaleString()}</span>
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <section className="py-24 bg-gradient-to-r from-gray-950 via-emerald-950 to-gray-950 relative overflow-hidden" ref={ref}> {/* Changed to emerald */}
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-600/10 to-green-600/10 animate-[gradient-shift-bg_8s_infinite_alternate]" // Changed to emerald/green
        />
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-600 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 text-emerald-200 text-sm font-semibold mb-6 transition-all duration-300 hover:scale-105" // Changed to emerald/green
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Our Impact
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent"> {/* Changed to emerald/green */}
              Industry Leaders
            </span>{' '}
            & Thousands of Professionals
          </h2>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto"> {/* Changed to emerald */}
            Join thousands of professionals who have transformed their careers with our platform
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`text-center group transition-all duration-600 ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-80'}`}
              style={{ transitionDelay: isInView ? `${index * 0.2}s` : '0s' }}
            >
              <div 
                className="relative mb-6 transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px] active:scale-95"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r ${stat.color} shadow-2xl transition-all duration-300 group-hover:shadow-emerald-400/25`}> {/* Changed to emerald */}
                  <stat.icon className="h-10 w-10 text-white" />
                </div>
                <div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-[rotate_20s_infinite_linear]"
                />
              </div>
              
              <div 
                className={`text-4xl lg:text-5xl font-bold text-white mb-2 transition-transform duration-500 ${isInView ? 'scale-100' : 'scale-0'}`}
                style={{ transitionDelay: isInView ? `${index * 0.2 + 0.3}s` : '0s' }}
              >
                <CountUp end={stat.value} inView={isInView} />
                {stat.suffix}
              </div>
              
              <div 
                className={`text-emerald-100 font-bold text-lg mb-2 transition-opacity duration-500 ${isInView ? 'opacity-100' : 'opacity-0'}`} // Changed to emerald
                style={{ transitionDelay: isInView ? `${index * 0.2 + 0.6}s` : '0s' }}
              >
                {stat.label}
              </div>
              
              <div 
                className={`text-emerald-300 text-sm transition-opacity duration-500 ${isInView ? 'opacity-100' : 'opacity-0'}`} // Changed to emerald
                style={{ transitionDelay: isInView ? `${index * 0.2 + 0.8}s` : '0s' }}
              >
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
