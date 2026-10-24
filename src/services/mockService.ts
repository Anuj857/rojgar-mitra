import { Job, Worker, Application, HiringRequest, ApplicationStatus } from '../types';
import { mockJobs } from '../data/mockJobs';
import { mockWorkers } from '../data/mockWorkers';
import { apiService } from './apiService';

/**
 * Rojgar Mitra Mock Service Layer
 * 
 * NOTE: This is temporary browser-side demo storage using localStorage for non-sensitive
 * mock data only. Designed so this file can be swapped for Google Sheets API or REST endpoints
 * in the next phase without changing any UI components.
 */

const STORAGE_KEYS = {
  JOBS: 'rojgar_demo_jobs_v1',
  APPLICATIONS: 'rojgar_demo_applications_v1',
  HIRING_REQUESTS: 'rojgar_demo_hiring_requests_v1',
  WORKER_PROFILE: 'rojgar_demo_worker_profile_v1',
  EMPLOYER_PROFILE: 'rojgar_demo_employer_profile_v1'
};

// Initializer helpers
const getStoredJobs = (): Job[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOBS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(mockJobs));
      return mockJobs;
    }
    return JSON.parse(raw);
  } catch {
    return mockJobs;
  }
};

const getStoredApplications = (): Application[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!raw) {
      // Default initial applications for demo worker
      const initialApps: Application[] = [
        {
          id: 'app-init-1',
          jobId: 'job-101',
          jobTitle: 'आवासीय भवन हेतु अनुभवी राजमिस्त्री (Head Mason Needed)',
          category: 'Construction Worker',
          employerName: 'अवध कंस्ट्रक्शन प्रा. लि. (संजय वर्मा)',
          location: 'गोमती नगर विस्तार, सेक्टर 4, लखनऊ (UP)',
          salary: 800,
          salaryPeriod: 'per_day',
          workerId: 'w-1',
          workerName: 'रमेश कुमार',
          workerMobile: '98765-XXXX1',
          workerSkill: 'ड्राइवर व कुशल कारीगर',
          appliedAt: '2 घंटे पहले',
          status: 'pending',
          expectedSalary: 800,
          notes: 'मैं कल सुबह 8:00 बजे से उपलब्ध हो सकता हूँ।'
        },
        {
          id: 'app-init-2',
          jobId: 'job-105',
          jobTitle: 'गोदाम लोडिंग-अनलोडिंग हेल्पर (Warehouse Helpers - 4 Persons)',
          category: 'Helper',
          employerName: 'किसान एग्रो ट्रेडर्स',
          location: 'ट्रांसपोर्ट नगर, सेक्टर बी, लखनऊ (UP)',
          salary: 550,
          salaryPeriod: 'per_day',
          workerId: 'w-1',
          workerName: 'रमेश कुमार',
          workerMobile: '98765-XXXX1',
          workerSkill: 'ड्राइवर व सहायक',
          appliedAt: '1 दिन पहले',
          status: 'accepted',
          expectedSalary: 550,
          notes: 'पहले भी 2 साल गोदाम में काम किया है।'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(initialApps));
      return initialApps;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const getStoredHiringRequests = (): HiringRequest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HIRING_REQUESTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const mockService = {
  // --- JOBS ---
  async getJobs(filters?: {
    keyword?: string;
    location?: string;
    category?: string;
    maxDistance?: number;
    salaryMin?: number;
    urgentOnly?: boolean;
    salaryPeriod?: string;
  }): Promise<Job[]> {
    let serverJobs: Job[] = [];
    try {
      serverJobs = await apiService.getJobs(filters);
    } catch (err) {
      console.warn('[mockService] Backend getJobs failed, falling back to local data:', err);
    }

    // Merge server jobs with initial mock jobs (avoiding duplicate IDs)
    const stored = getStoredJobs();
    const serverIds = new Set(serverJobs.map(j => j.id));
    const merged = [...serverJobs, ...stored.filter(j => !serverIds.has(j.id))];

    if (!filters) return merged;

    return merged.filter(job => {
      if (filters.keyword) {
        const q = filters.keyword.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchCat = job.category.toLowerCase().includes(q) || job.categoryHi.toLowerCase().includes(q);
        const matchDesc = job.description.toLowerCase().includes(q);
        const matchLoc = job.location.toLowerCase().includes(q);
        if (!matchTitle && !matchCat && !matchDesc && !matchLoc) return false;
      }
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.category && filters.category !== 'all' && job.category !== filters.category) {
        return false;
      }
      if (filters.urgentOnly && !job.isUrgent) {
        return false;
      }
      if (filters.salaryPeriod && filters.salaryPeriod !== 'all' && job.salaryPeriod !== filters.salaryPeriod) {
        return false;
      }
      if (filters.maxDistance && job.distanceKm > filters.maxDistance) {
        return false;
      }
      if (filters.salaryMin && job.salary < filters.salaryMin) {
        return false;
      }
      return true;
    });
  },

  async getJobById(id: string): Promise<Job | null> {
    try {
      const serverJob = await apiService.getJobById(id);
      if (serverJob) return serverJob;
    } catch (err) {
      console.warn('[mockService] Backend getJobById failed, falling back:', err);
    }
    const all = getStoredJobs();
    return all.find(j => j.id === id) || null;
  },

  async createJob(newJob: Omit<Job, 'id' | 'createdAt' | 'applicationsCount' | 'workersHired'>): Promise<Job> {
    // Write directly to Google Sheets via backend
    const created = await apiService.createJob(newJob);

    // Also update localStorage cache for offline responsiveness
    try {
      const all = getStoredJobs();
      all.unshift(created);
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(all));
    } catch {}

    return created;
  },

  async updateJobStatus(jobId: string, status: 'active' | 'closed' | 'paused'): Promise<Job | null> {
    const updated = await apiService.updateJobStatus(jobId, status);
    try {
      const all = getStoredJobs();
      const index = all.findIndex(j => j.id === jobId);
      if (index !== -1 && updated) {
        all[index] = updated;
        localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(all));
      }
    } catch {}
    return updated;
  },

  async deleteJob(jobId: string): Promise<boolean> {
    const success = await apiService.deleteJob(jobId);
    try {
      let all = getStoredJobs();
      all = all.filter(j => j.id !== jobId);
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(all));
    } catch {}
    return success;
  },

  // --- WORKERS ---
  async getWorkers(filters?: {
    keyword?: string;
    category?: string;
    location?: string;
    maxDistance?: number;
    availability?: string;
    minExp?: number;
  }): Promise<Worker[]> {
    let workers = [...mockWorkers];
    // Check if worker edited local profile
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEYS.WORKER_PROFILE);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        const idx = workers.findIndex(w => w.id === parsed.id);
        if (idx >= 0) workers[idx] = parsed;
        else workers.unshift(parsed);
      }
    } catch {}

    if (!filters) return workers;

    return workers.filter(w => {
      if (filters.keyword) {
        const q = filters.keyword.toLowerCase();
        const matchName = w.name.toLowerCase().includes(q);
        const matchCat = w.category.toLowerCase().includes(q) || w.categoryHi.toLowerCase().includes(q);
        const matchSkills = w.skills.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchCat && !matchSkills) return false;
      }
      if (filters.category && filters.category !== 'all' && w.category !== filters.category) {
        return false;
      }
      if (filters.location && !w.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.availability && filters.availability !== 'all' && w.availabilityStatus !== filters.availability) {
        return false;
      }
      if (filters.maxDistance && w.distanceKm > filters.maxDistance) {
        return false;
      }
      if (filters.minExp && w.experienceYears < filters.minExp) {
        return false;
      }
      return true;
    });
  },

  async getWorkerById(id: string): Promise<Worker | null> {
    const list = await this.getWorkers();
    return list.find(w => w.id === id) || null;
  },

  async saveWorkerProfile(profile: Worker): Promise<Worker> {
    localStorage.setItem(STORAGE_KEYS.WORKER_PROFILE, JSON.stringify(profile));
    return profile;
  },

  // --- APPLICATIONS ---
  async applyForJob(application: Omit<Application, 'id' | 'appliedAt' | 'status'>): Promise<Application> {
    try {
      const created = await apiService.applyForJob(application);
      const apps = getStoredApplications();
      apps.unshift(created);
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      return created;
    } catch (err) {
      console.error('[mockService] applyForJob failed on backend:', err);
      throw err;
    }
  },

  async getMyApplications(workerId?: string): Promise<Application[]> {
    try {
      const serverApps = await apiService.getMyApplications(workerId);
      if (serverApps && serverApps.length > 0) {
        return serverApps;
      }
    } catch (err) {
      console.warn('[mockService] getMyApplications failed on backend:', err);
    }
    const apps = getStoredApplications();
    if (!workerId) return apps;
    return apps.filter(a => a.workerId === workerId);
  },

  async updateApplicationStatus(appId: string, status: ApplicationStatus): Promise<Application | null> {
    try {
      const updated = await apiService.updateApplicationStatus(appId, status);
      const apps = getStoredApplications();
      const idx = apps.findIndex(a => a.id === appId);
      if (idx !== -1 && updated) {
        apps[idx] = updated;
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      }
      return updated;
    } catch (err) {
      console.error('[mockService] updateApplicationStatus failed on backend:', err);
      throw err;
    }
  },

  async getApplicationsForJob(jobId: string): Promise<Application[]> {
    try {
      return await apiService.getApplicationsForJob(jobId);
    } catch (err) {
      console.warn('[mockService] getApplicationsForJob failed on backend:', err);
      const apps = getStoredApplications();
      return apps.filter(a => a.jobId === jobId);
    }
  },

  // --- HIRING REQUESTS ---
  async sendHiringRequest(request: Omit<HiringRequest, 'id' | 'sentAt' | 'status'>): Promise<HiringRequest> {
    try {
      const created = await apiService.sendHiringRequest(request);
      const requests = getStoredHiringRequests();
      requests.unshift(created);
      localStorage.setItem(STORAGE_KEYS.HIRING_REQUESTS, JSON.stringify(requests));
      return created;
    } catch (err) {
      console.error('[mockService] sendHiringRequest failed on backend:', err);
      throw err;
    }
  },

  async getHiringRequests(workerId?: string): Promise<HiringRequest[]> {
    try {
      const serverReqs = await apiService.getHiringRequests(workerId);
      if (serverReqs && serverReqs.length > 0) {
        return serverReqs;
      }
    } catch (err) {
      console.warn('[mockService] getHiringRequests failed on backend:', err);
    }
    return getStoredHiringRequests();
  },

  // --- ADMIN STATS ---
  async getAdminStats() {
    const jobs = getStoredJobs();
    const workers = await this.getWorkers();
    const apps = getStoredApplications();

    return {
      totalWorkers: workers.length + 4500, // sample aggregate representation
      totalEmployers: 856,
      totalJobs: jobs.length + 1240,
      activeJobs: jobs.filter(j => j.status === 'active').length,
      totalApplications: apps.length + 3120,
      reportedListings: 2,
      platformHealth: 'सिस्टम स्थिति: सामान्य (100% Operational)',
      recentActivity: [
        { id: 1, action: 'नया जॉब पोस्ट: शोरूम वायरिंग', time: '10 मिनट पहले', user: 'रॉयल गारमेंट्स' },
        { id: 2, action: 'आवेदन स्वीकृत: गोदाम हेल्पर', time: '25 मिनट पहले', user: 'किसान एग्रो' },
        { id: 3, action: 'सत्यापित प्रोफाइल: रमेश कुमार (ड्राइवर)', time: '1 घंटा पहले', user: 'एडमिन सिस्टम' },
        { id: 4, action: 'हायरिंग रिक्वेस्ट भेजी गई: रामू यादव (राजमिस्त्री)', time: '2 घंटे पहले', user: 'अवध कंस्ट्रक्शन' }
      ]
    };
  }
};
