-- ============================================================================
-- Rojgar Mitra (रोजगार मित्र) — Supabase PostgreSQL Database Schema
-- Migration from Google Sheets to Supabase PostgreSQL
-- ============================================================================

-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. JOBS TABLE
-- Mirrors: Job interface from src/types/index.ts & Google Sheets 'Jobs' tab
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.jobs (
    id TEXT PRIMARY KEY DEFAULT ('job-' || replace(gen_random_uuid()::text, '-', '')),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    category_hi TEXT DEFAULT '',
    description TEXT DEFAULT '',
    salary NUMERIC NOT NULL DEFAULT 0,
    salary_period TEXT NOT NULL DEFAULT 'per_day' CHECK (salary_period IN ('per_day', 'per_month', 'per_hour', 'contract')),
    location TEXT NOT NULL,
    distance_km NUMERIC DEFAULT 0,
    workers_required INTEGER NOT NULL DEFAULT 1,
    workers_hired INTEGER NOT NULL DEFAULT 0,
    required_experience TEXT DEFAULT '',
    work_duration TEXT DEFAULT '',
    working_hours TEXT DEFAULT '',
    start_date TEXT DEFAULT '',
    is_urgent BOOLEAN NOT NULL DEFAULT false,
    employer_id TEXT NOT NULL,
    employer_name TEXT NOT NULL,
    employer_rating NUMERIC DEFAULT 5.0,
    employer_phone TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'paused')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    applications_count INTEGER NOT NULL DEFAULT 0,
    required_skills TEXT[] DEFAULT '{}'::text[],
    -- Optional Supabase Auth user reference (nullable for backend-mediated posting without Auth)
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for fast hyperlocal search and filtering
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs (category);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs (location);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON public.jobs (employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_urgent ON public.jobs (is_urgent) WHERE is_urgent = true;
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs (user_id) WHERE user_id IS NOT NULL;

-- ============================================================================
-- 2. WORKERS TABLE
-- Mirrors: Worker interface from src/types/index.ts & Google Sheets 'Workers' tab
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workers (
    id TEXT PRIMARY KEY DEFAULT ('w-' || replace(gen_random_uuid()::text, '-', '')),
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    category TEXT NOT NULL,
    category_hi TEXT DEFAULT '',
    skills TEXT[] DEFAULT '{}'::text[],
    experience_years NUMERIC DEFAULT 0,
    preferred_salary NUMERIC DEFAULT 0,
    salary_period TEXT NOT NULL DEFAULT 'per_day' CHECK (salary_period IN ('per_day', 'per_month', 'per_hour', 'contract')),
    location TEXT DEFAULT '',
    distance_km NUMERIC DEFAULT 0,
    preferred_distance_km NUMERIC DEFAULT 10,
    availability_status TEXT NOT NULL DEFAULT 'available_now' CHECK (availability_status IN ('available_now', 'available_part_time', 'busy')),
    profile_photo_url TEXT DEFAULT '',
    rating NUMERIC DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    completed_jobs_count INTEGER DEFAULT 0,
    verified BOOLEAN NOT NULL DEFAULT false,
    languages TEXT[] DEFAULT '{"Hindi"}'::text[],
    about TEXT DEFAULT '',
    work_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    -- Optional Supabase Auth user reference
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Unique index on worker mobile to prevent duplicate profiles
CREATE UNIQUE INDEX IF NOT EXISTS idx_workers_mobile ON public.workers (mobile);
CREATE INDEX IF NOT EXISTS idx_workers_category ON public.workers (category);
CREATE INDEX IF NOT EXISTS idx_workers_availability ON public.workers (availability_status);
CREATE INDEX IF NOT EXISTS idx_workers_location ON public.workers (location);
CREATE INDEX IF NOT EXISTS idx_workers_user_id ON public.workers (user_id) WHERE user_id IS NOT NULL;

-- ============================================================================
-- 3. EMPLOYERS TABLE
-- Mirrors: Employer interface from src/types/index.ts
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.employers (
    id TEXT PRIMARY KEY DEFAULT ('emp-' || replace(gen_random_uuid()::text, '-', '')),
    name TEXT NOT NULL,
    company_name TEXT DEFAULT '',
    business_type TEXT NOT NULL DEFAULT 'individual' CHECK (business_type IN ('individual', 'contractor', 'business', 'shop')),
    mobile TEXT NOT NULL,
    email TEXT DEFAULT '',
    location TEXT DEFAULT '',
    verified BOOLEAN NOT NULL DEFAULT false,
    active_jobs_count INTEGER DEFAULT 0,
    total_hired INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    -- Optional Supabase Auth user reference
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_employers_mobile ON public.employers (mobile);
CREATE INDEX IF NOT EXISTS idx_employers_user_id ON public.employers (user_id) WHERE user_id IS NOT NULL;

-- ============================================================================
-- 4. APPLICATIONS TABLE
-- Mirrors: Application interface from src/types/index.ts & Google Sheets 'Applications' tab
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY DEFAULT ('app-' || replace(gen_random_uuid()::text, '-', '')),
    job_id TEXT NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    job_title TEXT DEFAULT '',
    category TEXT DEFAULT '',
    employer_name TEXT DEFAULT '',
    location TEXT DEFAULT '',
    salary NUMERIC DEFAULT 0,
    salary_period TEXT DEFAULT 'per_day',
    worker_id TEXT NOT NULL,
    worker_name TEXT NOT NULL,
    worker_mobile TEXT DEFAULT '',
    worker_skill TEXT DEFAULT '',
    applied_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    expected_salary NUMERIC,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    -- Optional Supabase Auth user reference of applicant
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    -- Prevent duplicate application for the same job by the same worker
    CONSTRAINT uq_job_worker_application UNIQUE (job_id, worker_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications (job_id);
CREATE INDEX IF NOT EXISTS idx_applications_worker_id ON public.applications (worker_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications (user_id) WHERE user_id IS NOT NULL;

-- ============================================================================
-- 5. HIRING REQUESTS TABLE
-- Mirrors: HiringRequest interface from src/types/index.ts & Google Sheets 'HiringRequests' tab
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.hiring_requests (
    id TEXT PRIMARY KEY DEFAULT ('hire-req-' || replace(gen_random_uuid()::text, '-', '')),
    worker_id TEXT NOT NULL,
    worker_name TEXT DEFAULT '',
    employer_id TEXT NOT NULL,
    employer_name TEXT DEFAULT '',
    employer_phone TEXT DEFAULT '',
    job_role TEXT NOT NULL,
    proposed_daily_wage NUMERIC NOT NULL DEFAULT 0,
    location TEXT DEFAULT '',
    work_duration TEXT DEFAULT '',
    message TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'accepted', 'declined')),
    sent_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    -- Optional Supabase Auth user reference of sender (employer)
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_hiring_requests_worker_id ON public.hiring_requests (worker_id);
CREATE INDEX IF NOT EXISTS idx_hiring_requests_employer_id ON public.hiring_requests (employer_id);
CREATE INDEX IF NOT EXISTS idx_hiring_requests_status ON public.hiring_requests (status);
CREATE INDEX IF NOT EXISTS idx_hiring_requests_user_id ON public.hiring_requests (user_id) WHERE user_id IS NOT NULL;

-- ============================================================================
-- 6. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_jobs_updated_at ON public.jobs;
CREATE TRIGGER tr_jobs_updated_at
    BEFORE UPDATE ON public.jobs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_workers_updated_at ON public.workers;
CREATE TRIGGER tr_workers_updated_at
    BEFORE UPDATE ON public.workers
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_employers_updated_at ON public.employers;
CREATE TRIGGER tr_employers_updated_at
    BEFORE UPDATE ON public.employers
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_applications_updated_at ON public.applications;
CREATE TRIGGER tr_applications_updated_at
    BEFORE UPDATE ON public.applications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_hiring_requests_updated_at ON public.hiring_requests;
CREATE TRIGGER tr_hiring_requests_updated_at
    BEFORE UPDATE ON public.hiring_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 7. SECURE PUBLIC DIRECTORY VIEW (Privacy-Safe Worker Directory)
-- Excludes personal phone numbers (mobile) so anon users cannot scrape PII.
-- ============================================================================
CREATE OR REPLACE VIEW public.workers_public_directory AS
SELECT
    id,
    name,
    category,
    category_hi,
    skills,
    experience_years,
    preferred_salary,
    salary_period,
    location,
    distance_km,
    availability_status,
    profile_photo_url,
    rating,
    reviews_count,
    completed_jobs_count,
    verified,
    languages,
    about,
    created_at
FROM public.workers;

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
--
-- ARCHITECTURE & SECURITY MODEL:
-- 1. BACKEND MEDIATED (Current Active Architecture):
--    All writes (job posting, application submission, profile updates) and
--    sensitive reads flow through the Node.js Express backend using the
--    SUPABASE_SERVICE_ROLE_KEY. The service_role bypasses RLS and enforces
--    input validation, business logic, and duplicate checks server-side.
--    The service_role key must NEVER be exposed to the frontend or committed.
--
-- 2. PUBLIC ANONYMOUS ACCESS (Direct PostgREST with anon key):
--    - Active jobs: ALLOWED to read (public job browsing).
--    - Workers table: DENIED by default (protects mobile numbers & PII).
--    - Employers table: DENIED by default (protects mobile numbers & email).
--    - Applications & Hiring Requests: DENIED by default.
--    - Direct anonymous writes: STRICTLY DENIED on all tables.
--
-- 3. FUTURE SUPABASE AUTH ACCESS (Prepared for future Auth phase):
--    Uses explicit user_id UUID references, avoiding broken text-ID assumptions.
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hiring_requests ENABLE ROW LEVEL SECURITY;

-- 8.1 SERVICE ROLE POLICIES (Backend Node.js API has full management access)
DROP POLICY IF EXISTS "service_role_manage_jobs" ON public.jobs;
CREATE POLICY "service_role_manage_jobs"
    ON public.jobs FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_manage_workers" ON public.workers;
CREATE POLICY "service_role_manage_workers"
    ON public.workers FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_manage_employers" ON public.employers;
CREATE POLICY "service_role_manage_employers"
    ON public.employers FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_manage_applications" ON public.applications;
CREATE POLICY "service_role_manage_applications"
    ON public.applications FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_manage_hiring_requests" ON public.hiring_requests;
CREATE POLICY "service_role_manage_hiring_requests"
    ON public.hiring_requests FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 8.2 PUBLIC READ POLICIES (Safe Browsing Only)
-- Anyone (anon / public) can browse active job openings:
DROP POLICY IF EXISTS "public_read_active_jobs" ON public.jobs;
CREATE POLICY "public_read_active_jobs"
    ON public.jobs FOR SELECT
    TO anon, authenticated
    USING (status = 'active');

-- Note: Workers and Employers tables have NO public anon SELECT policy.
-- This securely prevents direct scraping of worker phone numbers and employer contacts.
-- Worker listings are served through the validated Express API via service_role,
-- or through the privacy-safe public.workers_public_directory view.

-- 8.3 FUTURE SUPABASE AUTH POLICIES (Row-Ownership via user_id UUID)
-- These policies are prepared for when Supabase Auth is integrated in the client.
-- They rely on user_id UUID = auth.uid(), completely avoiding broken text-ID assumptions.

-- Jobs: Authenticated employer can manage jobs they created
DROP POLICY IF EXISTS "auth_employer_insert_job" ON public.jobs;
CREATE POLICY "auth_employer_insert_job"
    ON public.jobs FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "auth_employer_update_own_job" ON public.jobs;
CREATE POLICY "auth_employer_update_own_job"
    ON public.jobs FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "auth_employer_delete_own_job" ON public.jobs;
CREATE POLICY "auth_employer_delete_own_job"
    ON public.jobs FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Workers: Authenticated worker can manage their own profile
DROP POLICY IF EXISTS "auth_worker_read_own_profile" ON public.workers;
CREATE POLICY "auth_worker_read_own_profile"
    ON public.workers FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "auth_worker_update_own_profile" ON public.workers;
CREATE POLICY "auth_worker_update_own_profile"
    ON public.workers FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Applications:
-- 1) Applicant can insert their application
DROP POLICY IF EXISTS "auth_worker_insert_application" ON public.applications;
CREATE POLICY "auth_worker_insert_application"
    ON public.applications FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- 2) Applicant can view their own application; Job owner can view applications for their job
DROP POLICY IF EXISTS "auth_view_applications" ON public.applications;
CREATE POLICY "auth_view_applications"
    ON public.applications FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.jobs
            WHERE public.jobs.id = public.applications.job_id
              AND public.jobs.user_id = auth.uid()
        )
    );

-- 3) Job owner can update the status (accept/reject) of applications on their job
DROP POLICY IF EXISTS "auth_employer_update_application_status" ON public.applications;
CREATE POLICY "auth_employer_update_application_status"
    ON public.applications FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.jobs
            WHERE public.jobs.id = public.applications.job_id
              AND public.jobs.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.jobs
            WHERE public.jobs.id = public.applications.job_id
              AND public.jobs.user_id = auth.uid()
        )
    );

-- Hiring Requests:
-- 1) Employer can insert a hiring request
DROP POLICY IF EXISTS "auth_employer_insert_hiring_request" ON public.hiring_requests;
CREATE POLICY "auth_employer_insert_hiring_request"
    ON public.hiring_requests FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- 2) Sender (employer) or targeted worker can view the hiring request
DROP POLICY IF EXISTS "auth_view_hiring_requests" ON public.hiring_requests;
CREATE POLICY "auth_view_hiring_requests"
    ON public.hiring_requests FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.workers
            WHERE public.workers.id = public.hiring_requests.worker_id
              AND public.workers.user_id = auth.uid()
        )
    );

-- 3) Targeted worker can update the status (accept/decline) of the request
DROP POLICY IF EXISTS "auth_worker_update_hiring_request_status" ON public.hiring_requests;
CREATE POLICY "auth_worker_update_hiring_request_status"
    ON public.hiring_requests FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.workers
            WHERE public.workers.id = public.hiring_requests.worker_id
              AND public.workers.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workers
            WHERE public.workers.id = public.hiring_requests.worker_id
              AND public.workers.user_id = auth.uid()
        )
    );
