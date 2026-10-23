import React, { useState } from 'react';
import { X, Send, UserCheck, IndianRupee } from 'lucide-react';
import { Worker } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { mockService } from '../../services/mockService';
import { useToast } from '../../context/ToastContext';

interface HiringRequestModalProps {
  worker: Worker | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const HiringRequestModal: React.FC<HiringRequestModalProps> = ({
  worker,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { showToast } = useToast();

  const [jobRole, setJobRole] = useState(worker ? (language === 'hi' ? worker.categoryHi : worker.category) : '');
  const [proposedWage, setProposedWage] = useState<number>(worker?.preferredSalary || 800);
  const [workDuration, setWorkDuration] = useState('3-5 दिन');
  const [location, setLocation] = useState(user?.location || 'गोमती नगर, लखनऊ');
  const [message, setMessage] = useState('नमस्ते! मुझे अपनी साइट पर काम के लिए आपकी आवश्यकता है। कृपया संपर्क स्वीकार करें।');
  const [employerPhone, setEmployerPhone] = useState(user?.mobile || '9876501234');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !worker) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await mockService.sendHiringRequest({
        workerId: worker.id,
        workerName: worker.name,
        employerId: user?.id || 'emp-demo',
        employerName: user?.name || (user?.companyName ? `${user.name} (${user.companyName})` : 'संजय वर्मा'),
        employerPhone: employerPhone.trim(),
        jobRole: jobRole.trim(),
        proposedDailyWage: Number(proposedWage),
        location: location.trim(),
        workDuration: workDuration.trim(),
        message: message.trim()
      });

      showToast(
        language === 'hi'
          ? `हायरिंग रिक्वेस्ट सफलतापूर्वक भेज दी गई! ${worker.name} को सूचित कर दिया गया है।`
          : `Hiring request sent successfully to ${worker.name}!`,
        'success'
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch {
      showToast('Error sending request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-success-50 text-success-700 flex items-center justify-center border border-success-100">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'hi' ? 'हायरिंग रिक्वेस्ट भेजें' : 'Send Direct Hiring Request'}
            </h3>
            <p className="text-xs text-slate-500">
              {worker.name} • {language === 'hi' ? worker.categoryHi : worker.category}
            </p>
          </div>
        </div>

        {/* Worker brief summary */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4 text-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500">{language === 'hi' ? 'अनुभव:' : 'Exp:'}</span>{' '}
            <span className="font-bold text-slate-800">{worker.experienceYears} वर्ष</span>
            <span className="mx-2 text-slate-300">•</span>
            <span className="text-slate-500">{language === 'hi' ? 'दूरी:' : 'Distance:'}</span>{' '}
            <span className="font-bold text-brand-700">{worker.distanceKm} km</span>
          </div>
          <div className="text-success-800 font-bold">
            ₹{worker.preferredSalary} {worker.salaryPeriod === 'per_day' ? '/ दिन' : '/ माह'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'hi' ? 'काम का प्रकार / पद' : 'Job Role / Title'}
            </label>
            <input
              type="text"
              required
              value={jobRole}
              onChange={e => setJobRole(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'hi' ? 'प्रस्तावित दैनिक वेतन (₹)' : 'Proposed Daily Wage (₹)'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <IndianRupee className="w-3.5 h-3.5" />
                </span>
                <input
                  type="number"
                  required
                  value={proposedWage}
                  onChange={e => setProposedWage(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'hi' ? 'काम की अवधि' : 'Work Duration'}
              </label>
              <input
                type="text"
                required
                value={workDuration}
                onChange={e => setWorkDuration(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                placeholder="उदा. 4 दिन / 1 महीना"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'hi' ? 'काम का स्थान' : 'Job Location'}
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'hi' ? 'आपका संपर्क फोन' : 'Your Contact Phone'}
              </label>
              <input
                type="tel"
                required
                value={employerPhone}
                onChange={e => setEmployerPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'hi' ? 'संदेश' : 'Personal Message'}
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-success-600 hover:bg-success-700 rounded-lg shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'हायरिंग रिक्वेस्ट भेजें' : 'Send Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
