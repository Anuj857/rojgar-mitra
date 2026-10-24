/// <reference types="vite/client" />

/**
 * Rojgar Mitra API Service
 *
 * Calls the Express/Google Sheets backend.
 * Mirrors the mockService interface so components can switch between them.
 *
 * Set VITE_API_URL in frontend .env to point to the backend.
 * Default: http://localhost:5000
 */

import { Job, Worker, Application, HiringRequest, ApplicationStatus } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function normalizeJob(raw: any): Job {
  return {
    ...raw,
    salary: Number(raw.salary) || 0,
    distanceKm: Number(raw.distanceKm) || 0,
    workersRequired: Number(raw.workersRequired) || 1,
    workersHired: Number(raw.workersHired) || 0,
    employerRating: Number(raw.employerRating) || 0,
    applicationsCount: Number(raw.applicationsCount) || 0,
    isUrgent: raw.isUrgent === true || raw.isUrgent === 'TRUE' || raw.isUrgent === 'true',
    requiredSkills: Array.isArray(raw.requiredSkills)
      ? raw.requiredSkills
      : (typeof raw.requiredSkills === 'string' && raw.requiredSkills.trim()
          ? raw.requiredSkills.split(',').map((s: string) => s.trim()).filter(Boolean)
          : []),
  };
}

function normalizeWorker(raw: any): Worker {
  return {
    ...raw,
    experienceYears: Number(raw.experienceYears) || 0,
    preferredSalary: Number(raw.preferredSalary) || 0,
    distanceKm: Number(raw.distanceKm) || 0,
    preferredDistanceKm: Number(raw.preferredDistanceKm) || 10,
    rating: Number(raw.rating) || 0,
    reviewsCount: Number(raw.reviewsCount) || 0,
    completedJobsCount: Number(raw.completedJobsCount) || 0,
    verified: raw.verified === true || raw.verified === 'TRUE' || raw.verified === 'true',
    skills: Array.isArray(raw.skills)
      ? raw.skills
      : (typeof raw.skills === 'string' && raw.skills.trim()
          ? raw.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
          : []),
    languages: Array.isArray(raw.languages)
      ? raw.languages
      : (typeof raw.languages === 'string' && raw.languages.trim()
          ? raw.languages.split(',').map((s: string) => s.trim()).filter(Boolean)
          : []),
    workHistory: Array.isArray(raw.workHistory) ? raw.workHistory : [],
  };
}

function normalizeApp(raw: any): Application {
  return {
    ...raw,
    salary: Number(raw.salary) || 0,
    expectedSalary: raw.expectedSalary ? Number(raw.expectedSalary) : undefined,
  };
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `API error ${res.status}`);
  }
  return data.data as T;
}

export const apiService = {
  // --- JOBS ---
  async getJobs(filters?: {
    keyword?: string;
    location?: string;
    category?: string;
    urgentOnly?: boolean;
    salaryPeriod?: string;
  }): Promise<Job[]> {
    const params = new URLSearchParams();
    if (filters?.keyword) params.set('keyword', filters.keyword);
    if (filters?.location) params.set('location', filters.location);
    if (filters?.category) params.set('category', filters.category);
    if (filters?.urgentOnly) params.set('urgentOnly', 'true');
    if (filters?.salaryPeriod) params.set('salaryPeriod', filters.salaryPeriod);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const list = await apiFetch<any[]>(`/api/jobs${qs}`);
    return list.map(normalizeJob);
  },

  async getJobById(id: string): Promise<Job | null> {
    try {
      const raw = await apiFetch<any>(`/api/jobs/${id}`);
      return raw ? normalizeJob(raw) : null;
    } catch {
      return null;
    }
  },

  async createJob(newJob: Omit<Job, 'id' | 'createdAt' | 'applicationsCount' | 'workersHired'>): Promise<Job> {
    const raw = await apiFetch<any>('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(newJob),
    });
    return normalizeJob(raw);
  },

  async updateJobStatus(jobId: string, status: 'active' | 'closed' | 'paused'): Promise<Job | null> {
    const raw = await apiFetch<any>(`/api/jobs/${jobId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return raw ? normalizeJob(raw) : null;
  },

  async updateJob(jobId: string, updates: Partial<Job>): Promise<Job> {
    const raw = await apiFetch<any>(`/api/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return normalizeJob(raw);
  },

  async deleteJob(jobId: string): Promise<boolean> {
    await apiFetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
    return true;
  },

  // --- WORKERS ---
  async getWorkers(filters?: {
    keyword?: string;
    category?: string;
    location?: string;
    availability?: string;
  }): Promise<Worker[]> {
    const params = new URLSearchParams();
    if (filters?.keyword) params.set('keyword', filters.keyword);
    if (filters?.category) params.set('category', filters.category);
    if (filters?.location) params.set('location', filters.location);
    if (filters?.availability) params.set('availability', filters.availability);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const list = await apiFetch<any[]>(`/api/workers${qs}`);
    return list.map(normalizeWorker);
  },

  async getWorkerById(id: string): Promise<Worker | null> {
    try {
      const raw = await apiFetch<any>(`/api/workers/${id}`);
      return raw ? normalizeWorker(raw) : null;
    } catch {
      return null;
    }
  },

  async saveWorkerProfile(profile: Worker): Promise<Worker> {
    try {
      const raw = await apiFetch<any>(`/api/workers/${profile.id}`, {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      return normalizeWorker(raw);
    } catch {
      // If worker not found, create
      const raw = await apiFetch<any>('/api/workers', {
        method: 'POST',
        body: JSON.stringify(profile),
      });
      return normalizeWorker(raw);
    }
  },

  // --- APPLICATIONS ---
  async applyForJob(application: Omit<Application, 'id' | 'appliedAt' | 'status'>): Promise<Application> {
    const raw = await apiFetch<any>('/api/applications', {
      method: 'POST',
      body: JSON.stringify(application),
    });
    return normalizeApp(raw);
  },

  async getMyApplications(workerId?: string): Promise<Application[]> {
    const qs = workerId ? `?workerId=${workerId}` : '';
    const list = await apiFetch<any[]>(`/api/applications${qs}`);
    return list.map(normalizeApp);
  },

  async updateApplicationStatus(appId: string, status: ApplicationStatus): Promise<Application | null> {
    const raw = await apiFetch<any>(`/api/applications/${appId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return raw ? normalizeApp(raw) : null;
  },

  async getApplicationsForJob(jobId: string): Promise<Application[]> {
    const list = await apiFetch<any[]>(`/api/applications?jobId=${jobId}`);
    return list.map(normalizeApp);
  },

  // --- HIRING REQUESTS ---
  async sendHiringRequest(request: Omit<HiringRequest, 'id' | 'sentAt' | 'status'>): Promise<HiringRequest> {
    return apiFetch<HiringRequest>('/api/hiring-requests', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async getHiringRequests(workerId?: string): Promise<HiringRequest[]> {
    const qs = workerId ? `?workerId=${workerId}` : '';
    return apiFetch<HiringRequest[]>(`/api/hiring-requests${qs}`);
  },
};
