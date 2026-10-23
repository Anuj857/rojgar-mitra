import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AboutUs: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          {language === 'hi' ? 'हमारा विज़न और मिशन' : 'Our Vision & Mission'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {language === 'hi' ? (
            <>
              हर हुनरमंद हाथ को मिले <br />
              <span className="text-brand-700">सम्मानजनक काम और सही दाम</span>
            </>
          ) : (
            <>
              Dignified Work & Fair Wages <br />
              <span className="text-brand-700">For Every Skilled Hand</span>
            </>
          )}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {language === 'hi'
            ? 'रोजगार मित्र भारत का पहला सच्चा हाइपरलोकल रोजगार मंच है, जिसे दैनिक वेतनभोगी श्रमिकों, ड्राइवरों, निर्माण कारीगरों, इलेक्ट्रीशियन, प्लंबरों और स्थानीय व्यवसायों को सीधे जोड़ने के लिए डिज़ाइन किया गया है।'
            : 'Rojgar Mitra is India’s hyperlocal employment platform designed to connect daily-wage workers, drivers, construction labourers, electricians, plumbers, and helpers directly with employers without intermediaries.'}
        </p>
      </div>

      {/* Tagline Card */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center shadow-xl space-y-2">
        <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">हमारा ध्येय वाक्य</span>
        <h2 className="text-2xl sm:text-4xl font-black tracking-wide">
          "काम पास में, रोजगार आसान।"
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto pt-2">
          {language === 'hi'
            ? 'घर के पास काम, हाथ में पूरी कमाई और बिचौलियों का अंत।'
            : 'Work near your home, 100% earnings in your hands, and an end to unfair middleman commissions.'}
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">100% बिचौलिया-मुक्त</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            पारंपरिक रूप से ठेकेदार और बिचौलिए श्रमिक की कमाई का 20-30% हिस्सा काट लेते थे। रोजगार मित्र पर पूरी कमाई सीधे श्रमिक की जेब में जाती है।
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">हाइपरलोकल फोकस</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            श्रमिकों को शहर के दूसरे छोर पर जाने की आवश्यकता नहीं। 2 से 15 किमी के दायरे में काम ढूंढें और अपना समय तथा किराया बचाएं।
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">श्रम की प्रतिष्ठा</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            डिजिटल कार्य इतिहास, रेटिंग और समीक्षाओं के माध्यम से एक पारदर्शी प्रोफाइल बनाएं जिससे नियमित और उच्च-मजदूरी वाले काम मिल सकें।
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-100 rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900">
          {language === 'hi' ? 'आज ही रोजगार मित्र परिवार से जुड़ें' : 'Join the Movement Today'}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/jobs"
            className="px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-sm"
          >
            {t.btnFindWork}
          </Link>
          <Link
            to="/workers"
            className="px-6 py-3 rounded-xl bg-success-600 hover:bg-success-700 text-white text-xs font-bold shadow-sm"
          >
            {t.btnHireWorker}
          </Link>
        </div>
      </div>
    </div>
  );
};
