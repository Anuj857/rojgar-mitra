import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { MainLayout } from './components/layout/MainLayout';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { OtpDemo } from './pages/OtpDemo';
import { RoleSelect } from './pages/RoleSelect';
import { WorkerSignup } from './pages/WorkerSignup';
import { EmployerSignup } from './pages/EmployerSignup';
import { WorkerDashboard } from './pages/WorkerDashboard';
import { WorkerProfile } from './pages/WorkerProfile';
import { JobSearch } from './pages/JobSearch';
import { JobDetails } from './pages/JobDetails';
import { MyApplications } from './pages/MyApplications';
import { WorkHistory } from './pages/WorkHistory';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { PostJob } from './pages/PostJob';
import { FindWorkers } from './pages/FindWorkers';
import { ManageJobs } from './pages/ManageJobs';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutUs } from './pages/AboutUs';
import { TermsPrivacy } from './pages/TermsPrivacy';

// Scroll to top on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="otp-demo" element={<OtpDemo />} />
                <Route path="role-select" element={<RoleSelect />} />
                <Route path="worker-signup" element={<WorkerSignup />} />
                <Route path="employer-signup" element={<EmployerSignup />} />
                <Route path="worker-dashboard" element={<WorkerDashboard />} />
                <Route path="worker-profile" element={<WorkerProfile />} />
                <Route path="jobs" element={<JobSearch />} />
                <Route path="jobs/:id" element={<JobDetails />} />
                <Route path="applications" element={<MyApplications />} />
                <Route path="work-history" element={<WorkHistory />} />
                <Route path="employer-dashboard" element={<EmployerDashboard />} />
                <Route path="post-job" element={<PostJob />} />
                <Route path="workers" element={<FindWorkers />} />
                <Route path="manage-jobs" element={<ManageJobs />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="about" element={<AboutUs />} />
                <Route path="terms" element={<TermsPrivacy />} />
                <Route path="*" element={<Home />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
