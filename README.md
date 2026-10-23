# Rojgar Mitra (रोजगार मित्र) — Frontend-First Platform

> **"काम पास में, रोजगार आसान।"**  
> *India's Hyperlocal Employment Platform connecting local skilled workers, technicians, and daily-wage labourers directly with employers, contractors, and businesses with 0% middlemen.*

---

## 📌 Phase 1: Frontend-First Implementation

As per project requirements, **Phase 1 is strictly frontend-first**:
- No backend server, database, or external auth is required or integrated.
- Modular architecture with clean TypeScript types and a dedicated service layer (`src/services/mockService.ts`).
- Non-sensitive browser-side demo data stored in `localStorage` for interactive demonstration (e.g., job postings created during demo immediately show up in the job listings and applications dashboard).
- **Ready for Google Sheets API integration** in Phase 2 without rebuilding any UI components.

---

## 🛠️ Technology Stack

- **React 18** with **TypeScript**
- **Vite** for rapid bundling and development
- **Tailwind CSS** with a custom Indian startup color palette (Deep Trust Blue `#0c3d70`, Vibrant Green `#16a34a`, Warm Amber accents)
- **React Router v6** for client-side routing
- **Lucide React** for icons
- **Hindi-First UI** with an instant English toggle button

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Steps
```bash
# 1. Navigate to the project directory
cd c:\Users\acer\Downloads\rojgar-mitra

# 2. Install dependencies (if not already installed)
npm install

# 3. Start local development server
npm run dev
```

The application will launch at:
👉 **`http://localhost:5173/`**

To verify a production build:
```bash
npm run build
npm run preview
```

---

## 📱 Completed Screens & User Journeys

### 1. Landing Page (`/`)
- **Brand Navbar** with logo, quick role-switcher, language toggle (`हिन्दी` / `English`), and responsive mobile drawer.
- **Hero Section**:
  - Headline: *"Find Local Work. Hire Local Talent."* / *"अपने पास काम पाएं, तुरंत हुनरमंद साथी चुनें"*
  - Tagline: *"आपके पास काम, आपके पास रोजगार।"*
  - Dual prominent CTAs: **"काम / नौकरी चाहिए" (Find a Job)** and **"मजदूर / मिस्त्री चाहिए" (Hire Workers)**.
  - Interactive search bar for role and locality that navigates with filter parameters.
- **Popular Categories**: Driver, Construction Worker / Mason, Electrician, Plumber, JCB Operator, Helper, Painter, Delivery Worker.
- **Featured Nearby Jobs**: Real-time salary and distance badges with 1-click apply.
- **How It Works**: 3-step guide for both Workers and Employers.
- **Why Choose Rojgar Mitra**: 100% middleman-free, within 2–15 km, transparent wages, verified profiles.
- **Trust & Safety Section**: Aadhaar and mobile verification guarantees.
- **Call-to-Action & Interactive FAQ Accordion**.
- **Professional Footer** with helpline, links, and frontend demo notice.

### 2. Authentication UI & Demo OTP Flow
- **Login Screen (`/login`)**: Indian mobile number input (+91 prefix, 10-digit validation) with 1-click demo role shortcuts.
- **OTP Screen (`/otp-demo`)**: 4-digit input with countdown resend timer and clear development disclaimer: **Demo code: 1234**.
- **Role Selection (`/role-select`)**: Choose between **Worker (कामगार / श्रमिक)** and **Employer (नियोक्ता / ठेकेदार)**.
- **Worker Signup (`/worker-signup`)**: Full profile creation with skills tags, experience, wage expectations, locality, and availability.
- **Employer Signup (`/employer-signup`)**: Firm/contractor name, business type, contact person, and site location.

### 3. Worker Experience
- **Worker Dashboard (`/worker-dashboard`)**:
  - Personalized welcome banner.
  - Profile completion progress indicator (85%).
  - Quick action shortcuts.
  - Recommended jobs based on trade.
  - Recent jobs list.
- **Worker Profile (`/worker-profile`)**: Editable profile with name, mobile, trade category, experience, preferred daily wage, distance radius (5–25 km), availability status, skills manager, and bio.
- **Job Search (`/jobs`)**:
  - Search by role or location.
  - Sidebar filters: Urgent hiring only, category dropdown, distance slider (2–25 km), salary period (day/month), minimum salary slider.
  - Real-time job counter and reset button.
- **Job Details (`/jobs/:id`)**:
  - Full job specifications, salary in ₹, employer rating, required skills, work duration, working hours, and location.
  - Direct employer call demo simulator.
  - 1-click **ApplyModal** to submit expected wage and availability notes.
- **My Applications (`/applications`)**:
  - Tabbed view: All, Pending, Accepted, Rejected.
  - Real-time status badges.
  - Reveals employer direct phone number when status is "Accepted".
  - Ability to withdraw pending applications.
- **Work History (`/work-history`)**:
  - Preview UI for past projects, verified attendance rates (e.g. 98%), employer ratings (1–5 stars), and employer review testimonials.
  - Clearly marked with **Sample Data Disclaimer**.
  - Interactive "Add Work Record" modal to test adding past projects.

### 4. Employer Experience
- **Employer Dashboard (`/employer-dashboard`)**:
  - Welcome banner with prominent **"Post a Job"** CTA.
  - Live metric cards: Active Job Count, Applications Received, Hired Workers.
  - Active jobs summary with applicant counts.
- **Post a Job (`/post-job`)**:
  - Functional form: Title, category, description, wage amount, payment period (per day, per month, per hour, contract), locality, number of workers required, required experience, duration, timings, start date, urgent hiring toggle, required skills.
  - Submitting immediately inserts the job into local demo state, making it live for workers to search and apply.
- **Find Workers (`/workers`)**:
  - Worker search bar and filters (category, availability, minimum experience, distance radius).
  - Worker profile cards showing ratings, completed jobs, daily wage, and distance.
  - **"View Profile" Modal**: Detailed experience, bio, and work history.
  - **"Send Hiring Request" Modal**: Direct wage offer, duration, and site message.
- **Manage Jobs (`/manage-jobs`)**:
  - Tabs: Active Jobs vs. Closed Jobs.
  - Close / reopen job toggle.
  - Inline **Edit Job Modal**.
  - Delete job action.
  - **View Applications Drawer**: Review candidates who applied, with interactive **"Accept & Hire"** or **"Decline"** actions that update candidate application status in real-time.

### 5. Admin Preview (`/admin`)
- Frontend-only admin overview dashboard.
- Metric cards: Total Workers (4,500+), Total Employers (856), Total Jobs (1,250+), Reported Listings (2).
- User Management Table: Filter by role (Worker / Employer), search by name or trade, and toggle verification status.
- Live Recent Activity Feed.

---

## 🗂️ Project Structure

```
rojgar-mitra/
├── index.html                  # HTML entry with Devanagari & Inter fonts
├── package.json                # Dependencies and build scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Brand theme colors and responsive breakpoints
├── tsconfig.json               # TypeScript strict compiler options
├── vite.config.ts              # Vite bundler configuration
├── public/
│   └── logo.svg                # Brand logo SVG
└── src/
    ├── main.tsx                # React root mount
    ├── App.tsx                 # React Router and Providers configuration
    ├── index.css               # Tailwind directives and custom scrollbar
    ├── types/
    │   └── index.ts            # Worker, Employer, Job, Application, Review types
    ├── context/
    │   ├── LanguageContext.tsx # Hindi-first / English i18n context
    │   ├── AuthContext.tsx     # Demo auth, roles, and quick-switch provider
    │   └── ToastContext.tsx    # Global interactive toast notification system
    ├── data/
    │   ├── mockCategories.ts   # 8 popular trade categories with icon mappings
    │   ├── mockJobs.ts         # Hyperlocal realistic job listings
    │   ├── mockWorkers.ts      # Detailed worker profiles with sample work history
    │   └── translations.ts     # Bilingual dictionary (Hindi & English)
    ├── services/
    │   └── mockService.ts      # Service layer with localStorage fallback
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.tsx      # Main navigation with mobile drawer & role switch
    │   │   └── Footer.tsx      # Multi-column footer & demo notices
    │   ├── layout/
    │   │   └── MainLayout.tsx  # Layout container
    │   ├── jobs/
    │   │   ├── JobCard.tsx     # Reusable job card with wage & distance badges
    │   │   └── ApplyModal.tsx  # Job application modal
    │   └── workers/
    │       ├── WorkerCard.tsx          # Reusable worker card with trade badge
    │       ├── WorkerProfileModal.tsx  # Full worker profile preview
    │       └── HiringRequestModal.tsx  # Direct hiring request modal
    └── pages/
        ├── Home.tsx              # Complete landing page
        ├── Login.tsx             # Mobile login
        ├── OtpDemo.tsx           # Simulated OTP screen (Code: 1234)
        ├── RoleSelect.tsx        # Worker vs Employer role selection
        ├── WorkerSignup.tsx      # Worker onboarding
        ├── EmployerSignup.tsx    # Employer onboarding
        ├── WorkerDashboard.tsx   # Worker command center
        ├── WorkerProfile.tsx     # Editable worker profile
        ├── JobSearch.tsx         # Job search with filters
        ├── JobDetails.tsx        # Single job detail view
        ├── MyApplications.tsx    # Applications tracking
        ├── WorkHistory.tsx       # Past projects & ratings
        ├── EmployerDashboard.tsx # Employer overview
        ├── PostJob.tsx           # Functional job posting form
        ├── FindWorkers.tsx       # Search and filter talent
        ├── ManageJobs.tsx        # Job management & applicant review
        ├── AdminDashboard.tsx    # Admin preview
        ├── AboutUs.tsx           # Mission & pillars
        └── TermsPrivacy.tsx      # Terms and demo transparency notice
```

---

## 📋 Next Phase: Google Sheets API Integration Roadmap

When you are ready to integrate Google Sheets as the lightweight backend:

1. **Google Cloud Console Setup**:
   - Create a Google Cloud project.
   - Enable **Google Sheets API** and **Google Drive API**.
   - Create a Service Account or OAuth 2.0 Web Client credentials and generate an API Key.
2. **Sheet Schema Preparation**:
   - **Sheet 1: `Jobs`**: `id`, `title`, `category`, `description`, `salary`, `salaryPeriod`, `location`, `distanceKm`, `workersRequired`, `employerId`, `employerName`, `status`, `createdAt`.
   - **Sheet 2: `Workers`**: `id`, `name`, `mobile`, `category`, `skills`, `experienceYears`, `preferredSalary`, `location`, `preferredDistanceKm`, `availabilityStatus`, `rating`.
   - **Sheet 3: `Applications`**: `id`, `jobId`, `workerId`, `workerName`, `workerMobile`, `expectedSalary`, `status`, `appliedAt`.
   - **Sheet 4: `HiringRequests`**: `id`, `workerId`, `employerId`, `jobRole`, `proposedWage`, `status`, `sentAt`.
3. **Plugging in the Service Layer**:
   - Replace the internal `localStorage` methods in `src/services/mockService.ts` with `fetch()` calls to Google Sheets API endpoints (or a serverless proxy like Google Apps Script Web App / Cloud Function).
   - Because all components consume `mockService.getJobs()`, `mockService.createJob()`, `mockService.applyForJob()`, etc., **zero UI component modifications** will be required!
