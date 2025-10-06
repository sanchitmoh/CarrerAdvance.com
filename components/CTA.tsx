'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Rocket, Star, CheckCircle } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

export default function CTA() {
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

    if (ref.current) observer.observe(ref.current)
    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [])

  return (
    <section
      className="py-32 bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-950 relative overflow-hidden"
      ref={ref}
    >
      {/* 🌈 Background Layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-transparent to-green-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-600/5 to-teal-600/5 rounded-full blur-3xl animate-[pulse_10s_infinite_alternate]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-green-600/5 to-lime-600/5 rounded-full blur-3xl animate-[pulse_12s_infinite_alternate_2s]"></div>
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      {/* 🌟 Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 text-emerald-200 text-sm font-semibold mb-8 transition-all duration-600 hover:scale-105 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Ready to Transform Your Career?
          <Star className="w-4 h-4 ml-2" />
        </div>

        <h2
          className={`text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight transition-all duration-600 delay-200 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Start Your Journey
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
            Today
          </span>
        </h2>

        <p
          className={`text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto mb-16 font-medium transition-all duration-600 delay-400 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Join over 75,000 professionals who have already advanced their careers with our next-generation platform.
        </p>

        {/* 🚀 CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-8 justify-center mb-16 transition-all duration-600 delay-600 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Get Started → /job-seekers/login */}
          <div className="transition-transform duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95">
            <Link href="/job-seekers/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-12 py-4 text-xl font-bold shadow-2xl hover:shadow-emerald-400/25 transition-all duration-300 rounded-2xl group"
              >
                <Rocket className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                Get Started Free
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Learn More */}
          <div className="transition-transform duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-emerald-400 text-emerald-200 hover:bg-emerald-500/10 hover:text-white hover:border-emerald-300 px-12 py-4 text-xl font-bold transition-all duration-300 rounded-2xl backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* ✅ Trust Badges */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-emerald-200 transition-all duration-600 delay-800 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium">No credit card required</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium">Free forever plan</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-medium">Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}