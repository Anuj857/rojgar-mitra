import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Briefcase, MapPin, IndianRupee } from 'lucide-react';
import { Job } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { mockService } from '../../services/mockService';
import { useToast } from '../../context/ToastContext';

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ job, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { showToast } = useToast();

  const [expectedSalary, setExpectedSalary] = useState<number>(job?.salary || 800);
  const [workerName, setWorkerName] = useState<string>(user?.name || 'रमेश कुमार');
  const [workerMobile, setWorkerMobile] = useState<string>(user?.mobile || '9876543210');
  const [notes, setNotes] = useState<string>('मैं इस काम के लिए तुरंत उपलब्ध हूँ और मेरे पास उपयुक्त अनुभव है।');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim()) {
      setError(language === 'hi' ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your name');
      return;
    }
    if (!workerMobile.trim() || workerMobile.length < 10) {
      setError(language === 'hi' ? 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await mockService.applyForJob({
        jobId: job.id,
        jobTitle: job.title,
        category: job.category,
        employerName: job.employerName,
        location: job.location,
        salary: job.salary,
        salaryPeriod: job.salaryPeriod,
        workerId: user?.id || 'w-1',
        workerName: workerName.trim(),
        workerMobile: workerMobile.trim(),
        workerSkill: user?.category || job.category,
        expectedSalary: Number(expectedSalary) || job.salary,
        notes: notes.trim()
      });

      showToast(
        language === 'hi'
          ? `सफलतापूर्वक आवेदन किया गया! ${job.employerName} को आपका आवेदन प्राप्त हो गया है।`
          : `Applied successfully! ${job.employerName} has received your application.`,
        'success'
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch {
      setError(language === 'hi' ? 'आवेदन करने में त्रुटि हुई' : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-700 border border-brand-100">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {language === 'hi' ? 'काम के लिए आवेदन करें' : 'Apply for this Job'}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">{job.title}</p>
          </div>
        </div>

        {/* Job Snippet */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-5 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center justify-between font-semibold text-slate-800">
            <span>{job.employerName}</span>
            <span className="text-success-700 font-bold flex items-center">
              ₹{job.salary.toLocaleString('en-IN')}{' '}
              <span className="text-[11px] font-normal text-slate-500 ml-1">
                {job.salaryPeriod === 'per_day' ? '/ दिन' : '/ माह'}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'hi' ? 'आपका नाम' : 'Your Full Name'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={workerName}
                onChange={e => setWorkerName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                placeholder="उदा. रमेश कुमार"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={workerMobile}
                onChange={e => setWorkerMobile(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                placeholder="10 अंकों का नंबर"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'hi' ? 'अपेक्षित मजदूरी / वेतन (₹)' : 'Expected Wage / Salary (₹)'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <IndianRupee className="w-3.5 h-3.5" />
              </span>
              <input
                type="number"
                value={expectedSalary}
                onChange={e => setExpectedSalary(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'hi' ? 'नियोक्ता के लिए संदेश या अनुभव' : 'Message for Employer'}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder={language === 'hi' ? 'अपनी उपलब्धता और पूर्व अनुभव के बारे में बताएं...' : 'Describe availability and experience...'}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{language === 'hi' ? 'जमा हो रहा है...' : 'Submitting...'}</span>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'आवेदन भेजें' : 'Send Application'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
