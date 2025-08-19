import { getApiUrl, getBaseUrl, getAssetUrl } from './api-config';

export interface EmployerUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  designation?: string;
  mobile_no?: string;
  profile_picture?: string;
}

export interface CompanyData {
  id?: number;
  employer_id: number;
  company_name: string;
  company_email: string;
  company_phone: string;
  website: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  logo?: string;
  founded_date?: string;
  employees?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  google_plus?: string;
  created_date?: string;
  updated_date?: string;
}

export interface EmployerProfile {
  employer: EmployerUser;
  company: CompanyData | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  employer_id?: number;
  user?: EmployerUser;
  company?: CompanyData | null;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data?: EmployerProfile;
}

export interface UpdateProfileRequest {
  firstname: string;
  lastname: string;
  email: string;
  designation?: string;
  mobile_no?: string;
  company?: Partial<CompanyData>;
}

export interface AddJobRequest {
  title: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salary_min: number;
  salary_max: number;
  salary_period: string;
  skills: string[];
  country: string;
  province: string;
  city: string;
  full_address: string;
  expiry_date: string;
  application_method: string;
  hours_per_week: number;
  schedule: string;
  urgency: string;
  start_date: string;
  deadline: string;
  notification_email: string;
  allow_calls: boolean;
  phone_number: string;
  positions: number;
  experience_level: string;
}

export interface Job {
  id: number;
  title: string;
  location: string;
  type: string;
  datePosted: string;
  status: string;
  description: string;
  requirements: string;
  salary: string;
  candidates: {
    applied: number;
    reviewed: number;
    shortlisted: number;
    contacted: number;
    rejected: number;
    hired: number;
  };
}

export interface Candidate {
  id: number;
  name: string;
  designation: string;
  location: string;
  industry: string;
  email: string;
  phone: string;
  avatar: string;
  status: string;
  appliedDate: string;
  experience: string;
  skills: string[];
  summary: string;
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  languages: {
    name: string;
    proficiency: string;
  }[];
  resumeUrl: string;
  ctc?: string;
  documents?: string[];
}

class EmployerApiService {
  private baseUrl = getApiUrl('/employer');

  /**
   * Get employer's own jobs
   */
  async getEmployerJobs(): Promise<{ success: boolean; jobs: Job[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get employer jobs error:', error);
      return { success: false, jobs: [] } as any;
    }
  }

  /**
   * Login employer
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  /**
   * Get employer profile
   */
  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/profile/get_profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  /**
   * Update employer profile
   */
  async updateProfile(profileData: UpdateProfileRequest): Promise<ProfileResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/profile/update_profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(file: File): Promise<{ success: boolean; message: string; file_path?: string }> {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);

      const response = await fetch(`${this.baseUrl}/profile/upload_picture`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Upload profile picture error:', error);
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  /**
   * Logout employer
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  /**
   * Check authentication status
   */
  async checkAuth(): Promise<{ success: boolean; authenticated: boolean; employer_id?: number; user?: EmployerUser }> {
    try {
      const response = await fetch(`${this.baseUrl}/check_auth`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Check auth error:', error);
      return {
        success: false,
        authenticated: false,
      };
    }
  }

  /**
   * Get asset URL for profile pictures
   */
  getAssetUrl(path: string): string {
    return getAssetUrl(path);
  }

  /**
   * Add a new job
   */
  async addJob(jobData: AddJobRequest): Promise<{ success: boolean; message: string; job?: Job }> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(jobData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Add job error:', error);
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  /**
   * Update an existing job
   */
  async updateJob(jobId: number, jobData: Partial<AddJobRequest>): Promise<{ success: boolean; message: string; job?: Job }> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs/${jobId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(jobData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update job error:', error);
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  /**
   * Delete a job
   */
  async deleteJob(jobId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs/${jobId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete job error:', error);
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  /**
   * Get job by ID
   */
  async getJobById(jobId: number): Promise<Job> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      return data.job || data;
    } catch (error) {
      console.error('Get job by ID error:', error);
      throw error;
    }
  }

  /**
   * Get candidates for a job
   */
  async getJobCandidates(jobId: number): Promise<Candidate[]> {
    try {
      const url = `${this.baseUrl}/jobs/${jobId}/candidates`;
      console.log('Fetching candidates from URL:', url);
      console.log('Base URL:', this.baseUrl);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      return data.data || data.candidates || data || [];
    } catch (error) {
      console.error('Get job candidates error:', error);
      return [];
    }
  }

  /**
   * Update candidate status
   */
  async updateCandidateStatus(jobId: number, candidateId: number, status: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs/${jobId}/candidates/${candidateId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update candidate status error:', error);
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }
}

export const employerApiService = new EmployerApiService();
