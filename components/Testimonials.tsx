'use client'

import { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote, MapPin, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Senior Software Engineer',
    company: 'Google',
    image: '/placeholder.svg?height=80&width=80&text=SC',
    content: 'CareerAdvance completely transformed my job search. The AI matching was incredibly accurate, and I landed my dream role at Google within 3 weeks!',
    rating: 5,
    salary: '$180K',
    location: 'San Francisco'
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager',
    company: 'Microsoft',
    image: '/placeholder.svg?height=80&width=80&text=MJ',
    content: 'The platform\'s modern interface and smart recommendations helped me transition from engineering to product management seamlessly. Highly recommend!',
    rating: 5,
    salary: '$165K',
    location: 'Seattle'
  },
  {
    name: 'Elena Rodriguez',
    role: 'UX Design Lead',
    company: 'Airbnb',
    image: '/placeholder.svg?height=80&width=80&text=ER',
    content: 'As a designer, I appreciated the beautiful, intuitive interface. More importantly, it connected me with opportunities I never would have found elsewhere.',
    rating: 5,
    salary: '$155K',
    location: 'Remote'
  },
  {
    name: 'David Kim',
    role: 'Data Scientist',
    company: 'Netflix',
    image: '/placeholder.svg?height=80&width=80&text=DK',
    content: 'The AI-powered job matching is next level. It understood my skills better than I did and found me the perfect role in machine learning.',
    rating: 5,
    salary: '$170K',
    location: 'Los Angeles'
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        setIsTransitioning(false);
      }, 500); // Half of the total transition duration
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      setIsTransitioning(false);
    }, 500);
  };

  const prevTestimonial = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <section className="py-32 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden"> {/* Changed to emerald/green/teal */}
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-emerald-300/20 to-green-300/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite_alternate]" // Changed to emerald/green
        />
        <div 
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-green-300/20 to-teal-300/20 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite_alternate_2s]" // Changed to green/teal
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="text-center mb-20 opacity-0 translate-y-8 animate-fade-in-up"
        >
          <div
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 text-sm font-semibold mb-6 transition-transform duration-300 hover:scale-105" // Changed to emerald/green
          >
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            Success Stories
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
            Real People,{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent"> {/* Changed to emerald/green/teal */}
              Real Results
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
            Join thousands of professionals who have transformed their careers and achieved their dreams.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div
            className={`modern-card p-12 shadow-2xl border-2 border-gray-200/50 transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0 translate-x-12' : 'opacity-100 translate-x-0'}`}
          >
            {/* Quote Icon */}
            <div
              className="flex justify-center mb-8 transition-transform duration-300 scale-0 animate-[scaleIn_0.5s_ease-out_forwards_0.2s]"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg"> {/* Changed to emerald/green */}
                <Quote className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center mb-8">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-6 text-yellow-400 fill-current mx-1 transition-transform duration-300 scale-0 animate-[scaleIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  <Star />
                </div>
              ))}
            </div>
            
            <blockquote className="text-2xl md:text-3xl text-gray-700 text-center mb-12 leading-relaxed font-medium">
              "{testimonials[currentIndex].content}"
            </blockquote>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center space-x-4">
                <img
                  src={testimonials[currentIndex].image || "/placeholder.svg"}
                  alt={testimonials[currentIndex].name}
                  className="w-16 h-16 rounded-full border-4 border-emerald-100 shadow-lg transition-transform duration-300 hover:scale-110" // Changed to emerald
                />
                <div className="text-center md:text-left">
                  <div className="font-bold text-gray-900 text-xl">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-emerald-600 font-semibold"> {/* Changed to emerald */}
                    {testimonials[currentIndex].role}
                  </div>
                  <div className="text-gray-500 font-medium">
                    {testimonials[currentIndex].company}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-6 text-center">
                <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-700" />
                  <div className="text-green-700 font-bold text-lg">{testimonials[currentIndex].salary}</div>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl flex items-center gap-2"> {/* Changed to emerald/teal */}
                  <MapPin className="h-4 w-4 text-emerald-700" /> {/* Changed to emerald */}
                  <div className="text-emerald-700 font-bold text-lg">{testimonials[currentIndex].location}</div> {/* Changed to emerald */}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-white shadow-xl hover:shadow-2xl border-2 border-gray-200 hover:border-emerald-300 w-12 h-12 rounded-full" // Changed to emerald
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-white shadow-xl hover:shadow-2xl border-2 border-gray-200 hover:border-emerald-300 w-12 h-12 rounded-full" // Changed to emerald
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-12 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                title={`Go to testimonial ${index + 1}`}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex 
                    ? 'w-12 h-3 bg-gradient-to-r from-emerald-500 to-green-500' // Changed to emerald/green
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
