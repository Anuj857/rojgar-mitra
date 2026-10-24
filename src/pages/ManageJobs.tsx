import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Users, 
  MapPin, 
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/apiService';
import { Job, Application, ApplicationStatus } from '../types';

export const ManageJobs: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');
  const [loading, setLoading] = useState(true);

  // Applications Drawer state
  const [selectedJobForApps, setSelectedJobForApps] = useState<Job | null>(null);
  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Edit Job Modal state
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSalary, setEditSalary] = useState<number>(800);
  const [editWorkersRequired, setEditWorkersRequired] = useState<number>(2);
  const [editDescription, setEditDescription] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    try {
      const all = await apiService.getJobs();
      setJobs(all);
    } catch (err) {
      console.error('[ManageJobs] getJobs error:', err);
      showToast(
        language === 'hi' ? 'जॉब लोड करने में त्रुटि' : 'Error loading jobs from server',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [user]);

  const handleOpenApplications = async (job: Job) => {
    setSelectedJobForApps(job);
    setLoadingApps(true);
    try {
      const apps = await apiService.getApplicationsForJob(job.id);
      setJobApplications(apps);
    } catch (err) {
      console.error('[ManageJobs] getApplicationsForJob error:', err);
      showToast('Error loading applications', 'error');
    } finally {
      setLoadingApps(false);
    }
  };

  const handleUpdateAppStatus = async (appId: string, status: ApplicationStatus) => {
    try {
      await apiService.updateApplicationStatus(appId, status);
      if (selectedJobForApps) {
        const refreshed = await apiService.getApplicationsForJob(selectedJobForApps.id);
        setJobApplications(refreshed);
      }
      showToast(
        language === 'hi'
          ? `आवेदन स्थिति अपडेट हुई: ${status === 'accepted' ? 'स्वीकृत (Accepted)' : 'अस्वीकृत (Rejected)'}`
          : `Application status updated to ${status}`,
        'success'
      );
    } catch (err) {
      console.error('[ManageJobs] updateApplicationStatus error:', err);
      showToast('Error updating application status', 'error');
    }
  };

  const handleToggleJobStatus = async (job: Job) => {
    const nextStatus = job.status === 'active' ? 'closed' : 'active';
    try {
      await apiService.updateJobStatus(job.id, nextStatus);
      showToast(
        language === 'hi'
          ? `काम की स्थिति बदली: ${nextStatus === 'closed' ? 'बंद (Closed)' : 'सक्रिय (Active)'}`
          : `Job status changed to ${nextStatus}`,
        'info'
      );
      loadJobs();
    } catch (err) {
      console.error('[ManageJobs] updateJobStatus error:', err);
      showToast('Error updating job status', 'error');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm(language === 'hi' ? 'क्या आप इस जॉब पोस्टिंग को हटाना चाहते हैं?' : 'Are you sure you want to delete this job?')) {
      try {
        await apiService.deleteJob(jobId);
        showToast(language === 'hi' ? 'जॉब सफलतापूर्वक हटाई गई' : 'Job deleted successfully', 'success');
        loadJobs();
      } catch (err) {
        console.error('[ManageJobs] deleteJob error:', err);
        showToast('Error deleting job', 'error');
      }
    }
  };

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditSalary(job.salary);
    setEditWorkersRequired(job.workersRequired);
    setEditDescription(job.description);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    const updatedJob: Job = {
      ...editingJob,
      title: editTitle,
      salary: editSalary,
      workersRequired: editWorkersRequired,
      description: editDescription,
    };

    try {
      await apiService.updateJob(editingJob.id, updatedJob);
      // Optimistic UI update while backend syncs
      setJobs(prev => prev.map(j => j.id === editingJob.id ? updatedJob : j));
      setEditingJob(null);
      showToast(language === 'hi' ? 'जॉब विवरण अपडेट हो गया!' : 'Job updated successfully!', 'success');
      // Reload from backend to get server state
      loadJobs();
    } catch (err) {
      console.error('[ManageJobs] handleSaveEdit error:', err);
      showToast('Error saving job edits', 'error');
    }
  };

  const displayedJobs = jobs.filter(j => 
    activeTab === 'active' ? j.status === 'active' : j.status === 'closed'
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.navManageJobs}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'hi'
              ? 'अपनी सक्रिय नौकरियां देखें, आवेदकों की समीक्षा करें और हायरिंग निर्णय लें।'
              : 'Manage your active job postings and candidate applications.'}
          </p>
        </div>

        <Link
          to="/post-job"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-success-600 hover:bg-success-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.navPostJob}</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('active')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'active'
              ? 'border-brand-700 text-brand-800 bg-brand-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {language === 'hi' ? `सक्रिय नौकरियां (${jobs.filter(j => j.status === 'active').length})` : `Active Jobs (${jobs.filter(j => j.status === 'active').length})`}
        </button>
        <button
          onClick={() => setActiveTab('closed')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'closed'
              ? 'border-brand-700 text-brand-800 bg-brand-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {language === 'hi' ? `बंद / संपन्न कार्य (${jobs.filter(j => j.status === 'closed').length})` : `Closed Jobs (${jobs.filter(j => j.status === 'closed').length})`}
        </button>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-32 rounded-2xl bg-slate-200/60 animate-pulse" />
          ))}
        </div>
      ) : displayedJobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {language === 'hi' ? 'इस श्रेणी में कोई काम पोस्ट नहीं है' : 'No jobs in this tab'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'hi' ? 'अपनी पहली नौकरी पोस्ट करें और उम्मीदवारों से तुरंत आवेदन पाएं।' : 'Post a job opening to receive applications.'}
          </p>
          <Link
            to="/post-job"
            className="inline-block px-5 py-2.5 bg-success-600 hover:bg-success-700 text-white rounded-xl text-xs font-bold"
          >
            {t.navPostJob}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedJobs.map(job => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                      {job.category}
                    </span>
                    <span className="text-xs text-slate-400">{job.createdAt}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      job.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {job.status === 'active' ? 'सक्रिय (Live)' : 'बंद (Closed)'}
                    </span>
                  </div>

                  <Link to={`/jobs/${job.id}`}>
                    <h3 className="text-base font-bold text-slate-900 hover:text-brand-700 transition-colors">
                      {job.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                    <span className="font-bold text-emerald-700">
                      ₹{job.salary} {job.salaryPeriod === 'per_day' ? '/ दिन' : '/ माह'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location.split(',')[0]}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {job.workersRequired} मजदूर चाहिए
                    </span>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleOpenApplications(job)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-50 text-brand-800 hover:bg-brand-100 border border-brand-200 text-xs font-bold transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-brand-600" />
                    <span>
                      {language === 'hi' ? 'आवेदन देखें' : 'View Applicants'} ({job.applicationsCount})
                    </span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(job)}
                    className="p-2 text-slate-600 hover:text-brand-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                    title="Edit job"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleJobStatus(job)}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                  >
                    {job.status === 'active' ? (language === 'hi' ? 'बंद करें' : 'Close') : (language === 'hi' ? 'पुनः सक्रिय' : 'Reopen')}
                  </button>

                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors"
                    title="Delete job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applications Drawer Modal */}
      {selectedJobForApps && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedJobForApps(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 pb-4 border-b border-slate-100">
              <span className="text-[11px] font-bold text-brand-700 uppercase tracking-wider">
                {language === 'hi' ? 'प्राप्त आवेदन' : 'Received Applications'}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">{selectedJobForApps.title}</h3>
              <p className="text-xs text-slate-500">
                {selectedJobForApps.location} • ₹{selectedJobForApps.salary}
              </p>
            </div>

            {loadingApps ? (
              <div className="h-40 flex items-center justify-center text-slate-400 text-xs">
                {language === 'hi' ? 'लोड हो रहा है...' : 'Loading applications...'}
              </div>
            ) : jobApplications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                {language === 'hi' 
                  ? 'इस काम पर अभी तक कोई आवेदन प्राप्त नहीं हुआ है।' 
                  : 'No applications received yet for this job.'}
              </div>
            ) : (
              <div className="space-y-3.5">
                {jobApplications.map(app => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{app.workerName}</h4>
                        <p className="text-slate-500">{app.workerSkill} • {app.appliedAt}</p>
                      </div>

                      <div className="text-right">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : app.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status === 'accepted' ? 'स्वीकृत (Accepted)' : app.status === 'rejected' ? 'अस्वीकृत' : 'विचाराधीन (Pending)'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                      <span>{language === 'hi' ? 'अपेक्षित मजदूरी:' : 'Expected Wage:'} <strong className="text-emerald-700">₹{app.expectedSalary || app.salary}</strong></span>
                      <span className="flex items-center gap-1 font-semibold text-brand-700">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{app.workerMobile}</span>
                      </span>
                    </div>

                    {app.notes && (
                      <p className="text-slate-600 italic">"{app.notes}"</p>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200/60">
                      {app.status !== 'accepted' && (
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, 'accepted')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'हायर करें (Accept)' : 'Accept & Hire'}</span>
                        </button>
                      )}

                      {app.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, 'rejected')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 font-semibold text-xs"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>{language === 'hi' ? 'अस्वीकार करें' : 'Decline'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {language === 'hi' ? 'जॉब विवरण संपादित करें' : 'Edit Job Post'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{editingJob.title}</p>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'काम का शीर्षक' : 'Job Title'}
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'मजदूरी (₹)' : 'Salary (₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={editSalary}
                    onChange={e => setEditSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'मजदूरों की संख्या' : 'Workers Required'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editWorkersRequired}
                    onChange={e => setEditWorkersRequired(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'विवरण' : 'Description'}
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-sm"
                >
                  {language === 'hi' ? 'सहेजें' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
