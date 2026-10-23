import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const RoleSelect: React.FC = () => {
  const { language, t } = useLanguage();
  const { setAccountRole } = useAuth();
  const navigate = useNavigate();

  const handleSelectRole = (role: 'worker' | 'employer') => {
    setAccountRole(role);
    if (role === 'worker') {
      navigate('/worker-signup');
    } else {
      navigate('/employer-signup');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            {language === 'hi' ? 'अपनी भूमिका चुनें' : 'Choose Account Role'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
            {t.roleSelectTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {language === 'hi' 
              ? 'काम पाने या काम करवाने के लिए उपयुक्त विकल्प चुनें' 
              : 'Select whether you are looking for work or looking to hire'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Worker Card */}
          <button
            onClick={() => handleSelectRole('worker')}
            className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 hover:border-brand-600 shadow-sm hover:shadow-xl transition-all text-left flex flex-col justify-between group active:scale-[0.98]"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all">
                <Briefcase className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-black text-slate-900 group-hover:text-brand-700 transition-colors">
                {language === 'hi' ? 'कामगार / श्रमिक' : 'Worker / Technician'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                {t.roleWorkerDesc}
              </p>

              <div className="mt-5 space-y-2 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? '100% निशुल्क - 0% दलाली' : 'Zero commission on earnings'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? 'अपने पास के काम तुरंत पाएं' : 'Direct calls from local employers'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-700">
              <span>{language === 'hi' ? 'श्रमिक के रूप में जारी रखें' : 'Continue as Worker'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </button>

          {/* Employer Card */}
          <button
            onClick={() => handleSelectRole('employer')}
            className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 hover:border-success-600 shadow-sm hover:shadow-xl transition-all text-left flex flex-col justify-between group active:scale-[0.98]"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-success-50 text-success-700 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-success-600 group-hover:text-white transition-all">
                <Users className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-black text-slate-900 group-hover:text-success-700 transition-colors">
                {language === 'hi' ? 'नियोक्ता / ठेकेदार' : 'Employer / Contractor'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                {t.roleEmployerDesc}
              </p>

              <div className="mt-5 space-y-2 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? 'सत्यापित स्थानीय हुनर तुरंत खोजें' : 'Verified local skill network'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? '1 मिनट में फ्री में काम पोस्ट करें' : 'Post unlimited job requirements'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-success-700">
              <span>{language === 'hi' ? 'नियोक्ता के रूप में जारी रखें' : 'Continue as Employer'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
