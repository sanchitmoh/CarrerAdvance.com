export interface EmployerBlogPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  summary?: string;
  keywords?: string;
  category_id?: number;
  category_name?: string;
  status: 'draft' | 'published' | 'archived' | string;
  created_at?: string;
  published_at?: string | null;
  views_count?: number;
  likes_count?: number;
  emp_id?: number;
  image_url?: string | null;
  author_name?: string;
}

export interface BlogsListResponse {
  success: boolean;
  data: EmployerBlogPost[];
  total: number;
  message?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: { id: number; name: string; slug: string }[];
}

import { getApiUrl } from './api-config';

class BlogsApiService {
  private baseUrl = getApiUrl('/blogs');

  async getEmployerBlogs(): Promise<BlogsListResponse> {
    const res = await fetch(`${this.baseUrl}/employer`, { cache: 'no-store', credentials: 'include' });
    return res.json();
  }

  async getCategories(): Promise<CategoriesResponse> {
    const res = await fetch(`${this.baseUrl}/categories`, { credentials: 'include' });
    return res.json();
  }

  async createBlog(payload: {
    title: string;
    content: string;
    excerpt?: string;
    summary?: string;
    keywords?: string;
    category_id?: number;
    status: 'draft' | 'published';
    tags?: string; // comma-separated
    imageFile?: File | null;
  }): Promise<{ success: boolean; message?: string; post_id?: number }> {
    const form = new FormData();
    form.append('title', payload.title);
    form.append('content', payload.content);
    if (payload.excerpt) form.append('excerpt', payload.excerpt);
    if (payload.summary) form.append('summary', payload.summary);
    if (payload.keywords) form.append('keywords', payload.keywords);
    if (payload.category_id) form.append('category_id', String(payload.category_id));
    form.append('status', payload.status);
    if (payload.tags) form.append('tags', payload.tags);
    if (payload.imageFile) form.append('image', payload.imageFile);

    const res = await fetch(`${this.baseUrl}`, { method: 'POST', body: form, credentials: 'include' });
    return res.json();
  }

  async updateBlog(
    id: number,
    payload:
      | {
          title: string;
          content: string;
          excerpt?: string;
          summary?: string;
          keywords?: string;
          category_id?: number;
          status: 'draft' | 'published' | 'archived';
          tags?: string; // comma-separated
          imageFile?: File | null;
        }
  ): Promise<{ success: boolean; message?: string }> {
    const hasFile = !!(payload as any).imageFile;
    if (hasFile) {
      const form = new FormData();
      form.append('title', payload.title);
      form.append('content', payload.content);
      if (payload.excerpt) form.append('excerpt', payload.excerpt);
      if (payload.summary) form.append('summary', payload.summary);
      if (payload.keywords) form.append('keywords', payload.keywords);
      if (payload.category_id) form.append('category_id', String(payload.category_id));
      form.append('status', payload.status);
      if (payload.tags) form.append('tags', payload.tags);
      if ((payload as any).imageFile) form.append('image', (payload as any).imageFile as File);
      // Use POST for multipart so CodeIgniter can parse fields via $this->input->post
      const res = await fetch(`${this.baseUrl}/${id}`, { method: 'POST', body: form, credentials: 'include' });
      return res.json();
    } else {
      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      return res.json();
    }
  }

  async deleteBlog(id: number): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE', credentials: 'include' });
    return res.json();
  }

  async aiGenerateContent(payload: { title: string; category: string }): Promise<{ success: boolean; data?: { content: string; excerpt: string; summary: string }; message?: string }> {
    const form = new FormData();
    form.append('title', payload.title);
    form.append('category', payload.category);
    const res = await fetch(`${this.baseUrl}/ai-generate`, { method: 'POST', body: form, credentials: 'include' });
    return res.json();
  }
}

export const blogsApiService = new BlogsApiService();


