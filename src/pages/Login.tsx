import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login: React.FC = () => {
  const { language, t } = useLanguage();
  const { loginWithMobile, switchRoleDemo } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [mobile, setMobile] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobile.trim().replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setError(language === 'hi' ? 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await loginWithMobile(cleanMobile);
      navigate('/otp-demo');
    } catch {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoRole = (role: 'worker' | 'employer' | 'admin') => {
    switchRoleDemo(role);
    showToast(
      language === 'hi'
        ? `${role === 'worker' ? 'श्रमिक' : role === 'employer' ? 'नियोक्ता' : 'एडमिन'} खाते में लॉगिन सफल`
        : `Logged in as ${role} account`,
      'success'
    );
    if (role === 'worker') navigate('/worker-dashboard');
    else if (role === 'employer') navigate('/employer-dashboard');
    else navigate('/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 group mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-900 to-brand-700 flex items-center justify-center shadow-md">
              <img src="/logo.svg" alt="Rojgar Mitra" className="w-8 h-8" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.loginTitle}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {t.loginSubtitle}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.mobileLabel} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full pl-14 pr-4 py-3 text-sm font-semibold tracking-wider border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>{language === 'hi' ? 'प्रतीक्षा करें...' : 'Sending...'}</span>
              ) : (
                <>
                  <span>{t.sendOtp}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Profile Shortcuts */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center mb-3">
              {language === 'hi' ? '— या सीधे प्रोफाइल चुनें —' : '— Or Continue with Sample Profile —'}
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoRole('worker')}
                className="p-2.5 rounded-xl border border-brand-200 bg-brand-50 hover:bg-brand-100 text-brand-900 text-xs font-bold text-left transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-brand-700 text-white flex items-center justify-center text-[10px] font-bold">
                  👷
                </div>
                <div>
                  <div>{language === 'hi' ? 'श्रमिक खाता' : 'Worker'}</div>
                  <div className="text-[10px] text-brand-700/80 font-normal">रमेश कुमार (ड्राइवर)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoRole('employer')}
                className="p-2.5 rounded-xl border border-success-200 bg-success-50 hover:bg-success-100 text-success-900 text-xs font-bold text-left transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-success-700 text-white flex items-center justify-center text-[10px] font-bold">
                  🏢
                </div>
                <div>
                  <div>{language === 'hi' ? 'नियोक्ता खाता' : 'Employer'}</div>
                  <div className="text-[10px] text-success-700/80 font-normal">संजय वर्मा (कांट्रेक्टर)</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Security assurance */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{language === 'hi' ? '100% सुरक्षित • आपका डेटा निजी रहेगा' : '100% Safe & Secure'}</span>
        </div>
      </div>
    </div>
  );
};
