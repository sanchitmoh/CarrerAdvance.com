import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, DollarSign, Building, Star, Bookmark, Briefcase } from 'lucide-react'

interface Job {
  id: string
  title: string
  slug?: string
  company_id?: string
  company_name: string
  location: string
  category: string
  industry?: string
  experience_level: string
  salary_min?: number
  salary_max?: number
  job_type: string
  description: string
  requirements: string
  benefits: string
  posted_date: string
  expiry_date?: string
  total_applications?: number
  total_interviewed?: number
  status: string
}

interface JobCardProps {
  job: Job
  onApply?: () => void
  onViewDetails?: () => void
}

export default function JobCard({ job, onApply, onViewDetails }: JobCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recently posted';
    
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Recently posted';
    }
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  }

  return (
    <div className={`group bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border ${
      job.status === 'featured' ? 'border-emerald-200 ring-2 ring-emerald-100' : 'border-gray-100'
    }`}>
      {job.status === 'featured' && (
        <div className="flex items-center mb-4">
          <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
          <span className="text-sm font-semibold text-emerald-600">Featured Job</span>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <img
                src="/placeholder.svg"
                alt={`${job.company_name} logo`}
                className="w-12 h-12 rounded-xl border border-gray-200"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {job.title}
                </h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <Building className="h-4 w-4 mr-1" />
                  <span className="font-medium">{job.company_name}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{formatDate(job.posted_date)}</span>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-emerald-600 p-2">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-emerald-500" /> {/* Changed to emerald */}
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-green-500" />
              <span>{job.job_type}</span>
            </div>
            <div className="flex items-center font-semibold text-emerald-600">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>{job.salary_min && job.salary_max ? `$${job.salary_min}k - $${job.salary_max}k` : 'Salary not specified'}</span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
            {job.description}
          </p>
          
          {job.requirements && (
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 transition-colors">
                {job.requirements}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-3 lg:ml-6 mt-4 lg:mt-0 lg:min-w-[200px]">
          <Button type="button" onClick={onApply} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 shadow-lg hover:shadow-emerald-200 transition-all duration-300 transform hover:scale-105 rounded-xl"> {/* Changed to emerald */}
            <Briefcase className="w-4 h-4 mr-2" />
            Apply Now
          </Button>
          <Button type="button" onClick={onViewDetails} variant="outline" className="border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 font-medium rounded-xl"> {/* Changed to emerald */}
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}
