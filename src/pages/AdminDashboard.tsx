import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  Building2, 
  AlertTriangle, 
  Activity, 
  Search
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { mockService } from '../services/mockService';
import { useToast } from '../context/ToastContext';

interface AdminStats {
  totalWorkers: number;
  totalEmployers: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  reportedListings: number;
  platformHealth: string;
  recentActivity: Array<{ id: number; action: string; time: string; user: string }>;
}

export const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { showToast } = useToast();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'worker' | 'employer'>('all');

  // Sample User Management table
  const [demoUsers, setDemoUsers] = useState([
    { id: 'usr-1', name: 'रमेश कुमार', role: 'worker', category: 'Driver', mobile: '98765-XXXX1', location: 'नोएडा', verified: true, status: 'Active' },
    { id: 'usr-2', name: 'संजय वर्मा (अवध कंस्ट्रक्शन)', role: 'employer', category: 'Civil Contractor', mobile: '98765-XXXX9', location: 'लखनऊ', verified: true, status: 'Active' },
    { id: 'usr-3', name: 'रामू यादव', role: 'worker', category: 'Construction Mason', mobile: '98765-XXXX2', location: 'लखनऊ', verified: true, status: 'Active' },
    { id: 'usr-4', name: 'रॉयल गारमेंट्स (अनूप गुप्ता)', role: 'employer', category: 'Retail Business', mobile: '98765-XXXX8', location: 'हजरतगंज', verified: true, status: 'Active' },
    { id: 'usr-5', name: 'सुनील शर्मा', role: 'worker', category: 'Electrician', mobile: '98765-XXXX3', location: 'इंदिरा नगर', verified: true, status: 'Active' },
    { id: 'usr-6', name: 'किसान एग्रो ट्रेडर्स', role: 'employer', category: 'Warehouse / Wholesale', mobile: '98765-XXXX5', location: 'ट्रांसपोर्ट नगर', verified: false, status: 'Pending Review' },
    { id: 'usr-7', name: 'मुकेश सिंह', role: 'worker', category: 'JCB Operator', mobile: '98765-XXXX5', location: 'गाजियाबाद', verified: true, status: 'Active' },
  ]);

  useEffect(() => {
    mockService.getAdminStats().then(setStats);
  }, []);

  const handleToggleVerify = (userId: string) => {
    setDemoUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const next = !u.verified;
        showToast(
          language === 'hi' 
            ? `${u.name} का सत्यापन ${next ? 'सफल' : 'रद्द'} किया गया`
            : `User verification updated for ${u.name}`,
          'info'
        );
        return { ...u, verified: next, status: next ? 'Active' : 'Pending Review' };
      }
      return u;
    }));
  };

  const filteredUsers = demoUsers.filter(u => {
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.category.toLowerCase().includes(q) || u.location.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'hi' ? 'एडमिन डैशबोर्ड' : 'Admin Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'hi' ? 'प्लेटफ़ॉर्म अवलोकन, उपयोगकर्ता प्रबंधन एवं गतिविधि निगरानी' : 'Platform overview, user management, and activity monitoring'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{language === 'hi' ? 'सिस्टम स्थिति: सामान्य' : 'System Status: Active'}</span>
          </span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'hi' ? 'कुल पंजीकृत श्रमिक' : 'Total Workers'}
            </span>
            <Users className="w-5 h-5 text-brand-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats ? stats.totalWorkers.toLocaleString('en-IN') : '4,500+'}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block">+18% इस माह</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'hi' ? 'कुल नियोक्ता / ठेकेदार' : 'Total Employers'}
            </span>
            <Building2 className="w-5 h-5 text-success-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats ? stats.totalEmployers.toLocaleString('en-IN') : '856'}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block">+12% इस माह</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'hi' ? 'कुल पोस्टेड काम' : 'Total Jobs'}
            </span>
            <Briefcase className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats ? stats.totalJobs.toLocaleString('en-IN') : '1,250+'}
          </div>
          <span className="text-[11px] text-brand-600 font-bold block">
            {stats ? stats.activeJobs : '8'} सक्रिय जॉब्स
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'hi' ? 'रिपोर्ट की गई शिकायतें' : 'Reported Listings'}
            </span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600">
            {stats ? stats.reportedListings : 2}
          </div>
          <span className="text-[11px] text-slate-400 block font-medium">0 अनसुलझी शिकायत</span>
        </div>
      </div>

      {/* Main Grid: User Management Table + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Management Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                {language === 'hi' ? 'उपयोगकर्ता प्रबंधन (User Management)' : 'User Management'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'श्रमिक और नियोक्ता प्रोफाइल का सत्यापन और निगरानी' : 'Monitor and verify accounts'}
              </p>
            </div>

            {/* Filter by role pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilterRole('all')}
                className={`px-2.5 py-1 rounded-lg ${filterRole === 'all' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
              >
                सभी
              </button>
              <button
                onClick={() => setFilterRole('worker')}
                className={`px-2.5 py-1 rounded-lg ${filterRole === 'worker' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
              >
                श्रमिक
              </button>
              <button
                onClick={() => setFilterRole('employer')}
                className={`px-2.5 py-1 rounded-lg ${filterRole === 'employer' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
              >
                नियोक्ता
              </button>
            </div>
          </div>

          {/* Search Table input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={language === 'hi' ? 'नाम या हुनर से खोजें...' : 'Filter table by name or category...'}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">उपयोगकर्ता</th>
                  <th className="py-2.5 px-3">रोल / श्रेणी</th>
                  <th className="py-2.5 px-3">मोबाइल</th>
                  <th className="py-2.5 px-3">स्थिति</th>
                  <th className="py-2.5 px-3 text-right">सत्यापन कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.location}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'worker' ? 'bg-brand-50 text-brand-800' : 'bg-success-50 text-success-800'
                      }`}>
                        {u.role === 'worker' ? '👷 श्रमिक' : '🏢 नियोक्ता'}
                      </span>
                      <div className="text-[11px] text-slate-600 mt-0.5">{u.category}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{u.mobile}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {u.verified ? '● सत्यापित' : '○ समीक्षाधीन'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleToggleVerify(u.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                          u.verified 
                            ? 'border-slate-300 text-slate-600 hover:bg-slate-100' 
                            : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        {u.verified ? 'रद्द करें' : 'सत्यापित करें'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Activity className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'हालिया गतिविधियां (Live Activity)' : 'Recent Activity Feed'}
            </h3>
          </div>

          <div className="space-y-4">
            {stats?.recentActivity.map(act => (
              <div key={act.id} className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>{act.time}</span>
                  <span className="font-semibold text-slate-600">{act.user}</span>
                </div>
                <p className="font-bold text-slate-800">{act.action}</p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              {language === 'hi' ? 'सिस्टम गतिविधि लॉग • 4 हालिया गतिविधियां' : 'System Activity Log • 4 recent updates'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
