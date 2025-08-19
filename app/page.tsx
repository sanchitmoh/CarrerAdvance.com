"use client";
import dynamic from 'next/dynamic'

// Dynamically import components that use framer-motion with ssr: false
const Hero = dynamic(() => import('@/components/Hero'), { ssr: false })
const Features = dynamic(() => import('@/components/Features'), { ssr: false })
const JobCategories = dynamic(() => import('@/components/JobCategories'), { ssr: false })
const Stats = dynamic(() => import('@/components/Stats'), { ssr: false })
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: false })
const CTA = dynamic(() => import('@/components/CTA'), { ssr: false })

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <Stats />
      <Features />
      <JobCategories />
      <Testimonials />
      <CTA />
    </main>
  )
}
