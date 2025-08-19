"use client";
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import JobCategories from '@/components/JobCategories'
import Stats from '@/components/Stats'
import Testimonials from '@/components/Testimonials'
import CTA from '@/components/CTA'

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
