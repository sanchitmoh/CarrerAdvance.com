// Leave Request API and Types

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type LeaveType = {
  id: number;
  leave_type: string;
  leave_days: number;
  company_id: number;
  created_by?: number;
  updated_by?: number;
  created_date?: string;
  updated_date?: string;
};

export type LeaveRequest = {
  id: number; // leave_appl_id
  employeeId: number;
  employeeName: string; // From join with ew_companyemp
  employeeCode: string; // emp_id from ew_companyemp
  companyId: number;
  leaveType: string; // leave_type (varchar(50))
  applyStartDate: string; // apply_strt_date
  applyEndDate: string; // apply_end_date
  approvedStartDate?: string; // leave_aprv_strt_date
  approvedEndDate?: string; // leave_aprv_end_date
  numApprovedDays: number; // num_aprv_day
  reason: string;
  status: LeaveStatus; // status (tinyint(1)): 0=pending, 1=approved, 2=rejected
  applyHardCopy?: string; // apply_hard_copy (varchar(255))
  createdAt: string; // created_at (timestamp)
  updatedAt: string; // updated_at (timestamp)
};

export type CreateLeaveRequest = {
  employeeId: number;
  leaveType: string;
  applyStartDate: string;
  applyEndDate: string;
  reason: string;
  applyHardCopy?: File;
};

export type UpdateLeaveRequest = {
  id: number;
  leaveType?: string;
  applyStartDate?: string;
  applyEndDate?: string;
  approvedStartDate?: string;
  approvedEndDate?: string;
  numApprovedDays?: number;
  reason?: string;
  status?: LeaveStatus;
  applyHardCopy?: File;
};

export type ApproveLeaveRequest = {
  id: number;
  approvedStartDate: string;
  approvedEndDate: string;
  numApprovedDays: number;
  status: 'approved';
};

export type LeaveRequestResponse = {
  success: boolean;
  data?: LeaveRequest | LeaveRequest[];
  message?: string;
  error?: string;
};

export type LeaveTypeResponse = {
  success: boolean;
  data?: LeaveType | LeaveType[];
  message?: string;
  error?: string;
};

// API Service Class
import { getBackendUrl } from '@/lib/api-config'

class LeaveApiService {
  // Use central API-config helper for backend URLs

  // Fetch all leave requests for a company
  async getLeaveRequests(companyId?: number): Promise<LeaveRequest[]> {
    const params = new URLSearchParams();
    if (companyId) params.append('company_id', companyId.toString());
    const url = getBackendUrl(`api/leave-requests${params.toString() ? `?${params.toString()}` : ''}`)
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch leave requests: ${response.statusText}`);
    }

    const result: LeaveRequestResponse = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch leave requests');
    }

    return result.data as LeaveRequest[];
  }

  // Fetch leave requests for a specific employee
  async getEmployeeLeaveRequests(employeeId: number, companyId?: number): Promise<LeaveRequest[]> {
    const params = new URLSearchParams();
    if (companyId) params.append('company_id', String(companyId));
    const url = getBackendUrl(`api/leave-requests/employee/${employeeId}${params.toString() ? `?${params.toString()}` : ''}`)
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch employee leave requests: ${response.statusText}`);
    }

    const result: LeaveRequestResponse = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch employee leave requests');
    }

    return result.data as LeaveRequest[];
  }

  // Fetch leave requests for a seeker by resolving mapping via Next.js proxy
  async getSeekerLeaveRequests(jobseekerId: number, companyId?: number): Promise<LeaveRequest[]> {
    const params = new URLSearchParams();
    params.append('jobseeker_id', String(jobseekerId));
    if (companyId) params.append('company_id', String(companyId));
    const response = await fetch(`/api/seeker/leaves/list?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch seeker leave requests: ${response.statusText}`);
    }
    const payload = await response.json();
    if (!payload?.success) {
      throw new Error(payload?.error || payload?.message || 'Failed to fetch seeker leave requests');
    }
    return (payload.data || []) as LeaveRequest[];
  }

  // Create a new leave request
  async createLeaveRequest(leaveRequest: CreateLeaveRequest): Promise<LeaveRequest> {
    const formData = new FormData();
    formData.append('employee_id', leaveRequest.employeeId.toString());
    formData.append('leave_type', leaveRequest.leaveType);
    formData.append('apply_strt_date', leaveRequest.applyStartDate);
    formData.append('apply_end_date', leaveRequest.applyEndDate);
    formData.append('reason', leaveRequest.reason);
    
    if (leaveRequest.applyHardCopy) {
      formData.append('apply_hard_copy', leaveRequest.applyHardCopy);
    }

    const url = getBackendUrl('api/leave-requests')
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to create leave request: ${response.statusText}`);
    }

    const result: LeaveRequestResponse = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to create leave request');
    }

    return result.data as LeaveRequest;
  }

  // Update a leave request (approve/reject)
  async updateLeaveRequest(leaveRequest: UpdateLeaveRequest): Promise<LeaveRequest> {
    const payload: any = {};
    if (leaveRequest.leaveType) payload.leave_type = leaveRequest.leaveType;
    if (leaveRequest.applyStartDate) payload.applyStartDate = leaveRequest.applyStartDate;
    if (leaveRequest.applyEndDate) payload.applyEndDate = leaveRequest.applyEndDate;
    if (leaveRequest.approvedStartDate) payload.approvedStartDate = leaveRequest.approvedStartDate;
    if (leaveRequest.approvedEndDate) payload.approvedEndDate = leaveRequest.approvedEndDate;
    if (typeof leaveRequest.numApprovedDays === 'number') payload.numApprovedDays = leaveRequest.numApprovedDays;
    if (leaveRequest.reason) payload.reason = leaveRequest.reason;
    if (leaveRequest.status) payload.status = leaveRequest.status;

    const url = getBackendUrl(`api/leave-requests/${leaveRequest.id}`)
    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update leave request: ${response.statusText}`);
    }

    const result: LeaveRequestResponse = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to update leave request');
    }

    return result.data as LeaveRequest;
  }

  // Approve a leave request with confirmation
  async approveLeaveRequest(approveData: ApproveLeaveRequest): Promise<LeaveRequest> {
    const payload = {
      approvedStartDate: approveData.approvedStartDate,
      approvedEndDate: approveData.approvedEndDate,
      numApprovedDays: approveData.numApprovedDays,
      status: 'approved' as const,
    };

    const url = getBackendUrl(`api/leave-requests/${approveData.id}/approve`)
    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to approve leave request: ${response.statusText}`);
    }

    const result: LeaveRequestResponse = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to approve leave request');
    }

    return result.data as LeaveRequest;
  }

  // Reject a leave request (mirror approve but set status rejected and hit /reject)
  async rejectLeaveRequest(rejectData: Omit<ApproveLeaveRequest, 'status'>): Promise<LeaveRequest> {
    const payload = {
      approvedStartDate: rejectData.approvedStartDate,
      approvedEndDate: rejectData.approvedEndDate,
      numApprovedDays: rejectData.numApprovedDays,
      status: 'rejected' as const,
    };

    const url = getBackendUrl(`api/leave-requests/${rejectData.id}/reject`)
    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to reject leave request: ${response.statusText}`);
    }

    const result: LeaveRequestResponse = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to reject leave request');
    }

    return result.data as LeaveRequest;
  }

  // Delete a leave request
  async deleteLeaveRequest(id: number): Promise<void> {
    const url = getBackendUrl(`api/leave-requests/${id}`)
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete leave request: ${response.statusText}`);
    }

    const result: LeaveRequestResponse = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete leave request');
    }
  }

  // Fetch all leave types for a company
  async getLeaveTypes(companyId?: number): Promise<LeaveType[]> {
    const params = new URLSearchParams();
    if (companyId) params.append('company_id', companyId.toString());
    const url = getBackendUrl(`api/leave-types${params.toString() ? `?${params.toString()}` : ''}`)
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch leave types: ${response.statusText}`);
    }

    const result: LeaveTypeResponse = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch leave types');
    }

    return result.data as LeaveType[];
  }

  // Create a new leave type
  async createLeaveType(leaveType: Omit<LeaveType, 'id'>): Promise<LeaveType> {
    const url = getBackendUrl('api/leave-types')
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leaveType),
    });

    if (!response.ok) {
      throw new Error(`Failed to create leave type: ${response.statusText}`);
    }

    const result: LeaveTypeResponse = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to create leave type');
    }

    return result.data as LeaveType;
  }

  // Update a leave type
  async updateLeaveType(id: number, leaveType: Partial<LeaveType>): Promise<LeaveType> {
    const url = getBackendUrl(`api/leave-types/${id}`)
    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leaveType),
    });

    if (!response.ok) {
      throw new Error(`Failed to update leave type: ${response.statusText}`);
    }

    const result: LeaveTypeResponse = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to update leave type');
    }

    return result.data as LeaveType;
  }

  // Delete a leave type
  async deleteLeaveType(id: number): Promise<void> {
    const url = getBackendUrl(`api/leave-types/${id}`)
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete leave type: ${response.statusText}`);
    }

    const result: LeaveTypeResponse = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete leave type');
    }
  }
}

// Export singleton instance
export const leaveApiService = new LeaveApiService();

// Export individual functions for convenience (bind to instance to preserve this)
export const getLeaveRequests = (...args: Parameters<LeaveApiService["getLeaveRequests"]>) =>
  leaveApiService.getLeaveRequests(...args);
export const getEmployeeLeaveRequests = (
  ...args: Parameters<LeaveApiService["getEmployeeLeaveRequests"]>
) => leaveApiService.getEmployeeLeaveRequests(...args);
export const createLeaveRequest = (
  ...args: Parameters<LeaveApiService["createLeaveRequest"]>
) => leaveApiService.createLeaveRequest(...args);
export const updateLeaveRequest = (
  ...args: Parameters<LeaveApiService["updateLeaveRequest"]>
) => leaveApiService.updateLeaveRequest(...args);
export const approveLeaveRequest = (
  ...args: Parameters<LeaveApiService["approveLeaveRequest"]>
) => leaveApiService.approveLeaveRequest(...args);
export const rejectLeaveRequest = (
  ...args: Parameters<LeaveApiService["rejectLeaveRequest"]>
) => leaveApiService.rejectLeaveRequest(...args);
export const deleteLeaveRequest = (
  ...args: Parameters<LeaveApiService["deleteLeaveRequest"]>
) => leaveApiService.deleteLeaveRequest(...args);
export const getLeaveTypes = (
  ...args: Parameters<LeaveApiService["getLeaveTypes"]>
) => leaveApiService.getLeaveTypes(...args);
export const createLeaveType = (
  ...args: Parameters<LeaveApiService["createLeaveType"]>
) => leaveApiService.createLeaveType(...args);
export const updateLeaveType = (
  ...args: Parameters<LeaveApiService["updateLeaveType"]>
) => leaveApiService.updateLeaveType(...args);
export const deleteLeaveType = (
  ...args: Parameters<LeaveApiService["deleteLeaveType"]>
) => leaveApiService.deleteLeaveType(...args);
