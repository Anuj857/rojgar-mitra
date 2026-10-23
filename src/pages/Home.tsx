import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Users, 
  Car, 
  Hammer, 
  Zap, 
  Wrench, 
  Truck, 
  Paintbrush, 
  PackageCheck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Award,
  Sparkles,
  IndianRupee,
  BadgeCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { mockCategories } from '../data/mockCategories';
import { mockService } from '../services/mockService';
import { Job } from '../types';
import { JobCard } from '../components/jobs/JobCard';

export const Home: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  // Search state
  const [searchRole, setSearchRole] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  // Featured jobs state
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoadingJobs(true);
      const jobs = await mockService.getJobs();
      setFeaturedJobs(jobs.slice(0, 6)); // Top 6 featured jobs
      setIsLoadingJobs(false);
    };
    fetchJobs();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchRole) params.append('role', searchRole);
    if (searchLocation) params.append('loc', searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car': return <Car className="w-6 h-6 text-brand-600" />;
      case 'Hammer': return <Hammer className="w-6 h-6 text-amber-600" />;
      case 'Zap': return <Zap className="w-6 h-6 text-yellow-600" />;
      case 'Wrench': return <Wrench className="w-6 h-6 text-cyan-600" />;
      case 'Truck': return <Truck className="w-6 h-6 text-orange-600" />;
      case 'Users': return <Users className="w-6 h-6 text-emerald-600" />;
      case 'Paintbrush': return <Paintbrush className="w-6 h-6 text-purple-600" />;
      case 'PackageCheck': return <PackageCheck className="w-6 h-6 text-blue-600" />;
      default: return <Briefcase className="w-6 h-6 text-brand-600" />;
    }
  };

  const faqs = [
    { q: t.faq1Q, a: t.faq1A },
    { q: t.faq2Q, a: t.faq2A },
    { q: t.faq3Q, a: t.faq3A },
    { q: t.faq4Q, a: t.faq4A }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-brand-800 to-slate-900 text-white pt-12 pb-20 sm:pt-20 sm:pb-32">
        {/* Subtle decorative background shapes */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-400 blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-success-400 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300 mb-6 shadow-sm">
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'hi' 
                ? 'भारत का भरोसेमंद हाइपरलोकल रोजगार मंच • 0% कमीशन' 
                : "India's Hyperlocal Employment Platform • Zero Middlemen"}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] max-w-4xl mx-auto">
            {language === 'hi' ? (
              <>
                अपने पास काम पाएं, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-success-400 via-emerald-300 to-amber-300">
                  तुरंत हुनरमंद साथी चुनें
                </span>
              </>
            ) : (
              <>
                Find Local Work. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-success-400 via-emerald-300 to-amber-300">
                  Hire Local Talent.
                </span>
              </>
            )}
          </h1>

          {/* Hindi Tagline */}
          <p className="mt-3 text-lg sm:text-xl font-bold text-amber-300/90 tracking-wide">
            "आपके पास काम, आपके पास रोजगार।"
          </p>

          {/* Subheadline */}
          <p className="mt-4 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubheadline}
          </p>

          {/* Two Prominent Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/jobs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-success-600 to-emerald-600 hover:from-success-500 hover:to-emerald-500 text-white font-extrabold text-base shadow-lg shadow-success-900/30 transition-all transform active:scale-95"
            >
              <Briefcase className="w-5 h-5" />
              <span>{t.btnFindWork}</span>
            </Link>
            <Link
              to="/workers"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-extrabold text-base backdrop-blur-md transition-all transform active:scale-95"
            >
              <Users className="w-5 h-5 text-emerald-400" />
              <span>{t.btnHireWorker}</span>
            </Link>
          </div>

          {/* Functional Search Bar */}
          <div className="mt-10 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2 sm:p-3 rounded-2xl shadow-2xl border border-slate-200 flex flex-col md:flex-row items-center gap-2 text-slate-800"
            >
              {/* Job Role Search */}
              <div className="w-full md:flex-1 flex items-center gap-3 px-3 py-2.5 bg-slate-50 md:bg-transparent rounded-xl border md:border-none border-slate-200">
                <Search className="w-5 h-5 text-brand-600 flex-shrink-0" />
                <input
                  type="text"
                  value={searchRole}
                  onChange={e => setSearchRole(e.target.value)}
                  placeholder={t.heroSearchRole}
                  className="w-full bg-transparent text-sm focus:outline-none placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="hidden md:block w-px h-8 bg-slate-200" />

              {/* Location Search */}
              <div className="w-full md:flex-1 flex items-center gap-3 px-3 py-2.5 bg-slate-50 md:bg-transparent rounded-xl border md:border-none border-slate-200">
                <MapPin className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={e => setSearchLocation(e.target.value)}
                  placeholder={t.heroSearchLoc}
                  className="w-full bg-transparent text-sm focus:outline-none placeholder:text-slate-400 font-medium"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full md:w-auto px-7 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 flex-shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>{t.btnSearch}</span>
              </button>
            </form>

            {/* Live Stats Row */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {t.statJobs}
              </span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {t.statWorkers}
              </span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                {t.statEmployers}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR JOB CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.categoriesTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t.categoriesSub}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {mockCategories.map(cat => (
            <Link
              key={cat.id}
              to={`/jobs?cat=${encodeURIComponent(cat.nameEn)}`}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all hover:border-brand-400 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-brand-50 flex items-center justify-center mb-4 transition-colors">
                  {getCategoryIcon(cat.iconName)}
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-brand-700 transition-colors">
                  {language === 'hi' ? cat.nameHi : cat.nameEn}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {cat.jobCount} {language === 'hi' ? 'सक्रिय काम' : 'jobs'} • {cat.workerCount} {language === 'hi' ? 'कारीगर' : 'workers'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>{cat.avgWage}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-700 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED NEARBY JOBS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-800 border border-brand-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>{language === 'hi' ? 'हाइपरलोकल जॉब्स' : 'Hyperlocal Jobs'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.featuredJobsTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {t.featuredJobsSub}
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800 hover:underline"
          >
            <span>{t.viewAllJobs}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-64 rounded-2xl bg-slate-200/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* 4. HOW IT WORKS (WORKERS & EMPLOYERS) */}
      <section className="bg-gradient-to-b from-slate-100 to-slate-50 py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.howItWorksTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {language === 'hi' 
                ? 'सरल, तेज और 100% पारदर्शी प्रक्रिया' 
                : 'Simple, fast, and completely transparent process'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* For Workers */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{t.howWorkersTitle}</h3>
                  <span className="text-xs text-brand-700 font-semibold">
                    {language === 'hi' ? '3 आसान चरणों में काम शुरू करें' : 'Start working in 3 easy steps'}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.howWorkersStep1Title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.howWorkersStep1Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.howWorkersStep2Title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.howWorkersStep2Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.howWorkersStep3Title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.howWorkersStep3Desc}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100">
                <Link
                  to="/worker-signup"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <span>{language === 'hi' ? 'मजदूर / मिस्त्री प्रोफाइल बनाएं' : 'Create Worker Profile'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* For Employers */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-success-50 text-success-700 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{t.howEmployersTitle}</h3>
                  <span className="text-xs text-success-700 font-semibold">
                    {language === 'hi' ? 'बिना एजेंट सीधे कारीगर हायर करें' : 'Hire workers with zero middlemen'}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-success-100 text-success-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.howEmployersStep1Title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.howEmployersStep1Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-success-100 text-success-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.howEmployersStep2Title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.howEmployersStep2Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-success-100 text-success-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.howEmployersStep3Title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.howEmployersStep3Desc}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100">
                <Link
                  to="/post-job"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-success-600 hover:bg-success-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <span>{language === 'hi' ? 'आज ही काम पोस्ट करें' : 'Post a Job Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE ROJGAR MITRA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.whyTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {language === 'hi' 
              ? 'स्थानीय रोजगार को पारदर्शी और सुलभ बनाने की हमारी प्रतिबद्धता' 
              : 'Our commitment to transparent and accessible local employment'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">{t.why1Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.why1Desc}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">{t.why2Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.why2Desc}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <IndianRupee className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">{t.why3Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.why3Desc}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">{t.why4Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.why4Desc}</p>
          </div>
        </div>
      </section>

      {/* 6. TRUST AND SAFETY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-brand-800/50">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-4 border border-brand-400/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'hi' ? 'भरोसा और सुरक्षा' : 'Trust & Safety Guarantee'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t.trustTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'रोजगार मित्र पर सभी उपयोगकर्ताओं की सुरक्षा सर्वोच्च प्राथमिकता है। हमने फर्जी प्रोफाइल और अनुचित कटौती को रोकने के लिए कड़े नियम बनाए हैं।'
                : 'Safety for both workers and employers is our highest priority. We enforce transparent wage agreements and verified contact policies.'}
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{t.trust1}</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{t.trust2}</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{t.trust3}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL-TO-ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-700 via-brand-800 to-slate-900 rounded-3xl p-8 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              {t.ctaTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-200">
              {t.ctaDesc}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/worker-signup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-success-600 hover:bg-success-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
              >
                {t.ctaWorkerBtn}
              </Link>
              <Link
                to="/employer-signup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-brand-900 hover:bg-slate-100 font-extrabold text-sm shadow-md transition-all active:scale-95"
              >
                {t.ctaEmployerBtn}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.faqTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {language === 'hi' ? 'आपके मन के आम सवालों के स्पष्ट जवाब' : 'Clear answers to common questions'}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-brand-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
