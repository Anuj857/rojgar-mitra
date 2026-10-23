import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Flame, 
  Star, 
  ArrowRight, 
  Check, 
  IndianRupee,
  Users
} from 'lucide-react';
import { Job } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ApplyModal } from './ApplyModal';

interface JobCardProps {
  job: Job;
  isApplied?: boolean;
  onApplied?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, isApplied = false, onApplied }) => {
  const { language, t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(isApplied);

  const handleApplySuccess = () => {
    setHasApplied(true);
    if (onApplied) onApplied();
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group hover:border-brand-300">
        <div>
          {/* Top Row: Category & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-100">
              {language === 'hi' ? job.categoryHi : job.category}
            </span>

            <div className="flex items-center gap-1.5">
              {job.isUrgent && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                  <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                  {t.urgentHiring}
                </span>
              )}
              <span className="text-[11px] text-slate-400 font-medium">{job.createdAt}</span>
            </div>
          </div>

          {/* Job Title */}
          <Link to={`/jobs/${job.id}`} className="block group-hover:text-brand-700 transition-colors">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 leading-snug">
              {job.title}
            </h3>
          </Link>

          {/* Employer & Rating */}
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-800 truncate">{job.employerName}</span>
            <span className="flex items-center gap-0.5 text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              {job.employerRating}
            </span>
          </div>

          {/* Key Details: Salary, Location, Workers */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            {/* Salary */}
            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider block">
                {language === 'hi' ? 'वेतन / मजदूरी' : 'Salary / Wage'}
              </span>
              <div className="flex items-baseline text-emerald-800 font-extrabold text-base mt-0.5">
                <IndianRupee className="w-3.5 h-3.5 mr-0.5 flex-shrink-0" />
                <span>{job.salary.toLocaleString('en-IN')}</span>
                <span className="text-[11px] font-normal text-emerald-700 ml-1">
                  {job.salaryPeriod === 'per_day' ? t.perDay : job.salaryPeriod === 'per_month' ? t.perMonth : t.perHour}
                </span>
              </div>
            </div>

            {/* Location & Distance */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block flex items-center justify-between">
                <span>{language === 'hi' ? 'स्थान' : 'Location'}</span>
                <span className="text-brand-700 font-bold">{job.distanceKm} km</span>
              </span>
              <div className="flex items-center gap-1 text-slate-700 font-medium truncate mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{job.location.split(',')[0]}</span>
              </div>
            </div>
          </div>

          {/* Quick specs: duration, timings, workers required */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {job.workDuration}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {job.workingHours}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {job.workersRequired} {t.workersNeeded}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
          {hasApplied ? (
            <button
              disabled
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-default"
            >
              <Check className="w-3.5 h-3.5" />
              {t.appliedSuccess}
            </button>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 py-2 px-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              {t.applyNow}
            </button>
          )}

          <Link
            to={`/jobs/${job.id}`}
            className="py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <span>{t.detailsBtn}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <ApplyModal
        job={job}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleApplySuccess}
      />
    </>
  );
};
