'use client'

import { Code, Palette, BarChart3, Stethoscope, Wrench, GraduationCap, Megaphone, Shield, Brain, Rocket, TrendingUp } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

const categories = [
  {
    icon: Brain,
    title: 'AI & Machine Learning',
    jobs: '18,500+',
    color: 'from-emerald-500 to-green-500', // Changed to emerald/green
    description: 'The frontier of technology, driving innovation across all sectors.',
    growth: '+45%'
  },
  {
    icon: Code,
    title: 'Software Development',
    jobs: '25,200+',
    color: 'from-green-500 to-teal-500', // Changed to green/teal
    description: 'Building the digital infrastructure that powers our modern world.',
    growth: '+32%'
  },
  {
    icon: Palette,
    title: 'Creative Design',
    jobs: '12,800+',
    color: 'from-teal-500 to-lime-500', // Changed to teal/lime
    description: 'Shaping user experiences and visual identities for brands globally.',
    growth: '+28%'
  },
  {
    icon: BarChart3,
    title: 'Data & Analytics',
    jobs: '15,600+',
    color: 'from-lime-500 to-yellow-500', // Changed to lime/yellow
    description: 'Transforming raw data into actionable insights for strategic decision-making.',
    growth: '+38%'
  },
  {
    icon: Rocket,
    title: 'Product Management',
    jobs: '8,900+',
    color: 'from-emerald-700 to-green-700', // Changed to darker emerald/green
    description: 'Leading the development of innovative products from concept to launch.',
    growth: '+42%'
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    jobs: '14,300+',
    color: 'from-green-700 to-teal-700', // Changed to darker green/teal
    description: 'Driving brand visibility and customer engagement in the digital landscape.',
    growth: '+35%'
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    jobs: '9,700+',
    color: 'from-red-500 to-pink-500', // Kept red/pink for security warning/contrast
    description: 'Protecting digital assets and infrastructure from evolving threats.',
    growth: '+52%'
  },
  {
    icon: GraduationCap,
    title: 'Education Technology',
    jobs: '6,400+',
    color: 'from-yellow-500 to-orange-500', // Kept yellow/orange for contrast
    description: 'Innovating learning experiences and educational tools for all ages.',
    growth: '+29%'
  }
]

export default function JobCategories() {
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
      { threshold: 0.1 }
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
    <section className="py-32 bg-gradient-to-br from-gray-50 to-emerald-50/50" ref={ref}> {/* Changed to emerald */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-20 transition-all duration-600 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 text-sm font-semibold mb-6 transition-transform duration-300 hover:scale-105" // Changed to emerald/green
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending Categories
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
            Explore{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent"> {/* Changed to emerald/green/teal */}
              High-Growth
            </span>
            <br />Career Paths
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
            Discover opportunities in the fastest-growing industries and position yourself for the future of work.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`group relative modern-card p-8 hover:shadow-2xl transition-all duration-500 border-2 border-gray-200/50 hover:border-emerald-200 cursor-pointer ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} // Changed to emerald
              style={{ transitionDelay: isInView ? `${index * 0.1}s` : '0s' }}
            >
              {/* Growth Badge */}
              <div
                className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs font-bold rounded-full transition-transform duration-300 ${isInView ? 'scale-100' : 'scale-0'}`}
                style={{ transitionDelay: isInView ? `${index * 0.1 + 0.5}s` : '0s' }}
              >
                {category.growth}
              </div>

              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div> {/* Changed to emerald/green */}
              
              <div className="relative">
                <div 
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} text-white mb-6 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl`}
                >
                  <category.icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors"> {/* Changed to emerald */}
                  {category.title}
                </h3>
                
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2"> {/* Changed to emerald/green */}
                  {category.jobs}
                </p>
                
                <p className="text-gray-600 text-sm font-medium mb-4">
                  {category.description}
                </p>
                
                {/* Hover Effect */}
                <div 
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-[-10px] group-hover:translate-x-0"
                >
                  <span className="text-emerald-600 font-bold text-sm flex items-center"> {/* Changed to emerald */}
                    Explore jobs 
                    <span
                      className="ml-2 inline-block animate-[bounceX_1.5s_infinite]"
                    >
                      →
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
