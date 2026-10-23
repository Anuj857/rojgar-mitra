import React from 'react';
import { X, CheckCircle2, Star, MapPin, IndianRupee, Award, ShieldCheck, PhoneCall } from 'lucide-react';
import { Worker } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface WorkerProfileModalProps {
  worker: Worker | null;
  isOpen: boolean;
  onClose: () => void;
  onHireClick: (worker: Worker) => void;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({
  worker,
  isOpen,
  onClose,
  onHireClick
}) => {
  const { language } = useLanguage();
  if (!isOpen || !worker) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-brand-800 to-brand-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-brand-900/20 relative flex-shrink-0">
            {worker.name.charAt(0)}
            {worker.verified && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">{worker.name}</h2>
              {worker.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'सत्यापित' : 'Verified'}
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-brand-700 mt-1">
              {language === 'hi' ? worker.categoryHi : worker.category} • {worker.experienceYears} {language === 'hi' ? 'वर्ष का अनुभव' : 'Years Experience'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {worker.location} ({worker.distanceKm} km दूर)
              </span>
              <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {worker.rating} ({worker.reviewsCount} समीक्षाएं)
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-500">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                {worker.completedJobsCount} काम पूरे किए
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 block">{language === 'hi' ? 'दैनिक मजदूरी' : 'Preferred Wage'}</span>
            <div className="text-base font-extrabold text-emerald-800 flex items-center mt-0.5">
              <IndianRupee className="w-4 h-4" />
              <span>{worker.preferredSalary}</span>
              <span className="text-xs font-normal text-slate-500 ml-1">/ दिन</span>
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 block">{language === 'hi' ? 'उपलब्धता स्थिति' : 'Availability'}</span>
            <div className="mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {language === 'hi' ? 'तुरंत उपलब्ध' : 'Available Now'}
              </span>
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-500 block">{language === 'hi' ? 'कार्य दायरा' : 'Max Travel'}</span>
            <div className="text-sm font-bold text-slate-800 mt-0.5">
              {worker.preferredDistanceKm} किमी तक
            </div>
          </div>
        </div>

        {/* About / Bio */}
        {worker.about && (
          <div className="mb-5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              {language === 'hi' ? 'परिचय व अनुभव' : 'About & Experience'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {worker.about}
            </p>
          </div>
        )}

        {/* Skills */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            {language === 'hi' ? 'हुनर व कौशल (Skills)' : 'Skills & Specialization'}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {worker.skills.map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-50 text-brand-800 border border-brand-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Work History Preview Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {language === 'hi' ? 'कार्य इतिहास व पूर्व रेटिंग' : 'Work History & Attendance'}
            </h4>
          </div>

          <div className="space-y-3">
            {worker.workHistory.map(wh => (
              <div key={wh.id} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{wh.jobTitle}</span>
                  <span className="flex items-center gap-1 text-amber-600 font-extrabold bg-amber-50 px-2 py-0.5 rounded">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {wh.rating} / 5
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between text-slate-500 text-[11px]">
                  <span>{wh.employerName} • {wh.dateRange}</span>
                  <span className="text-emerald-700 font-semibold">
                    उपस्थिति दर: {wh.attendanceRate}%
                  </span>
                </div>
                <p className="text-slate-600 italic bg-slate-50 p-2 rounded-lg text-[11px] border border-slate-100">
                  "{wh.reviewComment}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {language === 'hi' ? 'सीधा संपर्क: कोई बिचौलिया नहीं' : 'Direct Hiring: Zero Brokerage'}
          </div>
          <button
            onClick={() => {
              onClose();
              onHireClick(worker);
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-success-600 hover:bg-success-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{language === 'hi' ? 'हायरिंग रिक्वेस्ट भेजें' : 'Send Hiring Request'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
