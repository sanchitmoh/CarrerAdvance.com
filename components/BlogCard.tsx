import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Clock, Eye, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Blog {
  id: number
  title: string
  excerpt?: string
  description?: string
  content?: string
  image?: string
  image_default?: string
  image_url?: string
  author?: string
  date?: string
  created_date?: string
  category?: string
  readTime?: string
  read_time?: string
  views?: number
}

interface BlogCardProps {
  blog: Blog
}

export default function BlogCard({ blog }: BlogCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return 'Recently';
    }
  }

  const getImageSrc = () => {
    // Debug: log the image values
    console.log('Blog image data:', {
      image: blog.image,
      image_default: blog.image_default,
      image_url: blog.image_url,
      id: blog.id,
      title: blog.title
    });
    
    // Use the normalized image_url field first, then fallback to individual fields
    if (blog.image_url && blog.image_url !== '') return blog.image_url;
    if (blog.image && blog.image !== '') return blog.image;
    if (blog.image_default && blog.image_default !== '') return blog.image_default;
    return "/placeholder.svg?height=250&width=400&text=Blog+Image";
  }

  return (
    <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
      <div className="relative overflow-hidden">
        <Image
          src={getImageSrc()}
          alt={blog.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-emerald-500 text-white font-semibold px-3 py-1"> {/* Changed to emerald */}
            {blog.category || 'Blog'}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-emerald-500" /> {/* Changed to emerald */}
              <span>{blog.readTime || blog.read_time || '5 min'}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1 text-green-500" /> {/* Changed to green */}
              <span>{(blog.views || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight"> {/* Changed to emerald */}
          {blog.title}
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {blog.excerpt || blog.description || 'No description available.'}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/placeholder.svg?height=32&width=32&text=A"
              alt={blog.author}
              className="w-8 h-8 rounded-full mr-3 border border-gray-200"
            />
            <div>
              <div className="font-semibold text-gray-900 text-sm">{blog.author || 'Author'}</div>
              <div className="text-xs text-gray-500">{formatDate(blog.date || blog.created_date)}</div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-full group-hover:translate-x-1 transition-all duration-300"
            onClick={() => setIsDialogOpen(true)}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Blog Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{blog.title}</DialogTitle>
            <DialogDescription>
              {blog.excerpt || blog.description || 'Read the full article below.'}
            </DialogDescription>
            {blog.category && (
              <Badge className="bg-emerald-500 text-white font-semibold px-3 py-1 mt-2 w-fit">
                {blog.category}
              </Badge>
            )}
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Blog Image */}
            {getImageSrc() && (
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={getImageSrc()}
                  alt={blog.title}
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
            
            {/* Blog Meta */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{blog.author || 'Author'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(blog.date || blog.created_date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{blog.readTime || blog.read_time || '5 min'}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{(blog.views || 0).toLocaleString()} views</span>
                </div>
              </div>
            </div>
            
            {/* Blog Content */}
            <div className="prose prose-gray max-w-none">
              {blog.content ? (
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {blog.excerpt || blog.description || 'No content available.'}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  )
}
