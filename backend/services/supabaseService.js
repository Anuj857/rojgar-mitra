'use strict';
const supabaseClient = require('./supabaseClient');

// ============================================================================
// Mappers between PostgreSQL snake_case and JavaScript/API camelCase
// ============================================================================

function rowToJob(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    categoryHi: row.category_hi || '',
    description: row.description || '',
    salary: Number(row.salary) || 0,
    salaryPeriod: row.salary_period || 'per_day',
    location: row.location,
    distanceKm: Number(row.distance_km) || 0,
    workersRequired: Number(row.workers_required) || 1,
    workersHired: Number(row.workers_hired) || 0,
    requiredExperience: row.required_experience || '',
    workDuration: row.work_duration || '',
    workingHours: row.working_hours || '',
    startDate: row.start_date || '',
    isUrgent: Boolean(row.is_urgent),
    employerId: row.employer_id,
    employerName: row.employer_name,
    employerRating: Number(row.employer_rating) || 5.0,
    employerPhone: row.employer_phone || '',
    status: row.status || 'active',
    createdAt: row.created_at,
    applicationsCount: Number(row.applications_count) || 0,
    requiredSkills: Array.isArray(row.required_skills)
      ? row.required_skills
      : (typeof row.required_skills === 'string' && row.required_skills
          ? row.required_skills.split(',').map(s => s.trim()).filter(Boolean)
          : []),
    userId: row.user_id || undefined,
  };
}

function jobToRow(job) {
  const row = {};
  if (job.id !== undefined) row.id = job.id;
  if (job.userId !== undefined) row.user_id = job.userId;
  if (job.title !== undefined) row.title = job.title;
  if (job.category !== undefined) row.category = job.category;
  if (job.categoryHi !== undefined) row.category_hi = job.categoryHi;
  if (job.description !== undefined) row.description = job.description;
  if (job.salary !== undefined) row.salary = Number(job.salary);
  if (job.salaryPeriod !== undefined) row.salary_period = job.salaryPeriod;
  if (job.location !== undefined) row.location = job.location;
  if (job.distanceKm !== undefined) row.distance_km = Number(job.distanceKm);
  if (job.workersRequired !== undefined) row.workers_required = Number(job.workersRequired);
  if (job.workersHired !== undefined) row.workers_hired = Number(job.workersHired);
  if (job.requiredExperience !== undefined) row.required_experience = job.requiredExperience;
  if (job.workDuration !== undefined) row.work_duration = job.workDuration;
  if (job.workingHours !== undefined) row.working_hours = job.workingHours;
  if (job.startDate !== undefined) row.start_date = job.startDate;
  if (job.isUrgent !== undefined) row.is_urgent = Boolean(job.isUrgent);
  if (job.employerId !== undefined) row.employer_id = job.employerId;
  if (job.employerName !== undefined) row.employer_name = job.employerName;
  if (job.employerRating !== undefined) row.employer_rating = Number(job.employerRating);
  if (job.employerPhone !== undefined) row.employer_phone = job.employerPhone;
  if (job.status !== undefined) row.status = job.status;
  if (job.createdAt !== undefined) row.created_at = job.createdAt;
  if (job.applicationsCount !== undefined) row.applications_count = Number(job.applicationsCount);
  if (job.requiredSkills !== undefined) {
    row.required_skills = Array.isArray(job.requiredSkills)
      ? job.requiredSkills
      : (typeof job.requiredSkills === 'string'
          ? job.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
          : []);
  }
  return row;
}

function rowToWorker(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    mobile: row.mobile,
    category: row.category,
    categoryHi: row.category_hi || '',
    skills: Array.isArray(row.skills) ? row.skills : [],
    experienceYears: Number(row.experience_years) || 0,
    preferredSalary: Number(row.preferred_salary) || 0,
    salaryPeriod: row.salary_period || 'per_day',
    location: row.location || '',
    distanceKm: Number(row.distance_km) || 0,
    preferredDistanceKm: Number(row.preferred_distance_km) || 10,
    availabilityStatus: row.availability_status || 'available_now',
    profilePhotoUrl: row.profile_photo_url || '',
    rating: Number(row.rating) || 5.0,
    reviewsCount: Number(row.reviews_count) || 0,
    completedJobsCount: Number(row.completed_jobs_count) || 0,
    verified: Boolean(row.verified),
    languages: Array.isArray(row.languages) ? row.languages : [],
    about: row.about || '',
    workHistory: Array.isArray(row.work_history) ? row.work_history : [],
    userId: row.user_id || undefined,
  };
}

function workerToRow(worker) {
  const row = {};
  if (worker.id !== undefined) row.id = worker.id;
  if (worker.userId !== undefined) row.user_id = worker.userId;
  if (worker.name !== undefined) row.name = worker.name;
  if (worker.mobile !== undefined) row.mobile = worker.mobile;
  if (worker.category !== undefined) row.category = worker.category;
  if (worker.categoryHi !== undefined) row.category_hi = worker.categoryHi;
  if (worker.skills !== undefined) {
    row.skills = Array.isArray(worker.skills)
      ? worker.skills
      : (typeof worker.skills === 'string' ? worker.skills.split(',').map(s => s.trim()).filter(Boolean) : []);
  }
  if (worker.experienceYears !== undefined) row.experience_years = Number(worker.experienceYears);
  if (worker.preferredSalary !== undefined) row.preferred_salary = Number(worker.preferredSalary);
  if (worker.salaryPeriod !== undefined) row.salary_period = worker.salaryPeriod;
  if (worker.location !== undefined) row.location = worker.location;
  if (worker.distanceKm !== undefined) row.distance_km = Number(worker.distanceKm);
  if (worker.preferredDistanceKm !== undefined) row.preferred_distance_km = Number(worker.preferredDistanceKm);
  if (worker.availabilityStatus !== undefined) row.availability_status = worker.availabilityStatus;
  if (worker.profilePhotoUrl !== undefined) row.profile_photo_url = worker.profilePhotoUrl;
  if (worker.rating !== undefined) row.rating = Number(worker.rating);
  if (worker.reviewsCount !== undefined) row.reviews_count = Number(worker.reviewsCount);
  if (worker.completedJobsCount !== undefined) row.completed_jobs_count = Number(worker.completedJobsCount);
  if (worker.verified !== undefined) row.verified = Boolean(worker.verified);
  if (worker.languages !== undefined) {
    row.languages = Array.isArray(worker.languages)
      ? worker.languages
      : (typeof worker.languages === 'string' ? worker.languages.split(',').map(s => s.trim()).filter(Boolean) : []);
  }
  if (worker.about !== undefined) row.about = worker.about;
  if (worker.workHistory !== undefined) row.work_history = worker.workHistory;
  return row;
}

function rowToApp(row) {
  if (!row) return null;
  return {
    id: row.id,
    jobId: row.job_id,
    jobTitle: row.job_title || '',
    category: row.category || '',
    employerName: row.employer_name || '',
    location: row.location || '',
    salary: Number(row.salary) || 0,
    salaryPeriod: row.salary_period || 'per_day',
    workerId: row.worker_id,
    workerName: row.worker_name,
    workerMobile: row.worker_mobile || '',
    workerSkill: row.worker_skill || '',
    appliedAt: row.applied_at,
    status: row.status || 'pending',
    expectedSalary: row.expected_salary ? Number(row.expected_salary) : undefined,
    notes: row.notes || '',
    userId: row.user_id || undefined,
  };
}

function appToRow(app) {
  const row = {};
  if (app.id !== undefined) row.id = app.id;
  if (app.userId !== undefined) row.user_id = app.userId;
  if (app.jobId !== undefined) row.job_id = app.jobId;
  if (app.jobTitle !== undefined) row.job_title = app.jobTitle;
  if (app.category !== undefined) row.category = app.category;
  if (app.employerName !== undefined) row.employer_name = app.employerName;
  if (app.location !== undefined) row.location = app.location;
  if (app.salary !== undefined) row.salary = Number(app.salary);
  if (app.salaryPeriod !== undefined) row.salary_period = app.salaryPeriod;
  if (app.workerId !== undefined) row.worker_id = app.workerId;
  if (app.workerName !== undefined) row.worker_name = app.workerName;
  if (app.workerMobile !== undefined) row.worker_mobile = app.workerMobile;
  if (app.workerSkill !== undefined) row.worker_skill = app.workerSkill;
  if (app.appliedAt !== undefined) row.applied_at = app.appliedAt;
  if (app.status !== undefined) row.status = app.status;
  if (app.expectedSalary !== undefined) row.expected_salary = app.expectedSalary ? Number(app.expectedSalary) : null;
  if (app.notes !== undefined) row.notes = app.notes;
  return row;
}

function rowToHiring(row) {
  if (!row) return null;
  return {
    id: row.id,
    workerId: row.worker_id,
    workerName: row.worker_name || '',
    employerId: row.employer_id,
    employerName: row.employer_name || '',
    employerPhone: row.employer_phone || '',
    jobRole: row.job_role,
    proposedDailyWage: Number(row.proposed_daily_wage) || 0,
    location: row.location || '',
    workDuration: row.work_duration || '',
    message: row.message || '',
    status: row.status || 'sent',
    sentAt: row.sent_at,
    userId: row.user_id || undefined,
  };
}

function hiringToRow(req) {
  const row = {};
  if (req.id !== undefined) row.id = req.id;
  if (req.userId !== undefined) row.user_id = req.userId;
  if (req.workerId !== undefined) row.worker_id = req.workerId;
  if (req.workerName !== undefined) row.worker_name = req.workerName;
  if (req.employerId !== undefined) row.employer_id = req.employerId;
  if (req.employerName !== undefined) row.employer_name = req.employerName;
  if (req.employerPhone !== undefined) row.employer_phone = req.employerPhone;
  if (req.jobRole !== undefined) row.job_role = req.jobRole;
  if (req.proposedDailyWage !== undefined) row.proposed_daily_wage = Number(req.proposedDailyWage);
  if (req.location !== undefined) row.location = req.location;
  if (req.workDuration !== undefined) row.work_duration = req.workDuration;
  if (req.message !== undefined) row.message = req.message;
  if (req.status !== undefined) row.status = req.status;
  if (req.sentAt !== undefined) row.sent_at = req.sentAt;
  return row;
}

// ============================================================================
// Supabase Data Access Service
// ============================================================================

class SupabaseService {
  isConfigured() {
    return supabaseClient.isConfigured();
  }

  // --- JOBS ---

  async getJobs(filters = {}) {
    const supabase = supabaseClient.getClient();
    let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });

    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters.urgentOnly === 'true' || filters.urgentOnly === true) {
      query = query.eq('is_urgent', true);
    }
    if (filters.salaryPeriod && filters.salaryPeriod !== 'all') {
      query = query.eq('salary_period', filters.salaryPeriod);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Supabase getJobs error: ${error.message}`);

    let jobs = (data || []).map(rowToJob);

    // Keyword filtering across multiple fields
    if (filters.keyword) {
      const q = filters.keyword.toLowerCase();
      jobs = jobs.filter(j =>
        (j.title || '').toLowerCase().includes(q) ||
        (j.category || '').toLowerCase().includes(q) ||
        (j.description || '').toLowerCase().includes(q) ||
        (j.location || '').toLowerCase().includes(q)
      );
    }

    return jobs;
  }

  async getJobById(id) {
    const supabase = supabaseClient.getClient();
    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).maybeSingle();
    if (error) throw new Error(`Supabase getJobById error: ${error.message}`);
    return data ? rowToJob(data) : null;
  }

  async createJob(jobData) {
    const supabase = supabaseClient.getClient();
    const row = jobToRow(jobData);
    const { data, error } = await supabase.from('jobs').insert([row]).select().single();
    if (error) throw new Error(`Supabase createJob error: ${error.message}`);
    return rowToJob(data);
  }

  async updateJob(id, updates) {
    const supabase = supabaseClient.getClient();
    const row = jobToRow(updates);
    delete row.id; // protect primary key
    const { data, error } = await supabase.from('jobs').update(row).eq('id', id).select().single();
    if (error) throw new Error(`Supabase updateJob error: ${error.message}`);
    return rowToJob(data);
  }

  async updateJobStatus(id, status) {
    const supabase = supabaseClient.getClient();
    const { data, error } = await supabase.from('jobs').update({ status }).eq('id', id).select().single();
    if (error) throw new Error(`Supabase updateJobStatus error: ${error.message}`);
    return rowToJob(data);
  }

  async deleteJob(id) {
    const supabase = supabaseClient.getClient();
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) throw new Error(`Supabase deleteJob error: ${error.message}`);
    return true;
  }

  // --- WORKERS ---

  async getWorkers(filters = {}) {
    const supabase = supabaseClient.getClient();
    let query = supabase.from('workers').select('*').order('created_at', { ascending: false });

    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters.availability && filters.availability !== 'all') {
      query = query.eq('availability_status', filters.availability);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Supabase getWorkers error: ${error.message}`);

    let workers = (data || []).map(rowToWorker);

    if (filters.keyword) {
      const q = filters.keyword.toLowerCase();
      workers = workers.filter(w =>
        (w.name || '').toLowerCase().includes(q) ||
        (w.category || '').toLowerCase().includes(q) ||
        (w.skills || []).some(s => s.toLowerCase().includes(q))
      );
    }

    return workers;
  }

  async getWorkerById(id) {
    const supabase = supabaseClient.getClient();
    const { data, error } = await supabase.from('workers').select('*').eq('id', id).maybeSingle();
    if (error) throw new Error(`Supabase getWorkerById error: ${error.message}`);
    return data ? rowToWorker(data) : null;
  }

  async createWorker(workerData) {
    const supabase = supabaseClient.getClient();
    const row = workerToRow(workerData);
    const { data, error } = await supabase.from('workers').insert([row]).select().single();
    if (error) throw new Error(`Supabase createWorker error: ${error.message}`);
    return rowToWorker(data);
  }

  async updateWorker(id, updates) {
    const supabase = supabaseClient.getClient();
    const row = workerToRow(updates);
    delete row.id;
    const { data, error } = await supabase.from('workers').update(row).eq('id', id).select().single();
    if (error) throw new Error(`Supabase updateWorker error: ${error.message}`);
    return rowToWorker(data);
  }

  // --- APPLICATIONS ---

  async getApplications(filters = {}) {
    const supabase = supabaseClient.getClient();
    let query = supabase.from('applications').select('*').order('applied_at', { ascending: false });

    if (filters.workerId) {
      query = query.eq('worker_id', filters.workerId);
    }
    if (filters.jobId) {
      query = query.eq('job_id', filters.jobId);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Supabase getApplications error: ${error.message}`);
    return (data || []).map(rowToApp);
  }

  async findApplication(jobId, workerId) {
    const supabase = supabaseClient.getClient();
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('job_id', jobId)
      .eq('worker_id', workerId)
      .maybeSingle();
    if (error) throw new Error(`Supabase findApplication error: ${error.message}`);
    return data ? rowToApp(data) : null;
  }

  async createApplication(appData) {
    const supabase = supabaseClient.getClient();
    const row = appToRow(appData);
    const { data, error } = await supabase.from('applications').insert([row]).select().single();
    if (error) throw new Error(`Supabase createApplication error: ${error.message}`);

    // Atomically increment applications_count on the job
    try {
      const job = await this.getJobById(appData.jobId);
      if (job) {
        await supabase
          .from('jobs')
          .update({ applications_count: (job.applicationsCount || 0) + 1 })
          .eq('id', appData.jobId);
      }
    } catch (countErr) {
      console.warn('[SupabaseService] Failed to increment applications_count:', countErr.message);
    }

    return rowToApp(data);
  }

  async updateApplicationStatus(id, status) {
    const supabase = supabaseClient.getClient();
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`Supabase updateApplicationStatus error: ${error.message}`);
    return rowToApp(data);
  }

  // --- HIRING REQUESTS ---

  async getHiringRequests(filters = {}) {
    const supabase = supabaseClient.getClient();
    let query = supabase.from('hiring_requests').select('*').order('sent_at', { ascending: false });

    if (filters.workerId) {
      query = query.eq('worker_id', filters.workerId);
    }
    if (filters.employerId) {
      query = query.eq('employer_id', filters.employerId);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Supabase getHiringRequests error: ${error.message}`);
    return (data || []).map(rowToHiring);
  }

  async createHiringRequest(reqData) {
    const supabase = supabaseClient.getClient();
    const row = hiringToRow(reqData);
    const { data, error } = await supabase.from('hiring_requests').insert([row]).select().single();
    if (error) throw new Error(`Supabase createHiringRequest error: ${error.message}`);
    return rowToHiring(data);
  }
}

module.exports = new SupabaseService();
