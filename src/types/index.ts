export type Language = 'hi' | 'en';

export type UserRole = 'worker' | 'employer' | 'admin';

export type AvailabilityStatus = 'available_now' | 'available_part_time' | 'busy';

export type SalaryPeriod = 'per_day' | 'per_month' | 'per_hour' | 'contract';

export interface WorkHistoryItem {
  id: string;
  jobTitle: string;
  employerName: string;
  dateRange: string;
  attendanceRate: number; // e.g. 96 (%)
  rating: number; // 1-5
  reviewComment: string;
  isSampleData: boolean;
}

export interface Worker {
  id: string;
  name: string;
  mobile: string;
  category: string;
  categoryHi: string;
  skills: string[];
  experienceYears: number;
  preferredSalary: number;
  salaryPeriod: SalaryPeriod;
  location: string;
  distanceKm: number;
  preferredDistanceKm: number;
  availabilityStatus: AvailabilityStatus;
  profilePhotoUrl?: string;
  rating: number;
  reviewsCount: number;
  completedJobsCount: number;
  verified: boolean;
  languages: string[];
  about?: string;
  workHistory: WorkHistoryItem[];
}

export interface Employer {
  id: string;
  name: string;
  companyName?: string;
  businessType: 'individual' | 'contractor' | 'business' | 'shop';
  mobile: string;
  email?: string;
  location: string;
  verified: boolean;
  activeJobsCount: number;
  totalHired: number;
}

export interface Job {
  id: string;
  title: string;
  category: string;
  categoryHi: string;
  description: string;
  salary: number;
  salaryPeriod: SalaryPeriod;
  location: string;
  distanceKm: number;
  workersRequired: number;
  workersHired: number;
  requiredExperience: string;
  workDuration: string;
  workingHours: string;
  startDate: string;
  isUrgent: boolean;
  employerId: string;
  employerName: string;
  employerRating: number;
  employerPhone: string;
  status: 'active' | 'closed' | 'paused';
  createdAt: string;
  applicationsCount: number;
  requiredSkills: string[];
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  category: string;
  employerName: string;
  location: string;
  salary: number;
  salaryPeriod: SalaryPeriod;
  workerId: string;
  workerName: string;
  workerMobile: string;
  workerSkill: string;
  appliedAt: string;
  status: ApplicationStatus;
  expectedSalary?: number;
  notes?: string;
}

export interface HiringRequest {
  id: string;
  workerId: string;
  workerName: string;
  employerId: string;
  employerName: string;
  employerPhone: string;
  jobRole: string;
  proposedDailyWage: number;
  location: string;
  workDuration: string;
  message: string;
  status: 'sent' | 'accepted' | 'declined';
  sentAt: string;
}

export interface Review {
  id: string;
  reviewerName: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    mobile: string;
    name: string;
    role: UserRole;
    location?: string;
    profileCompleted: boolean;
  } | null;
}
