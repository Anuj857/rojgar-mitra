import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Briefcase, 
  Star, 
  ShieldCheck, 
  Phone, 
  Flame, 
  CheckCircle,
  Share2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { mockService } from '../services/mockService';
import { Job } from '../types';
import { ApplyModal } from '../components/jobs/ApplyModal';

export const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      setLoading(true);
      const found = await mockService.getJobById(id);
      setJob(found);

      // Check if current user already applied
      const apps = await mockService.getMyApplications(user?.id || 'w-1');
      if (apps.some(a => a.jobId === id)) {
        setHasApplied(true);
      }
      setLoading(false);
    };

    fetchJob();
  }, [id, user]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(
        language === 'hi' ? 'जॉब लिंक क्लिपबोर्ड में कॉपी हो गया!' : 'Job link copied to clipboard!',
        'success'
      );
    }
  };

  const handleCallEmployer = () => {
    if (!job) return;
    showToast(
      language === 'hi'
        ? `नियोक्ता ${job.employerName} का फोन: ${job.employerPhone}`
        : `Connecting to ${job.employerName}: ${job.employerPhone}`,
      'info'
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-4">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          {language === 'hi' ? 'यह काम उपलब्ध नहीं है' : 'Job listing not found'}
        </h2>
        <Link to="/jobs" className="inline-block px-5 py-2.5 bg-brand-700 text-white rounded-xl text-xs font-bold">
          {language === 'hi' ? 'अन्य नौकरियां देखें' : 'Browse other jobs'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'सभी नौकरियों पर वापस जाएं' : 'Back to Job Search'}</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'शेयर करें' : 'Share'}</span>
        </button>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Top Header: Category, Urgent Badge, Posted Date */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-brand-50 text-brand-800 border border-brand-200">
              {language === 'hi' ? job.categoryHi : job.category}
            </span>
            {job.isUrgent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                {t.urgentHiring}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 font-medium">पोस्ट किया गया: {job.createdAt}</span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
            {job.title}
          </h1>

          {/* Employer Card Mini */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm text-slate-600">
            <span className="font-bold text-slate-900">{job.employerName}</span>
            <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {job.employerRating} रेटिंग
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              सत्यापित नियोक्ता
            </span>
          </div>
        </div>

        {/* Highlight Stats: Wage, Location, Workers, Duration */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">{language === 'hi' ? 'वेतन / मजदूरी' : 'Salary'}</span>
            <div className="text-emerald-800 font-extrabold text-base flex items-center mt-0.5">
              <IndianRupee className="w-4 h-4 mr-0.5" />
              <span>{job.salary.toLocaleString('en-IN')}</span>
              <span className="text-xs font-normal text-slate-500 ml-1">
                {job.salaryPeriod === 'per_day' ? t.perDay : job.salaryPeriod === 'per_month' ? t.perMonth : t.perHour}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">{language === 'hi' ? 'दूरी' : 'Distance'}</span>
            <div className="text-brand-800 font-extrabold text-base mt-0.5">
              {job.distanceKm} km दूर
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">{language === 'hi' ? 'आवश्यकता' : 'Workers Needed'}</span>
            <div className="text-slate-800 font-extrabold text-base mt-0.5">
              {job.workersRequired} मजदूर
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">{language === 'hi' ? 'कार्य अवधि' : 'Duration'}</span>
            <div className="text-slate-800 font-extrabold text-base mt-0.5">
              {job.workDuration}
            </div>
          </div>
        </div>

        {/* Exact Location & Timings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-slate-100 bg-white">
            <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">{language === 'hi' ? 'कार्य स्थल' : 'Job Location'}</span>
              <span className="text-slate-600">{job.location}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-slate-100 bg-white">
            <Clock className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">{language === 'hi' ? 'काम के घंटे व शुरुआत' : 'Working Hours'}</span>
              <span className="text-slate-600">{job.workingHours} • {job.startDate}</span>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {language === 'hi' ? 'काम का पूरा विवरण' : 'Job Description'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Required Skills */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {language === 'hi' ? 'जरूरी कौशल व हुनर' : 'Required Skills'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            {language === 'hi' 
              ? 'बिना किसी एजेंट फीस के सीधे नियोक्ता से जुड़ें' 
              : 'Direct connection without middleman charges'}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleCallEmployer}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'कॉल करें' : 'Call Employer'}</span>
            </button>

            {hasApplied ? (
              <button
                disabled
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-extrabold cursor-default"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{t.appliedSuccess}</span>
              </button>
            ) : (
              <button
                onClick={() => setApplyModalOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-black shadow-md transition-all active:scale-95"
              >
                <Briefcase className="w-4 h-4" />
                <span>{t.applyNow}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <ApplyModal
        job={job}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        onSuccess={() => setHasApplied(true)}
      />
    </div>
  );
};
