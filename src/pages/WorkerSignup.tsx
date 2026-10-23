import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  MapPin, 
  IndianRupee, 
  CheckCircle, 
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { mockCategories } from '../data/mockCategories';
import { mockService } from '../services/mockService';
import { Worker } from '../types';

export const WorkerSignup: React.FC = () => {
  const { language } = useLanguage();
  const { user, completeWorkerProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('रमेश कुमार');
  const [mobile] = useState(user?.mobile || '9876543210');
  const [category, setCategory] = useState('Driver');
  const [skills, setSkills] = useState<string[]>(['Heavy Vehicle Licence', 'GPS Navigation', 'Night Driving']);
  const [newSkill, setNewSkill] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(5);
  const [preferredSalary, setPreferredSalary] = useState<number>(850);
  const [location, setLocation] = useState('सेक्टर 62, नोएडा (Noida)');
  const [preferredDistanceKm, setPreferredDistanceKm] = useState<number>(15);
  const [availabilityStatus, setAvailabilityStatus] = useState<'available_now' | 'available_part_time'>('available_now');
  const [about, setAbout] = useState('निजी और कमर्शियल गाड़ी चलाने का 5 वर्ष का अच्छा अनुभव। समय का पाबंद और जिम्मेदार।');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (s: string) => {
    setSkills(skills.filter(item => item !== s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullProfile: Worker = {
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
      reviewsCount: 12,
      completedJobsCount: 16,
      verified: true,
      languages: ['Hindi', 'Basic English'],
      about: about.trim(),
      workHistory: [
        {
          id: 'wh-new-1',
          jobTitle: `${category} Specialist`,
          employerName: 'स्थानीय कांट्रेक्टर',
          dateRange: 'Jan 2024 - Present',
          attendanceRate: 98,
          rating: 4.9,
          reviewComment: 'बहुत मेहनती और कुशल। समय पर काम पूरा किया।',
          isSampleData: true
        }
      ]
    };

    await mockService.saveWorkerProfile(fullProfile);
    completeWorkerProfile({
      name: fullProfile.name,
      mobile: fullProfile.mobile,
      location: fullProfile.location,
      category: fullProfile.category
    });

    showToast(
      language === 'hi' 
        ? 'श्रमिक प्रोफाइल सफलतापूर्वक बनाई गई!' 
        : 'Worker profile created successfully!',
      'success'
    );

    setIsSubmitting(false);
    navigate('/worker-dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6">
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            {language === 'hi' ? 'श्रमिक प्रोफाइल विवरण' : 'Worker Profile Setup'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
            {language === 'hi' ? 'अपनी कार्य प्रोफाइल बनाएं' : 'Create Your Worker Profile'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {language === 'hi' 
              ? 'आस-पास के ठेकेदार और मालिक आपकी यह प्रोफाइल देखकर सीधे संपर्क करेंगे' 
              : 'Local employers will see this profile to offer direct jobs'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar and basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'पूरा नाम' : 'Full Name'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
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
                {language === 'hi' ? 'मोबाइल नंबर (सत्यापित)' : 'Mobile Number (Verified)'}
              </label>
              <input
                type="text"
                disabled
                value={`+91 ${mobile}`}
                className="w-full px-3 py-2.5 text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 rounded-xl cursor-not-allowed"
              />
            </div>
          </div>

          {/* Category & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'मुख्य काम की श्रेणी' : 'Primary Category'} <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              >
                {mockCategories.map(cat => (
                  <option key={cat.id} value={cat.nameEn}>
                    {cat.nameHi} ({cat.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'कार्य अनुभव (वर्षों में)' : 'Experience (in years)'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                max={40}
                required
                value={experienceYears}
                onChange={e => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Preferred wage & location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'अपेक्षित दैनिक मजदूरी (₹ / दिन)' : 'Preferred Daily Wage (₹ / day)'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <IndianRupee className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  step={50}
                  required
                  value={preferredSalary}
                  onChange={e => setPreferredSalary(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'आपका इलाका / शहर' : 'Your Locality / City'} <span className="text-rose-500">*</span>
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
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                  placeholder="उदा. गोमती नगर, लखनऊ"
                />
              </div>
            </div>
          </div>

          {/* Travel radius and availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'अधिकतम यात्रा दायरा (किमी)' : 'Max Preferred Job Distance'}
              </label>
              <select
                value={preferredDistanceKm}
                onChange={e => setPreferredDistanceKm(Number(e.target.value))}
                className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value={5}>5 किमी (बिल्कुल पास / Walking & Cycle)</option>
                <option value={10}>10 किमी (लोकल इलाका / Within 10 km)</option>
                <option value={15}>15 किमी (शहर भर / Up to 15 km)</option>
                <option value={25}>25 किमी (पूरा जिला / Up to 25 km)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'वर्तमान उपलब्धता स्थिति' : 'Availability Status'}
              </label>
              <select
                value={availabilityStatus}
                onChange={e => setAvailabilityStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="available_now">🟢 तुरंत उपलब्ध (Available Now)</option>
                <option value="available_part_time">🟡 पार्ट-टाइम उपलब्ध (Part-time)</option>
              </select>
            </div>
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {language === 'hi' ? 'हुनर व विशेषज्ञताएं (Skills)' : 'Skills & Specializations'}
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
                placeholder={language === 'hi' ? 'हुनर दर्ज करें और + दबाएं (उदा. ईंट चिनाई, वायरिंग)...' : 'Add a skill tag...'}
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

          {/* Bio / About */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'अपने बारे में संक्षिप्त जानकारी' : 'Brief Bio'}
            </label>
            <textarea
              rows={3}
              value={about}
              onChange={e => setAbout(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-black text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{language === 'hi' ? 'प्रोफाइल सहेजें और काम देखें' : 'Save Profile & Explore Jobs'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
