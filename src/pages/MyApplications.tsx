import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Briefcase, 
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { mockService } from '../services/mockService';
import { Application, ApplicationStatus } from '../types';

export const MyApplications: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | ApplicationStatus>('all');
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    setLoading(true);
    const list = await mockService.getMyApplications(user?.id || 'w-1');
    setApplications(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, [user]);

  const handleWithdraw = async (appId: string) => {
    // In mock, withdraw means removing or marking rejected
    const remaining = applications.filter(a => a.id !== appId);
    setApplications(remaining);
    localStorage.setItem('rojgar_demo_applications_v1', JSON.stringify(remaining));
    showToast(
      language === 'hi' ? 'आवेदन वापस ले लिया गया' : 'Application withdrawn',
      'info'
    );
  };

  const filteredApps = applications.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'hi' ? 'स्वीकृत (Accepted)' : 'Accepted'}</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{language === 'hi' ? 'अस्वीकृत (Declined)' : 'Declined'}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'hi' ? 'विचाराधीन (Pending)' : 'Under Review'}</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.navApplications}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'hi'
              ? 'आपके द्वारा भेजे गए सभी नौकरी आवेदनों की स्थिति और नियोक्ता का जवाब देखें।'
              : 'Track the status of all your submitted job applications.'}
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? '+ नया काम खोजें' : '+ Find More Jobs'}</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'all', label: language === 'hi' ? `सभी (${applications.length})` : `All (${applications.length})` },
          { id: 'pending', label: language === 'hi' ? `विचाराधीन (${applications.filter(a => a.status === 'pending').length})` : `Pending (${applications.filter(a => a.status === 'pending').length})` },
          { id: 'accepted', label: language === 'hi' ? `स्वीकृत (${applications.filter(a => a.status === 'accepted').length})` : `Accepted (${applications.filter(a => a.status === 'accepted').length})` },
          { id: 'rejected', label: language === 'hi' ? `अस्वीकृत (${applications.filter(a => a.status === 'rejected').length})` : `Rejected (${applications.filter(a => a.status === 'rejected').length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-brand-700 text-brand-800 bg-brand-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(n => (
            <div key={n} className="h-36 rounded-2xl bg-slate-200/60 animate-pulse" />
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ClipboardList className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {language === 'hi' ? 'इस श्रेणी में कोई आवेदन नहीं है' : 'No applications in this tab'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'hi'
              ? 'नजदीकी नौकरियां देखें और 1-क्लिक में तुरंत आवेदन करें।'
              : 'Explore open jobs in your locality and apply with 1-click.'}
          </p>
          <Link
            to="/jobs"
            className="inline-block px-5 py-2.5 bg-brand-700 text-white rounded-xl text-xs font-bold"
          >
            {language === 'hi' ? 'नौकरियां खोजें' : 'Browse Jobs'}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map(app => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3.5 hover:border-brand-200 transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                    {app.category}
                  </span>
                  <Link to={`/jobs/${app.jobId}`}>
                    <h3 className="text-base font-bold text-slate-900 hover:text-brand-700 transition-colors mt-1">
                      {app.jobTitle}
                    </h3>
                  </Link>
                  <p className="text-xs font-semibold text-slate-700">{app.employerName}</p>
                </div>

                <div>
                  {getStatusBadge(app.status)}
                </div>
              </div>

              {/* Application Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-500 block">{language === 'hi' ? 'ऑफर वेतन' : 'Job Wage'}</span>
                  <span className="font-bold text-slate-800">
                    ₹{app.salary} {app.salaryPeriod === 'per_day' ? '/ दिन' : '/ माह'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">{language === 'hi' ? 'आपकी मांग' : 'Expected Wage'}</span>
                  <span className="font-bold text-emerald-700">
                    ₹{app.expectedSalary || app.salary}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">{language === 'hi' ? 'आवेदन तिथि' : 'Applied Date'}</span>
                  <span className="font-semibold text-slate-700">{app.appliedAt}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">{language === 'hi' ? 'स्थान' : 'Location'}</span>
                  <span className="font-semibold text-slate-700 truncate block">{app.location.split(',')[0]}</span>
                </div>
              </div>

              {/* Note / Message */}
              {app.notes && (
                <p className="text-xs text-slate-600 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 italic">
                  "{app.notes}"
                </p>
              )}

              {/* Accepted State: Reveal Direct Contact */}
              {app.status === 'accepted' && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>
                      {language === 'hi'
                        ? 'नियोक्ता ने आपका आवेदन स्वीकार कर लिया है! तुरंत फोन पर बात करें:'
                        : 'Employer accepted your application! Direct contact ready:'}
                    </span>
                  </div>
                  <a
                    href="tel:9876543210"
                    className="inline-flex items-center gap-1 font-bold bg-emerald-700 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-800"
                  >
                    <Phone className="w-3 h-3" />
                    <span>98765-XXXX9</span>
                  </a>
                </div>
              )}

              {/* Action row */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                <Link
                  to={`/jobs/${app.jobId}`}
                  className="font-bold text-brand-700 hover:underline flex items-center gap-1"
                >
                  <span>{language === 'hi' ? 'जॉब विवरण देखें' : 'View Job Details'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {app.status === 'pending' && (
                  <button
                    onClick={() => handleWithdraw(app.id)}
                    className="text-slate-400 hover:text-rose-600 font-medium transition-colors"
                  >
                    {language === 'hi' ? 'आवेदन रद्द करें' : 'Withdraw'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
