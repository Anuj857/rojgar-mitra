import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Users, 
  SlidersHorizontal, 
  X, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { mockCategories } from '../data/mockCategories';
import { mockService } from '../services/mockService';
import { Worker } from '../types';
import { WorkerCard } from '../components/workers/WorkerCard';

export const FindWorkers: React.FC = () => {
  const { language, t } = useLanguage();

  // Search & Filter state
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [minExp, setMinExp] = useState<number>(0);
  const [maxDistance, setMaxDistance] = useState<number>(25);

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchWorkers = async () => {
    setIsLoading(true);
    const results = await mockService.getWorkers({
      keyword: keyword.trim() || undefined,
      location: location.trim() || undefined,
      category: category !== 'all' ? category : undefined,
      availability: availability !== 'all' ? availability : undefined,
      minExp: minExp > 0 ? minExp : undefined,
      maxDistance: maxDistance < 25 ? maxDistance : undefined
    });
    setWorkers(results);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWorkers();
  }, [category, availability, minExp, maxDistance]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWorkers();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setLocation('');
    setCategory('all');
    setAvailability('all');
    setMinExp(0);
    setMaxDistance(25);
    mockService.getWorkers().then(setWorkers);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.navHireWorkers}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'hi'
              ? 'ड्राइवर, राजमिस्त्री, इलेक्ट्रीशियन, प्लंबर व अन्य कुशल कारीगरों को सीधे खोजें'
              : 'Discover verified local workers and technicians with zero commission'}
          </p>
        </div>

        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4 text-success-600" />
          <span>{language === 'hi' ? 'फ़िल्टर विकल्प' : 'Filter Workers'}</span>
        </button>
      </div>

      {/* Main Search Bar */}
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
            placeholder={language === 'hi' ? 'कारीगर का नाम, हुनर या पद (उदा. इलेक्ट्रीशियन, जेसीबी)...' : 'Search by name, skill, or trade...'}
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
            placeholder={language === 'hi' ? 'इलाका या शहर (उदा. गोमती नगर, नोएडा)...' : 'Locality or city...'}
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
          className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-success-600 hover:bg-success-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>{language === 'hi' ? 'कारीगर खोजें' : 'Search Workers'}</span>
        </button>
      </form>

      {/* Grid: Sidebar Filters + Worker Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-6 h-fit`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-success-600" />
              <span>{language === 'hi' ? 'श्रमिक फ़िल्टर' : 'Filter Talent'}</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-semibold text-brand-700 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              {language === 'hi' ? 'कार्य श्रेणी (Skill Category)' : 'Skill Category'}
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 bg-slate-50"
            >
              <option value="all">{language === 'hi' ? 'सभी श्रेणियां (All Categories)' : 'All Categories'}</option>
              {mockCategories.map(cat => (
                <option key={cat.id} value={cat.nameEn}>
                  {cat.nameHi} ({cat.nameEn})
                </option>
              ))}
            </select>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              {language === 'hi' ? 'उपलब्धता स्थिति (Availability)' : 'Availability Status'}
            </label>
            <div className="space-y-1.5 text-xs text-slate-700">
              {[
                { id: 'all', label: language === 'hi' ? 'सभी स्थितियां' : 'All Availability' },
                { id: 'available_now', label: '🟢 तुरंत उपलब्ध (Available Now)' },
                { id: 'available_part_time', label: '🟡 पार्ट-टाइम (Part-time)' }
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availability"
                    value={opt.id}
                    checked={availability === opt.id}
                    onChange={e => setAvailability(e.target.value)}
                    className="text-success-600 focus:ring-success-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Experience */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
              <span>{language === 'hi' ? 'न्यूनतम अनुभव' : 'Min Experience'}</span>
              <span className="text-brand-700 font-extrabold">{minExp} वर्ष</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={minExp}
              onChange={e => setMinExp(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0 वर्ष (फ्रेशर)</span>
              <span>5 वर्ष</span>
              <span>10+ वर्ष (वरिष्ठ)</span>
            </div>
          </div>

          {/* Distance Radius */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
              <span>{language === 'hi' ? 'दूरी दायरा' : 'Distance Radius'}</span>
              <span className="text-emerald-700 font-extrabold">{maxDistance} km</span>
            </div>
            <input
              type="range"
              min={2}
              max={25}
              step={1}
              value={maxDistance}
              onChange={e => setMaxDistance(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
        </aside>

        {/* Worker Cards Column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
            <span className="font-semibold text-slate-700">
              {workers.length} {language === 'hi' ? 'सत्यापित कारीगर मिले' : 'workers found'}
            </span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'hi' ? 'मोबाइल व आधार सत्यापित' : 'Verified Community'}</span>
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-64 rounded-2xl bg-slate-200/60 animate-pulse" />
              ))}
            </div>
          ) : workers.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'hi' ? 'कोई कारीगर नहीं मिला' : 'No workers found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'hi'
                  ? 'कृपया अन्य स्थान या कम दूरी फ़िल्टर का चयन करें।'
                  : 'Try loosening your filter criteria or distance radius.'}
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-brand-700 text-white rounded-xl text-xs font-bold"
              >
                {language === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {workers.map(w => (
                <WorkerCard key={w.id} worker={w} onHired={fetchWorkers} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
