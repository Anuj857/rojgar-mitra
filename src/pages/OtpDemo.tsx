import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const OtpDemo: React.FC = () => {
  const { language, t } = useLanguage();
  const { pendingMobile, verifyOtp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [code, setCode] = useState(['1', '2', '3', '4']);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...code];
    updated[index] = val;
    setCode(updated);

    // Auto focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = code.join('');

    if (fullCode.length !== 4) {
      setError(language === 'hi' ? 'कृपया 4 अंकों का कोड दर्ज करें' : 'Please enter 4-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await verifyOtp(fullCode);
      showToast(
        language === 'hi' ? 'सफलतापूर्वक सत्यापन पूर्ण हुआ!' : 'Verification Successful!',
        'success'
      );
      navigate('/role-select');
    } catch (err: any) {
      setError(err?.message || (language === 'hi' ? 'गलत कोड। कृपया 1234 दर्ज करें।' : 'Invalid code. Please enter 1234.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(30);
    setCode(['1', '2', '3', '4']);
    showToast(
      language === 'hi' ? 'सत्यापन कोड: 1234' : 'Verification code: 1234',
      'info'
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Top return */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'नंबर बदलें' : 'Change number'}</span>
        </Link>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-5">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-3 border border-brand-100">
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t.otpTitle}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {t.otpSubtitle}{' '}
              <span className="font-bold text-slate-800">+91 {pendingMobile || '98765 43210'}</span>
            </p>
          </div>

          {/* Verification Code Box */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 text-xs flex items-center justify-between">
            <span className="font-semibold">{t.demoOtpNotice}</span>
            <button
              type="button"
              onClick={() => setCode(['1', '2', '3', '4'])}
              className="text-[11px] font-bold text-brand-700 hover:text-brand-900 underline"
            >
              {language === 'hi' ? 'कोड भरें' : 'Auto Fill'}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* OTP Digits */}
          <form onSubmit={handleVerify} className="space-y-5">
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map(i => (
                <input
                  key={i}
                  id={`otp-input-${i}`}
                  type="text"
                  maxLength={1}
                  value={code[i]}
                  onChange={e => handleDigitChange(i, e.target.value)}
                  className="w-13 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black text-slate-900 border-2 border-slate-300 rounded-2xl focus:border-brand-600 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <span>{language === 'hi' ? 'सत्यापित हो रहा है...' : 'Verifying...'}</span>
              ) : (
                <span>{t.verifyAndLogin}</span>
              )}
            </button>
          </form>

          {/* Resend Timer */}
          <div className="text-center pt-2">
            {timer > 0 ? (
              <span className="text-xs text-slate-400">
                {language === 'hi' ? `पुनः कोड भेजें (${timer}s)` : `Resend code in (${timer}s)`}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-xs font-bold text-brand-700 hover:text-brand-900 underline"
              >
                {language === 'hi' ? 'पुनः कोड भेजें' : 'Resend Code'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
