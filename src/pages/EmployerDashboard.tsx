import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Briefcase, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  ClipboardList
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockService } from '../services/mockService';
import { Job, Application } from '../types';

export const EmployerDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [allApplications, setAllApplications] = useState<Application[]>([]);

  useEffect(() => {
    const loadEmployerData = async () => {
      const jobs = await mockService.getJobs();
      setActiveJobs(jobs.filter(j => j.status === 'active'));
      const apps = await mockService.getMyApplications();
      setAllApplications(apps);
    };

    loadEmployerData();
  }, [user]);

  const totalHired = allApplications.filter(a => a.status === 'accepted').length + 5; // realistic demo count

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-brand-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-success-500/20 text-success-300 border border-success-400/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-success-400" />
              <span>{language === 'hi' ? 'सत्यापित नियोक्ता खाता' : 'Verified Employer Account'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {language === 'hi' 
                ? `नमस्ते, ${user?.name || 'संजय वर्मा'} जी!` 
                : `Welcome, ${user?.name || 'Sanjay Verma'}!`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {user?.companyName ? `${user.companyName} • ` : ''}
              {language === 'hi' 
                ? 'अपने प्रोजेक्ट्स के लिए कुशल कारीगर व मजदूर बिना किसी बिचौलिए के सीधे हायर करें।' 
                : 'Directly hire skilled workers and labourers for your sites with 0% brokerage.'}
            </p>
          </div>

          {/* Primary CTA: Post Job */}
          <Link
            to="/post-job"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-success-600 hover:bg-success-700 text-white font-extrabold text-sm shadow-lg shadow-success-950/40 transition-all active:scale-95 flex-shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t.navPostJob}</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {language === 'hi' ? 'सक्रिय जॉब पोस्टिंग' : 'Active Job Posts'}
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {activeJobs.length}
            </div>
            <Link to="/manage-jobs" className="text-xs font-semibold text-brand-700 hover:underline mt-2 inline-block">
              {language === 'hi' ? 'प्रबंधन करें →' : 'Manage jobs →'}
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
            <Briefcase className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {language === 'hi' ? 'प्राप्त आवेदन' : 'Applications Received'}
            </span>
            <div className="text-3xl font-black text-brand-700 mt-1">
              {allApplications.length}
            </div>
            <Link to="/manage-jobs" className="text-xs font-semibold text-brand-700 hover:underline mt-2 inline-block">
              {language === 'hi' ? 'उम्मीदवार देखें →' : 'Review candidates →'}
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <ClipboardList className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {language === 'hi' ? 'कुल हायर किए गए श्रमिक' : 'Total Hired Workers'}
            </span>
            <div className="text-3xl font-black text-success-700 mt-1">
              {totalHired}
            </div>
            <Link to="/workers" className="text-xs font-semibold text-success-700 hover:underline mt-2 inline-block">
              {language === 'hi' ? 'और कारीगर खोजें →' : 'Discover more →'}
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-success-50 text-success-700 flex items-center justify-center font-bold">
            <Users className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          to="/workers"
          className="bg-gradient-to-r from-brand-50 to-brand-100/50 p-6 rounded-3xl border border-brand-200 hover:border-brand-400 transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <h3 className="text-base font-bold text-brand-950 group-hover:text-brand-700 flex items-center gap-2">
              <Search className="w-5 h-5 text-brand-700" />
              <span>{language === 'hi' ? 'स्थानीय कारीगर व मजदूर खोजें' : 'Browse Local Workers'}</span>
            </h3>
            <p className="text-xs text-brand-800/80">
              {language === 'hi'
                ? 'ड्राइवर, राजमिस्त्री, इलेक्ट्रीशियन, प्लंबर व हेल्पर की सत्यापित प्रोफाइल देखें।'
                : 'Browse verified profiles and send direct hiring requests.'}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-brand-700 group-hover:translate-x-1.5 transition-transform" />
        </Link>

        <Link
          to="/post-job"
          className="bg-gradient-to-r from-success-50 to-emerald-100/50 p-6 rounded-3xl border border-success-200 hover:border-success-400 transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <h3 className="text-base font-bold text-success-950 group-hover:text-success-800 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-success-700" />
              <span>{language === 'hi' ? 'नई नौकरी / काम तुरंत पोस्ट करें' : 'Post a New Job Requirement'}</span>
            </h3>
            <p className="text-xs text-success-800/80">
              {language === 'hi'
                ? 'वेतन और स्थान दर्ज करें, 10 मिनट में स्थानीय कामगार आवेदन करना शुरू कर देंगे।'
                : '100% free job listing. Start receiving applications immediately.'}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-success-700 group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </div>

      {/* 4. Active Job Posts Summary Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'सक्रिय नौकरियां व प्राप्त आवेदन' : 'Active Job Postings'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'हाल ही में पोस्ट किए गए कार्य और उनके आवेदकों की संख्या' : 'Overview of posted openings'}
            </p>
          </div>
          <Link
            to="/manage-jobs"
            className="text-xs font-bold text-brand-700 hover:underline"
          >
            {language === 'hi' ? 'सभी प्रबंधित करें →' : 'View all →'}
          </Link>
        </div>

        <div className="space-y-3">
          {activeJobs.slice(0, 4).map(job => (
            <div
              key={job.id}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                    {job.category}
                  </span>
                  <span className="text-xs text-slate-400">{job.createdAt}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{job.title}</h4>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>₹{job.salary} {job.salaryPeriod === 'per_day' ? '/ दिन' : '/ माह'}</span>
                  <span>•</span>
                  <span>{job.location.split(',')[0]}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <span className="text-xs font-bold text-brand-800 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                    {job.applicationsCount} {language === 'hi' ? 'आवेदन' : 'applications'}
                  </span>
                </div>
                <Link
                  to="/manage-jobs"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  {language === 'hi' ? 'प्रबंधित करें' : 'Manage'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
