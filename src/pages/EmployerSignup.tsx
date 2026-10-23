import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, MapPin, Phone, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const EmployerSignup: React.FC = () => {
  const { language } = useLanguage();
  const { user, completeEmployerProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('संजय वर्मा (Sanjay Verma)');
  const [companyName, setCompanyName] = useState('अवध कंस्ट्रक्शन प्रा. लि.');
  const [businessType, setBusinessType] = useState<'contractor' | 'individual' | 'business' | 'shop'>('contractor');
  const [mobile] = useState(user?.mobile || '9876501234');
  const [email, setEmail] = useState('contact@awadhconstruction.in');
  const [location, setLocation] = useState('गोमती नगर, लखनऊ (UP)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    completeEmployerProfile({
      name: name.trim(),
      companyName: companyName.trim(),
      mobile: mobile,
      location: location.trim()
    });

    showToast(
      language === 'hi' 
        ? 'नियोक्ता प्रोफाइल सफलतापूर्वक सक्रिय हो गई!' 
        : 'Employer profile activated successfully!',
      'success'
    );

    setIsSubmitting(false);
    navigate('/employer-dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-success-700 bg-success-50 px-3 py-1 rounded-full border border-success-200">
            {language === 'hi' ? 'नियोक्ता प्रोफाइल विवरण' : 'Employer Profile Setup'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
            {language === 'hi' ? 'नियोक्ता / फर्म प्रोफाइल बनाएं' : 'Create Employer Profile'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {language === 'hi'
              ? 'कारीगरों को तुरंत काम पर रखने और आवश्यकताएं पोस्ट करने के लिए आवश्यक'
              : 'Post jobs and hire local verified workers instantly with 0% brokerage'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'आपका नाम (मुख्य संपर्क)' : 'Contact Person Name'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-success-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'कंपनी / व्यवसाय / साइट का नाम' : 'Company / Firm / Site Name'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-success-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'व्यवसाय का प्रकार' : 'Business Type'}
              </label>
              <select
                value={businessType}
                onChange={e => setBusinessType(e.target.value as any)}
                className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-success-500 bg-white"
              >
                <option value="contractor">ठेकेदार / सिविल कांट्रेक्टर (Contractor)</option>
                <option value="individual">व्यक्तिगत गृहस्वामी (Individual Homeowner)</option>
                <option value="business">कंपनी / उद्यम (Business Entity)</option>
                <option value="shop">दुकानदार / गोदाम मालिक (Shop / Warehouse)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'मोबाइल नंबर (सत्यापित)' : 'Mobile (Verified)'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  disabled
                  value={`+91 ${mobile}`}
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 rounded-xl cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email (Optional)'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-success-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'मुख्य कार्यक्षेत्र / शहर' : 'City / Primary Site Locality'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-success-500"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-success-600 hover:bg-success-700 text-white font-black text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{language === 'hi' ? 'डैशबोर्ड में प्रवेश करें' : 'Enter Employer Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
