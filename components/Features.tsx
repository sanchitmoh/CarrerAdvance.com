'use client'

import { User, Upload, Briefcase, BookOpen, MessageSquare, Shield, Brain, Rocket, Target, Globe, Zap, Star, Lightbulb, TrendingUp, X } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Our advanced AI analyzes your skills, experience, and preferences to match you with perfect opportunities, saving you time and effort.',
    color: 'from-emerald-500 to-green-500',
    delay: 0
  },
  {
    icon: Rocket,
    title: 'Career Acceleration Paths',
    description: 'Fast-track your career with personalized learning paths, skill development recommendations, and expert-led courses tailored to your goals.',
    color: 'from-green-500 to-teal-500',
    delay: 0.2
  },
  {
    icon: Target,
    title: 'Precision Job Targeting',
    description: 'Connect with the right employers and opportunities that align precisely with your career goals, values, and aspirations, not just keywords.',
    color: 'from-teal-500 to-lime-500',
    delay: 0.4
  },
  {
    icon: Globe,
    title: 'Expansive Global Network',
    description: 'Access a vast network of opportunities worldwide and connect with top professionals from leading companies across diverse industries globally.',
    color: 'from-lime-500 to-yellow-500',
    delay: 0.6
  },
  {
    icon: Zap,
    title: 'Streamlined Applications',
    description: 'Apply to multiple jobs with one click using our smart application system, track your progress, and manage all your applications from a single dashboard.',
    color: 'from-emerald-700 to-green-700',
    delay: 0.8
  },
  {
    icon: Star,
    title: 'Premium User Experience',
    description: 'Enjoy a seamless, intuitive, and visually stunning interface designed for the next generation of career professionals, making your journey effortless.',
    color: 'from-green-700 to-teal-700',
    delay: 1.0
  }
]

// Custom Toast Component
function Toast({ message, isVisible, onClose }: { message: string; isVisible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-emerald-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 min-w-[300px]">
        <div className="flex-1">
          <p className="font-semibold">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-emerald-700 rounded-full p-1 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function Features() {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [toast, setToast] = useState({ isVisible: false, message: '' })

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

  // Function to handle Learn More click
  const handleLearnMore = (featureTitle: string) => {
    setToast({ 
      isVisible: true, 
      message: `${featureTitle} - Coming Soon!` 
    })
  }

  const closeToast = () => {
    setToast({ isVisible: false, message: '' })
  }

  return (
    <>
      <section className="py-32 bg-gradient-to-br from-white via-emerald-50/30 to-green-50/30" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-20 transition-all duration-600 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 text-sm font-semibold mb-6 transition-transform duration-300 hover:scale-105"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Innovative Solutions
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                Dominate Your Career
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Experience the future of career development with our cutting-edge platform designed for ambitious professionals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative modern-card p-8 hover:shadow-2xl transition-all duration-500 border-2 border-gray-200/50 hover:border-emerald-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: isInView ? `${feature.delay}s` : '0s' }}
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative">
                  <div 
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl`}
                  >
                    <feature.icon className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed text-lg font-medium">
                    {feature.description}
                  </p>
                  
                  {/* Hover Arrow */}
                  <button 
                    onClick={() => handleLearnMore(feature.title)}
                    className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 cursor-pointer bg-transparent border-none text-left"
                  >
                    <span className="text-emerald-600 font-bold text-sm flex items-center">
                      Learn More 
                      <span
                        className="ml-2 inline-block animate-[bounceX_1.5s_infinite]"
                      >
                        →
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Toast */}
      <Toast 
        message={toast.message} 
        isVisible={toast.isVisible} 
        onClose={closeToast} 
      />
    </>
  )
}