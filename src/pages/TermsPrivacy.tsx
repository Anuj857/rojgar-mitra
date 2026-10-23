import React from 'react';
import { ShieldCheck, Lock, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TermsPrivacy: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          कानूनी नीतियां व शर्तें
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
          {language === 'hi' ? 'गोपनीयता नीति एवं सेवा शर्तें' : 'Privacy Policy & Terms of Service'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          अंतिम अद्यतन: 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-600" />
            1. डेटा सुरक्षा एवं गोपनीयता (Privacy & Data Handling)
          </h2>
          <p>
            रोजगार मित्र सभी श्रमिकों और नियोक्ताओं की जानकारी की गोपनीयता का आदर करता है। हम किसी भी अनधिकृत तीसरे पक्ष को व्यक्तिगत फोन नंबर या व्यक्तिगत विवरण साझा नहीं करते। केवल जब कोई श्रमिक किसी कार्य के लिए आवेदन करता है या नियोक्ता सहमति देता है, तभी परस्पर संपर्क विवरण साझा किए जाते हैं।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600" />
            2. निष्पक्ष मजदूरी नीति (Fair Wage & Transparent Terms)
          </h2>
          <p>
            नियोक्ताओं को जॉब पोस्ट करते समय सही और यथार्थवादी दैनिक या मासिक मजदूरी स्पष्ट रूप से लिखनी होगी। काम पूरा होने पर तय की गई मजदूरी का समय पर भुगतान करना नियोक्ता की जिम्मेदारी है। श्रमिकों से किसी भी प्रकार का अनुचित कमीशन नहीं काटा जाएगा।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            3. सुरक्षा एवं आचरण नियम (Community Guidelines)
          </h2>
          <p>
            मंच पर किसी भी प्रकार की धोखाधड़ी, गलत जॉब पोस्टिंग, भ्रामक अनुभव विवरण या दुर्व्यवहार सख्त वर्जित है। ऐसी किसी भी शिकायत पर तुरंत संबंधित खाते को निलंबित किया जा सकता है।
          </p>
        </section>
      </div>
    </div>
  );
};
