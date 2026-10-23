import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Briefcase, 
  Users, 
  PlusCircle, 
  User as UserIcon, 
  LogOut, 
  Globe, 
  ShieldCheck, 
  ChevronDown,
  ClipboardList
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    showToast(language === 'hi' ? 'लॉगआउट सफल' : 'Logged out successfully', 'info');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-brand-900 to-brand-700 flex items-center justify-center shadow-md shadow-brand-900/20 group-hover:scale-105 transition-transform">
              <img src="/logo.svg" alt="Rojgar Mitra Logo" className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-brand-950 flex items-center gap-1">
                रोजगार <span className="text-success-600">मित्र</span>
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 tracking-wide -mt-1 hidden xs:block">
                {t.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/') ? 'text-brand-800 bg-brand-50' : 'text-slate-700 hover:text-brand-700 hover:bg-slate-50'
              }`}
            >
              {t.navHome}
            </Link>
            <Link
              to="/jobs"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/jobs') ? 'text-brand-800 bg-brand-50' : 'text-slate-700 hover:text-brand-700 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4 text-brand-600" />
              {t.navFindJobs}
            </Link>
            <Link
              to="/workers"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/workers') ? 'text-brand-800 bg-brand-50' : 'text-slate-700 hover:text-brand-700 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4 text-success-600" />
              {t.navHireWorkers}
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/about') ? 'text-brand-800 bg-brand-50' : 'text-slate-700 hover:text-brand-700 hover:bg-slate-50'
              }`}
            >
              {t.navAbout}
            </Link>
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors text-slate-600 hover:text-brand-700 hover:bg-slate-50 ${
                isActive('/admin') ? 'text-brand-800 bg-brand-50' : ''
              }`}
            >
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-slate-600" />
                {t.navAdmin}
              </span>
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all shadow-sm active:scale-95"
              title="Toggle Hindi / English"
            >
              <Globe className="w-3.5 h-3.5 text-brand-600" />
              <span>{language === 'hi' ? 'English' : 'हिन्दी'}</span>
            </button>

            {/* Logged In Dashboard / Actions */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                {user.role === 'employer' ? (
                  <Link
                    to="/post-job"
                    className="inline-flex items-center gap-1.5 bg-success-600 hover:bg-success-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {t.navPostJob}
                  </Link>
                ) : user.role === 'worker' ? (
                  <Link
                    to="/applications"
                    className="inline-flex items-center gap-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 px-3 py-2 rounded-lg text-xs font-bold border border-brand-200 transition-all"
                  >
                    <ClipboardList className="w-4 h-4 text-brand-600" />
                    {t.navApplications}
                  </Link>
                ) : null}

                {/* Profile / Account Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-800"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-left hidden xl:block">
                      <div className="font-bold truncate max-w-[110px]">{user.name}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{user.role}</div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {roleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-500">{user.mobile}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-brand-100 text-brand-800 rounded text-[10px] font-bold uppercase tracking-wider">
                          {user.role}
                        </span>
                      </div>

                      {user.role === 'worker' && (
                        <>
                          <Link
                            to="/worker-dashboard"
                            onClick={() => setRoleDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Briefcase className="w-4 h-4 text-brand-600" />
                            {t.navWorkerDashboard}
                          </Link>
                          <Link
                            to="/worker-profile"
                            onClick={() => setRoleDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <UserIcon className="w-4 h-4 text-slate-500" />
                            {t.navProfile}
                          </Link>
                          <Link
                            to="/applications"
                            onClick={() => setRoleDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <ClipboardList className="w-4 h-4 text-slate-500" />
                            {t.navApplications}
                          </Link>
                        </>
                      )}

                      {user.role === 'employer' && (
                        <>
                          <Link
                            to="/employer-dashboard"
                            onClick={() => setRoleDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Briefcase className="w-4 h-4 text-brand-600" />
                            {t.navEmployerDashboard}
                          </Link>
                          <Link
                            to="/manage-jobs"
                            onClick={() => setRoleDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <ClipboardList className="w-4 h-4 text-slate-500" />
                            {t.navManageJobs}
                          </Link>
                          <Link
                            to="/post-job"
                            onClick={() => setRoleDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <PlusCircle className="w-4 h-4 text-success-600" />
                            {t.navPostJob}
                          </Link>
                        </>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setRoleDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <ShieldCheck className="w-4 h-4 text-brand-600" />
                          {t.navAdmin}
                        </Link>
                      )}

                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        {t.navLogout}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {t.navLogin}
                </Link>
                <Link
                  to="/role-select"
                  className="px-4 py-2 text-sm font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-lg shadow-sm transition-all active:scale-95"
                >
                  {t.navGetStarted}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu and Language toggle buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              {language === 'hi' ? 'EN' : 'हिन्दी'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          {isAuthenticated && user ? (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900">{user.name}</div>
                <div className="text-xs text-slate-500">{user.mobile} • Role: {user.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 text-center text-sm font-bold border border-slate-300 rounded-lg text-slate-700"
              >
                {t.navLogin}
              </Link>
              <Link
                to="/role-select"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 text-center text-sm font-bold bg-brand-700 text-white rounded-lg"
              >
                {t.navGetStarted}
              </Link>
            </div>
          )}

          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              {t.navHome}
            </Link>
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              🔍 {t.navFindJobs}
            </Link>
            <Link
              to="/workers"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              👷 {t.navHireWorkers}
            </Link>

            {user?.role === 'worker' && (
              <>
                <Link
                  to="/worker-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-semibold text-brand-800 bg-brand-50"
                >
                  📊 {t.navWorkerDashboard}
                </Link>
                <Link
                  to="/worker-profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
                >
                  👤 {t.navProfile}
                </Link>
                <Link
                  to="/applications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
                >
                  📑 {t.navApplications}
                </Link>
              </>
            )}

            {user?.role === 'employer' && (
              <>
                <Link
                  to="/employer-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-semibold text-brand-800 bg-brand-50"
                >
                  📊 {t.navEmployerDashboard}
                </Link>
                <Link
                  to="/post-job"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-semibold text-success-700 bg-success-50"
                >
                  ➕ {t.navPostJob}
                </Link>
                <Link
                  to="/manage-jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
                >
                  💼 {t.navManageJobs}
                </Link>
              </>
            )}

            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              🛡️ {t.navAdmin}
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              ℹ️ {t.navAbout}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
