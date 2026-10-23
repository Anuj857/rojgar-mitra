import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Heart, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-lg">
                <img src="/logo.svg" alt="Rojgar Mitra" className="w-7 h-7" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                रोजगार <span className="text-success-400">मित्र</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t.footerDesc}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 p-2.5 rounded-lg max-w-sm">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span>{language === 'hi' ? '100% निशुल्क व सुरक्षित • कोई बिचौलिया नहीं' : '100% Free for Workers • Zero Middlemen'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footerLinks}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  {t.navHome}
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-slate-400 hover:text-white transition-colors">
                  {t.navFindJobs}
                </Link>
              </li>
              <li>
                <Link to="/workers" className="text-slate-400 hover:text-white transition-colors">
                  {t.navHireWorkers}
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="text-slate-400 hover:text-white transition-colors">
                  {t.navPostJob}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-400 hover:text-white transition-colors">
                  {t.navAdmin}
                </Link>
              </li>
            </ul>
          </div>

          {/* Job Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {language === 'hi' ? 'मुख्य काम' : 'Categories'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>{language === 'hi' ? 'राजमिस्त्री / निर्माण' : 'Construction & Mason'}</li>
              <li>{language === 'hi' ? 'इलेक्ट्रीशियन व वायरिंग' : 'Electrician & Wiring'}</li>
              <li>{language === 'hi' ? 'कमर्शियल व प्राइवेट ड्राइवर' : 'Commercial Drivers'}</li>
              <li>{language === 'hi' ? 'प्लंबर व सेनेटरी' : 'Plumbing & Sanitation'}</li>
              <li>{language === 'hi' ? 'जेसीबी ऑपरेटर' : 'JCB & Heavy Machinery'}</li>
              <li>{language === 'hi' ? 'गोदाम हेल्पर' : 'Helpers & Loaders'}</li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footerContact}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>+91 1800-ROJGAR (टोल फ्री हेल्पलाइन)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>support@rojgarmitra.in</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>गोमती नगर, लखनऊ (UP) & दिल्ली-एनसीआर, भारत</span>
              </div>
            </div>
            <div className="pt-2">
              <Link 
                to="/terms"
                className="text-xs text-slate-400 hover:text-white underline block"
              >
                {language === 'hi' ? 'नियम व गोपनीयता नीति' : 'Terms & Privacy Policy'}
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>{t.footerRights}</p>
          <p className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Bharat's hardworking workforce</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
