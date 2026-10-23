import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  IndianRupee, 
  Camera, 
  ShieldCheck, 
  Save,
  Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { mockService } from '../services/mockService';
import { mockCategories } from '../data/mockCategories';
import { Worker } from '../types';

export const WorkerProfile: React.FC = () => {
  const { language } = useLanguage();
  const { user, completeWorkerProfile } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('रमेश कुमार');
  const [mobile, setMobile] = useState('9876543210');
  const [category, setCategory] = useState('Driver');
  const [experienceYears, setExperienceYears] = useState<number>(6);
  const [preferredSalary, setPreferredSalary] = useState<number>(850);
  const [location, setLocation] = useState('सेक्टर 62, नोएडा (Noida)');
  const [preferredDistanceKm, setPreferredDistanceKm] = useState<number>(15);
  const [availabilityStatus, setAvailabilityStatus] = useState<'available_now' | 'available_part_time' | 'busy'>('available_now');
  const [skills, setSkills] = useState<string[]>(['Heavy Vehicle Licence', 'Night Driving', 'GPS Navigation', 'Bolero Specialist']);
  const [newSkill, setNewSkill] = useState('');
  const [about, setAbout] = useState('6 साल का निजी और कमर्शियल गाड़ी चलाने का अनुभव। दिल्ली-एनसीआर के सभी रास्तों की अच्छी समझ। समय का पाबंद और स्वच्छ रिकॉर्ड।');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const worker = await mockService.getWorkerById(user?.id || 'w-1');
      if (worker) {
        setName(worker.name);
        setMobile(worker.mobile);
        setCategory(worker.category);
        setExperienceYears(worker.experienceYears);
        setPreferredSalary(worker.preferredSalary);
        setLocation(worker.location);
        setPreferredDistanceKm(worker.preferredDistanceKm);
        setAvailabilityStatus(worker.availabilityStatus);
        setSkills(worker.skills);
        if (worker.about) setAbout(worker.about);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updated: Worker = {
      id: user?.id || 'w-1',
      name: name.trim(),
      mobile: mobile,
      category: category,
      categoryHi: mockCategories.find(c => c.nameEn === category)?.nameHi || category,
      skills: skills,
      experienceYears: Number(experienceYears),
      preferredSalary: Number(preferredSalary),
      salaryPeriod: 'per_day',
      location: location.trim(),
      distanceKm: 2.5,
      preferredDistanceKm: Number(preferredDistanceKm),
      availabilityStatus: availabilityStatus,
      rating: 4.8,
      reviewsCount: 34,
      completedJobsCount: 42,
      verified: true,
      languages: ['Hindi', 'Basic English'],
      about: about.trim(),
      workHistory: [
        {
          id: 'wh-1',
          jobTitle: `${category} Lead`,
          employerName: 'Sharma Logistics & Transport',
          dateRange: 'Jan 2024 - Sep 2024 (9 Months)',
          attendanceRate: 98,
          rating: 5,
          reviewComment: 'बहुत ही भरोसेमंद कारीगर। गाड़ी का पूरा ध्यान रखते हैं।',
          isSampleData: true
        }
      ]
    };

    await mockService.saveWorkerProfile(updated);
    completeWorkerProfile({
      name: updated.name,
      location: updated.location,
      category: updated.category
    });

    showToast(
      language === 'hi' 
        ? 'प्रोफाइल विवरण सफलतापूर्वक अपडेट हुआ!' 
        : 'Worker profile updated successfully!',
      'success'
    );
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="h-8 w-40 bg-slate-200 rounded mx-auto animate-pulse mb-4" />
        <div className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'hi' ? 'मेरी कामगार प्रोफाइल' : 'Worker Profile'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'hi'
              ? 'अपनी जानकारी अद्यतित रखें ताकि आपको सही मजदूरी और नजदीकी काम मिल सके।'
              : 'Keep your skills, expected wage, and preferred locality updated.'}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{language === 'hi' ? 'मोबाइल नंबर सत्यापित' : 'Mobile Verified'}</span>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Profile Photo Placeholder */}
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-brand-800 to-brand-600 text-white flex items-center justify-center text-3xl font-black shadow-md">
              {name.charAt(0)}
            </div>
            <button
              type="button"
              onClick={() => showToast(language === 'hi' ? 'फोटो अपलोड' : 'Photo upload', 'info')}
              className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-slate-900 text-white hover:bg-brand-700 shadow-md transition-colors"
              title="Upload photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{name}</h3>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'प्रोफाइल फोटो' : 'Profile Photo'}
            </p>
            <span className="inline-block mt-1 text-[11px] text-brand-700 bg-brand-50 px-2 py-0.5 rounded font-semibold">
              4.8 ★ (34 समीक्षाएं) • 42 काम पूरे किए
            </span>
          </div>
        </div>

        {/* Basic Fields: Name & Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'नाम' : 'Full Name'} <span className="text-rose-500">*</span>
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
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'मोबाइल नंबर (लॉगिन)' : 'Mobile Number'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="text"
                disabled
                value={mobile}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 rounded-xl cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Category & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'हुनर / मुख्य श्रेणी' : 'Primary Category'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-4 h-4" />
              </span>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              >
                {mockCategories.map(cat => (
                  <option key={cat.id} value={cat.nameEn}>
                    {cat.nameHi} ({cat.nameEn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'अनुभव (वर्षों में)' : 'Experience (Years)'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Award className="w-4 h-4" />
              </span>
              <input
                type="number"
                min={0}
                max={50}
                value={experienceYears}
                onChange={e => setExperienceYears(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Salary & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'पसंदीदा दैनिक मजदूरी (₹ / दिन)' : 'Preferred Daily Wage (₹ / day)'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <IndianRupee className="w-4 h-4" />
              </span>
              <input
                type="number"
                step={50}
                value={preferredSalary}
                onChange={e => setPreferredSalary(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'वर्तमान स्थान / शहर' : 'Locality / City'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Distance Radius & Availability Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'पसंदीदा कार्य दूरी (अधिकतम किमी)' : 'Preferred Job Distance'}
            </label>
            <select
              value={preferredDistanceKm}
              onChange={e => setPreferredDistanceKm(Number(e.target.value))}
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value={5}>5 किमी (बिल्कुल पास)</option>
              <option value={10}>10 किमी तक</option>
              <option value={15}>15 किमी तक</option>
              <option value={25}>25 किमी (पूरा शहर)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'उपलब्धता स्थिति (Availability)' : 'Availability Status'}
            </label>
            <select
              value={availabilityStatus}
              onChange={e => setAvailabilityStatus(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="available_now">🟢 तुरंत उपलब्ध (Available Now)</option>
              <option value="available_part_time">🟡 पार्ट-टाइम उपलब्ध (Part-time)</option>
              <option value="busy">⚪ वर्तमान में व्यस्त (Busy on Project)</option>
            </select>
          </div>
        </div>

        {/* Skills Tag Management */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {language === 'hi' ? 'कौशल और हुनर (Skills)' : 'Skills & Specialization'}
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder={language === 'hi' ? 'नया हुनर लिखें और + दबाएं...' : 'Add a skill tag...'}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              + जोड़ें
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {skills.map(s => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200"
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s)}
                  className="text-slate-400 hover:text-rose-600 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* About Bio */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {language === 'hi' ? 'परिचय व अनुभव विवरण' : 'Bio / Experience Description'}
          </label>
          <textarea
            rows={3}
            value={about}
            onChange={e => setAbout(e.target.value)}
            className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <span className="text-[11px] text-slate-400">
            {language === 'hi' ? 'परिवर्तन तुरंत लागू होंगे' : 'Changes apply immediately'}
          </span>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? (language === 'hi' ? 'सहेजा जा रहा है...' : 'Saving...') : (language === 'hi' ? 'प्रोफाइल अपडेट करें' : 'Save Changes')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
