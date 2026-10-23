import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  CheckCircle2, 
  ClipboardList, 
  User, 
  History, 
  Clock, 
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockService } from '../services/mockService';
import { mockCategories } from '../data/mockCategories';
import { Job, Application } from '../types';
import { JobCard } from '../components/jobs/JobCard';

export const WorkerDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [myApps, setMyApps] = useState<Application[]>([]);
  const [quickSearch, setQuickSearch] = useState('');

  // Profile completion calculation (out of 100%)
  const profileCompletion = 85;

  useEffect(() => {
    const loadDashboardData = async () => {
      const allJobs = await mockService.getJobs();
      
      // Filter recommended jobs matching worker's category or urgent
      const recommended = allJobs.filter(j => 
        j.category === (user?.category || 'Driver') || j.isUrgent
      ).slice(0, 3);

      setRecommendedJobs(recommended.length > 0 ? recommended : allJobs.slice(0, 3));
      setRecentJobs(allJobs.slice(0, 6));

      const apps = await mockService.getMyApplications(user?.id || 'w-1');
      setMyApps(apps);
    };

    loadDashboardData();
  }, [user]);

  const handleJobApplied = async () => {
    const apps = await mockService.getMyApplications(user?.id || 'w-1');
    setMyApps(apps);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'hi' ? 'सत्यापित कामगार प्रोफाइल' : 'Verified Worker Account'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {language === 'hi' ? `नमस्ते, ${user?.name || 'रमेश कुमार'} जी!` : `Welcome back, ${user?.name || 'Ramesh Kumar'}!`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {language === 'hi'
                ? 'आपके क्षेत्र में आज 15+ नए काम पोस्ट हुए हैं। सीधे नियोक्ता से बात करें।'
                : 'Over 15 new jobs posted in your locality today. Connect directly with employers.'}
            </p>
          </div>

          {/* Quick Profile Summary Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 min-w-[260px] text-xs space-y-2.5">
            <div className="flex items-center justify-between font-bold">
              <span>{language === 'hi' ? 'प्रोफाइल पूर्णता' : 'Profile Completed'}</span>
              <span className="text-emerald-400">{profileCompletion}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
              <span>{myApps.length} {language === 'hi' ? 'सक्रिय आवेदन' : 'Active Applications'}</span>
              <Link to="/worker-profile" className="text-amber-300 hover:underline font-semibold">
                {language === 'hi' ? 'एडिट करें →' : 'Edit →'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Action Shortcut Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/jobs"
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-300 transition-all group flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-700">
              {language === 'hi' ? 'काम खोजें' : 'Search Jobs'}
            </div>
            <div className="text-[11px] text-slate-400">{language === 'hi' ? 'पास के काम' : 'Nearby jobs'}</div>
          </div>
        </Link>

        <Link
          to="/applications"
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-300 transition-all group flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700">
              {language === 'hi' ? 'मेरे आवेदन' : 'Applications'}
            </div>
            <div className="text-[11px] text-slate-400">{myApps.length} {language === 'hi' ? 'आवेदन भेजे' : 'applied'}</div>
          </div>
        </Link>

        <Link
          to="/worker-profile"
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-300 transition-all group flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-700">
              {language === 'hi' ? 'मेरी प्रोफाइल' : 'My Profile'}
            </div>
            <div className="text-[11px] text-slate-400">{language === 'hi' ? 'हुनर व मजदूरी' : 'Skills & wage'}</div>
          </div>
        </Link>

        <Link
          to="/work-history"
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-300 transition-all group flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-700">
              {language === 'hi' ? 'कार्य इतिहास' : 'Work History'}
            </div>
            <div className="text-[11px] text-slate-400">{language === 'hi' ? 'रेटिंग व रिव्यू' : 'Ratings & preview'}</div>
          </div>
        </Link>
      </div>

      {/* 3. Inline Search & Category Chips */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quickSearch}
              onChange={e => setQuickSearch(e.target.value)}
              placeholder={language === 'hi' ? 'अपने काम का नाम लिखें (उदा. ड्राइवर, हेल्पर, पेंटर)...' : 'Type role to filter...'}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <Link
            to={quickSearch ? `/jobs?role=${encodeURIComponent(quickSearch)}` : '/jobs'}
            className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold shadow-sm"
          >
            {t.btnSearch}
          </Link>
        </div>

        {/* Popular Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-semibold whitespace-nowrap text-[11px]">
            {language === 'hi' ? 'श्रेणियां:' : 'Categories:'}
          </span>
          {mockCategories.map(cat => (
            <Link
              key={cat.id}
              to={`/jobs?cat=${encodeURIComponent(cat.nameEn)}`}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-800 text-slate-700 font-medium whitespace-nowrap transition-colors border border-transparent hover:border-brand-200"
            >
              {language === 'hi' ? cat.nameHi : cat.nameEn}
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Recommended Jobs Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'आपके हुनर के अनुसार अनुशंसित काम' : 'Recommended For Your Profile'}
            </h2>
          </div>
          <Link to="/jobs" className="text-xs font-bold text-brand-700 hover:underline">
            {language === 'hi' ? 'सभी देखें →' : 'View all →'}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              isApplied={myApps.some(a => a.jobId === job.id)}
              onApplied={handleJobApplied}
            />
          ))}
        </div>
      </div>

      {/* 5. Recent Job Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'हाल ही में पोस्ट किए गए काम' : 'Recently Posted Jobs'}
            </h2>
          </div>
          <Link to="/jobs" className="text-xs font-bold text-brand-700 hover:underline">
            {language === 'hi' ? 'नौकरी खोजें →' : 'Search more →'}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentJobs.slice(0, 3).map(job => (
            <JobCard
              key={job.id}
              job={job}
              isApplied={myApps.some(a => a.jobId === job.id)}
              onApplied={handleJobApplied}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
