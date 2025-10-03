"use client";
import React, { useEffect, useState } from 'react';
import BlogCard from '@/components/BlogCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, TrendingUp, Clock, Eye, Newspaper } from 'lucide-react'
import { getApiUrl } from '@/lib/api-config'

const defaultCategories = ['All', 'Career Tips', 'Technology', 'Networking', 'Interview Tips', 'Career Growth', 'Skills Development']

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [featuredPost, setFeaturedPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState(defaultCategories);
  const blogsPerPage = 10;

  // Fetch blogs from backend
  const fetchBlogs = async (search = '', category = 'All', page = 1) => {
    setLoading(true);
    setError('');
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      params.append('page', page.toString());
      params.append('limit', blogsPerPage.toString());

      const res = await fetch(getApiUrl(`blogs?${params.toString()}`));
      const data = await res.json();

      if (data?.success) {
        const posts = data.data || [];
        
        // Normalize posts array
        const normalizedPosts = posts.map((p: any) => ({
          ...p,
          image: p.image || p.image_default,
          image_url: p.image_url,
          author: p.author_name || p.author,
          category: p.category_name || p.category,
          created_date: p.created_at || p.created_date,
          views: p.views_count || p.views,
        }));

        setBlogs(normalizedPosts);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
        setCurrentPage(page);

        if (normalizedPosts.length > 0) setFeaturedPost(normalizedPosts[0]);
      } else {
        setError('Failed to fetch blogs.');
      }
    } catch (err) {
      setError('Failed to fetch blogs.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const res = await fetch(getApiUrl('blogs/categories'));
      const data = await res.json();
      
      if (data?.success && data.data) {
        const categoryNames = ['All', ...data.data.map((cat: any) => cat.name)];
        setCategories(categoryNames);
      }
    } catch (err) {
      console.log('Failed to fetch categories, using defaults');
    }
  };

  // Load initial blogs and categories
  useEffect(() => {
    fetchCategories();
    fetchBlogs();
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs(searchQuery, selectedCategory, 1);
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    fetchBlogs(searchQuery, category, 1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    fetchBlogs(searchQuery, selectedCategory, page);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-sm font-semibold mb-6">
            <Newspaper className="w-4 h-4 mr-2" />
            Latest Insights
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Career Insights &
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-lime-300 bg-clip-text text-transparent">
              Expert Advice
            </span>
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
            Stay updated with the latest career trends, industry insights, and professional development tips from our experts.
          </p>
          
          {/* Search */}
          <form className="max-w-2xl mx-auto" onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search articles, topics, or authors..."
                className="pl-12 h-14 text-lg bg-white/10 backdrop-blur-sm border-2 border-white/20 focus:border-white/40 text-white placeholder-white/70 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit"
                className="absolute right-2 top-2 bg-white text-emerald-600 hover:bg-gray-100 h-10 px-6 font-semibold rounded-lg"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Featured Article */}
        {featuredPost && (
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <TrendingUp className="h-6 w-6 text-emerald-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Article</h2>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.image || featuredPost.image_default || "/placeholder.svg"}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full">
                      {featuredPost.category || 'Blog'}
                    </span>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{featuredPost.read_time || '5 min'}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{(featuredPost.views || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt || featuredPost.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src="/placeholder.svg?height=40&width=40&text=AU"
                        alt={featuredPost.author || 'Author'}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{featuredPost.author || 'Author'}</div>
                        <div className="text-sm text-gray-500">
                          {featuredPost.created_date ? new Date(featuredPost.created_date).toLocaleDateString() : 'Recently'}
                        </div>
                      </div>
                    </div>
                    
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold">
                      Read Article
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === selectedCategory ? 'default' : 'outline'}
              className={`rounded-full px-6 py-2 font-medium transition-all duration-300 ${
                category === selectedCategory 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg'
                  : 'border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogs.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No blogs found.</p>
              </div>
            ) : (
              blogs.map((blog: any) => (
                <BlogCard key={blog.id} blog={blog} />
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2"
            >
              Previous
            </Button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 ${
                      pageNum === currentPage 
                        ? 'bg-emerald-600 text-white' 
                        : 'hover:bg-emerald-50'
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2"
            >
              Next
            </Button>
          </div>
        )}

        {/* Results Info */}
        <div className="text-center text-gray-600 mb-8">
          Showing {blogs.length} of {total} articles
        </div>
      </div>
    </div>
  )
}
