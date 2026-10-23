import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Star, 
  MapPin, 
  IndianRupee, 
  Send, 
  Eye, 
  Award,
  Briefcase
} from 'lucide-react';
import { Worker } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { WorkerProfileModal } from './WorkerProfileModal';
import { HiringRequestModal } from './HiringRequestModal';

interface WorkerCardProps {
  worker: Worker;
  onHired?: () => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onHired }) => {
  const { language } = useLanguage();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [hireModalOpen, setHireModalOpen] = useState(false);

  const getStatusBadge = () => {
    switch (worker.availabilityStatus) {
      case 'available_now':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {language === 'hi' ? 'तुरंत उपलब्ध' : 'Available Now'}
          </span>
        );
      case 'available_part_time':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {language === 'hi' ? 'पार्ट-टाइम उपलब्ध' : 'Part-time'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
            {language === 'hi' ? 'व्यस्त' : 'Busy'}
          </span>
        );
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group hover:border-success-300">
        <div>
          {/* Header Row: Avatar, Name, Rating & Status */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-800 to-brand-600 text-white flex items-center justify-center text-lg font-black shadow-md flex-shrink-0 relative">
                {worker.name.charAt(0)}
                {worker.verified && (
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                  {worker.name}
                </h3>
                <p className="text-xs font-semibold text-brand-700 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {language === 'hi' ? worker.categoryHi : worker.category}
                </p>
              </div>
            </div>

            <div className="text-right">
              {getStatusBadge()}
            </div>
          </div>

          {/* Rating, completed jobs and experience */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 my-2.5">
            <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              {worker.rating}
              <span className="text-slate-400 font-normal">({worker.reviewsCount})</span>
            </span>

            <span className="text-slate-500 font-medium">
              {worker.experienceYears} {language === 'hi' ? 'वर्ष अनुभव' : 'yrs exp'}
            </span>

            <span className="flex items-center gap-1 text-slate-500">
              <Award className="w-3 h-3 text-slate-400" />
              {worker.completedJobsCount} {language === 'hi' ? 'काम पूरे' : 'jobs'}
            </span>
          </div>

          {/* Rate & Location */}
          <div className="grid grid-cols-2 gap-2 my-3 text-xs">
            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-emerald-700 font-semibold uppercase block">
                {language === 'hi' ? 'अपेक्षित मजदूरी' : 'Daily Wage'}
              </span>
              <div className="flex items-baseline text-emerald-900 font-extrabold text-sm sm:text-base mt-0.5">
                <IndianRupee className="w-3.5 h-3.5 mr-0.5 flex-shrink-0" />
                <span>{worker.preferredSalary}</span>
                <span className="text-[11px] font-normal text-emerald-700 ml-1">
                  {worker.salaryPeriod === 'per_day' ? '/ दिन' : '/ माह'}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 font-semibold uppercase flex items-center justify-between">
                <span>{language === 'hi' ? 'दूरी' : 'Distance'}</span>
                <span className="text-brand-700 font-bold">{worker.distanceKm} km</span>
              </span>
              <div className="flex items-center gap-1 text-slate-700 font-medium truncate mt-1">
                <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{worker.location.split(',')[0]}</span>
              </div>
            </div>
          </div>

          {/* Skills pills */}
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {worker.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 truncate max-w-[140px]"
                >
                  {skill}
                </span>
              ))}
              {worker.skills.length > 3 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-500 bg-slate-100">
                  +{worker.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => setProfileModalOpen(true)}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'hi' ? 'प्रोफाइल देखें' : 'View Profile'}</span>
          </button>

          <button
            onClick={() => setHireModalOpen(true)}
            className="flex-1 py-2 px-3 rounded-xl bg-success-600 hover:bg-success-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'हायरिंग रिक्वेस्ट' : 'Hire Worker'}</span>
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      <WorkerProfileModal
        worker={worker}
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onHireClick={() => setHireModalOpen(true)}
      />

      {/* Hiring Request Modal */}
      <HiringRequestModal
        worker={worker}
        isOpen={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
        onSuccess={onHired}
      />
    </>
  );
};
