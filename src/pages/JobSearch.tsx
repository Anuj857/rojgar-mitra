import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Flame, 
  SlidersHorizontal, 
  X, 
  RotateCcw,
  Briefcase
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { mockCategories } from '../data/mockCategories';
import { mockService } from '../services/mockService';
import { Job, Application } from '../types';
import { JobCard } from '../components/jobs/JobCard';
import { useAuth } from '../context/AuthContext';

export const JobSearch: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from URL query params
  const [keyword, setKeyword] = useState(searchParams.get('role') || searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('loc') || '');
  const [category, setCategory] = useState(searchParams.get('cat') || 'all');
  const [maxDistance, setMaxDistance] = useState<number>(25);
  const [salaryPeriod, setSalaryPeriod] = useState<string>('all');
  const [urgentOnly, setUrgentOnly] = useState<boolean>(false);
  const [minSalary, setMinSalary] = useState<number>(0);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [myApps, setMyApps] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);
    const results = await mockService.getJobs({
      keyword: keyword.trim() || undefined,
      location: location.trim() || undefined,
      category: category !== 'all' ? category : undefined,
      maxDistance: maxDistance < 25 ? maxDistance : undefined,
      urgentOnly: urgentOnly || undefined,
      salaryPeriod: salaryPeriod !== 'all' ? salaryPeriod : undefined,
      salaryMin: minSalary > 0 ? minSalary : undefined
    });
    setJobs(results);

    const apps = await mockService.getMyApplications(user?.id || 'w-1');
    setMyApps(apps);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [category, maxDistance, salaryPeriod, urgentOnly, minSalary]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setLocation('');
    setCategory('all');
    setMaxDistance(25);
    setSalaryPeriod('all');
    setUrgentOnly(false);
    setMinSalary(0);
    setSearchParams({});
    mockService.getJobs().then(setJobs);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.navFindJobs}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'hi'
              ? 'अपने इलाके के सक्रिय काम खोजें और सीधे बात करें'
              : 'Search active hyperlocal job requirements without middlemen'}
          </p>
        </div>

        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          <span>{language === 'hi' ? 'फ़िल्टर विकल्प' : 'Filter Options'}</span>
        </button>
      </div>

      {/* Main Search Input Form */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-2"
      >
        <div className="w-full md:flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80">
          <Search className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder={language === 'hi' ? 'काम का नाम या हुनर (उदा. ड्राइवर, वेल्डर, राजमिस्त्री)...' : 'Job title or skill...'}
            className="w-full bg-transparent text-xs sm:text-sm focus:outline-none placeholder:text-slate-400 font-medium"
          />
          {keyword && (
            <button type="button" onClick={() => setKeyword('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="w-full md:flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80">
          <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder={language === 'hi' ? 'स्थान / मोहल्ला / शहर...' : 'Locality or city...'}
            className="w-full bg-transparent text-xs sm:text-sm focus:outline-none placeholder:text-slate-400 font-medium"
          />
          {location && (
            <button type="button" onClick={() => setLocation('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>{t.btnSearch}</span>
        </button>
      </form>

      {/* Layout Grid: Sidebar Filters + Job Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop + Mobile drawer toggle) */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-6 h-fit`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-600" />
              <span>{language === 'hi' ? 'फ़िल्टर' : 'Filter Jobs'}</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-semibold text-brand-700 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
            </button>
          </div>

          {/* Urgent Hiring Toggle */}
          <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span className="text-xs font-bold text-amber-900">
                  {language === 'hi' ? 'केवल तुरंत आवश्यकता' : 'Urgent Hiring Only'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={urgentOnly}
                onChange={e => setUrgentOnly(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
              />
            </label>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              {language === 'hi' ? 'काम की श्रेणी (Category)' : 'Skill Category'}
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 bg-slate-50"
            >
              <option value="all">{language === 'hi' ? 'सभी श्रेणियां (All Categories)' : 'All Categories'}</option>
              {mockCategories.map(cat => (
                <option key={cat.id} value={cat.nameEn}>
                  {language === 'hi' ? cat.nameHi : cat.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Distance Filter */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
              <span>{language === 'hi' ? 'अधिकतम दूरी' : 'Max Distance'}</span>
              <span className="text-brand-700 font-extrabold">{maxDistance} km</span>
            </div>
            <input
              type="range"
              min={2}
              max={25}
              step={1}
              value={maxDistance}
              onChange={e => setMaxDistance(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>2 km (पैदल)</span>
              <span>10 km</span>
              <span>25 km (पूरा क्षेत्र)</span>
            </div>
          </div>

          {/* Salary / Payment Period Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              {language === 'hi' ? 'वेतन प्रकार (Payment Period)' : 'Salary Period'}
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                { id: 'all', label: language === 'hi' ? 'सभी (All Periods)' : 'All Periods' },
                { id: 'per_day', label: language === 'hi' ? 'दैनिक मजदूरी (Per Day)' : 'Daily Wage (Per Day)' },
                { id: 'per_month', label: language === 'hi' ? 'मासिक वेतन (Per Month)' : 'Monthly (Per Month)' }
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="radio"
                    name="salaryPeriod"
                    value={opt.id}
                    checked={salaryPeriod === opt.id}
                    onChange={e => setSalaryPeriod(e.target.value)}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Salary Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
              <span>{language === 'hi' ? 'न्यूनतम वेतन (₹)' : 'Minimum Salary'}</span>
              <span className="text-emerald-700 font-extrabold">₹{minSalary}</span>
            </div>
            <input
              type="range"
              min={0}
              max={2000}
              step={100}
              value={minSalary}
              onChange={e => setMinSalary(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
        </aside>

        {/* Job Listings Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Results count & status bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
            <span className="font-semibold text-slate-700">
              {jobs.length} {language === 'hi' ? 'उपलब्ध काम मिले' : 'jobs found'}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">
              ● {language === 'hi' ? 'लाइव अपडेटेड' : 'Live Updated'}
            </span>
          </div>

          {/* Job Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-64 rounded-2xl bg-slate-200/60 animate-pulse" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'hi' ? 'कोई काम नहीं मिला' : 'No jobs found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'hi'
                  ? 'आपके चुने गए फ़िल्टर से कोई नौकरी मेल नहीं खाई। फ़िल्टर रीसेट करें।'
                  : 'No jobs match your current search and distance filter criteria.'}
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-brand-700 text-white rounded-xl text-xs font-bold hover:bg-brand-800 transition-colors"
              >
                {language === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset All Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  isApplied={myApps.some(a => a.jobId === job.id)}
                  onApplied={fetchJobs}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
