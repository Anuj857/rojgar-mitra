import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IndianRupee, 
  MapPin, 
  Users, 
  Flame, 
  CheckCircle, 
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { mockCategories } from '../data/mockCategories';
import { apiService } from '../services/apiService';
import { SalaryPeriod } from '../types';

export const PostJob: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Construction Worker');
  const [description, setDescription] = useState('');
  const [salary, setSalary] = useState<number>(800);
  const [salaryPeriod, setSalaryPeriod] = useState<SalaryPeriod>('per_day');
  const [location, setLocation] = useState(user?.location || 'गोमती नगर, लखनऊ (UP)');
  const [workersRequired, setWorkersRequired] = useState<number>(2);
  const [requiredExperience, setRequiredExperience] = useState('2+ वर्ष अनुभव');
  const [workDuration, setWorkDuration] = useState('15 दिन (Contract)');
  const [workingHours, setWorkingHours] = useState('सुबह 9:00 बजे से शाम 6:00 बजे');
  const [startDate, setStartDate] = useState('कल सुबह से (Tomorrow)');
  const [isUrgent, setIsUrgent] = useState(true);
  const [requiredSkills, setRequiredSkills] = useState('ईंट चिनाई, प्लास्टर कार्य, समय की पाबंदी');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      showToast(language === 'hi' ? 'कृपया सभी जरूरी विवरण भरें' : 'Please fill all required fields', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const skillsArray = requiredSkills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const created = await apiService.createJob({
        title: title.trim(),
        category: category,
        categoryHi: mockCategories.find(c => c.nameEn === category)?.nameHi || category,
        description: description.trim(),
        salary: Number(salary),
        salaryPeriod: salaryPeriod,
        location: location.trim(),
        distanceKm: 2.1,
        workersRequired: Number(workersRequired),
        requiredExperience: requiredExperience.trim(),
        workDuration: workDuration.trim(),
        workingHours: workingHours.trim(),
        startDate: startDate.trim(),
        isUrgent: isUrgent,
        employerId: user?.id || 'emp-demo',
        employerName: user?.companyName || user?.name || 'अवध कंस्ट्रक्शन प्रा. लि.',
        employerRating: 4.9,
        employerPhone: user?.mobile || '98765-XXXX9',
        status: 'active',
        requiredSkills: skillsArray.length > 0 ? skillsArray : ['कुशल कारीगर']
      });

      showToast(
        language === 'hi'
          ? `काम सफलतापूर्वक पोस्ट किया गया! "${created.title}" अब लाइव है।`
          : `Job posted successfully! "${created.title}" is now visible to workers.`,
        'success'
      );

      navigate('/manage-jobs');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error creating job';
      console.error('[PostJob] createJob error:', err);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? 'नया काम / नौकरी पोस्ट करें' : 'Post a New Job'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {language === 'hi'
            ? 'अपनी साइट या व्यापार के लिए आवश्यक कारीगरों और मजदूरों की जानकारी भरें। 0% कमीशन।'
            : 'Post job requirements for local workers. Zero broker fees.'}
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
        {/* Job Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {language === 'hi' ? 'काम का शीर्षक (Job Title)' : 'Job Title'} <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={language === 'hi' ? 'उदा. आवासीय भवन हेतु 2 अनुभवी राजमिस्त्री चाहिए' : 'e.g. Mason needed for 2-storey house'}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Category & Urgent Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'काम की श्रेणी (Category)' : 'Job Category'} <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
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
              {language === 'hi' ? 'तुरंत आवश्यकता (Urgent Hiring)' : 'Urgent Hiring Toggle'}
            </label>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Flame className={`w-4 h-4 ${isUrgent ? 'text-amber-600 fill-amber-500' : 'text-slate-400'}`} />
                <span>{language === 'hi' ? 'तत्काल प्रभाव से चाहिए' : 'Urgent Tag'}</span>
              </span>
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={e => setIsUrgent(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Salary & Period */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'मजदूरी / वेतन राशि (₹)' : 'Salary Amount (₹)'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IndianRupee className="w-4 h-4" />
              </span>
              <input
                type="number"
                required
                step={50}
                value={salary}
                onChange={e => setSalary(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'भुगतान अवधि (Salary Period)' : 'Salary Period'}
            </label>
            <select
              value={salaryPeriod}
              onChange={e => setSalaryPeriod(e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="per_day">प्रति दिन (₹ / Day)</option>
              <option value="per_month">प्रति माह (₹ / Month)</option>
              <option value="per_hour">प्रति घंटा (₹ / Hour)</option>
              <option value="contract">पूरा ठेका (Contract Basis)</option>
            </select>
          </div>
        </div>

        {/* Location & Workers Needed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'कार्य स्थल (Job Location)' : 'Job Location'} <span className="text-rose-500">*</span>
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
                placeholder="उदा. गोमती नगर विस्तार, सेक्टर 4, लखनऊ"
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'कितने मजदूर / कारीगर चाहिए?' : 'Number of Workers Required'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Users className="w-4 h-4" />
              </span>
              <input
                type="number"
                min={1}
                max={50}
                required
                value={workersRequired}
                onChange={e => setWorkersRequired(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Duration, Timings, Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'कार्य अवधि' : 'Work Duration'}
            </label>
            <input
              type="text"
              value={workDuration}
              onChange={e => setWorkDuration(e.target.value)}
              placeholder="उदा. 15 दिन / 1 माह"
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'काम के घंटे' : 'Working Hours'}
            </label>
            <input
              type="text"
              value={workingHours}
              onChange={e => setWorkingHours(e.target.value)}
              placeholder="उदा. सुबह 9 से शाम 6 बजे"
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'काम शुरू होने की तारीख' : 'Start Date'}
            </label>
            <input
              type="text"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              placeholder="उदा. कल सुबह से"
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Required Experience & Skills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'अपेक्षित अनुभव' : 'Required Experience'}
            </label>
            <input
              type="text"
              value={requiredExperience}
              onChange={e => setRequiredExperience(e.target.value)}
              placeholder="उदा. 2+ वर्ष अनुभव"
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'जरूरी हुनर (कॉमा लगाकर लिखें)' : 'Skills (Comma separated)'}
            </label>
            <input
              type="text"
              value={requiredSkills}
              onChange={e => setRequiredSkills(e.target.value)}
              placeholder="उदा. ईंट चिनाई, प्लास्टर, टाइल्स"
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {language === 'hi' ? 'काम का पूरा विवरण (Job Description)' : 'Job Description'} <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={language === 'hi' 
              ? 'काम की प्रकृति, साइट का पता, भोजन या रहने की सुविधा और भुगतान के नियम स्पष्ट रूप से लिखें...' 
              : 'Describe the work, site details, payment terms and facilities...'}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs text-slate-500">
            {language === 'hi' ? '100% निशुल्क जॉब पोस्टिंग' : '100% Free Job Posting'}
          </span>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-success-600 hover:bg-success-700 text-white font-black text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{isSubmitting ? (language === 'hi' ? 'पोस्ट हो रहा है...' : 'Posting...') : (language === 'hi' ? 'काम अभी पोस्ट करें' : 'Post Job Now')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
