import React, { useState } from 'react';
import { 
  Star, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  PlusCircle, 
  TrendingUp,
  Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { WorkHistoryItem } from '../types';

export const WorkHistory: React.FC = () => {
  const { language } = useLanguage();
  const { showToast } = useToast();

  const [historyItems, setHistoryItems] = useState<WorkHistoryItem[]>([
    {
      id: 'wh-1',
      jobTitle: 'Commercial Fleet Driver (वाणिज्यिक बोलेरो चालक)',
      employerName: 'Sharma Logistics & Transport (शर्मा लॉजिस्टिक्स)',
      dateRange: 'Jan 2024 - Sep 2024 (9 महीने)',
      attendanceRate: 98,
      rating: 5.0,
      reviewComment: 'बहुत ही अनुशासित और भरोसेमंद ड्राइवर। गाड़ी का रखरखाव उत्कृष्ट रहा और सभी डिलीवरी सुरक्षित समय पर पूरी कीं।',
      isSampleData: true
    },
    {
      id: 'wh-2',
      jobTitle: 'Heavy Material Transport Lead',
      employerName: 'Vikas Builders Site Team (विकास बिल्डर्स)',
      dateRange: 'Jun 2023 - Dec 2023 (6 महीने)',
      attendanceRate: 96,
      rating: 4.8,
      reviewComment: 'समय के पाबंद, रात की शिफ्ट में भी बिना किसी शिकायत के काम किया। व्यवहार बहुत सौम्य और ईमानदार।',
      isSampleData: true
    },
    {
      id: 'wh-3',
      jobTitle: 'Residential Highway Escort Driver',
      employerName: 'निजी परिवार (Personal Family Chauffeur)',
      dateRange: 'Oct 2022 - May 2023 (8 महीने)',
      attendanceRate: 100,
      rating: 4.9,
      reviewComment: 'लंबी दूरी की यात्राओं में बहुत सुरक्षित ड्राइविंग। परिवार के साथ बहुत सम्मानजनक व्यवहार।',
      isSampleData: true
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newEmployer, setNewEmployer] = useState('');
  const [newDates, setNewDates] = useState('');
  const [newAttendance, setNewAttendance] = useState(98);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const handleAddSampleRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newEmployer) return;

    const record: WorkHistoryItem = {
      id: `wh-${Date.now()}`,
      jobTitle: newTitle,
      employerName: newEmployer,
      dateRange: newDates || 'हाल ही में संपन्न',
      attendanceRate: Number(newAttendance),
      rating: Number(newRating),
      reviewComment: newComment || 'उत्कृष्ट काम और समय पर उपस्थिति।',
      isSampleData: true
    };

    setHistoryItems([record, ...historyItems]);
    setModalOpen(false);
    setNewTitle('');
    setNewEmployer('');
    setNewDates('');
    setNewComment('');
    showToast(
      language === 'hi' 
        ? 'नया कार्य इतिहास रिकॉर्ड जोड़ा गया!' 
        : 'New work history record added!',
      'success'
    );
  };

  // Average stats
  const avgAttendance = Math.round(
    historyItems.reduce((acc, curr) => acc + curr.attendanceRate, 0) / historyItems.length
  );
  const avgRating = (
    historyItems.reduce((acc, curr) => acc + curr.rating, 0) / historyItems.length
  ).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'hi' ? 'कार्य इतिहास व नियोक्ता समीक्षाएं' : 'Work History & Employer Ratings'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'hi'
              ? 'पूर्व नियोक्ताओं द्वारा दिए गए रेटिंग स्कोर, उपस्थिति रिकॉर्ड और प्रशंसा पत्र'
              : 'Past job performance, verified attendance rates, and employer feedback'}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{language === 'hi' ? '+ पूर्व कार्य जोड़ें' : '+ Add Work Record'}</span>
        </button>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">{language === 'hi' ? 'औसत रेटिंग' : 'Overall Rating'}</span>
            <div className="text-xl font-black text-slate-900 mt-0.5 flex items-baseline gap-1">
              <span>{avgRating}</span>
              <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">{language === 'hi' ? 'उपस्थिति दर' : 'Attendance Rate'}</span>
            <div className="text-xl font-black text-emerald-700 mt-0.5">
              {avgAttendance}%
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">{language === 'hi' ? 'सफलतापूर्वक पूर्ण' : 'Completed Projects'}</span>
            <div className="text-xl font-black text-brand-900 mt-0.5">
              {historyItems.length} प्रोजेक्ट्स
            </div>
          </div>
        </div>
      </div>

      {/* History Items Feed */}
      <div className="space-y-4">
        {historyItems.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-brand-200 transition-colors"
          >
            <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded mb-1">
                  {language === 'hi' ? 'कार्य अनुभव' : 'Work Experience'} #{idx + 1}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{item.jobTitle}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">{item.employerName}</span>
                  <span className="text-slate-300">•</span>
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.dateRange}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl text-sm border border-amber-200">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  {item.rating} / 5
                </span>
              </div>
            </div>

            {/* Attendance & Employer Quote */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'hi' ? 'उपस्थिति दर:' : 'Attendance Rate:'} {item.attendanceRate}%</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {language === 'hi' ? 'नियोक्ता समीक्षा' : 'Employer Review'}
              </span>
            </div>

            <blockquote className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-700 italic">
              "{item.reviewComment}"
            </blockquote>
          </div>
        ))}
      </div>

      {/* Add Record Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {language === 'hi' ? 'पूर्व कार्य इतिहास जोड़ें' : 'Add Work Experience'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {language === 'hi' ? 'अपने पिछले कार्य का अनुभव और नियोक्ता का विवरण दर्ज करें' : 'Enter details of past projects'}
            </p>

            <form onSubmit={handleAddSampleRecord} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'पद / काम का प्रकार' : 'Job Role'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="उदा. आवासीय भवन वायरिंग इलेक्ट्रीशियन"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'नियोक्ता या कंपनी का नाम' : 'Employer / Company'}
                </label>
                <input
                  type="text"
                  required
                  value={newEmployer}
                  onChange={e => setNewEmployer(e.target.value)}
                  placeholder="उदा. श्री राम बिल्डर्स"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'समय अवधि' : 'Date Range'}
                  </label>
                  <input
                    type="text"
                    value={newDates}
                    onChange={e => setNewDates(e.target.value)}
                    placeholder="उदा. 4 महीने"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'उपस्थिति (%)' : 'Attendance (%)'}
                  </label>
                  <input
                    type="number"
                    min={70}
                    max={100}
                    value={newAttendance}
                    onChange={e => setNewAttendance(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'रेटिंग (1-5)' : 'Rating (1-5)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    step={0.1}
                    value={newRating}
                    onChange={e => setNewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'नियोक्ता की समीक्षा टिप्पणी' : 'Employer Feedback Comment'}
                </label>
                <textarea
                  rows={2}
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="उदा. समय पर काम पूरा किया और बेहतरीन कारीगरी दिखाई।"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-sm"
                >
                  {language === 'hi' ? 'रिकॉर्ड सहेजें' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
