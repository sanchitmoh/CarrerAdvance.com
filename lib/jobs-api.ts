export interface Job {
	id: string;
	title: string;
	slug?: string;
	company_id?: string;
	company_name: string;
	location: string;
	category: string;
	industry?: string;
	experience_level: string;
	salary_min?: number;
	salary_max?: number;
	job_type: string;
	description: string;
	requirements: string;
	benefits: string;
	posted_date: string;
	expiry_date?: string;
	total_applications?: number;
	total_interviewed?: number;
	status: string;
}

export interface JobsResponse {
	success: boolean;
	data: {
		jobs: Job[];
		total: number;
		page: number;
		limit: number;
		total_pages: number;
	};
}

export interface JobDetailsResponse {
	success: boolean;
	data: Job;
}

export interface CategoriesResponse {
	success: boolean;
	data: string[];
}

export interface IndustriesResponse {
	success: boolean;
	data: string[];
}

export interface CitiesResponse {
	success: boolean;
	data: string[];
}

class JobsApiService {
	private baseUrl = '/api/jobs';

	async getJobs(params: {
		page?: number;
		limit?: number;
		title?: string;
		location?: string;
		category?: string;
		industry?: string;
		experience?: string;
		job_type?: string;
		salary_min?: number;
		salary_max?: number;
		sort?: string;
		order?: string;
	} = {}): Promise<JobsResponse> {
		const searchParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				searchParams.append(key, String(value));
			}
		});
		const res = await fetch(`${this.baseUrl}/list?${searchParams.toString()}`);
		return res.json();
	}

	async getJobDetails(id: string): Promise<JobDetailsResponse> {
		const res = await fetch(`${this.baseUrl}/${id}`);
		return res.json();
	}

	async getCategories(): Promise<CategoriesResponse> {
		const res = await fetch(`${this.baseUrl}/categories`);
		return res.json();
	}

	async getIndustries(): Promise<IndustriesResponse> {
		const res = await fetch(`${this.baseUrl}/industries`);
		return res.json();
	}

	async getCities(): Promise<CitiesResponse> {
		const res = await fetch(`${this.baseUrl}/cities`);
		return res.json();
	}

	async testConnection(): Promise<{ success: boolean; message: string }> {
		const res = await fetch(`${this.baseUrl}/test`);
		return res.json();
	}
}

export const jobsApiService = new JobsApiService();


